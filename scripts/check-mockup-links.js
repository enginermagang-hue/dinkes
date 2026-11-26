// Uji tautan mockup dari ujung ke ujung:
//  - setiap halaman memuat CSS, include sidebar, dan header
//  - setiap link di sidebar dan header mengarah ke halaman yang juga sehat
//
//   npm run mockup:links

const fs = require('node:fs')
const path = require('node:path')
const puppeteer = require('puppeteer')
const { startStaticServer } = require('./lib/static-server')

const ROOT = path.resolve(__dirname, '..')
const DOCS = path.join(ROOT, 'docs')
const START = 'mockup/components/index.html'

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

  for (const file of fs.readdirSync(path.join(DOCS, 'mockup', 'components'))) {
    if (!file.endsWith('.html')) continue
    if (['sidebar.html', 'header.html', 'footer.html'].includes(file)) continue
    pages.push(`mockup/components/${file}`)
  }

  return pages.sort()
}

// Direktori yang menjadi basis path relatif untuk sebuah URL halaman.
function expectedDir(url) {
  return new URL('.', url).pathname
}

async function inspect(page, url) {
  const response = await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })
  if (!response) return { status: 0, problems: [`${url}: tidak ada respons`] }

  const state = await page.evaluate(() => {
    const nav = document.querySelector('aside[data-nav]')
    const header = document.querySelector('header')
    const hasLayout = !!document.body.dataset.page
    return {
      hasLayout,
      nav: !!nav,
      header: !!header,
      navPosition: nav ? getComputedStyle(nav).position : null,
      baseDir: new URL('.', document.baseURI).pathname,
      links: [
        ...document.querySelectorAll('aside[data-nav] a[href], header a[href], main nav a[href]'),
      ].map((a) => a.href),
    }
  })

  const problems = []
  if (response.status() >= 400) problems.push(`${url}: HTTP ${response.status()}`)

  const dir = expectedDir(url)
  if (state.baseDir !== dir) {
    problems.push(`${url}: base path salah (${state.baseDir}, seharusnya ${dir})`)
  }

  if (state.hasLayout) {
    if (!state.nav) problems.push(`${url}: sidebar tidak termuat`)
    if (!state.header) problems.push(`${url}: header tidak termuat`)
    if (state.nav && state.navPosition !== 'fixed') {
      problems.push(`${url}: CSS tidak terpakai (sidebar position=${state.navPosition})`)
    }
  }

  return { status: response.status(), ...state, problems }
}

;(async () => {
  const server = await startStaticServer(DOCS)
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })

  const origin = server.origin
  const pages = collectPages()
  const problems = []

  // 1. Halaman awal dibuka seperti tautan biasa (dengan index.html).
  const start = await inspect(page, `${origin}/${START}`)
  problems.push(...start.problems)

  // 2. Setiap halaman harus sehat saat dibuka langsung.
  for (const pagePath of pages) {
    const state = await inspect(page, `${origin}/${pagePath}`)
    problems.push(...state.problems)
  }

  // 3. Semua tautan sidebar/header harus mengarah ke halaman sehat.
  const checked = new Set()
  for (const link of start.links) {
    if (checked.has(link) || link.includes('#')) continue
    checked.add(link)

    const state = await inspect(page, link)
    problems.push(...state.problems)
  }

  await browser.close()
  server.server.close()

  if (problems.length === 0) {
    console.log(
      `mockup:links OK — ${pages.length} halaman, ${checked.size} tautan sidebar/header diperiksa.`,
    )
    process.exit(0)
  }

  console.error(`mockup:links menemukan ${problems.length} masalah:\n`)
  for (const problem of problems) console.error('  - ' + problem)
  process.exit(1)
})().catch((error) => {
  console.error(error)
  process.exit(1)
})
