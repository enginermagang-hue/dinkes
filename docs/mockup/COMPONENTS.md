# Panduan Komponen Mockup

Dokumen ini adalah acuan penulisan markup mockup SMSOD. Semua komponen memakai class
semantik yang didefinisikan di `resources/css/app.css` (`@layer components`), bukan
utilitas Tailwind yang ditulis ulang di HTML.

## Aturan Singkat

- Pakai class semantik untuk warna, border, radius, padding, dan tipografi komponen.
- Utilitas Tailwind hanya untuk **tata letak**: `flex`, `grid`, `gap-*`, `space-y-*`,
  `mt-*`/`mb-*` antar blok, `w-*`/`max-w-*`, `hidden`, dan varian `sm:`/`md:`/`lg:`.
- Jangan menulis `bg-*`, `text-<warna>`, `border-*`, `rounded-*`, atau padding komponen
  langsung di markup. Jalankan `npm run mockup:check` untuk memeriksa pelanggaran.
- Bila sebuah elemen memang sengaja memamerkan utilitas (contoh token warna), tambahkan
  atribut `data-allow-utilities`.

## Verifikasi

| Perintah                  | Fungsi                                                |
| ------------------------- | ----------------------------------------------------- |
| `npm run mockup:css`      | Build ulang `docs/mockup/assets/mockup.css`           |
| `npm run mockup:serve`    | Server lokal untuk membuka mockup                     |
| `npm run mockup:links`    | Uji tautan sidebar/header dan pemuatan layout         |
| `npm run mockup:check`    | Gagal bila ada komponen yang ditulis manual           |
| `npm run mockup:snapshot` | Simpan baseline screenshot ke `.cache/mockup-golden/` |
| `npm run mockup:visual`   | Bandingkan tampilan sekarang dengan baseline          |

---

## Fondasi

| Class            | Kegunaan                                      |
| ---------------- | --------------------------------------------- |
| `.app-page`      | Latar halaman: `min-h-screen bg-slate-100`    |
| `.app-shell`     | Pembungkus sidebar + konten                   |
| `.app-body`      | Kolom konten bersebelahan sidebar             |
| `.app-content`   | Padding otomatis terhadap lebar sidebar       |
| `.page-title`    | Judul halaman                                 |
| `.page-subtitle` | Deskripsi di bawah judul halaman              |
| `.section-head`  | Garis bawah + jarak untuk kepala seksi        |
| `.section-title` | Judul seksi di dalam `.section-head`          |
| `.section-desc`  | Deskripsi seksi                               |
| `.text-hint`     | Teks bantuan kecil (`text-xs text-slate-500`) |

```html
<section>
  <h1 class="page-title">Katalog Komponen</h1>
  <p class="page-subtitle">Acuan visual seluruh halaman mockup.</p>
</section>

<div class="section-head">
  <h2 class="section-title">1. Tombol</h2>
  <p class="section-desc">Varian, ukuran, dan keadaan.</p>
</div>
```

## Tombol

| Class                                                      | Kegunaan                               |
| ---------------------------------------------------------- | -------------------------------------- |
| `.btn`                                                     | Basis: layout, radius, ketebalan huruf |
| `.btn-primary`                                             | Aksi utama, latar brand                |
| `.btn-secondary`                                           | Latar putih dengan border              |
| `.btn-outline`                                             | Transparan dengan border               |
| `.btn-ghost`                                               | Tanpa border, hover abu                |
| `.btn-success` / `.btn-warning` / `.btn-danger`            | Varian semantik                        |
| `.btn-soft` / `.btn-soft-warning`                          | Latar lembut                           |
| `.btn-link`                                                | Tampilan seperti tautan                |
| `.btn-md` / `.btn-sm` / `.btn-xs` / `.btn-2xs` / `.btn-lg` | Ukuran                                 |
| `.btn-icon`                                                | Tombol ikon persegi 36×36              |
| `.btn-square`                                              | Tombol ikon dengan padding `p-2`       |
| `.btn-block`                                               | Lebar penuh                            |
| `.btn-quiet` / `.btn-muted` / `.btn-ink`                   | Warna teks `slate-600/400/700`         |
| `.btn-strong` / `.btn-normal`                              | Ketebalan huruf                        |
| `.is-disabled`                                             | Keadaan nonaktif berwarna brand muda   |

