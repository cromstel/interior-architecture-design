/**
 * One-off probe: does a real Chrome navigation reach the real site, or does
 * Hostinger's CDN serve its "Checking your browser" interstitial?
 *
 * Uses Chrome DevTools Protocol over Node's built-in WebSocket, so it needs no
 * puppeteer and adds nothing to the project's dependencies.
 *
 * The interstitial is ~3 KB and the real homepage ~149 KB, so the byte count of
 * the document is a reliable tell. This is the check that decides whether a
 * local Lighthouse run can produce trustworthy numbers at all.
 *
 * Run: node scripts/probe-waf.mjs [url] [--headful]
 */
import { spawn } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const argv = process.argv.slice(2)
const headful = argv.includes('--headful')
const url = argv.find((a) => !a.startsWith('--')) || 'https://interior-design.cromstelit.com/'
const PORT = headful ? 9334 : 9333

const chrome =
  process.env.CHROME_PATH ||
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

const profile = mkdtempSync(join(tmpdir(), 'cdp-'))
// The WAF appears to key on headless signals, so `--headful` runs a real
// windowed Chrome. That is the whole point of the flag: if headful gets the
// real page, Lighthouse can be pointed at this instance via --port and produce
// numbers measured against production rather than against the challenge page.
const proc = spawn(
  chrome,
  [
    ...(headful ? [] : ['--headless=new', '--disable-gpu']),
    '--no-sandbox',
    '--disable-dev-shm-usage',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`,
    'about:blank',
  ],
  { stdio: 'ignore' }
)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function endpoint() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/version`)
      return (await r.json()).webSocketDebuggerUrl
    } catch {
      await sleep(250)
    }
  }
  throw new Error('Chrome did not expose a debugging endpoint')
}

class CDP {
  constructor(ws) {
    this.ws = ws
    this.id = 0
    this.pending = new Map()
    this.events = []
    ws.addEventListener('message', (e) => {
      const m = JSON.parse(e.data)
      if (m.id && this.pending.has(m.id)) {
        const { resolve, reject } = this.pending.get(m.id)
        this.pending.delete(m.id)
        m.error ? reject(new Error(m.error.message)) : resolve(m.result)
      } else if (m.method) {
        this.events.push(m)
      }
    })
  }
  send(method, params = {}, sessionId) {
    const id = ++this.id
    const msg = { id, method, params }
    if (sessionId) msg.sessionId = sessionId
    this.ws.send(JSON.stringify(msg))
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject })
      setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id)
          reject(new Error(`${method} timed out`))
        }
      }, 45000)
    })
  }
}

try {
  const wsUrl = await endpoint()
  const ws = new WebSocket(wsUrl)
  await new Promise((res, rej) => {
    ws.addEventListener('open', res)
    ws.addEventListener('error', rej)
  })
  const cdp = new CDP(ws)

  const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' })
  const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true })

  await cdp.send('Page.enable', {}, sessionId)
  await cdp.send('Network.enable', {}, sessionId)
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: false }, sessionId)

  const statuses = []
  cdp.ws.addEventListener('message', (e) => {
    const m = JSON.parse(e.data)
    if (m.method === 'Network.responseReceived') {
      statuses.push({
        url: m.params.response.url,
        status: m.params.response.status,
        type: m.params.type,
      })
    }
  })

  const loaded = new Promise((resolve) => {
    const h = (e) => {
      const m = JSON.parse(e.data)
      if (m.method === 'Page.loadEventFired') {
        cdp.ws.removeEventListener('message', h)
        resolve()
      }
    }
    cdp.ws.addEventListener('message', h)
  })

  const nav = await cdp.send('Page.navigate', { url }, sessionId)
  await Promise.race([loaded, sleep(30000)])

  // The interstitial is a JS challenge that says "please wait for up to 5
  // seconds" and then sets a cookie and reloads. Measuring the DOM the moment
  // load fires only ever sees the challenge, so poll for the real document --
  // what a visitor's browser actually ends up looking at.
  const readDoc = async () => {
    const r = await cdp.send(
      'Runtime.evaluate',
      {
        expression:
          'JSON.stringify({len: document.documentElement.outerHTML.length, title: document.title, body: document.body ? document.body.innerText.slice(0,200) : ""})',
        returnByValue: true,
      },
      sessionId
    )
    return JSON.parse(r.result.value)
  }

  let doc = await readDoc()
  const challenged = (d) =>
    /checking your browser|just a moment|enable javascript and cookies|attention required/i.test(d.body) ||
    d.len < 20000

  let waited = 0
  while (challenged(doc) && waited < 45000) {
    await sleep(2000)
    waited += 2000
    doc = await readDoc()
  }

  const main = statuses.filter((s) => s.type === 'Document' && s.url.startsWith(url.split('/').slice(0, 3).join('/')))
  console.log('url          :', url)
  console.log('navigate     :', nav.frameId ? 'committed' : JSON.stringify(nav))
  console.log('main doc     :', main.map((m) => `${m.status} ${m.url}`).join(' | ') || 'none seen')
  console.log('waited       :', `${waited / 1000}s for the challenge to clear`)
  console.log('dom chars    :', doc.len)
  console.log('title        :', doc.title)
  console.log('body preview :', doc.body.replace(/\s+/g, ' ').slice(0, 120))
  const waf = /checking your browser|just a moment|enable javascript and cookies|attention required/i.test(doc.body) || doc.len < 20000
  console.log('')
  console.log(waf ? 'VERDICT: WAF interstitial — a local Lighthouse run would score the challenge page, not the site.'
                  : 'VERDICT: real site reached — a local Lighthouse run would be trustworthy.')
  process.exitCode = waf ? 1 : 0
} finally {
  proc.kill()
  try { rmSync(profile, { recursive: true, force: true }) } catch {}
  // The debugging WebSocket keeps the event loop alive; nothing is left to wait on.
  process.exit(process.exitCode || 0)
}