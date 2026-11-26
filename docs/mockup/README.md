# Mockup Antarmuka SMSOD

Folder ini berisi mockup HTML statis untuk memvalidasi alur dan tampilan sebelum
development Laravel dimulai. Semua halaman memakai Tailwind CSS v4 dan data dummy yang
konsisten dengan `docs/PRD.md`.

## Cara Membuka

1. Jalankan build CSS sekali: `npm run mockup:css`.
2. Jalankan server mockup: `npm run mockup:serve`.
3. Buka `http://127.0.0.1:3000/mockup/01-login/` (atau
   `http://127.0.0.1:3000/mockup/components/` untuk katalog).

Anda juga bisa memakai `npx serve docs`; `docs/serve.json` memastikan URL direktori selalu
berakhir dengan `/`.

Tidak perlu backend. Semua data bersifat contoh. Mockup memuat komponen layout melalui
`fetch`, sehingga harus dibuka lewat server lokal, bukan `file://`.

> **Penting:** path di dalam mockup bersifat relatif (`../assets/...`,
> `../components/sidebar.html`, `../02-dashboard/index.html`). URL halaman harus berakhir
> dengan `/` — misalnya `/mockup/02-dashboard/`, bukan `/mockup/02-dashboard`. Bila garis
> miring terakhir hilang, CSS, include sidebar, dan link antarmodul akan gagal dimuat.
> `npm run mockup:links` memeriksa hal ini secara otomatis.

## Sub-halaman Katalog

Katalog komponen dipecah agar mudah direview:

| Halaman                      | Isi                                                                                             |
| ---------------------------- | ----------------------------------------------------------------------------------------------- |
| `components/index.html`      | Ringkasan dan navigasi ke sub-halaman                                                           |
| `components/foundation.html` | Tipografi, token warna, tombol, ikon (4 bagian)                                                 |
| `components/form.html`       | Input, select, radio/checkbox/switch, upload, stepper, nilai, validasi, tanda tangan (8 bagian) |
| `components/data.html`       | Tabel lanjutan, empty state, deskripsi, timeline, tree, chart, pagination (7 bagian)            |
| `components/feedback.html`   | Badge, alert, toast, modal, tooltip/popover, skeleton, spinner, progress, tab (9 bagian)        |
| `components/layout.html`     | Breadcrumb, page header, card/KPI, avatar, tab, accordion, chip, status, cetak (8 bagian)       |
| `components/advanced.html`   | Command palette, barcode/QR, shortcut, halaman galat, permukaan gelap (5 bagian)                |

## Daftar Modul

| Folder            | Halaman                         | Rujukan PRD |
| ----------------- | ------------------------------- | ----------- |
| `01-login`        | Login, 2FA, tautan Google       | 8.9         |
| `02-dashboard`    | Dashboard pimpinan dan KPI      | 8.7         |
| `03-stok`         | Stok, batch, kartu stok, mutasi | 8.3, 8.6    |
| `04-pengadaan`    | PO, penerimaan, BAST            | 8.2, 8.3    |
| `05-distribusi`   | Permintaan, pengiriman, selisih | 8.4         |
| `06-lplpo`        | LPLPO bulanan dan verifikasi    | 8.11        |
| `07-rko`          | RKO triwulanan dan konsolidasi  | 8.1         |
| `08-pelayanan`    | Resep, telaah, dispensing       | 8.5         |
| `09-pengendalian` | Opname, ABC-VEN, kedaluwarsa    | 8.6         |
| `10-anggaran`     | Pagu, komitmen, realisasi       | 8.8         |
| `11-prediksi`     | Prediksi kebutuhan, peringatan  | 8.10        |
| `12-pengguna`     | Pengguna, peran, whitelist      | 8.9         |

## Build dan Watch CSS

```bash
npm run mockup:css     # build sekali, hasil ke docs/mockup/assets/mockup.css
npm run mockup:watch   # build ulang saat berkas mockup berubah
```

Sumber CSS berada di `resources/css/app.css` (Tailwind v4, CSS-first). Penambahan berkas
dilakukan dengan direktif `@source`, bukan `content` pada `tailwind.config.js`.

## Ikon

Mockup memakai Remix Icon yang dibundel lokal. Font disalin ke
`docs/mockup/assets/fonts/`, sedangkan CSS vendor berada di
`resources/css/vendor/remixicon.css` dan diimpor oleh `app.css`.

