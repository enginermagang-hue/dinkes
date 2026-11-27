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

| Folder              | Halaman                              | Rujukan PRD |
| ------------------- | ------------------------------------ | ----------- |
| `01-login`          | Login, 2FA, tautan Google            | 8.9         |
| `02-dashboard`      | Dashboard pimpinan dan KPI           | 8.7         |
| `03-stok`           | Stok, batch, kartu stok, mutasi      | 8.3, 8.6    |
| `04-pengadaan`      | Keranjang pengadaan, penyedia        | 8.2         |
| `05-permintaan`     | Permintaan, validasi RKO/pagu        | 8.4         |
| `06-lplpo`          | LPLPO bulanan, verifikasi, cetak     | 8.11        |
| `07-rko`            | RKO triwulanan dan konsolidasi       | 8.1         |
| `08-pelayanan`      | Pelayanan, telaah resep, rekap       | 8.5         |
| `09-pengendalian`   | Opname, ABC-VEN, kedaluwarsa         | 8.6         |
| `10-anggaran`       | Pagu, komitmen, realisasi            | 8.8         |
| `11-prediksi`       | Prediksi kebutuhan, peringatan       | 8.10        |
| `12-pengguna`       | Pengguna, peran, whitelist           | 8.9         |
| `13-penerimaan`     | Penerimaan, selisih, BAST            | 8.3         |
| `14-distribusi`     | Pengiriman, surat jalan, selisih     | 8.4         |
| `15-purchase-order` | PO, persetujuan, penerimaan sebagian | 8.2         |
| `16-laporan`        | Laporan standar, ekspor SIPNAP/SIPD  | 8.7         |
| `17-master`         | Master obat, fasilitas, lokasi       | 8.12        |

### Sub-halaman Pengadaan

Modul `04-pengadaan` kini hanya memuat perencanaan pengadaan. Dokumen PO berada di
modul `15-purchase-order`.

| Halaman                   | Isi                                                      |
| ------------------------- | -------------------------------------------------------- |
| `04-pengadaan/index.html` | Keranjang dari RKO, perbandingan harga, kinerja penyedia |

### Sub-halaman RKO

| Halaman                   | Isi                                                         |
| ------------------------- | ----------------------------------------------------------- |
| `07-rko/index.html`       | Daftar RKO: KPI, filter, pencarian, pagination              |
| `07-rko/tambah.html`      | Form RKO dengan perhitungan kebutuhan otomatis              |
| `07-rko/detail.html`      | Detail RKO/2027/Q1/001: item, riwayat versi, persetujuan    |
| `07-rko/konsolidasi.html` | Rencana gabungan RKO/2027/Q1/003 menuju keranjang pengadaan |

### Sub-halaman Pengendalian

| Halaman                              | Isi                                                  |
| ------------------------------------ | ---------------------------------------------------- |
| `09-pengendalian/index.html`         | Peringatan stok dan parameter safety/ROP/min/max     |
| `09-pengendalian/kedaluwarsa.html`   | Batch kedaluwarsa + berita acara pemusnahan          |
| `09-pengendalian/abc-ven.html`       | Analisis ABC-VEN, matriks prioritas, perputaran stok |
| `09-pengendalian/opname.html`        | Daftar sesi stock opname per lokasi                  |
| `09-pengendalian/opname-detail.html` | Blanko hitung fisik + pratinjau mutasi penyesuaian   |

### Sub-halaman Anggaran

| Halaman                      | Isi                                                    |
| ---------------------------- | ------------------------------------------------------ |
| `10-anggaran/index.html`     | Pagu per fasilitas: KPI, filter, tabel, pagination     |
| `10-anggaran/detail.html`    | Detail pagu Puskesmas A: mutasi komitmen dan realisasi |
| `10-anggaran/tetapkan.html`  | Form penetapan pagu per fasilitas, tahun, sumber dana  |
| `10-anggaran/realisasi.html` | Rekap realisasi + rekonsiliasi dokumen pembayaran      |
| `10-anggaran/realokasi.html` | Usulan realokasi pagu + alur persetujuan Kepala Dinas  |

### Sub-halaman Prediksi

| Halaman                       | Isi                                                      |
| ----------------------------- | -------------------------------------------------------- |
| `11-prediksi/index.html`      | Hasil prediksi kebutuhan 1–3 bulan + confidence dan tren |
| `11-prediksi/peringatan.html` | Peringatan dini kekosongan + rekomendasi jumlah          |
| `11-prediksi/tren.html`       | Tren, musiman, ROP dinamis, dan deteksi anomali          |
| `11-prediksi/detail.html`     | Detail per item: prediksi vs aktual + koreksi apoteker   |
| `11-prediksi/akurasi.html`    | Akurasi model per periode + rekomendasi latih ulang      |

