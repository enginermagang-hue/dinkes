// Interaksi ringan untuk mockup statis.

const TOAST_STYLES = {
  success: { type: 'success', icon: 'ri-checkbox-circle-line' },
  error: { type: 'error', icon: 'ri-error-warning-line' },
  warning: { type: 'warning', icon: 'ri-alert-line' },
  info: { type: 'info', icon: 'ri-information-line' },
}

function closeModal(modal) {
  if (!modal || modal.classList.contains('hidden')) return
  modal.classList.add('is-closing')
  setTimeout(() => {
    modal.classList.remove('is-closing')
    modal.classList.add('hidden')
  }, 160)
}

function showToast(button) {
  const type = button.dataset.toastType || 'info'
  const style = TOAST_STYLES[type] || TOAST_STYLES.info

  const toast = document.createElement('div')
  toast.className = `toast toast-enter toast-${style.type}`
  toast.setAttribute('role', 'status')

  const icon = document.createElement('i')
  icon.className = `${style.icon} icon-sm`
  icon.setAttribute('aria-hidden', 'true')

  const label = document.createElement('span')
  label.textContent = button.dataset.toast

  const close = document.createElement('button')
  close.type = 'button'
  close.className = 'toast-close'
  close.setAttribute('aria-label', 'Tutup notifikasi')
  close.innerHTML = '<i class="ri-close-line icon-xs" aria-hidden="true"></i>'

  let removed = false
  const dismiss = () => {
    if (removed) return
    removed = true
    clearTimeout(timer)
    toast.classList.remove('toast-enter')
    toast.classList.add('toast-leave')
    setTimeout(() => toast.remove(), 160)
  }
  const timer = setTimeout(dismiss, 3200)
  close.addEventListener('click', dismiss)

  toast.append(icon, label, close)
  document.body.appendChild(toast)
}

let dropdownOutsideBound = false

function closeDropdown(dropdown) {
  if (!dropdown.open) return
  const panel = dropdown.querySelector('.dropdown-panel')
  if (!panel) {
    dropdown.open = false
    return
  }
  if (panel.dataset.closing) return
  panel.dataset.closing = '1'
  panel.classList.add('dropdown-leave')
  setTimeout(() => {
    panel.classList.remove('dropdown-leave')
    delete panel.dataset.closing
    dropdown.open = false
  }, 120)
}

function closeAllDropdowns(except) {
  document.querySelectorAll('details[open]').forEach((item) => {
    if (item !== except) closeDropdown(item)
  })
}

function initDropdowns() {
  const dropdowns = Array.from(document.querySelectorAll('details'))
  if (!dropdowns.length) return

  dropdowns.forEach((item) => {
    if (item.dataset.ddBound) return
    item.dataset.ddBound = '1'

    const summary = item.querySelector(':scope > summary')
    if (summary) {
      summary.addEventListener('click', (event) => {
        event.preventDefault()
        if (item.open) {
          closeDropdown(item)
          return
        }
        closeAllDropdowns(item)
        item.open = true
      })
    }

    item.addEventListener('toggle', () => {
      if (!item.open) return
      dropdowns.forEach((other) => {
        if (other !== item && other.open) closeDropdown(other)
      })
    })
  })

  if (dropdownOutsideBound) return
  dropdownOutsideBound = true

  // Item di dalam panel dapat menutup dropdown lewat data-dropdown-close.
  document.addEventListener('click', (event) => {
    const target = event.target
    if (!(target instanceof Element)) return
    const closer = target.closest('[data-dropdown-close]')
    if (!closer) return
    const dropdown = closer.closest('details')
    if (dropdown) closeDropdown(dropdown)
  })

  // Klik di luar dropdown menutup semua dropdown dengan animasi.
  document.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('details')) return
    closeAllDropdowns()
  })

  // Tombol Escape menutup semua dropdown.
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return
    closeAllDropdowns()
  })
}

function initQuantity() {
  document.querySelectorAll('[data-qty]').forEach((box) => {
    if (box.dataset.bound) return
    box.dataset.bound = '1'
    const input = box.querySelector('input')
    if (!input) return
    box.querySelectorAll('[data-qty-step]').forEach((button) => {
      button.addEventListener('click', () => {
        const step = parseInt(button.dataset.qtyStep, 10) || 1
        const min = parseInt(input.min || '0', 10)
        const max = input.max ? parseInt(input.max, 10) : Number.MAX_SAFE_INTEGER
        const next = Math.min(max, Math.max(min, (parseInt(input.value, 10) || 0) + step))
        input.value = String(next)
      })
    })
  })
}

