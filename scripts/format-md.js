const { execSync } = require('child_process')

console.log('🔍 Checking Markdown files...\n')

try {
  console.log('📝 Running Prettier...')
  execSync('npx prettier --write "**/*.md"', { stdio: 'inherit' })

  console.log('\n✓ Running markdownlint...')
  execSync('npx markdownlint "**/*.md"', { stdio: 'inherit' })

  console.log('\n✅ All Markdown files formatted successfully!')
} catch (error) {
  console.error('\n❌ Error formatting Markdown files')
  process.exit(1)
}