### Sub-halaman Pengguna

| Halaman                      | Isi                                                   |
| ---------------------------- | ----------------------------------------------------- |
| `12-pengguna/index.html`     | Daftar pengguna: KPI, filter, pencarian, pagination   |
| `12-pengguna/tambah.html`    | Buat akun, peran, penugasan fasilitas, kirim undangan |
| `12-pengguna/detail.html`    | Profil, keamanan, peran, dan audit terakhir pengguna  |
| `12-pengguna/peran.html`     | 15 peran baku + matriks hak akses per modul           |
| `12-pengguna/whitelist.html` | Google whitelist dan akun Google terhubung            |
| `12-pengguna/audit.html`     | Audit log login dan aksi kritis                       |

### Sub-halaman Pelaporan

| Halaman                  | Isi                                                   |
| ------------------------ | ----------------------------------------------------- |
| `16-laporan/index.html`  | Ringkasan laporan standar, kartu SIPNAP/SIPD, riwayat |
| `16-laporan/ekspor.html` | Form ekspor SIPNAP (CSV) dan SIPD (Excel) + pratinjau |

### Sub-halaman Purchase Order

| Halaman                         | Isi                                                        |
| ------------------------------- | ---------------------------------------------------------- |
| `15-purchase-order/index.html`  | Daftar PO: KPI, filter, pencarian, pagination              |
| `15-purchase-order/tambah.html` | Form buat PO dari keranjang yang disetujui                 |
| `15-purchase-order/detail.html` | Detail PO/2027/0002: item, penerimaan, riwayat persetujuan |

### Sub-halaman LPLPO

| Halaman                    | Isi                                                      |
| -------------------------- | -------------------------------------------------------- |
| `06-lplpo/index.html`      | Daftar LPLPO: KPI, filter, pencarian, pagination         |
| `06-lplpo/tambah.html`     | Form LPLPO bulanan dengan stok otomatis dari mutasi      |
| `06-lplpo/detail.html`     | Detail LPLPO/2027/01/004: item, alasan, riwayat          |
| `06-lplpo/verifikasi.html` | Layar verifikasi Dinas: usul, disetujui, alasan, setujui |
| `06-lplpo/edit.html`       | Revisi LPLPO yang dikembalikan + riwayat versi           |
| `06-lplpo/pdf.html`        | Dokumen LPLPO resmi siap cetak                           |

### Sub-halaman Pelayanan

| Halaman                          | Isi                                                   |
| -------------------------------- | ----------------------------------------------------- |
| `08-pelayanan/index.html`        | Antrean pelayanan: KPI, filter, pencarian, pagination |
| `08-pelayanan/tambah.html`       | Catat pelayanan: item obat, batch FEFO, telaah, serah |
| `08-pelayanan/detail.html`       | Detail PLY/2027/01/0004: item, telaah, riwayat        |
| `08-pelayanan/racikan.html`      | Resep racikan dengan komposisi bahan per bungkus      |
| `08-pelayanan/pengembalian.html` | Retur obat dari unit: kondisi, tujuan, verifikasi     |
| `08-pelayanan/rekap.html`        | Rekap pemakaian bulanan dan umpan balik perencanaan   |

### Sub-halaman Penerimaan

Modul `13-penerimaan` terdiri dari lima halaman:

| Halaman                     | Isi                                                         |
| --------------------------- | ----------------------------------------------------------- |
| `13-penerimaan/index.html`  | Daftar penerimaan: KPI, filter, pencarian, pagination       |
| `13-penerimaan/detail.html` | Detail PNR/2027/0031: item, status dokumen, jejak audit     |
| `13-penerimaan/tambah.html` | Formulir penerimaan: zona, rak, barcode, checklist validasi |
| `13-penerimaan/edit.html`   | Edit penerimaan terverifikasi, alasan perubahan, audit      |
| `13-penerimaan/bast.html`   | Dokumen BAST/2027/0012 siap cetak                           |

### Sub-halaman Master Data

| Halaman                | Isi                                                    |
| ---------------------- | ------------------------------------------------------ |
| `17-master/index.html` | Tiga tab: obat dan BMHP, fasilitas, lokasi penyimpanan |

### Sub-halaman Permintaan

Modul `05-permintaan` menangani pengajuan dan verifikasi permintaan fasilitas:

