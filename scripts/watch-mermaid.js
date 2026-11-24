const path = require('path')
const chokidar = require('chokidar')
const {
  ROOT,
  rel,
  exportFile,
  loadCache,
  saveCache,
  removeCacheEntry,
} = require('./lib/mermaid-utils')

const DEBOUNCE_MS = 500
const timers = new Map()

const watcher = chokidar.watch(ROOT, {
  ignored: /(^|[\/\\])(node_modules|\.git|\.github|\.vscode|\.cache|dist|build)([\/\\]|$)/,
  ignoreInitial: true,
  usePolling: true,
  interval: 300,
})

function isMarkdown(file) {
  return file.toLowerCase().endsWith('.md')
}

function sync(mdFile) {
  const full = path.isAbsolute(mdFile) ? mdFile : path.join(ROOT, mdFile)
  if (timers.has(full)) clearTimeout(timers.get(full))

  timers.set(
    full,
    setTimeout(() => {
      timers.delete(full)
      try {
        const cache = loadCache()
        const results = exportFile(full, { cache })
        saveCache(cache)
        const changed = results.filter((result) => !result.skipped)
        if (changed.length > 0) {
          console.log(`🔄 ${rel(full)}:`)
          for (const result of changed) {
            console.log(`   ✓ ${result.name}.png`)
          }
        } else {
          console.log(`⏭️  ${rel(full)}: diagram tidak berubah`)
        }
      } catch (error) {
        console.error(`❌ ${rel(full)}: ${error.message}`)
      }
    }, DEBOUNCE_MS)
  )
}

console.log('👀 Watching Markdown files for Mermaid changes...')
console.log('   Tekan Ctrl+C untuk berhenti.\n')

watcher.on('add', (file) => {
  if (isMarkdown(file)) sync(file)
})
watcher.on('change', (file) => {
  if (isMarkdown(file)) sync(file)
})
watcher.on('unlink', (file) => {
  if (!isMarkdown(file)) return
  const full = path.isAbsolute(file) ? file : path.join(ROOT, file)
  if (timers.has(full)) clearTimeout(timers.get(full))
  timers.delete(full)
  removeCacheEntry(full)
  console.log(`🗑️  ${rel(full)}: dihapus dari cache`)
})

watcher.on('ready', () => {
  console.log('✅ Watcher aktif. Edit file .md untuk melihat PNG ter-update.\n')
})
