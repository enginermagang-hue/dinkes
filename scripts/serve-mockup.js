// Server lokal untuk mockup. Menyajikan folder docs/ sekaligus menjaga
// URL direktori berakhir dengan garis miring agar path relatif (CSS, include,
// dan link sidebar) tetap valid.
//
//   npm run mockup:serve            # http://127.0.0.1:3000/mockup/
//   PORT=4000 npm run mockup:serve  # port lain

const path = require('node:path')
const { startStaticServer } = require('./lib/static-server')

const ROOT = path.resolve(__dirname, '..', 'docs')
const PORT = Number(process.env.PORT || process.argv[2] || 3000)

startStaticServer(ROOT, PORT)
  .then(({ origin }) => {
    console.log('Mockup SMSOD siap:')
    console.log(`  Login          ${origin}/mockup/01-login/`)
    console.log(`  Katalog        ${origin}/mockup/components/`)
    console.log(`  Dashboard      ${origin}/mockup/02-dashboard/`)
    console.log('\nTekan Ctrl+C untuk berhenti.')
  })
  .catch((error) => {
    console.error('Gagal menjalankan server mockup:', error.message)
    process.exit(1)
  })
