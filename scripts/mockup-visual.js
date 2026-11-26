// Regresi visual mockup: ambil screenshot semua halaman lalu bandingkan.
//
//   node scripts/mockup-visual.js snapshot   # simpan baseline ke .cache/mockup-golden
//   node scripts/mockup-visual.js compare    # bandingkan dengan baseline
//
// Baseline disimpan di .cache/ sehingga tidak masuk git.

const fs = require('node:fs')
const path = require('node:path')
const crypto = require('node:crypto')
const puppeteer = require('puppeteer')
const { startStaticServer } = require('./lib/static-server')

const ROOT = path.resolve(__dirname, '..')
const DOCS = path.join(ROOT, 'docs')
const CACHE = path.join(ROOT, '.cache')
const GOLDEN = path.join(CACHE, 'mockup-golden')
const CURRENT = path.join(CACHE, 'mockup-current')

const PARTIALS = new Set(['sidebar.html', 'header.html', 'footer.html'])
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
]

function collectPages() {
  const pages = []

  for (const entry of fs.readdirSync(path.join(DOCS, 'mockup'), { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === 'assets' || entry.name === 'components') continue
    const dir = path.join(DOCS, 'mockup', entry.name)
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith('.html')) continue
      pages.push(`mockup/${entry.name}/${file}`)
    }
  }

  const componentsDir = path.join(DOCS, 'mockup', 'components')
  for (const file of fs.readdirSync(componentsDir)) {
    if (!file.endsWith('.html') || PARTIALS.has(file)) continue
    pages.push(`mockup/components/${file}`)
  }

  return pages.sort()
}

function slug(page, viewport) {
  return `${page.replace(/[\\/]/g, '__').replace(/\.html$/, '')}@${viewport.name}.png`
}

function sha(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
}

async function capture(browser, origin, pagePath, viewport, outFile) {
  const page = await browser.newPage()
  await page.setViewport({ width: viewport.width, height: viewport.height, deviceScaleFactor: 1 })
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await page.goto(`${origin}/${pagePath}`, { waitUntil: 'networkidle0', timeout: 30000 })
  await page.addStyleTag({
    content:
      '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}' +
      'html{scroll-behavior:auto!important}',
  })
  await new Promise((resolve) => setTimeout(resolve, 120))
  await page.screenshot({ path: outFile, fullPage: true })
  await page.close()
}

async function run(mode) {
  const pages = collectPages()
  const target = mode === 'compare' ? CURRENT : GOLDEN
  fs.mkdirSync(target, { recursive: true })

  const { server, origin } = await startStaticServer(DOCS)
  const browser = await puppeteer.launch({ headless: true })
  const results = []

  try {
    for (const pagePath of pages) {
      for (const viewport of VIEWPORTS) {
        const file = path.join(target, slug(pagePath, viewport))
        await capture(browser, origin, pagePath, viewport, file)
        results.push({ pagePath, viewport, file })
      }
    }
  } finally {
    await browser.close()
    server.close()
  }

  if (mode !== 'compare') {
    console.log(`Baseline tersimpan: ${results.length} screenshot di ${path.relative(ROOT, GOLDEN)}`)
    return 0
  }

  let changed = 0
  let missing = 0
  for (const item of results) {
    const golden = path.join(GOLDEN, slug(item.pagePath, item.viewport))
    if (!fs.existsSync(golden)) {
      missing++
      console.log(`BARU  ${slug(item.pagePath, item.viewport)}`)
      continue
    }
    if (sha(golden) !== sha(item.file)) {
      changed++
      console.log(`BEDA  ${slug(item.pagePath, item.viewport)}`)
    }
  }

  console.log(`\n${results.length} screenshot dibandingkan: ${changed} berubah, ${missing} tanpa baseline`)
  return changed + missing === 0 ? 0 : 1
}

const mode = process.argv[2] === 'compare' ? 'compare' : 'snapshot'
run(mode)
  .then((code) => process.exit(code))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