```html
<button class="btn btn-primary btn-md">Simpan</button>
<button class="btn btn-secondary btn-md">Batal</button>
<button class="btn btn-outline btn-xs">Sebelumnya</button>
<button class="btn btn-primary btn-lg w-full">Masuk</button>
<button class="btn btn-primary btn-square" aria-label="Tambah">
  <i class="ri-add-line icon-sm" aria-hidden="true"></i>
</button>
```

## Kartu dan Permukaan

| Class           | Kegunaan                                                 |
| --------------- | -------------------------------------------------------- |
| `.card`         | Permukaan putih dengan border dan radius                 |
| `.card-body`    | Padding `p-5`                                            |
| `.card-body-sm` | Padding `p-4`                                            |
| `.card-header`  | Baris judul dengan garis bawah                           |
| `.card-footer`  | Baris penutup dengan garis atas                          |
| `.card-title`   | Judul di dalam kartu                                     |
| `.card-hover`   | Efek hover untuk kartu yang dapat diklik                 |
| `.kpi`          | Kartu KPI (`kpi-sm`, `kpi-lg`, `kpi-label`, `kpi-value`) |
| `.paper`        | Kertas dokumen siap cetak                                |
| `.dark-surface` | Pratinjau permukaan gelap                                |

```html
<div class="card">
  <div class="card-header">
    <h2 class="card-title">Daftar Stok</h2>
    <span class="text-hint">3 item dipilih</span>
  </div>
  <div class="card-body">Isi kartu.</div>
</div>
```

## Badge dan Status

| Class                                                                | Kegunaan                      |
| -------------------------------------------------------------------- | ----------------------------- |
| `.badge`                                                             | Basis badge bundar            |
| `.badge-neutral` / `.badge-brand`                                    | Varian netral dan brand       |
| `.badge-success` / `.badge-warning` / `.badge-danger`                | Varian status                 |
| `.badge-lg`                                                          | Badge lebih besar             |
| `.badge-dark-success` / `.badge-dark-warning` / `.badge-dark-danger` | Di permukaan gelap            |
| `.status-dot` + `.status-dot-*`                                      | Titik status                  |
| `.tag`                                                               | Chip netral (label teknologi) |

```html
<span class="badge badge-success">Aman</span>
<span class="badge badge-warning badge-lg">Waspada</span>
<span class="status-dot status-dot-danger"></span>
```

## Alert

| Class                                                                  | Kegunaan                |
| ---------------------------------------------------------------------- | ----------------------- |
| `.alert`                                                               | Basis pesan kontekstual |
| `.alert-brand` / `.alert-success` / `.alert-warning` / `.alert-danger` | Varian                  |

```html
<div class="alert alert-warning">Perhatian: 3 batch mendekati kedaluwarsa.</div>
```

## Formulir

| Class                                                               | Kegunaan                                           |
| ------------------------------------------------------------------- | -------------------------------------------------- |
| `.field`                                                            | Input, textarea, select dengan ring fokus          |
| `.field-error` / `.field-success` / `.field-warning`                | Keadaan validasi                                   |
| `.field-label`                                                      | Label di atas input                                |
| `.field-help`                                                       | Teks bantuan                                       |
| `.field-error-text` / `.field-warning-text` / `.field-success-text` | Pesan validasi                                     |
| `.check` + `.check-box`                                             | Checkbox dan radio kustom (`check-sm`, `check-lg`) |
| `.switch` + `.switch-track` + `.switch-thumb`                       | Switch (`switch-sm`, `switch-lg`)                  |
| `.dropzone`                                                         | Area unggah berkas                                 |
| `.qty`                                                              | Stepper jumlah                                     |
| `.steps` + `.step` + `.step-dot`                                    | Indikator langkah                                  |
| `.signature`                                                        | Area tanda tangan                                  |
| `.search-field`                                                     | Input pencarian pada header                        |