function initCopy() {
  document.querySelectorAll('[data-copy]').forEach((button) => {
    if (button.dataset.bound) return
    button.dataset.bound = '1'
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.copy)
        showToast({ dataset: { toast: 'Disalin: ' + button.dataset.copy, toastType: 'success' } })
      } catch (error) {
        showToast({ dataset: { toast: 'Gagal menyalin', toastType: 'error' } })
      }
    })
  })
}

function initExpandRows() {
  document.querySelectorAll('[data-expand-target]').forEach((button) => {
    if (button.dataset.bound) return
    button.dataset.bound = '1'
    button.addEventListener('click', () => {
      const row = document.querySelector(button.dataset.expandTarget)
      if (row) row.classList.toggle('hidden')
    })
  })
}

function initCheckAll() {
  document.querySelectorAll('[data-check-all]').forEach((master) => {
    if (master.dataset.bound) return
    master.dataset.bound = '1'
    const table = master.closest('table')
    if (!table) return

    const counter = table.closest('.card')?.querySelector('[data-check-count]')
    const updateCounter = () => {
      if (!counter) return
      const total = table.querySelectorAll('[data-check-row]:checked').length
      counter.textContent = `${total} dokumen dipilih`
    }

    master.addEventListener('change', () => {
      table.querySelectorAll('[data-check-row]').forEach((box) => {
        box.checked = master.checked
      })
      updateCounter()
    })

    table.querySelectorAll('[data-check-row]').forEach((box) => {
      box.addEventListener('change', updateCounter)
    })

    updateCounter()
  })
}

function initSegments() {
  document.querySelectorAll('[data-segment]').forEach((group) => {
    if (group.dataset.bound) return
    group.dataset.bound = '1'
    group.querySelectorAll('button').forEach((button) => {
      button.addEventListener('click', () => {
        group.querySelectorAll('button').forEach((item) => {
          item.setAttribute('aria-pressed', 'false')
        })
        button.setAttribute('aria-pressed', 'true')
      })
    })
  })
}

function initCommandPalette() {
  const palette = document.querySelector('[data-command-palette]')
  if (!palette) return

  const input = palette.querySelector('[data-command-input]')
  const items = Array.from(palette.querySelectorAll('[data-command-item]'))
  const filterItems = (query) => {
    const q = query.trim().toLowerCase()
    items.forEach((item) => {
      item.classList.toggle('hidden', q !== '' && !item.textContent.toLowerCase().includes(q))
    })
  }

  const open = () => {
    palette.classList.remove('hidden')
    if (input) {
      input.value = ''
      filterItems('')
      input.focus()
    }
  }
  const close = () => palette.classList.add('hidden')

  if (!palette.dataset.bound) {
    palette.dataset.bound = '1'
    document.querySelectorAll('[data-command-open]').forEach((button) => {
      button.addEventListener('click', open)
    })
    palette.querySelectorAll('[data-command-close]').forEach((element) => {
      element.addEventListener('click', close)
    })
    items.forEach((item) => item.addEventListener('click', close))
    if (input) input.addEventListener('input', () => filterItems(input.value))
    document.addEventListener('keydown', (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        open()
      }
      if (event.key === 'Escape') close()
    })
  }
}

function initSignature() {
  const canvas = document.querySelector('[data-signature]')
  if (!canvas || canvas.dataset.bound) return
  canvas.dataset.bound = '1'
  const ctx = canvas.getContext('2d')

  const resize = () => {
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#0f172a'
  }
  resize()

  let drawing = false
  const position = (event) => {
    const rect = canvas.getBoundingClientRect()
    return { x: event.clientX - rect.left, y: event.clientY - rect.top }
  }

  canvas.addEventListener('pointerdown', (event) => {
    drawing = true
    const point = position(event)
    ctx.beginPath()
    ctx.moveTo(point.x, point.y)
    canvas.setPointerCapture(event.pointerId)
  })
  canvas.addEventListener('pointermove', (event) => {
    if (!drawing) return
    const point = position(event)
    ctx.lineTo(point.x, point.y)
    ctx.stroke()
  })
  canvas.addEventListener('pointerup', () => {
    drawing = false
  })

  const clear = document.querySelector('[data-signature-clear]')
  if (clear) {
    clear.addEventListener('click', () => ctx.clearRect(0, 0, canvas.width, canvas.height))
  }
}

