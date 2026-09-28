/**
 * Production-like static server for auditing.
 *
 * The first pass served bare files, so Lighthouse charged the site for ~678 KB
 * of uncompressed text and for having no cache headers — neither of which is
 * the codebase's doing. This mirrors what Netlify/Vercel/Cloudflare do, so the
 * measured numbers reflect a real deployment.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT = path.join(process.cwd(), 'out');
const COMPRESSIBLE = new Set(['.html', '.js', '.css', '.svg', '.xml', '.txt', '.json']);
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.avif': 'image/avif',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

http
  .createServer((req, res) => {
    const p = decodeURIComponent(req.url.split('?')[0]);
    let file = path.join(ROOT, p);
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file) && fs.existsSync(file + '.html')) file += '.html';
    if (!fs.existsSync(file) && fs.existsSync(file + '/index.html')) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) {
      const nf = path.join(ROOT, '404.html');
      res.writeHead(404, { 'Content-Type': MIME['.html'] });
      return res.end(fs.readFileSync(nf));
    }

    const ext = path.extname(file);
    const body = fs.readFileSync(file);
    const headers = { 'Content-Type': MIME[ext] || 'application/octet-stream' };

    // Fingerprinted build output is immutable; HTML revalidates each visit.
    if (p.startsWith('/_next/static/')) {
      headers['Cache-Control'] = 'public, max-age=31536000, immutable';
    } else if (ext === '.html') {
      headers['Cache-Control'] = 'public, max-age=0, must-revalidate';
    } else {
      headers['Cache-Control'] = 'public, max-age=86400';
    }

    const accepts = String(req.headers['accept-encoding'] || '');
    if (COMPRESSIBLE.has(ext) && /\b(br|gzip)\b/.test(accepts) && body.length > 512) {
      const useBr = /\bbr\b/.test(accepts);
      headers['Content-Encoding'] = useBr ? 'br' : 'gzip';
      headers.Vary = 'Accept-Encoding';
      const out = useBr ? zlib.brotliCompressSync(body) : zlib.gzipSync(body);
      headers['Content-Length'] = out.length;
      res.writeHead(200, headers);
      return res.end(out);
    }

    headers['Content-Length'] = body.length;
    res.writeHead(200, headers);
    res.end(body);
  })
  .listen(4600, () => console.log('serving out/ with compression + cache headers on http://localhost:4600'));