```html
<label class="field-label" for="nama">Nama obat</label>
<input id="nama" class="field mt-1" />
<p class="field-help">Gunakan nama generik.</p>
```

## Tabel

| Class            | Kegunaan                                 |
| ---------------- | ---------------------------------------- |
| `.table-wrap`    | Pembungkus dengan scroll horizontal      |
| `.table`         | Tabel dasar (`w-full text-left text-sm`) |
| `.table-head`    | Header abu-abu huruf kapital             |
| `.table-compact` | Padding rapat dan teks kecil             |
| `.table-comfy`   | Padding lebar                            |
| `.table-plain`   | Tanpa padding bawaan (dokumen cetak)     |
| `.num`           | Sel rata kanan untuk angka               |
| `.table-sort`    | Tombol urut di header                    |
| `.table-sticky`  | Kolom pertama yang tetap saat digulir    |
| `.table-toolbar` | Baris aksi di atas tabel                 |

```html
<div class="card overflow-hidden">
  <div class="table-toolbar">
    <h2 class="card-title">Daftar Stok</h2>
  </div>
  <div class="table-wrap">
    <table class="table table-head">
      <thead>
        <tr>
          <th>Kode</th>
          <th class="num">Saldo</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>OBT-001</td>
          <td class="num">4.360</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

## Navigasi

| Class                                    | Kegunaan                        |
| ---------------------------------------- | ------------------------------- |
| `.pill-nav` + `.pill-nav-item`           | Navigasi tab katalog            |
| `.pill-nav-item-active`                  | Item katalog aktif              |
| `.nav-item` + `.nav-item-active`         | Item sidebar                    |
| `.nav-item-muted` / `.nav-item-danger`   | Item sidebar redup atau keluar  |
| `.nav-section-label`                     | Label kelompok di sidebar       |
| `.tabs` + `.tab` + `.tab-active`         | Tab konten dengan latar abu     |
| `.page-btn`                              | Tombol pagination 36×36         |
| `.page-btn-outline` / `.page-btn-active` | Keadaan biasa dan halaman aktif |
| `.page-btn-muted` / `.page-btn-gap`      | Tombol nonaktif dan pemisah "…" |

```html
<nav class="pill-nav">
  <a href="index.html" class="pill-nav-item pill-nav-item-active">Ringkasan</a>
  <a href="form.html" class="pill-nav-item">Formulir</a>
</nav>

<div class="tabs">
  <button class="tab tab-active" data-tab="a" data-tab-group="demo">Ringkasan</button>
  <button class="tab" data-tab="b" data-tab-group="demo">Detail</button>
</div>
```

## Umpan Balik

| Class                                                                           | Kegunaan                    |
| ------------------------------------------------------------------------------- | --------------------------- |
| `.toast` + `.toast-success` / `.toast-error` / `.toast-warning` / `.toast-info` | Notifikasi mengambang       |
| `.toast-close`                                                                  | Tombol tutup toast          |
| `.modal-backdrop` + `.modal-panel`                                              | Modal beranimasi            |
| `.dropdown-panel`                                                               | Panel dropdown              |
| `.tooltip`                                                                      | Tooltip berbasis `data-tip` |
| `.skeleton`                                                                     | Placeholder muat            |
| `.spinner` + `.spinner-sm` / `.spinner-lg`                                      | Indikator proses            |
| `.progress` + `.progress-bar`                                                   | Bilah progres               |

## Ikon

| Class                                                                              | Kegunaan              |
| ---------------------------------------------------------------------------------- | --------------------- |
| `.icon-xs` / `.icon-sm` / `.icon-md` / `.icon-lg` / `.icon-xl`                     | Ukuran ikon           |
| `.icon-muted` / `.icon-brand` / `.icon-success` / `.icon-warning` / `.icon-danger` | Warna                 |
| `.icon-spin`                                                                       | Ikon berputar         |
| `.icon-btn`                                                                        | Tombol ikon sederhana |

Semua ikon berasal dari Remix Icon dan wajib memakai salah satu class ukuran di atas.
