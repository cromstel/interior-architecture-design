/**
 * Package the static export for deployment.
 *
 * Two things Compress-Archive gets wrong on Windows, both of which break the
 * host's unzip:
 *   - entry names use backslashes (`_next\static\...`) instead of forward
 *     slashes, so the server writes files with backslashes in their names or
 *     flattens the tree entirely;
 *   - it cannot produce a flat archive without a top-level wrapper.
 *
 * Writes forward-slash entries rooted at the contents of `out/`, which is the
 * layout the deploy endpoint expects.
 *
 * Run: node scripts/pack-deploy.mjs [outDir] [zipPath]
 */
import { readdirSync, readFileSync, statSync, createWriteStream, existsSync } from 'node:fs'
import { join, dirname, relative, sep } from 'node:path'
import { deflateRawSync, crc32 } from 'node:zlib'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, process.argv[2] || 'out')
const zipPath = process.argv[3] || join(root, '..', 'interior-design-site.zip')

if (!existsSync(outDir)) {
  console.error(`${relative(root, outDir)} not found — run \`npm run build\` first.`)
  process.exit(1)
}

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name)
    if (entry.isDirectory()) walk(p, acc)
    else acc.push(p)
  }
  return acc
}

const files = walk(outDir).sort()
if (!files.length) {
  console.error('Nothing to package.')
  process.exit(1)
}

/** DOS date/time, which is what the zip format stores. */
function dosTime(d) {
  const time = ((d.getHours() & 0x1f) << 11) | ((d.getMinutes() & 0x3f) << 5) | ((d.getSeconds() / 2) & 0x1f)
  const date = (((d.getFullYear() - 1980) & 0x7f) << 9) | (((d.getMonth() + 1) & 0xf) << 5) | (d.getDate() & 0x1f)
  return { time, date }
}

const chunks = []
let offset = 0
const central = []

for (const file of files) {
  // Forward slashes are mandatory: the archive is consumed on Linux.
  const name = relative(outDir, file).split(sep).join('/')
  const data = readFileSync(file)
  const deflated = deflateRawSync(data, { level: 9 })
  // Fall back to storing when compression makes the entry bigger.
  const useDeflate = deflated.length < data.length
  const payload = useDeflate ? deflated : data
  const method = useDeflate ? 8 : 0
  const { time, date } = dosTime(statSync(file).mtime)
  const crc = crc32(data) >>> 0

  const local = Buffer.alloc(30)
  local.writeUInt32LE(0x04034b50, 0)
  local.writeUInt16LE(20, 4) // version needed
  local.writeUInt16LE(0, 6) // flags
  local.writeUInt16LE(method, 8)
  local.writeUInt16LE(time, 10)
  local.writeUInt16LE(date, 12)
  local.writeUInt32LE(crc, 14)
  local.writeUInt32LE(payload.length, 18)
  local.writeUInt32LE(data.length, 22)
  local.writeUInt16LE(name.length, 26)
  local.writeUInt16LE(0, 28)
  chunks.push(local, Buffer.from(name, 'utf8'), payload)

  const cd = Buffer.alloc(46)
  cd.writeUInt32LE(0x02014b50, 0)
  cd.writeUInt16LE(20, 4) // version made by
  cd.writeUInt16LE(20, 6) // version needed
  cd.writeUInt16LE(0, 8)
  cd.writeUInt16LE(method, 10)
  cd.writeUInt16LE(time, 12)
  cd.writeUInt16LE(date, 14)
  cd.writeUInt32LE(crc, 16)
  cd.writeUInt32LE(payload.length, 20)
  cd.writeUInt32LE(data.length, 24)
  cd.writeUInt16LE(name.length, 28)
  cd.writeUInt16LE(0, 30) // extra
  cd.writeUInt16LE(0, 32) // comment
  cd.writeUInt16LE(0, 34) // disk
  cd.writeUInt16LE(0, 36) // internal attrs
  cd.writeUInt32LE(0, 38) // external attrs
  cd.writeUInt32LE(offset, 42)
  central.push(Buffer.concat([cd, Buffer.from(name, 'utf8')]))

  offset += local.length + name.length + payload.length
}

const centralBuf = Buffer.concat(central)
const end = Buffer.alloc(22)
end.writeUInt32LE(0x06054b50, 0)
end.writeUInt16LE(0, 4)
end.writeUInt16LE(0, 6)
end.writeUInt16LE(central.length, 8)
end.writeUInt16LE(central.length, 10)
end.writeUInt32LE(centralBuf.length, 12)
end.writeUInt32LE(offset, 16)
end.writeUInt16LE(0, 20)

const out = createWriteStream(zipPath)
out.write(Buffer.concat([...chunks, centralBuf, end]))
out.end()
out.on('close', () => {
  const bytes = statSync(zipPath).size
  console.log(`Packed ${files.length} entries -> ${zipPath}`)
  console.log(`  ${(bytes / 1024 / 1024).toFixed(2)} MB, all paths forward-slash, flat at the root`)
})
