// Server statis minimal untuk pengujian mockup tanpa dependensi tambahan.
// Dipakai oleh scripts/mockup-visual.js.

const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path')

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
}

function resolveFile(root, urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0])
  let target = path.join(root, clean)

  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
    const index = path.join(target, 'index.html')
    if (fs.existsSync(index)) return index
    return null
  }

  if (fs.existsSync(target)) return target

  // Terima URL tanpa ekstensi (mis. /mockup/components/foundation).
  if (fs.existsSync(target + '.html')) return target + '.html'

  return null
}

function startStaticServer(root, port = 0) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const urlPath = (req.url || '/').split('?')[0]

      // Arahkan permintaan direktori tanpa garis miring akhir agar path relatif
      // (CSS, include, link sidebar) tetap dihitung dari folder halaman.
      const target = path.join(root, decodeURIComponent(urlPath))
      if (urlPath !== '/' && !urlPath.endsWith('/') && fs.existsSync(target) && fs.statSync(target).isDirectory()) {
        res.writeHead(301, { location: urlPath + '/' })
        res.end()
        return
      }

      const file = resolveFile(root, req.url === '/' ? '/index.html' : req.url)
      if (!file) {
        res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' })
        res.end('404')
        return
      }
      const ext = path.extname(file)
      res.writeHead(200, {
        'content-type': MIME[ext] || 'application/octet-stream',
        'cache-control': 'no-store',
      })
      fs.createReadStream(file).pipe(res)
    })

    server.on('error', reject)
    server.listen(port, '127.0.0.1', () => {
      const address = server.address()
      resolve({ server, origin: `http://127.0.0.1:${address.port}` })
    })
  })
}

module.exports = { startStaticServer }
