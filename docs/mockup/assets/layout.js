// Pemuat komponen layout statis untuk mockup.
// Setiap halaman menandai elemen dengan data-include berisi path komponen.

const SIDEBAR_KEY = 'mockup:sidebar-mini'
const DESKTOP_QUERY = window.matchMedia('(min-width: 1024px)')
const MOBILE_QUERY = window.matchMedia('(max-width: 1023px)')
let savedScrollY = 0

function lockScroll() {
  savedScrollY = window.scrollY || document.documentElement.scrollTop || 0
  document.documentElement.classList.add('nav-open')
  document.body.style.top = `-${savedScrollY}px`
}

function unlockScroll() {
  if (!document.documentElement.classList.contains('nav-open')) return
  document.documentElement.classList.remove('nav-open')
  document.body.style.top = ''
  window.scrollTo(0, savedScrollY)
}

function applySidebarState() {
  const mini = DESKTOP_QUERY.matches && localStorage.getItem(SIDEBAR_KEY) === '1'
  document.body.classList.toggle('sidebar-mini', mini)
}

function initSidebarToggle() {
  document.querySelectorAll('[data-collapse-sidebar]').forEach((button) => {
    if (button.dataset.bound) return
    button.dataset.bound = '1'
    button.addEventListener('click', () => {
      if (!DESKTOP_QUERY.matches) return
      const next = !document.body.classList.contains('sidebar-mini')
      localStorage.setItem(SIDEBAR_KEY, next ? '1' : '0')
      document.body.classList.toggle('sidebar-mini', next)
    })
  })
}

function navElements() {
  return {
    nav: document.querySelector('[data-nav]'),
    backdrop: document.querySelector('[data-nav-backdrop]'),
  }
}

function openNav() {
  const { nav, backdrop } = navElements()
  if (!nav) return
  nav.classList.remove('-translate-x-full')
  nav.classList.add('translate-x-0')
  lockScroll()
  document.querySelectorAll('[data-toggle-nav]').forEach((button) => {
    button.classList.add('is-open')
  })
  if (backdrop) {
    backdrop.classList.remove('hidden')
    void backdrop.offsetWidth
    backdrop.classList.remove('opacity-0')
    backdrop.classList.add('opacity-100')
  }
}

function closeNav() {
  const { nav, backdrop } = navElements()
  if (!nav) return
  nav.classList.add('-translate-x-full')
  nav.classList.remove('translate-x-0')
  unlockScroll()
  document.querySelectorAll('[data-toggle-nav]').forEach((button) => {
    button.classList.remove('is-open')
  })
  if (backdrop) {
    backdrop.classList.remove('opacity-100')
    backdrop.classList.add('opacity-0')
    setTimeout(() => {
      if (!backdrop.classList.contains('opacity-100')) {
        backdrop.classList.add('hidden')
      }
    }, 160)
  }
}

function toggleNav() {
  const { nav } = navElements()
  if (!nav) return
  const isOpen = !nav.classList.contains('-translate-x-full')
  if (isOpen) closeNav()
  else openNav()
}

function initNav() {
  document.querySelectorAll('[data-toggle-nav]').forEach((button) => {
    if (button.dataset.bound) return
    button.dataset.bound = '1'
    button.addEventListener('click', toggleNav)
  })

  const { backdrop } = navElements()
  if (backdrop && !backdrop.dataset.bound) {
    backdrop.dataset.bound = '1'
    backdrop.addEventListener('click', closeNav)
  }

  document.querySelectorAll('aside[data-nav] a[href]').forEach((link) => {
    if (link.dataset.navBound) return
    link.dataset.navBound = '1'
    link.addEventListener('click', () => {
      if (MOBILE_QUERY.matches) closeNav()
    })
  })

  if (!document.body.dataset.navEscBound) {
    document.body.dataset.navEscBound = '1'
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && MOBILE_QUERY.matches) closeNav()
    })
  }
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
  initNav()

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
DESKTOP_QUERY.addEventListener('change', () => {
  applySidebarState()
  if (!MOBILE_QUERY.matches) closeNav()
})
MOBILE_QUERY.addEventListener('change', () => {
  if (!MOBILE_QUERY.matches) closeNav()
})
