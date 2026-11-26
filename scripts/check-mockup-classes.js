// Penjaga konsistensi: pastikan komponen mockup memakai class semantik,
// bukan utilitas Tailwind yang ditulis ulang di markup.
//
//   npm run mockup:check
//
// Keluar dengan kode 1 bila menemukan pola komponen yang ditulis manual.

const fs = require('node:fs')
const path = require('node:path')

const ROOT = path.resolve(__dirname, '..', 'docs', 'mockup')

const RULES = [
  { name: 'kartu manual', test: /rounded-xl[^"]*border[^"]*border-slate-200[^"]*bg-white/ },
  { name: 'kepala seksi manual', test: /border-b[^"]*border-slate-200[^"]*pb-2/ },
  { name: 'judul seksi manual', test: /text-lg[^"]*font-semibold/ },
  { name: 'tombol primer manual', test: /rounded-lg[^"]*bg-brand-600[^"]*px-/ },
  { name: 'tombol sekunder manual', test: /rounded-lg[^"]*border[^"]*border-slate-300[^"]*px-/ },
  { name: 'badge manual', test: /rounded-full[^"]*px-2\.5[^"]*py-0\.5/ },
  { name: 'label formulir manual', test: /block[^"]*font-medium[^"]*text-slate-700[^"]*text-sm/ },
  { name: 'tabel manual', test: /<table[^>]*class="[^"]*\btext-left\b/ },
]

// Elemen dengan atribut ini sengaja memamerkan utilitas (contoh token warna,
// pratinjau permukaan gelap, dan sebagainya).
const ALLOW_ATTR = 'data-allow-utilities'

function collectHtml(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules') continue
      collectHtml(full, out)
    } else if (entry.name.endsWith('.html')) {
      out.push(full)
    }
  }
  return out
}

function lineOf(text, index) {
  return text.slice(0, index).split('\n').length
}

const problems = []
const files = collectHtml(ROOT)

for (const file of files) {
  const raw = fs.readFileSync(file, 'utf8')
  const lines = raw.split('\n')

  lines.forEach((line, i) => {
    if (line.includes(ALLOW_ATTR)) return
    // Lewati baris yang membuka blok pengecualian.
    if (/^.*data-allow-utilities/.test(line)) return

    for (const rule of RULES) {
      if (rule.test.test(line)) {
        problems.push({
          file: path.relative(ROOT, file).replace(/\\/g, '/'),
          line: i + 1,
          rule: rule.name,
          snippet: line.trim().slice(0, 110),
        })
      }
    }
  })
}

if (problems.length === 0) {
  console.log(`mockup:check OK — ${files.length} berkas, tidak ada komponen manual.`)
  process.exit(0)
}

console.error(`mockup:check menemukan ${problems.length} komponen yang ditulis manual:\n`)
for (const p of problems) {
  console.error(`  ${p.file}:${p.line}  [${p.rule}]`)
  console.error(`    ${p.snippet}`)
}
console.error(
  '\nGunakan class semantik (mis. .btn, .card, .badge, .table) atau tambahkan\n' +
    `${ALLOW_ATTR} pada elemen bila memang sengaja memamerkan utilitas.`,
)
process.exit(1)
