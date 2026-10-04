/**
 * Which hero candidate does the preload fetch, and which does the <img> fetch?
 *
 * The site documents a rule: the preload and the element must resolve to the same
 * file, or the browser downloads one image for the preload and a second, larger
 * one for the element. This proves whether that holds at a real viewport, which
 * reading the markup cannot show -- `sizes` and `imageSizes` only resolve to a
 * concrete file once the browser has a viewport and a device pixel ratio.
 *
 * Also reports how many preloads for the same srcset were emitted, because the
 * markup currently carries the hero twice and that is worth pinning down.
 *
 * Run: node scripts/hero-preload-check.mjs [url] [width] [height]
 */
import { spawn } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const url = process.argv[2] || 'https://interior-design.cromstelit.com/about/'
const WIDTH = Number(process.argv[3] || 1512)
const HEIGHT = Number(process.argv[4] || 900)
const PORT = 9377

const chrome =
  process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

const profile = mkdtempSync(join(tmpdir(), 'hero-'))
const proc = spawn(
  chrome,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`,
    'about:blank',
  ],
  { stdio: 'ignore' }
)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

try {
  let wsUrl
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/version`)
      wsUrl = (await r.json()).webSocketDebuggerUrl
      break
    } catch { await sleep(250) }
  }
  if (!wsUrl) throw new Error('no debugging endpoint')

  const ws = new WebSocket(wsUrl)
  await new Promise((res, rej) => {
    ws.addEventListener('open', res)
    ws.addEventListener('error', rej)
  })

  let id = 0
  const pending = new Map()
  const fetches = []
  const preloads = []

  ws.addEventListener('message', (e) => {
    const m = JSON.parse(e.data)
    if (m.id && pending.has(m.id)) {
      const { resolve, reject } = pending.get(m.id)
      pending.delete(m.id)
      m.error ? reject(new Error(m.error.message)) : resolve(m.result)
    } else if (m.method === 'Network.requestWillBeSent') {
      const r = m.params.request
      if (/\.(avif|webp|jpg|png)(\?|$)/i.test(r.url)) fetches.push({ url: r.url, initiator: m.params.initiator?.type })
    }
  })

  const send = (method, params = {}, sessionId) => {
    const i = ++id
    ws.send(JSON.stringify({ id: i, method, params, ...(sessionId ? { sessionId } : {}) }))
    return new Promise((resolve, reject) => {
      pending.set(i, { resolve, reject })
      setTimeout(() => pending.has(i) && (pending.delete(i), reject(new Error(method + ' timeout'))), 40000)
    })
  }

  const { targetId } = await send('Target.createTarget', { url: 'about:blank' })
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true })

  await send('Page.enable', {}, sessionId)
  await send('Network.enable', {}, sessionId)
  // Match a real desktop so `sizes="100vw"` resolves the way a visitor sees it.
  await send(
    'Emulation.setDeviceMetricsOverride',
    { width: WIDTH, height: HEIGHT, deviceScaleFactor: 1, mobile: false },
    sessionId
  )

  // Count the image preloads actually in the document, for this hero.
  await send('Page.navigate', { url }, sessionId)
  await sleep(9000)

  const { result } = await send(
    'Runtime.evaluate',
    {
      expression: `JSON.stringify([...document.querySelectorAll('link[rel=preload][as=image]')].map(l => ({
        srcset: l.getAttribute('imagesrcset') || l.getAttribute('imagesrcset'),
        sizes: l.getAttribute('imagesizes'),
        priority: l.getAttribute('fetchpriority')
      })))`,
      returnByValue: true,
    },
    sessionId
  )
  for (const p of JSON.parse(result.value)) preloads.push(p)

  const base = new URL(url).pathname.replace(/\/+$/, '')
  const hero = preloads.map((p) => (p.srcset || '').split(',')[0].trim().split(' ')[0]).filter(Boolean)
  const heroStem = hero.length ? hero[0].replace(/-sm\.avif$|\.avif$/, '') : null

  console.log(`url      : ${url}`)
  console.log(`viewport : ${WIDTH}x${HEIGHT} @1x`)
  console.log(`image preloads in the document: ${preloads.length}`)
  for (const p of preloads) {
    console.log(`  sizes=${p.sizes || '(none)'} fetchpriority=${p.priority || '(none)'}`)
    console.log(`    ${p.srcset}`)
  }

  const dupes = preloads.filter((p) => p.srcset === preloads[0]?.srcset)
  if (dupes.length > 1) {
    console.log('')
    console.log(`  DUPLICATE: the same srcset is preloaded ${dupes.length} times`)
  }

  if (heroStem) {
    const mine = fetches.filter((f) => f.url.includes(heroStem.split('/').pop().replace(/-sm$|\.avif$/, '')))
    console.log('')
    console.log(`  hero fetches (${heroStem.split('/').pop().replace(/-sm$|\.avif$/, '')}):`)
    for (const f of mine) console.log(`    ${f.url.split('/').pop()}  initiator=${f.initiator}`)
    const files = [...new Set(mine.map((f) => f.url.split('/').pop()))]
    console.log('')
    console.log(`  distinct hero files downloaded: ${files.length}`)
    if (files.length > 1) console.log('  MISMATCH: preload and element fetched different candidates')
    else console.log('  MATCH: one file served both the preload and the element')
  }

  process.exitCode = 0
} finally {
  proc.kill()
  try { rmSync(profile, { recursive: true, force: true }) } catch {}
  process.exit(process.exitCode || 0)
}