function initPrint() {
  document.querySelectorAll('[data-print]').forEach((button) => {
    if (button.dataset.bound) return
    button.dataset.bound = '1'
    button.addEventListener('click', () => window.print())
  })
}

function initDataTables() {
  document.querySelectorAll('[data-table]').forEach((table) => {
    if (table.dataset.tableBound) return
    table.dataset.tableBound = '1'

    const card = table.closest('.card')
    const tbody = table.tBodies[0]
    if (!card || !tbody) return

    const search = card.querySelector('[data-table-search]')
    const sizeSelect = card.querySelector('[data-table-size]')
    const nav = card.querySelector('[data-table-nav]')
    const empty = card.querySelector('[data-table-empty]')
    const totals = card.querySelectorAll('[data-table-total]')
    const range = card.querySelector('[data-table-range]')

    const rows = Array.from(tbody.rows)
    let page = 1
    let size = Number(sizeSelect ? sizeSelect.value : 0) || rows.length || 10
    let query = ''

    const filtered = () => {
      const q = query.trim().toLowerCase()
      if (!q) return rows
      return rows.filter((row) => row.textContent.toLowerCase().includes(q))
    }

    const addNavButton = (label, target, options = {}) => {
      const button = document.createElement('button')
      button.type = 'button'
      button.className = `page-btn ${options.active ? 'page-btn-active' : 'page-btn-outline'}`
      if (options.disabled) button.disabled = true
      if (options.active) button.setAttribute('aria-current', 'page')
      if (options.icon) {
        button.innerHTML = `<i class="${options.icon} icon-sm" aria-hidden="true"></i>`
        button.setAttribute('aria-label', options.label)
      } else {
        button.textContent = label
      }
      button.addEventListener('click', () => {
        page = target
        render()
      })
      nav.appendChild(button)
    }

    const renderNav = (pages) => {
      if (!nav) return
      nav.innerHTML = ''
      addNavButton('Sebelumnya', page - 1, {
        icon: 'ri-arrow-left-s-line',
        label: 'Halaman sebelumnya',
        disabled: page <= 1,
      })
      for (let number = 1; number <= pages; number += 1) {
        addNavButton(String(number), number, { active: number === page })
      }
      addNavButton('Berikutnya', page + 1, {
        icon: 'ri-arrow-right-s-line',
        label: 'Halaman berikutnya',
        disabled: page >= pages,
      })
    }

    const render = () => {
      const list = filtered()
      const pages = Math.max(1, Math.ceil(list.length / size))
      page = Math.min(Math.max(1, page), pages)

      const start = (page - 1) * size
      const visible = new Set(list.slice(start, start + size))
      rows.forEach((row) => row.classList.toggle('hidden', !visible.has(row)))

      totals.forEach((el) => {
        el.textContent = String(list.length)
      })
      if (range) {
        range.textContent =
          list.length === 0 ? '0' : `${start + 1}–${Math.min(start + size, list.length)}`
      }
      if (empty) empty.classList.toggle('hidden', list.length > 0)

      renderNav(pages)
    }

    if (search) {
      search.addEventListener('input', () => {
        query = search.value
        page = 1
        render()
      })
    }

    if (sizeSelect) {
      sizeSelect.addEventListener('change', () => {
        size = Number(sizeSelect.value) || size
        page = 1
        render()
      })
    }

    render()
  })
}

function initMockup() {
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
          item.classList.remove('tab-active')
        })
      button.classList.add('tab-active')

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

  // Toast bertipe dengan ikon, warna status, animasi, dan tombol tutup.
  document.querySelectorAll('[data-toast]').forEach((button) => {
    if (button.dataset.bound) return
    button.dataset.bound = '1'
    button.addEventListener('click', () => showToast(button))
  })

  initDropdowns()
  initQuantity()
  initCopy()
  initExpandRows()
  initCheckAll()
  initDataTables()
  initSegments()
  initCommandPalette()
  initSignature()
  initPrint()
}

window.initMockup = initMockup
document.addEventListener('DOMContentLoaded', initMockup)
