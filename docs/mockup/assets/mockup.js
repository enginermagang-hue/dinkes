// Interaksi ringan untuk mockup statis.

const TOAST_STYLES = {
  success: { bg: 'bg-emerald-600', icon: 'ri-checkbox-circle-line' },
  error: { bg: 'bg-rose-600', icon: 'ri-error-warning-line' },
  warning: { bg: 'bg-amber-500', icon: 'ri-alert-line' },
  info: { bg: 'bg-slate-900', icon: 'ri-information-line' },
}

function closeModal(modal) {
  if (!modal || modal.classList.contains('hidden')) return
  modal.classList.add('is-closing')
  setTimeout(() => {
    modal.classList.remove('is-closing')
    modal.classList.add('hidden')
  }, 160)
}

function initMockup() {
  // Toggle sidebar pada layar kecil.
  document.querySelectorAll('[data-toggle-nav]').forEach((button) => {
    if (button.dataset.bound) return
    button.dataset.bound = '1'
    button.addEventListener('click', () => {
      const nav = document.querySelector('[data-nav]')
      if (nav) nav.classList.toggle('hidden')
    })
  })

  // Tab sederhana: tombol dengan data-tab dan panel dengan data-panel.
  document.querySelectorAll('[data-tab]').forEach((button) => {
    if (button.dataset.bound) return
    button.dataset.bound = '1'
    button.addEventListener('click', () => {
      const group = button.dataset.tabGroup || 'default'
      const target = button.dataset.tab

      document
        .querySelectorAll(`[data-tab][data-tab-group="${group}"]`)
        .forEach((item) => {
          item.classList.remove('bg-brand-600', 'text-white')
          item.classList.add('text-slate-600')
        })
      button.classList.add('bg-brand-600', 'text-white')
      button.classList.remove('text-slate-600')

      document
        .querySelectorAll(`[data-panel][data-panel-group="${group}"]`)
        .forEach((panel) => {
          panel.classList.toggle('hidden', panel.dataset.panel !== target)
        })
    })
  })

  // Modal dengan animasi masuk dan keluar.
  document.querySelectorAll('[data-modal-open]').forEach((button) => {
    if (button.dataset.bound) return
    button.dataset.bound = '1'
    button.addEventListener('click', () => {
      const modal = document.querySelector(button.dataset.modalOpen)
      if (!modal) return
      modal.classList.remove('hidden', 'is-closing')
    })
  })

  document.querySelectorAll('[data-modal-close]').forEach((button) => {
    if (button.dataset.bound) return
    button.dataset.bound = '1'
    button.addEventListener('click', () => {
      closeModal(button.closest('[data-modal]'))
    })
  })

  // Toast bertipe dengan ikon dan warna sesuai status.
  document.querySelectorAll('[data-toast]').forEach((button) => {
    if (button.dataset.bound) return
    button.dataset.bound = '1'
    button.addEventListener('click', () => {
      const type = button.dataset.toastType || 'info'
      const style = TOAST_STYLES[type] || TOAST_STYLES.info

      const toast = document.createElement('div')
      toast.className =
        `fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg px-4 py-3 ` +
        `text-sm text-white shadow-lg ${style.bg}`
      toast.setAttribute('role', 'status')

      const icon = document.createElement('i')
      icon.className = `${style.icon} icon-sm`
      icon.setAttribute('aria-hidden', 'true')

      const label = document.createElement('span')
      label.textContent = button.dataset.toast

      toast.append(icon, label)
      document.body.appendChild(toast)
      setTimeout(() => toast.remove(), 2600)
    })
  })
}

window.initMockup = initMockup
document.addEventListener('DOMContentLoaded', initMockup)
