// Regresi visual mockup: ambil screenshot semua halaman lalu bandingkan.
//
//   node scripts/mockup-visual.js snapshot   # simpan baseline ke .cache/mockup-golden
//   node scripts/mockup-visual.js compare    # bandingkan dengan baseline
//
// Perbandingan memakai ambang toleransi kecil agar fluktuasi antialiasing teks
// tidak dianggap sebagai perubahan. Baseline disimpan di .cache/ (tidak masuk git).

const fs = require('node:fs')
const path = require('node:path')
const puppeteer = require('puppeteer')
const { startStaticServer } = require('./lib/static-server')

const ROOT = path.resolve(__dirname, '..')
const DOCS = path.join(ROOT, 'docs')
const CACHE = path.join(ROOT, '.cache')
const GOLDEN = path.join(CACHE, 'mockup-golden')
const CURRENT = path.join(CACHE, 'mockup-current')

// Rasio piksel berbeda yang masih dianggap sama (0,02% dari total piksel).
const TOLERANCE = 0.0002

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

function dataUrl(file) {
  return 'data:image/png;base64,' + fs.readFileSync(file).toString('base64')
}

async function capture(browser, origin, pagePath, viewport, outFile) {
  const page = await browser.newPage()
  await page.setViewport({ width: viewport.width, height: viewport.height, deviceScaleFactor: 1 })
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await page.goto(`${origin}/${pagePath}`, { waitUntil: 'networkidle0', timeout: 30000 })
  await page.evaluate(() => document.fonts.ready)
  await page.addStyleTag({
    content:
      '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}' +
      'html{scroll-behavior:auto!important}',
  })
  await new Promise((resolve) => setTimeout(resolve, 250))
  await page.screenshot({ path: outFile, fullPage: true })
  await page.close()
}

// Hitung rasio piksel berbeda memakai canvas di browser yang sama.
const DIFF_SCRIPT = async (aUrl, bUrl) => {
  const load = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = src
    })

  const [a, b] = await Promise.all([load(aUrl), load(bUrl)])
  const w = Math.max(a.width, b.width)
  const h = Math.max(a.height, b.height)

  const read = (img) => {
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)
    return ctx.getImageData(0, 0, w, h).data
  }

  const dataA = read(a)
  const dataB = read(b)
  let diff = 0
  for (let i = 0; i < dataA.length; i += 4) {
    const delta =
      Math.abs(dataA[i] - dataB[i]) +
      Math.abs(dataA[i + 1] - dataB[i + 1]) +
      Math.abs(dataA[i + 2] - dataB[i + 2])
    if (delta > 12) diff += 1
  }

  return { diff, total: w * h, ratio: diff / (w * h), sizeA: [a.width, a.height], sizeB: [b.width, b.height] }
}

async function run(mode) {
  const pages = collectPages()
  const target = mode === 'compare' ? CURRENT : GOLDEN
  fs.mkdirSync(target, { recursive: true })

  const { server, origin } = await startStaticServer(DOCS)
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--disable-gpu', '--font-render-hinting=none', '--force-color-profile=srgb'],
  })
  const results = []

  try {
    for (const pagePath of pages) {
      for (const viewport of VIEWPORTS) {
        const file = path.join(target, slug(pagePath, viewport))
        await capture(browser, origin, pagePath, viewport, file)
        results.push({ pagePath, viewport, file })
      }
    }

    if (mode !== 'compare') {
      console.log(`Baseline tersimpan: ${results.length} screenshot di ${path.relative(ROOT, GOLDEN)}`)
      return 0
    }

    const diffPage = await browser.newPage()
    await diffPage.goto('about:blank')

    let changed = 0
    let missing = 0
    for (const item of results) {
      const name = slug(item.pagePath, item.viewport)
      const golden = path.join(GOLDEN, name)
      if (!fs.existsSync(golden)) {
        missing++
        console.log(`BARU  ${name}`)
        continue
      }

      const stats = await diffPage.evaluate(DIFF_SCRIPT, dataUrl(golden), dataUrl(item.file))
      if (stats.ratio > TOLERANCE) {
        changed++
        console.log(`BEDA  ${name}  (${(stats.ratio * 100).toFixed(3)}%)`)
      }
    }

    console.log(
      `\n${results.length} screenshot dibandingkan: ${changed} berubah, ${missing} tanpa baseline`,
    )
    return changed + missing === 0 ? 0 : 1
  } finally {
    await browser.close()
    server.close()
  }
}

const mode = process.argv[2] === 'compare' ? 'compare' : 'snapshot'
run(mode)
  .then((code) => process.exit(code))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
