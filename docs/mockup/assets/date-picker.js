// Layanan tanggal berbasis Flatpickr untuk mockup.
// Nilai input tetap ISO (Y-m-d); tampilan memakai dd-mm-yyyy.
// Inisialisasi otomatis untuk input[type="date"] dan input[data-date].

;(function () {
  const ISO_FORMAT = 'Y-m-d'
  const DISPLAY_FORMAT = 'd-m-Y'
  const DISPLAY_PLACEHOLDER = 'dd-mm-yyyy'
  const COPIED_ATTRIBUTES = ['aria-label', 'aria-describedby', 'aria-invalid', 'title']

  let presetBound = false
  let escapeBound = false
  const instances = []

  const pad = (value) => String(value).padStart(2, '0')

  const parseISO = (value) => {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || '').trim())
    if (!match) return null
    return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  }

  const presetDates = (preset, base) => {
    if (preset === 'today') return [base, base]
    if (preset === '7d') {
      return [new Date(base.getFullYear(), base.getMonth(), base.getDate() - 6), base]
    }
    if (preset === 'month') {
      return [
        new Date(base.getFullYear(), base.getMonth(), 1),
        new Date(base.getFullYear(), base.getMonth() + 1, 0),
      ]
    }
    return null
  }

  const presetGroup = (input) => {
    const field = input.closest('[data-date-field]')
    return field ? field.querySelector('[data-date-presets]') : null
  }

  function setup(input) {
    if (input.dataset.dateReady) return
    if (!window.flatpickr) return
    input.dataset.dateReady = '1'

    const range = input.hasAttribute('data-date-range')
    const group = presetGroup(input)
    const clearPresets = () => {
      if (!group) return
      group.querySelectorAll('[data-date-preset]').forEach((chip) => {
        chip.classList.remove('chip-active')
      })
    }

    const config = {
      locale: window.flatpickr.l10ns ? window.flatpickr.l10ns.id : undefined,
      dateFormat: ISO_FORMAT,
      altInput: true,
      altFormat: DISPLAY_FORMAT,
      altInputClass: `${input.className} flatpickr-alt`,
      allowInput: true,
      disableMobile: true,
      mode: range ? 'range' : 'single',
      onChange: clearPresets,
    }

    if (input.min) config.minDate = input.min
    if (input.max) config.maxDate = input.max

    const picker = window.flatpickr(input, config)
    const alt = picker.altInput
    if (!alt) return

    instances.push(picker)

    // Pindahkan id ke input tampilan agar label tetap fokus ke kolom yang terlihat.
    if (input.id) {
      alt.id = input.id
      input.removeAttribute('id')
    }

    COPIED_ATTRIBUTES.forEach((name) => {
      if (input.hasAttribute(name)) alt.setAttribute(name, input.getAttribute(name))
    })

    alt.placeholder = input.placeholder || DISPLAY_PLACEHOLDER
    alt.autocomplete = 'off'
  }

  function init(scope) {
    if (!window.flatpickr) return
    const root = scope && typeof scope.querySelectorAll === 'function' ? scope : document
    root
      .querySelectorAll('input[type="date"]:not([data-date-ready]), input[data-date]:not([data-date-ready])')
      .forEach(setup)
    bindPresets()
    bindEscape()
  }

  function bindEscape() {
    if (escapeBound) return
    escapeBound = true

    // Escape pertama menutup kalender; dropdown induk tetap terbuka.
    document.addEventListener(
      'keydown',
      (event) => {
        if (event.key !== 'Escape') return
        const open = instances.filter((picker) => picker.isOpen)
        if (!open.length) return
        event.mockupOverlayHandled = true
        open.forEach((picker) => picker.close())
      },
      true,
    )
  }

  function bindPresets() {
    if (presetBound) return
    presetBound = true

    document.addEventListener('click', (event) => {
      const target = event.target
      if (!(target instanceof Element)) return
      const chip = target.closest('[data-date-preset]')
      if (!chip) return

      const field = chip.closest('[data-date-field]')
      const input = field ? field.querySelector('input[data-date]') : null
      const picker = input && input._flatpickr
      if (!picker) return

      const base = parseISO(input.dataset.dateBase) || new Date()
      const dates = presetDates(chip.dataset.datePreset, base)
      if (!dates) return

      picker.setDate(picker.config.mode === 'range' ? dates : dates[0], true)
      picker.close()

      if (field) {
        field.querySelectorAll('[data-date-preset]').forEach((item) => {
          item.classList.toggle('chip-active', item === chip)
        })
      }
    })
  }

  window.DatePicker = { init }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => init())
  } else {
    init()
  }
})()
