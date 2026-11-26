// Layanan select berbasis TomSelect untuk mockup.
// Semua select otomatis diubah, kecuali yang memakai data-select-skip atau
// berada di dalam kalender Flatpickr.

;(function () {
  const SEARCH_THRESHOLD = 10
  const instances = []
  let escapeBound = false

  const shouldSearch = (select) => {
    const setting = select.getAttribute('data-select-search')
    if (setting === 'false') return false
    if (setting === 'true') return true
    return select.options.length > SEARCH_THRESHOLD
  }

  function setup(select) {
    if (select.dataset.selectReady || select.tomselect) return
    if (select.hasAttribute('data-select-skip')) return
    if (select.closest('.flatpickr-calendar')) return
    if (!window.TomSelect) return
    select.dataset.selectReady = '1'

    const settings = {
      create: false,
      allowEmptyOption: true,
      dropdownParent: 'body',
      plugins: select.multiple ? ['remove_button'] : [],
      onDropdownOpen: () => {
        if (!instance) return
        const align = (attempt = 8) => {
          requestAnimationFrame(() => {
            if (instance.dropdown.offsetHeight <= 2 && attempt > 0) {
              align(attempt - 1)
              return
            }
            instance.positionDropdown()
          })
        }
        align()
      },
    }

    if (!shouldSearch(select)) settings.controlInput = false

    let instance = new window.TomSelect(select, settings)
    instances.push(instance)

    // TomSelect selalu membuka ke bawah; flip ke atas bila ruang bawah kurang.
    const position = instance.positionDropdown.bind(instance)
    instance.positionDropdown = () => {
      position()
      const dropdown = instance.dropdown
      if (!dropdown || dropdown.style.display === 'none') return
      const rect = instance.control.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      const spaceAbove = rect.top
      if (dropdown.offsetHeight > spaceBelow && spaceAbove > spaceBelow) {
        dropdown.style.top = `${rect.top + window.scrollY - dropdown.offsetHeight - 4}px`
      }
    }

    // TomSelect menyalin seluruh class select ke wrapper; .field akan
    // menggandakan border/padding, jadi hanya class layout yang dipertahankan.
    instance.wrapper.classList.remove('field')
  }

  function init(scope) {
    if (!window.TomSelect) return
    const root = scope && typeof scope.querySelectorAll === 'function' ? scope : document
    root.querySelectorAll('select:not([data-select-skip])').forEach(setup)
    bindEscape()
  }

  function bindEscape() {
    if (escapeBound) return
    escapeBound = true

    // Escape pertama menutup dropdown TomSelect; dropdown induk tetap terbuka.
    document.addEventListener(
      'keydown',
      (event) => {
        if (event.key !== 'Escape') return
        const open = instances.filter((instance) => instance.isOpen)
        if (!open.length) return
        event.mockupOverlayHandled = true
        open.forEach((instance) => instance.close())
      },
      true,
    )
  }

  window.SelectPicker = { init }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => init())
  } else {
    init()
  }
})()