| Halaman                     | Isi                                                        |
| --------------------------- | ---------------------------------------------------------- |
| `05-permintaan/index.html`  | Daftar permintaan: KPI, filter sumber/prioritas, tabel     |
| `05-permintaan/tambah.html` | Form permintaan manual dengan validasi RKO, pagu, dan stok |
| `05-permintaan/detail.html` | Detail PMT/2027/0041: item, verifikasi, riwayat audit      |

Catatan data dummy: nomor permintaan memakai format `PMT/2027/00xx`. Format resmi belum
ditetapkan pada PRD, sehingga penomoran ini hanya contoh untuk mockup.

### Sub-halaman Distribusi

Modul `14-distribusi` mengeksekusi permintaan yang sudah disetujui: menyiapkan barang,
mengirim, lalu mencatat penerimaan dan selisih.

| Halaman                          | Isi                                                         |
| -------------------------------- | ----------------------------------------------------------- |
| `14-distribusi/index.html`       | Daftar pengiriman + tab redistribusi, filter, pagination    |
| `14-distribusi/tambah.html`      | Form pengiriman: permintaan rujukan, kurir, item batch FEFO |
| `14-distribusi/detail.html`      | Detail DO/2027/0035: item, status, riwayat, dokumen terkait |
| `14-distribusi/picking.html`     | Picking list FEFO per rak dan progres penyiapan             |
| `14-distribusi/terima.html`      | Konfirmasi penerimaan, selisih, alasan, tanda tangan        |
| `14-distribusi/surat-jalan.html` | Dokumen surat jalan SJ/2027/0035 siap cetak                 |

PRD 8.4 masih menggabungkan permintaan dan pengiriman dalam satu modul Distribusi.
Mockup memisahkannya menjadi dua menu agar sesuai tugas pengguna: Puskesmas mengajukan
permintaan, gudang mengirim barang.

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
| Tanggal     | `flatpickr-alt`, `flatpickr-calendar`, `chip`                  |
| Select      | `ts-wrapper`, `ts-control`, `ts-dropdown`                      |
| Umpan balik | `toast`, `modal-panel`, `tooltip`, `skeleton`, `spinner`       |

Aturan pemakaian:

- Class semantik untuk warna, border, radius, padding, dan tipografi komponen.
- Utilitas Tailwind hanya untuk tata letak (`flex`, `grid`, `gap-*`, `mt-*`, `w-*`,
  `hidden`, dan varian breakpoint).
- Jalankan `npm run mockup:check` sebelum commit untuk memastikan tidak ada komponen
  yang ditulis manual.

Input tanggal memakai Flatpickr yang dibundel lokal di `docs/mockup/assets/`. Muat
`flatpickr.min.js`, `flatpickr-id.js`, dan `date-picker.js` sebelum `mockup.js`; kontrak
lengkap ada di [`COMPONENTS.md`](./COMPONENTS.md) bagian Input tanggal.

Select memakai TomSelect lokal (`tom-select.min.js` + `select-picker.js`). Semua
`<select>` diubah otomatis; tambahkan `data-select-skip` untuk mempertahankan select
bawaan. Kotak pencarian hanya aktif bila opsi lebih dari 10.

## Verifikasi Tampilan

| Perintah                  | Fungsi                                                 |
| ------------------------- | ------------------------------------------------------ |
| `npm run mockup:css`      | Build ulang `docs/mockup/assets/mockup.css`            |
| `npm run mockup:serve`    | Server lokal untuk membuka mockup                      |
| `npm run mockup:links`    | Uji tautan sidebar/header dan pemuatan layout          |
| `npm run mockup:check`    | Gagal bila ada komponen ditulis dengan utilitas manual |
| `npm run mockup:snapshot` | Simpan baseline screenshot ke `.cache/mockup-golden/`  |
| `npm run mockup:visual`   | Bandingkan tampilan sekarang dengan baseline           |

Baseline disimpan lokal di `.cache/` dan tidak di-commit, sehingga setiap mesin perlu
menjalankan `mockup:snapshot` sekali sebelum `mockup:visual`.

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
- README ini ikut diperiksa `prettier` dan `markdownlint`; jalankan `npm run md:check`
  setelah mengubahnya.

## Dokumen Terkait

| Dokumen                | Isi                              |
| ---------------------- | -------------------------------- |
| `docs/PRD.md`          | Kebutuhan produk dan fungsional  |
| `docs/TECH-STACK.md`   | Tech stack dan arsitektur teknis |
| `docs/DATA-MODEL.md`   | Skema basis data                 |
| `docs/API-CONTRACT.md` | Kontrak API internal             |
