const fs = require('fs')
const os = require('os')
const path = require('path')
const crypto = require('crypto')
const { execSync } = require('child_process')

const ROOT = path.resolve(__dirname, '..', '..')
const CACHE_FILE = path.join(ROOT, '.cache', 'mermaid-hashes.json')
const IGNORE_DIRS = new Set([
  'node_modules',
  '.git',
  '.github',
  '.vscode',
  '.cache',
  'dist',
  'build',
])
const MERMAID_BLOCK = /```mermaid[ \t]*\r?\n([\s\S]*?)\r?\n?```/g
const mmdc = path.join(
  ROOT,
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'mmdc.cmd' : 'mmdc'
)

function rel(file) {
  return path.relative(ROOT, file).split(path.sep).join('/')
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (!IGNORE_DIRS.has(entry.name)) walk(full, files)
    } else if (entry.name.toLowerCase().endsWith('.md')) {
      files.push(full)
    }
  }
  return files
}

function slugify(text) {
  const slug = text
    .replace(/[`*_~[\]()]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
  return slug || 'diagram'
}

function nearestHeading(lines, index) {
  for (let i = index - 1; i >= 0; i--) {
    const match = lines[i].match(/^(#{1,6})\s+(.+?)\s*#*$/)
    if (match) return match[2]
  }
  return 'diagram'
}

function hash(text) {
  return crypto.createHash('sha256').update(text).digest('hex')
}

function extractBlocks(content, lines) {
  const blocks = []
  const used = new Map()
  let match

  MERMAID_BLOCK.lastIndex = 0
  while ((match = MERMAID_BLOCK.exec(content)) !== null) {
    const lineIndex = content.slice(0, match.index).split(/\r?\n/).length - 1
    const base = slugify(nearestHeading(lines, lineIndex))
    const seen = used.get(base) || 0
    used.set(base, seen + 1)
    const name = seen === 0 ? base : `${base}-${seen + 1}`
    blocks.push({ name, code: match[1].trim(), lineIndex })
  }
  return blocks
}

function loadCache() {
  try {
    return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'))
  } catch {
    return {}
  }
}

function saveCache(cache) {
  fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true })
  fs.writeFileSync(CACHE_FILE, `${JSON.stringify(cache, null, 2)}\n`, 'utf8')
}

function pngPath(mdFile, name) {
  return path.join(path.dirname(mdFile), 'diagrams', `${name}.png`)
}

function exportBlock(block, mdFile) {
  const outFile = pngPath(mdFile, block.name)
  fs.mkdirSync(path.dirname(outFile), { recursive: true })
  const tmpFile = path.join(
    os.tmpdir(),
    `mermaid-${Date.now()}-${Math.random().toString(36).slice(2)}-${block.name}.mmd`
  )
  fs.writeFileSync(tmpFile, `${block.code}\n`, 'utf8')

  try {
    execSync(`"${mmdc}" -i "${tmpFile}" -o "${outFile}"`, {
      cwd: ROOT,
      stdio: ['ignore', 'ignore', 'inherit'],
    })
  } finally {
    if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile)
  }
  return outFile
}

function exportFile(mdFile, options = {}) {
  const { force = false, cache = loadCache() } = options
  const content = fs.readFileSync(mdFile, 'utf8')
  const lines = content.split(/\r?\n/)
  const blocks = extractBlocks(content, lines)
  const key = rel(mdFile)
  const fileCache = cache[key] || (cache[key] = {})
  const results = []

  for (const block of blocks) {
    const digest = hash(block.code)
    const outFile = pngPath(mdFile, block.name)
    if (
      !force &&
      fileCache[block.name] === digest &&
      fs.existsSync(outFile)
    ) {
      results.push({ name: block.name, skipped: true, outFile })
      continue
    }
    const generated = exportBlock(block, mdFile)
    fileCache[block.name] = digest
    results.push({ name: block.name, skipped: false, outFile: generated })
  }

  const activeNames = new Set(blocks.map((block) => block.name))
  for (const name of Object.keys(fileCache)) {
    if (!activeNames.has(name)) delete fileCache[name]
  }
  return results
}

function exportAll(options = {}) {
  const { force = false } = options
  const cache = loadCache()
  const activeKeys = new Set()
  const exported = []
  let skipped = 0

  for (const mdFile of walk(ROOT)) {
    activeKeys.add(rel(mdFile))
    for (const result of exportFile(mdFile, { force, cache })) {
      if (result.skipped) skipped++
      else exported.push(result)
    }
  }

  for (const key of Object.keys(cache)) {
    if (!activeKeys.has(key)) delete cache[key]
  }
  saveCache(cache)
  return { exported, skipped }
}

function removeCacheEntry(mdFile) {
  const cache = loadCache()
  delete cache[rel(mdFile)]
  saveCache(cache)
}

module.exports = {
  ROOT,
  CACHE_FILE,
  rel,
  walk,
  slugify,
  nearestHeading,
  hash,
  extractBlocks,
  loadCache,
  saveCache,
  pngPath,
  exportBlock,
  exportFile,
  exportAll,
  removeCacheEntry,
}
