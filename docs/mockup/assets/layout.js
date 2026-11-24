// Pemuat komponen layout statis untuk mockup.
// Setiap halaman menandai elemen dengan data-include berisi path komponen.

const SIDEBAR_KEY = 'mockup:sidebar-mini'

function applySidebarState() {
  const mini = localStorage.getItem(SIDEBAR_KEY) === '1'
  document.body.classList.toggle('sidebar-mini', mini)
}

function initSidebarToggle() {
  document.querySelectorAll('[data-collapse-sidebar]').forEach((button) => {
    if (button.dataset.bound) return
    button.dataset.bound = '1'
    button.addEventListener('click', () => {
      const next = !document.body.classList.contains('sidebar-mini')
      localStorage.setItem(SIDEBAR_KEY, next ? '1' : '0')
      document.body.classList.toggle('sidebar-mini', next)
    })
  })
}

async function loadIncludes() {
  const nodes = Array.from(document.querySelectorAll('[data-include]'))

  await Promise.all(
    nodes.map(async (el) => {
      try {
        const response = await fetch(el.dataset.include)
        if (!response.ok) throw new Error(String(response.status))
        el.outerHTML = await response.text()
      } catch (error) {
        el.innerHTML =
          '<div class="m-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">' +
          'Komponen gagal dimuat: ' +
          el.dataset.include +
          '. Jalankan melalui server lokal, misalnya npx serve docs.</div>'
      }
    }),
  )

  applySidebarState()
  markActiveNav()
  initSidebarToggle()

  if (typeof window.initMockup === 'function') {
    window.initMockup()
  }

  document.dispatchEvent(new CustomEvent('layout:ready'))
}

function markActiveNav() {
  const page = document.body.dataset.page
  if (!page) return

  document.querySelectorAll('[data-nav-item]').forEach((link) => {
    if (link.dataset.navItem !== page) return
    link.classList.add('bg-brand-600', 'text-white')
    link.classList.remove('text-slate-300', 'hover:bg-slate-800')
  })
}

document.addEventListener('DOMContentLoaded', loadIncludes)