Class ukuran yang tersedia: `icon-xs`, `icon-sm`, `icon-md`, `icon-lg`, `icon-xl`.
Class warna: `icon-muted`, `icon-brand`, `icon-success`, `icon-warning`, `icon-danger`.
Perilaku tambahan: `icon-spin` dan `icon-btn`. Contoh lengkap ada pada sub-halaman katalog
komponen, dimulai dari `docs/mockup/components/foundation.html`.

## Komponen Kustom

Seluruh komponen memakai class semantik. Acuan lengkap beserta contoh markup ada di
[`COMPONENTS.md`](./COMPONENTS.md).

| Kelompok    | Class utama                                                    |
| ----------- | -------------------------------------------------------------- |
| Kerangka    | `app-page`, `app-shell`, `app-body`, `app-content`             |
| Tipografi   | `page-title`, `page-subtitle`, `section-head`, `section-title` |
| Tombol      | `btn`, `btn-primary`, `btn-secondary`, `btn-outline`, `btn-sm` |
| Kartu       | `card`, `card-body`, `card-header`, `card-footer`, `kpi`       |
| Badge       | `badge`, `badge-success`, `badge-warning`, `badge-danger`      |
| Alert       | `alert`, `alert-success`, `alert-warning`, `alert-danger`      |
| Tabel       | `table`, `table-head`, `table-compact`, `num`, `table-sticky`  |
| Navigasi    | `pill-nav`, `nav-item`, `tabs`, `tab`, `tab-active`            |
| Formulir    | `field`, `field-label`, `field-help`, `check`, `switch`        |
| Umpan balik | `toast`, `modal-panel`, `tooltip`, `skeleton`, `spinner`       |

Aturan pemakaian:

- Class semantik untuk warna, border, radius, padding, dan tipografi komponen.
- Utilitas Tailwind hanya untuk tata letak (`flex`, `grid`, `gap-*`, `mt-*`, `w-*`,
  `hidden`, dan varian breakpoint).
- Jalankan `npm run mockup:check` sebelum commit untuk memastikan tidak ada komponen
  yang ditulis manual.

## Verifikasi Tampilan

| Perintah                  | Fungsi                                                 |
| ------------------------- | ------------------------------------------------------ |
| `npm run mockup:css`      | Build ulang `docs/mockup/assets/mockup.css`            |
| `npm run mockup:serve`    | Server lokal untuk membuka mockup                      |
| `npm run mockup:links`    | Uji tautan sidebar/header dan pemuatan layout          |
| `npm run mockup:check`    | Gagal bila ada komponen ditulis dengan utilitas manual |
| `npm run mockup:snapshot` | Simpan baseline screenshot ke `.cache/mockup-golden/`  |
| `npm run mockup:visual`   | Bandingkan tampilan sekarang dengan baseline           |

Ringkasan dan tautan ke semua sub-halaman ada pada
`docs/mockup/components/index.html`.

## Strategi Dua Fase

**Fase mockup (sekarang):**

```css
@source '../../docs/mockup/**/*.html';
@source '../../docs/mockup/assets/mockup.js';
```

**Fase development Laravel:** tambahkan dua baris berikut pada `resources/css/app.css`.

```css
@source '../../resources/views/**/*.blade.php';
@source '../../resources/js/**/*.js';
```

Path mockup tetap dipertahankan agar mockup masih bisa dibangun ulang kapan saja.

## Catatan

- Mockup tidak terhubung ke API dan tidak menyimpan data.
- Data dummy mengikuti contoh pada PRD: Puskesmas A, OBT-001 Amoksisilin, LP-001, dan
  seterusnya.
- Setelah aplikasi Laravel berjalan, folder ini menjadi acuan tampilan dan dapat diarsip.
- Folder ini dikecualikan dari `prettier` dan `markdownlint` melalui `.prettierignore`.

## Dokumen Terkait

| Dokumen                | Isi                              |
| ---------------------- | -------------------------------- |
| `docs/PRD.md`          | Kebutuhan produk dan fungsional  |
| `docs/TECH-STACK.md`   | Tech stack dan arsitektur teknis |
| `docs/DATA-MODEL.md`   | Skema basis data                 |
| `docs/API-CONTRACT.md` | Kontrak API internal             |
