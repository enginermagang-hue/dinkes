const { exportAll } = require('./lib/mermaid-utils')

console.log('🖼️  Exporting Mermaid diagrams to PNG...\n')

const { exported, skipped } = exportAll()

for (const result of exported) {
  console.log(`  ✓ ${require('./lib/mermaid-utils').rel(result.outFile)}`)
}

console.log(`\n✅ Exported ${exported.length} diagram(s), skipped ${skipped} unchanged.`)
