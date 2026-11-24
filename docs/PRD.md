# PRD — Sistem Manajemen Stok Obat dan BMHP Dinas Kesehatan Kabupaten

| Atribut         | Nilai                                              |
| --------------- | -------------------------------------------------- |
| Nama Produk     | Sistem Manajemen Stok Obat dan BMHP Daerah (SMSOD) |
| Versi Dokumen   | 1.0 (Draft)                                        |
| Status          | Untuk direview                                     |
| Pemilik Produk  | Dinas Kesehatan Kabupaten                          |
| Penyusun        | Tim Pengembangan                                   |
| Tanggal         | 24 November 2026                                   |
| Target Pembaca  | Kepala Dinas, Apoteker, Tim IT, Vendor             |
| Dokumen Terkait | `docs/UI-MOCKUP.md`, `docs/API-CONTRACT.md`        |

Dokumen ini mendefinisikan kebutuhan produk untuk aplikasi pengelolaan stok obat dan
Bahan Medis Habis Pakai (BMHP) pada lingkup Dinas Kesehatan Kabupaten. Cakupan entitas
tertinggi adalah Dinas Kesehatan Kabupaten, dengan fasilitas kesehatan di bawahnya berupa
Puskesmas (beserta Puskesmas Pembantu) dan Rumah Sakit Umum Daerah (RSUD) yang berstatus
BLUD.

Mockup antarmuka dan kontrak API tidak dibahas di dokumen ini. Keduanya ditulis pada file
terpisah agar PRD tetap fokus pada kebutuhan bisnis dan fungsional.

---

## 1. Executive Summary

Sistem Manajemen Stok Obat dan BMHP Daerah (SMSOD) adalah aplikasi berbasis web yang
mengelola siklus persediaan obat dan BMHP secara terpusat di level Dinas Kesehatan
Kabupaten, sekaligus memberikan otonomi operasional yang terkendali kepada Puskesmas dan
RSUD.

Masalah utama yang diselesaikan adalah fragmentasi data stok antar fasilitas kesehatan,
ketidaksesuaian antara stok sistem dan stok fisik, keterlambatan deteksi kekosongan obat,
penumpukan stok yang berujung kedaluwarsa, serta pelaporan yang masih manual dan tidak
seragam.

Sistem ini menyatukan empat kemampuan inti:

- Perencanaan kebutuhan obat berbasis konsumsi, morbiditas, dan analisis ABC-VEN.
- Pengadaan terintegrasi e-Katalog LKPP dengan jejak audit lengkap.
- Distribusi bertingkat dari gudang Dinas Kesehatan ke Puskesmas dan RSUD.
- Pengendalian persediaan real-time dengan peringatan stok kritis dan kedaluwarsa.

Hasil yang diharapkan adalah ketersediaan obat esensial di atas 90 persen, penurunan
angka kedaluwarsa di bawah 1 persen, dan akurasi stok di atas 95 persen dalam dua belas
bulan setelah implementasi penuh.

---

## 2. Latar Belakang dan Masalah

### 2.1 Konteks Organisasi

Dinas Kesehatan Kabupaten bertanggung jawab atas pembinaan kefarmasian seluruh fasilitas
kesehatan di wilayahnya. Secara operasional, terdapat dua kelompok fasilitas dengan
karakter tata kelola yang berbeda.

| Aspek              | Puskesmas                       | RSUD                                 |
| ------------------ | ------------------------------- | ------------------------------------ |
| Status organisasi  | UPTD Dinas Kesehatan            | Unit organisasi Pemda berstatus BLUD |
| Kewenangan belanja | Melalui DPA Dinas Kesehatan     | APBD dan pendapatan BLUD sendiri     |
| Pengadaan obat     | Sepenuhnya oleh Dinas Kesehatan | Mandiri untuk obat umum              |
| Pembinaan teknis   | Langsung                        | Oleh Dinas Kesehatan                 |
| Pelaporan          | Wajib ke Dinas Kesehatan        | Wajib ke Dinas Kesehatan             |

Implikasi bagi produk: Puskesmas dikelola penuh secara end-to-end, sedangkan RSUD dikelola
secara semi-managed, yaitu pengawasan, pelaporan, dan distribusi obat program, tanpa
mengambil alih pengadaan obat umum yang menjadi kewenangan BLUD.

### 2.2 Masalah yang Dihadapi

| Kode | Masalah                             | Dampak                                            |
| ---- | ----------------------------------- | ------------------------------------------------- |
| M-01 | Data stok tersebar di banyak file   | Rekap lambat, angka tidak konsisten antar laporan |
| M-02 | Stok sistem tidak sama dengan fisik | Hidden stockout, salah rencana pengadaan          |
| M-03 | Deteksi kekosongan obat terlambat   | Pasien tidak terlayani, rujukan meningkat         |
| M-04 | Penumpukan stok tanpa kendali       | Modal kerja terikat, obat kedaluwarsa             |
| M-05 | Penerapan FEFO tidak konsisten      | Obat mendekati kedaluwarsa terlewat               |
| M-06 | Pelaporan manual dan tidak seragam  | Beban administratif, laporan ke pusat terlambat   |
| M-07 | Distribusi tidak berbasis prioritas | Puskesmas kritis tidak terpenuhi lebih dahulu     |
| M-08 | Tidak ada jejak audit pengadaan     | Risiko temuan audit dan potensi penyimpangan      |

### 2.3 Kondisi Saat Ini (As-Is)

```mermaid
flowchart LR
    A["Pengadaan manual / e-Katalog terpisah"] --> B["Gudang Dinas Kesehatan"]
    B --> C["Distribusi via surat jalan manual"]
    C --> D["Puskesmas mencatat di buku / spreadsheet"]
    C --> E["RSUD mencatat di SIMRS terpisah"]
    D --> F["Rekap manual ke Dinas Kesehatan"]
    E --> F
    F --> G["Laporan ke Provinsi dan Kementerian"]
```

![Kondisi Saat Ini (As-Is)](./diagrams/2-3-kondisi-saat-ini-as-is.png)

Titik lemah utama berada pada transisi C ke D dan D ke F, karena pencatatan ganda dan
keterlambatan input menyebabkan data tidak sinkron.

---

## 3. Tujuan dan Kriteria Keberhasilan

### 3.1 Tujuan Produk

1. Menyatukan data stok obat dan BMHP seluruh fasilitas kesehatan dalam satu sumber
   kebenaran.
2. Mempercepat perencanaan dan pengadaan melalui perhitungan otomatis dan integrasi
   e-Katalog.
3. Menjamin ketersediaan obat esensial melalui peringatan dini dan distribusi berbasis
   prioritas.
4. Menekan angka kedaluwarsa dan penumpukan stok melalui pengendalian persediaan.
5. Menghasilkan laporan standar secara otomatis dan konsisten.

### 3.2 Kriteria Keberhasilan (KPI)

| KPI                 | Definisi                                              | Target   | Frekuensi  |
| ------------------- | ----------------------------------------------------- | -------- | ---------- |
| Availability Rate   | Item tersedia dibagi total item RKO dikali 100 persen | ≥ 90%    | Bulanan    |
| Stockout Rate       | Item kosong dibagi total item formularium             | ≤ 5%     | Mingguan   |
| Stock Accuracy      | Item tanpa selisih dibagi total item opname           | ≥ 95%    | Bulanan    |
| Expired Rate        | Nilai obat kedaluwarsa dibagi total nilai keluar      | ≤ 1%     | Triwulanan |
| Order Fulfillment   | Permintaan terpenuhi dibagi total permintaan          | ≥ 95%    | Bulanan    |
| Overstock Rate      | Nilai stok di atas maksimum dibagi total inventori    | ≤ 10%    | Triwulanan |
| Waktu Rekap Laporan | Waktu menghasilkan laporan bulanan konsolidasi        | ≤ 10 mnt | Bulanan    |

### 3.3 Metrik Adopsi

| Metrik                             | Target 12 bulan |
| ---------------------------------- | --------------- |
| Fasilitas aktif menggunakan sistem | 100%            |
| Transaksi tercatat di sistem       | ≥ 98%           |
| Pengguna terlatih                  | ≥ 95%           |

---

## 4. Stakeholders dan Personas

### 4.1 Daftar Stakeholder

| Stakeholder            | Peran                                | Kepentingan Utama                        |
| ---------------------- | ------------------------------------ | ---------------------------------------- |
| Kepala Dinas Kesehatan | Pemilik kebijakan dan anggaran       | Ketersediaan obat dan efisiensi anggaran |
| Kepala Bidang Farmasi  | Penanggung jawab teknis kefarmasian  | Akurasi data dan kepatuhan regulasi      |
| Apoteker Gudang Dinas  | Pengelola gudang farmasi kabupaten   | Stok akurat, distribusi lancar           |
| Petugas Gudang         | Eksekutor penerimaan dan pengeluaran | Kemudahan input dan picking              |
| Kepala Puskesmas       | Penanggung jawab fasilitas           | Ketersediaan obat di fasilitas           |
| Apoteker Puskesmas     | Pengelola farmasi Puskesmas          | Perencanaan dan pelayanan obat           |
| Direktur RSUD          | Penanggung jawab RS                  | Kepatuhan pelaporan dan obat program     |
| Apoteker RSUD          | Pengelola farmasi RS                 | Integrasi data dan pelaporan             |
| Auditor Inspektorat    | Pengawas internal                    | Jejak audit dan transparansi             |
| Tim IT Dinas           | Pengelola teknis                     | Keamanan, ketersediaan, pemeliharaan     |

### 4.2 Persona Utama

**Persona 1 — Ibu Ratna, Apoteker Gudang Dinas**

- Usia 34 tahun, pengalaman 8 tahun di gudang farmasi kabupaten.
- Kebutuhan: melihat stok seluruh item dalam satu layar, memprioritaskan distribusi,
  dan mendeteksi item mendekati kedaluwarsa.
- Frustrasi: rekap permintaan Puskesmas dilakukan manual di spreadsheet.

**Persona 2 — Bapak Andi, Apoteker Puskesmas**

- Usia 29 tahun, mengelola farmasi Puskesmas dengan dua Puskesmas Pembantu.
- Kebutuhan: mengajukan permintaan cepat, melihat sisa stok, dan mencatat pelayanan.
- Frustrasi: sering menerima obat yang tidak sesuai kebutuhan dan stok sistem tidak akurat.

**Persona 3 — Ibu Sari, Apoteker RSUD**

- Usia 40 tahun, mengelola instalasi farmasi RSUD BLUD.
- Kebutuhan: melaporkan ketersediaan obat program dan memantau formularium daerah.
- Frustrasi: harus mengisi laporan ganda untuk Dinas dan Kementerian.

**Persona 4 — Bapak Hendra, Kepala Bidang Farmasi**

- Usia 48 tahun, pengambil keputusan teknis.
- Kebutuhan: dashboard ringkas, laporan siap kirim, dan peringatan risiko.
- Frustrasi: angka dari tiap Puskesmas berbeda dan tidak dapat dibandingkan.

---

## 5. Scope

### 5.1 In-Scope

| Area         | Cakupan                                                         |
| ------------ | --------------------------------------------------------------- |
| Perencanaan  | RKO Puskesmas, RKO RSUD obat program, konsolidasi Dinas         |
| Pengadaan    | Integrasi e-Katalog, PO, penerimaan, BAST                       |
| Penyimpanan  | Multi gudang, lokasi rak, batch, expired, FEFO                  |
| Distribusi   | Dinas ke Puskesmas, Dinas ke RSUD (program), internal Puskesmas |
| Pelayanan    | Dispensing Puskesmas dan RSUD, pemakaian per pasien             |
| Pengendalian | Stock opname, reorder point, safety stock, alert                |
| Pelaporan    | Laporan harian sampai tahunan, ekspor standar                   |
| Administrasi | Manajemen pengguna, peran, fasilitas, master data obat          |

### 5.2 Out-of-Scope

| Area                          | Alasan                                            |
| ----------------------------- | ------------------------------------------------- |
| Pengadaan obat umum RSUD      | Kewenangan BLUD, hanya dicatat untuk monitoring   |
| Billing dan klaim BPJS        | Ditangani SIMRS dan sistem klaim terpisah         |
| Rekam medis elektronik penuh  | Hanya integrasi ringkas untuk data resep          |
| Akuntansi dan jurnal keuangan | Hanya menyediakan data pendukung, bukan pembukuan |
| Telemedicine                  | Di luar domain logistik farmasi                   |
| Aplikasi mobile native        | Fase awal berbasis web responsif                  |

### 5.3 Batasan

- Aplikasi harus dapat berjalan pada infrastruktur pemerintah daerah dengan bandwidth
  terbatas.
- Sebagian Puskesmas Pembantu memiliki koneksi internet tidak stabil.
- Data historis dari sistem lama perlu dimigrasikan secara bertahap.

---

## 6. Arsitektur Sistem

### 6.1 Hierarki Entitas

```mermaid
flowchart TD
    DINKES["Dinas Kesehatan Kabupaten<br/>Gudang Farmasi Pusat"]
    RSUD["RSUD (BLUD)<br/>Semi-Managed"]
    PKM1["Puskesmas A<br/>End-to-End"]
    PKM2["Puskesmas B<br/>End-to-End"]
    PUSTU1["Puskesmas Pembantu A1"]
    PUSTU2["Puskesmas Pembantu A2"]

    DINKES -->|"Distribusi penuh"| PKM1
    DINKES -->|"Distribusi penuh"| PKM2
    DINKES -->|"Obat program + pengawasan"| RSUD
    PKM1 --> PUSTU1
    PKM1 --> PUSTU2
```

![Hierarki Entitas](./diagrams/6-1-hierarki-entitas.png)

### 6.2 Model Pengelolaan per Entitas

| Kapabilitas           | Dinas Kesehatan | Puskesmas | RSUD         |
| --------------------- | --------------- | --------- | ------------ |
| Perencanaan kebutuhan | Konsolidasi     | Penuh     | Obat program |
| Pengadaan             | Penuh           | Tidak     | Mandiri      |
| Penerimaan barang     | Penuh           | Penuh     | Penuh        |
| Distribusi keluar     | Penuh           | Internal  | Internal     |
| Pelayanan pasien      | Tidak           | Penuh     | Penuh        |
| Stock opname          | Supervisi       | Penuh     | Penuh        |
| Monitoring stok       | Semua fasilitas | Sendiri   | Sendiri      |
| Pelaporan             | Konsolidasi     | Otomatis  | Bulanan      |

### 6.3 Prinsip Arsitektur

1. Multi-fasilitas dengan isolasi data per fasilitas dan akses lintas fasilitas khusus
   untuk peran Dinas.
2. Audit trail wajib untuk setiap mutasi stok, tanpa pengecualian.
3. Soft delete untuk master data agar referensi historis tetap utuh.
4. Idempotensi pada proses penerimaan dan distribusi untuk mencegah pencatatan ganda.
5. Dukungan mode input tertunda untuk fasilitas dengan koneksi tidak stabil.

---

## 7. Business Process End-to-End

### 7.1 Alur Utama

```mermaid
flowchart TD
    A["Perencanaan<br/>RKO Fasilitas"] --> B["Konsolidasi<br/>Dinas Kesehatan"]
    B --> C["Pengadaan<br/>e-Katalog"]
    C --> D["Penerimaan<br/>Gudang Dinas"]
    D --> E["Penyimpanan<br/>FEFO dan Batch"]
    E --> F{"Jenis Distribusi"}
    F -->|"Puskesmas"| G["Distribusi ke Puskesmas"]
    F -->|"Obat Program"| H["Distribusi ke RSUD"]
    G --> I["Pelayanan Puskesmas"]
    H --> J["Pelayanan RSUD"]
    I --> K["Pencatatan Pemakaian"]
    J --> K
    K --> L["Pengendalian<br/>Opname dan Alert"]
    L --> M["Pelaporan<br/>dan Evaluasi"]
    M --> A
```

![Alur Utama](./diagrams/7-1-alur-utama.png)

### 7.2 Aktor dan Tanggung Jawab Proses

| Tahap        | Aktor Utama                 | Keluaran                      |
| ------------ | --------------------------- | ----------------------------- |
| Perencanaan  | Apoteker Puskesmas dan RSUD | Dokumen RKO                   |
| Konsolidasi  | Apoteker Gudang Dinas       | Rencana pengadaan gabungan    |
| Pengadaan    | Pejabat Pengadaan           | PO dan kontrak                |
| Penerimaan   | Petugas Gudang              | BAST dan stok masuk           |
| Penyimpanan  | Petugas Gudang              | Lokasi rak dan batch tercatat |
| Distribusi   | Petugas Gudang dan Kurir    | Surat jalan dan BAST          |
| Pelayanan    | Apoteker Fasilitas          | Catatan dispensing            |
| Pengendalian | Apoteker dan Auditor        | Berita acara opname           |
| Pelaporan    | Kepala Bidang Farmasi       | Laporan standar               |

---

## 8. Fitur per Modul

### 8.1 Modul Perencanaan (RKO)

#### 8.1.1 Ringkasan Modul Perencanaan

Modul ini menghitung kebutuhan obat tiap fasilitas berdasarkan data konsumsi, morbiditas,
sisa stok, waktu tunggu, dan stok penyangga, lalu mengonsolidasikannya di level Dinas.

#### 8.1.2 Aktor dan Hak Akses Perencanaan

| Peran                 | Hak                                    |
| --------------------- | -------------------------------------- |
| Apoteker Puskesmas    | Membuat, mengubah, mengajukan RKO      |
| Apoteker RSUD         | Membuat RKO obat program               |
| Apoteker Gudang Dinas | Melihat, memverifikasi, mengonsolidasi |
| Kepala Bidang Farmasi | Menyetujui rencana pengadaan           |

#### 8.1.3 Fitur Modul Perencanaan

1. Perhitungan otomatis metode konsumsi berdasarkan pemakaian periode sebelumnya.
2. Perhitungan metode morbiditas berdasarkan angka kesakitan per diagnosa.
3. Penyesuaian otomatis untuk buffer stock dan lead time stock.
4. Analisis ABC dan VEN beserta kombinasi ABC-VEN untuk prioritas.
5. Simulasi skenario kebutuhan dengan parameter yang dapat diubah.
6. Konsolidasi otomatis RKO seluruh fasilitas menjadi rencana pengadaan.
7. Deteksi duplikasi dan anomali jumlah yang tidak wajar.
8. Riwayat versi RKO dan jejak persetujuan.

#### 8.1.4 Alur Modul Perencanaan

```mermaid
sequenceDiagram
    participant P as Apoteker Puskesmas
    participant S as Sistem
    participant D as Apoteker Dinas
    participant K as Kepala Bidang

    P->>S: Buka periode RKO
    S-->>P: Tampilkan data konsumsi dan sisa stok
    P->>S: Input penyesuaian dan submit
    S->>S: Hitung konsumsi, buffer, safety stock
    S-->>D: Notifikasi RKO masuk
    D->>S: Verifikasi dan konsolidasi
    S->>K: Ajukan rencana pengadaan
    K->>S: Setujui
    S-->>P: Status RKO disetujui
```

![Alur Modul Perencanaan](./diagrams/8-1-4-alur-modul-perencanaan.png)

#### 8.1.5 Aturan Bisnis Perencanaan

- RKO diajukan per triwulan dengan tenggat H-30 sebelum periode berjalan.
- Perhitungan metode konsumsi menggunakan rata-rata pemakaian tiga sampai enam bulan.
- Buffer stock ditetapkan berdasarkan kebijakan Dinas dan dapat berbeda per kategori obat.
- Item kategori V (Vital) tidak boleh diusulkan nol tanpa alasan tertulis.
- Perubahan RKO setelah disetujui memerlukan persetujuan ulang.

#### 8.1.6 Contoh Data Perencanaan

Contoh RKO Puskesmas untuk periode triwulan I 2027:

| Kode    | Nama Obat            | Satuan | Pemakaian 3 Bln | Sisa Stok | Buffer | Kebutuhan |
| ------- | -------------------- | ------ | --------------: | --------: | -----: | --------: |
| OBT-001 | Amoksisilin 500 mg   | Tablet |           3.600 |       400 |    300 |     3.500 |
| OBT-002 | Parasetamol 500 mg   | Tablet |           5.400 |       800 |    450 |     5.050 |
| OBT-003 | Metformin 500 mg     | Tablet |           1.800 |       250 |    150 |     1.700 |
| OBT-004 | Amlodipin 10 mg      | Tablet |           2.700 |       300 |    220 |     2.620 |
| OBT-005 | Kotrimoksazol 480 mg | Tablet |             900 |       150 |     80 |       830 |
| OBT-006 | Oralit Serbuk        | Sachet |           1.200 |       200 |    100 |     1.100 |
| OBT-007 | Salbutamol Inhaler   | Botol  |              60 |        12 |     10 |        58 |
| OBT-008 | Insulin Glargine     | Vial   |              30 |         6 |      4 |        28 |

Catatan: kebutuhan dihitung sebagai pemakaian ditambah buffer dikurangi sisa stok, dengan
pembulatan ke atas sesuai satuan terkecil.

### 8.2 Modul Pengadaan

#### 8.2.1 Ringkasan Modul Pengadaan

Modul ini mengelola proses pengadaan dari rencana yang disetujui hingga penerbitan pesanan,
dengan integrasi e-Katalog untuk fasilitas yang wajib mengikuti mekanisme tersebut.

#### 8.2.2 Aktor dan Hak Akses Pengadaan

| Peran                 | Hak                                        |
| --------------------- | ------------------------------------------ |
| Pejabat Pengadaan     | Membuat PO dan memilih penyedia            |
| Apoteker Gudang Dinas | Menyusun keranjang pengadaan               |
| Kepala Bidang Farmasi | Menyetujui PO di atas nilai tertentu       |
| Auditor               | Melihat riwayat pengadaan secara read-only |

#### 8.2.3 Fitur Modul Pengadaan

1. Keranjang pengadaan otomatis dari rencana yang disetujui.
2. Integrasi katalog elektronik untuk pencarian produk dan harga.
3. Pembuatan PO, kontrak, dan surat pesanan obat.
4. Persetujuan berjenjang berdasarkan nilai pengadaan.
5. Pelacakan status pesanan dari dipesan hingga diterima.
6. Pencatatan penerimaan sebagian dan penerimaan bertahap.
7. Perbandingan harga historis per item dan per penyedia.
8. Deteksi penyedia dengan riwayat keterlambatan.

#### 8.2.4 Aturan Bisnis Pengadaan

- Pengadaan wajib merujuk pada RKO yang telah disetujui.
- Pengadaan di atas ambang tertentu memerlukan persetujuan Kepala Dinas.
- Penerimaan tidak boleh melebihi jumlah pada PO tanpa adendum.
- Setiap PO wajib memiliki nomor unik yang tidak dapat digunakan ulang.
- Item tanpa nomor izin edar yang berlaku tidak boleh dipesan.

#### 8.2.5 Contoh Data Pengadaan

| No PO        | Tanggal    | Penyedia          | Jumlah Item |       Nilai | Status    |
| ------------ | ---------- | ----------------- | ----------: | ----------: | --------- |
| PO/2027/0001 | 2027-01-05 | PT Sehat Farma    |          18 | 245.000.000 | Diterima  |
| PO/2027/0002 | 2027-01-08 | PT Medika Jaya    |          12 | 132.500.000 | Sebagian  |
| PO/2027/0003 | 2027-01-12 | PT Global Medika  |           9 |  87.300.000 | Dikirim   |
| PO/2027/0004 | 2027-01-15 | PT Sehat Farma    |          22 | 310.750.000 | Disetujui |
| PO/2027/0005 | 2027-01-20 | PT Nusantara Obat |           7 |  54.900.000 | Draf      |

### 8.3 Modul Penerimaan dan Penyimpanan

#### 8.3.1 Ringkasan Modul Penerimaan dan Penyimpanan

Modul ini mencatat penerimaan barang dari penyedia, memverifikasi kesesuaian dokumen dan
fisik, lalu menempatkan barang pada lokasi penyimpanan dengan pencatatan batch dan tanggal
kedaluwarsa.

#### 8.3.2 Aktor dan Hak Akses Penerimaan

| Peran           | Hak                                          |
| --------------- | -------------------------------------------- |
| Petugas Gudang  | Menerima, memeriksa, menempatkan barang      |
| Apoteker Gudang | Memverifikasi mutu dan menyetujui penerimaan |
| Auditor         | Melihat dokumen penerimaan                   |

#### 8.3.3 Fitur Modul Penerimaan dan Penyimpanan

1. Penerimaan berdasarkan PO dengan validasi jumlah dan item.
2. Pencatatan nomor batch dan tanggal kedaluwarsa per unit penerimaan.
3. Pemindaian barcode untuk mempercepat input.
4. Penempatan otomatis ke lokasi rak berdasarkan aturan kategori.
5. Pencetakan label lokasi, batch, dan peringatan kedaluwarsa.
6. Penerimaan sebagian dan penanganan selisih kirim.
7. Karantina otomatis untuk barang yang belum lolos pemeriksaan mutu.
8. Pemetaan zona penyimpanan sesuai suhu dan kategori obat.

#### 8.3.4 Zona Penyimpanan Standar

| Zona      | Peruntukan                      | Kondisi Suhu    |
| --------- | ------------------------------- | --------------- |
| Zona A    | Obat fast-moving kategori A     | 15–25 °C        |
| Zona B    | Obat medium-moving kategori B   | 15–25 °C        |
| Zona C    | Obat slow-moving kategori C     | 15–25 °C        |
| Cold      | Vaksin dan produk rantai dingin | 2–8 °C          |
| Frozen    | Produk beku tertentu            | ≤ -15 °C        |
| Narkotika | Narkotika dan psikotropika      | Lemari terkunci |
| Karantina | Barang menunggu pemeriksaan     | Sesuai jenis    |
| Retur     | Barang akan dikembalikan        | Sesuai jenis    |
| Musnah    | Barang rusak atau kedaluwarsa   | Terpisah        |

#### 8.3.5 Contoh Kartu Stok

Kartu stok item Amoksisilin 500 mg, gudang Dinas, periode Januari 2027:

| Tanggal    | No Dokumen   | Jenis       | Masuk | Keluar |  Sisa | Batch   | Expired    |
| ---------- | ------------ | ----------- | ----: | -----: | ----: | ------- | ---------- |
| 2027-01-05 | PO/2027/0001 | Masuk       | 5.000 |      0 | 5.000 | AMX2401 | 2028-12-31 |
| 2027-01-10 | DO/2027/0012 | Keluar      |     0 |  1.200 | 3.800 | AMX2401 | 2028-12-31 |
| 2027-01-15 | DO/2027/0018 | Keluar      |     0 |    900 | 2.900 | AMX2401 | 2028-12-31 |
| 2027-01-20 | PO/2027/0004 | Masuk       | 3.000 |      0 | 5.900 | AMX2402 | 2029-03-31 |
| 2027-01-25 | DO/2027/0025 | Keluar      |     0 |  1.500 | 4.400 | AMX2401 | 2028-12-31 |
| 2027-01-28 | ADJ/2027/003 | Penyesuaian |     0 |     40 | 4.360 | AMX2401 | 2028-12-31 |

### 8.4 Modul Distribusi

#### 8.4.1 Ringkasan Modul Distribusi

Modul ini mengelola permintaan dari fasilitas, penentuan prioritas, penyiapan barang,
pengiriman, dan konfirmasi penerimaan di fasilitas tujuan.

#### 8.4.2 Aktor dan Hak Akses Distribusi

| Peran                 | Hak                                         |
| --------------------- | ------------------------------------------- |
| Apoteker Puskesmas    | Mengajukan dan mengonfirmasi permintaan     |
| Apoteker RSUD         | Mengajukan permintaan obat program          |
| Apoteker Gudang Dinas | Memverifikasi, memprioritaskan, menerbitkan |
| Petugas Gudang        | Menyiapkan dan mengeluarkan barang          |
| Kurir                 | Memperbarui status pengiriman               |

#### 8.4.3 Fitur Modul Distribusi

1. Formulir permintaan per item dengan validasi terhadap RKO dan stok Dinas.
2. Mesin prioritas berdasarkan tingkat kekritisan stok fasilitas.
3. Rekomendasi alokasi otomatis ketika stok terbatas.
4. Pembuatan surat jalan dan surat pengeluaran barang.
5. Picking list dengan urutan pengambilan sesuai FEFO.
6. Pelacakan status pengiriman.
7. Konfirmasi penerimaan dengan pencatatan selisih.
8. Redistribusi antar Puskesmas untuk menyeimbangkan stok.

#### 8.4.4 Alur Distribusi

```mermaid
sequenceDiagram
    participant P as Puskesmas
    participant D as Dinas
    participant G as Gudang
    participant K as Kurir

    P->>D: Ajukan permintaan obat
    D->>D: Validasi RKO dan stok
    D->>D: Hitung prioritas alokasi
    D-->>P: Konfirmasi jumlah disetujui
    D->>G: Terbitkan picking list
    G->>G: Ambil barang sesuai FEFO
    G->>K: Serah terima untuk kirim
    K->>P: Antarkan barang
    P->>D: Konfirmasi penerimaan dan selisih
```

![Alur Distribusi](./diagrams/8-4-4-alur-distribusi.png)

#### 8.4.5 Aturan Alokasi Prioritas

| Prioritas | Kondisi                               | Perlakuan                    |
| --------- | ------------------------------------- | ---------------------------- |
| 1         | Stok fasilitas di bawah safety stock  | Dipenuhi penuh lebih dahulu  |
| 2         | Stok fasilitas di bawah reorder point | Dipenuhi setelah prioritas 1 |
| 3         | Stok fasilitas dalam batas aman       | Dipenuhi proporsional        |
| 4         | Stok fasilitas di atas maksimum       | Ditunda atau dikurangi       |

#### 8.4.6 Contoh Data Distribusi

| No DO        | Tanggal    | Tujuan         | Item | Jumlah | Status   | Selisih |
| ------------ | ---------- | -------------- | ---: | -----: | -------- | ------: |
| DO/2027/0012 | 2027-01-10 | Puskesmas A    |    8 |  4.500 | Diterima |       0 |
| DO/2027/0018 | 2027-01-15 | Puskesmas B    |    6 |  3.200 | Diterima |       0 |
| DO/2027/0025 | 2027-01-25 | Puskesmas C    |    9 |  5.100 | Diterima |      20 |
| DO/2027/0031 | 2027-02-02 | RSUD (program) |    4 |  1.800 | Diterima |       0 |
| DO/2027/0035 | 2027-02-08 | Puskesmas A    |    7 |  2.900 | Dikirim  |       — |

### 8.5 Modul Pelayanan dan Dispensing

#### 8.5.1 Ringkasan Modul Pelayanan dan Dispensing

Modul ini mencatat penggunaan obat untuk pasien di Puskesmas dan RSUD sehingga pemakaian
riil dapat menjadi dasar perencanaan periode berikutnya.

#### 8.5.2 Aktor dan Hak Akses Pelayanan

| Peran           | Hak                                    |
| --------------- | -------------------------------------- |
| Dokter          | Menulis resep elektronik               |
| Apoteker        | Menelaah, menyiapkan, menyerahkan obat |
| Petugas Farmasi | Menyiapkan dan mencatat penyerahan     |

#### 8.5.3 Fitur Modul Pelayanan dan Dispensing

1. Penerimaan resep elektronik dari modul pelayanan atau sistem eksternal.
2. Telaah resep meliputi dosis, interaksi, dan duplikasi.
3. Pengurangan stok otomatis saat penyerahan obat.
4. Pencatatan pemakaian per item, per pasien, dan per diagnosa.
5. Penanganan resep racikan dengan komposisi bahan.
6. Pencatatan obat tidak terlayani beserta alasannya.
7. Pengembalian obat dari unit ke gudang dengan pencatatan.
8. Rekap pemakaian untuk umpan balik perencanaan.

#### 8.5.4 Aturan Bisnis Pelayanan

- Stok tidak boleh menjadi negatif; penyerahan diblokir bila stok tidak mencukupi.
- Obat dengan batch mendekati kedaluwarsa diprioritaskan keluar.
- Narkotika dan psikotropika memerlukan pencatatan khusus dan persetujuan apoteker.
- Obat rusak atau kedaluwarsa tidak boleh diserahkan dan harus masuk jalur pemusnahan.

#### 8.5.5 Contoh Data Pemakaian

Rekap pemakaian Puskesmas A, Januari 2027:

| Kode    | Nama Obat            | Jumlah Keluar | Jumlah Pasien | Rata-rata per Pasien |
| ------- | -------------------- | ------------: | ------------: | -------------------: |
| OBT-001 | Amoksisilin 500 mg   |         1.200 |           400 |                    3 |
| OBT-002 | Parasetamol 500 mg   |         1.800 |           600 |                    3 |
| OBT-003 | Metformin 500 mg     |           600 |           200 |                    3 |
| OBT-004 | Amlodipin 10 mg      |           900 |           300 |                    3 |
| OBT-005 | Kotrimoksazol 480 mg |           300 |           100 |                    3 |

### 8.6 Modul Pengendalian Persediaan

#### 8.6.1 Ringkasan Modul Pengendalian Persediaan

Modul ini menjaga keseimbangan stok melalui perhitungan titik pemesanan kembali, stok
pengaman, stock opname, serta peringatan dini untuk kekosongan dan kedaluwarsa.

#### 8.6.2 Aktor dan Hak Akses Pengendalian

| Peran              | Hak                                    |
| ------------------ | -------------------------------------- |
| Apoteker Fasilitas | Menjalankan opname dan menindaklanjuti |
| Apoteker Gudang    | Menyetujui penyesuaian stok            |
| Auditor            | Memverifikasi berita acara opname      |

#### 8.6.3 Fitur Modul Pengendalian Persediaan

1. Perhitungan safety stock dan reorder point per item per fasilitas.
2. Penetapan batas minimum dan maksimum stok.
3. Peringatan otomatis untuk stok kritis, kekosongan, dan kelebihan.
4. Peringatan kedaluwarsa berjenjang 6, 3, dan 1 bulan.
5. Modul stock opname dengan blanko per lokasi dan rekonsiliasi selisih.
6. Analisis fast, slow, dan non-moving item.
7. Usulan redistribusi antar fasilitas berdasarkan kelebihan dan kekurangan.
8. Pencatatan pemusnahan beserta berita acara.

#### 8.6.4 Formula Pengendalian

```text
Safety Stock   = (Pemakaian Maks × Lead Time Maks) − (Pemakaian Rata × Lead Time Rata)
Reorder Point  = (Pemakaian Rata × Lead Time Rata) + Safety Stock
Max Stock      = Reorder Point + Kuantitas Pemesanan Ekonomis
```

#### 8.6.5 Tingkatan Peringatan

| Tingkat   | Kondisi                         | Warna  | Tindakan                      |
| --------- | ------------------------------- | ------ | ----------------------------- |
| Normal    | Stok di antara ROP dan maksimum | Hijau  | Pemantauan rutin              |
| Waspada   | Stok di bawah ROP               | Kuning | Ajukan permintaan             |
| Kritis    | Stok di bawah safety stock      | Oranye | Prioritas distribusi          |
| Kosong    | Stok sama dengan nol            | Merah  | Eskalasi dan substitusi       |
| Kelebihan | Stok di atas maksimum           | Biru   | Tunda pengadaan, redistribusi |

#### 8.6.6 Contoh Hasil Stock Opname

| Kode    | Nama Obat          | Stok Sistem | Stok Fisik | Selisih | Keterangan              |
| ------- | ------------------ | ----------: | ---------: | ------: | ----------------------- |
| OBT-001 | Amoksisilin 500 mg |       4.360 |      4.350 |     -10 | Selisih hitung          |
| OBT-002 | Parasetamol 500 mg |       6.200 |      6.200 |       0 | Sesuai                  |
| OBT-003 | Metformin 500 mg   |       1.850 |      1.880 |     +30 | Input distribusi kurang |
| OBT-004 | Amlodipin 10 mg    |       2.640 |      2.640 |       0 | Sesuai                  |
| OBT-009 | Vitamin A Kapsul   |         500 |        480 |     -20 | Kemasan rusak           |

#### 8.6.7 Contoh Analisis ABC-VEN

| Kode    | Nilai Pemakaian | Kumulatif | Kelas ABC | Kategori VEN  | Prioritas |
| ------- | --------------: | --------: | --------- | ------------- | --------- |
| OBT-004 |     180.000.000 |       38% | A         | Vital         | AV        |
| OBT-003 |     120.000.000 |       63% | A         | Essential     | AE        |
| OBT-002 |      72.000.000 |       78% | A         | Essential     | AE        |
| OBT-001 |      54.000.000 |       90% | B         | Vital         | BV        |
| OBT-007 |      36.000.000 |       97% | B         | Essential     | BE        |
| OBT-005 |      12.000.000 |       99% | C         | Essential     | CE        |
| OBT-006 |       6.000.000 |      100% | C         | Non-Essential | CN        |

Prioritas AV dan BV mendapat kendali ketat, pemantauan harian, dan jaminan ketersediaan.
Prioritas CN dapat dikurangi frekuensi pengadaannya.

#### 8.6.8 Contoh Pemantauan Kedaluwarsa

| Kode    | Nama Obat          | Batch   | Expired    | Sisa | Sisa Hari | Status        |
| ------- | ------------------ | ------- | ---------- | ---: | --------: | ------------- |
| OBT-010 | Vaksin Campak      | VC2401  | 2027-02-15 |  120 |        30 | Kritis        |
| OBT-011 | Insulin Reguler    | IR2402  | 2027-04-30 |   40 |       104 | Waspada       |
| OBT-012 | Tetrasiklin 250 mg | TC2312  | 2027-08-31 |  300 |       227 | Aman          |
| OBT-013 | Serum Anti Rabies  | SAR2401 | 2027-01-20 |    8 |         4 | Sangat Kritis |

### 8.7 Modul Pelaporan dan Monitoring

#### 8.7.1 Ringkasan Modul Pelaporan dan Monitoring

Modul ini menyusun laporan standar secara otomatis dan menyediakan dashboard pemantauan
bagi pimpinan serta pengelola teknis.

#### 8.7.2 Aktor dan Hak Akses Pelaporan

| Peran                 | Hak                          |
| --------------------- | ---------------------------- |
| Kepala Dinas          | Dashboard seluruh fasilitas  |
| Kepala Bidang Farmasi | Dashboard dan ekspor laporan |
| Apoteker Fasilitas    | Laporan fasilitas sendiri    |
| Auditor               | Akses baca seluruh laporan   |

#### 8.7.3 Fitur Modul Pelaporan dan Monitoring

1. Dashboard ketersediaan, kekosongan, dan nilai inventori.
2. Laporan harian mutasi stok per gudang.
3. Laporan bulanan ketersediaan obat dan BMHP.
4. Laporan triwulanan realisasi RKO dan analisis ABC-VEN.
5. Laporan kedaluwarsa dan pemusnahan.
6. Laporan kinerja fasilitas dengan peringkat.
7. Ekspor laporan ke format standar untuk pelaporan ke pusat.
8. Penjadwalan pengiriman laporan otomatis.

#### 8.7.4 Contoh Dashboard Ringkas

| Indikator         | Nilai | Target | Status    |
| ----------------- | ----: | -----: | --------- |
| Availability Rate |   92% |  ≥ 90% | Tercapai  |
| Stockout Rate     |    4% |   ≤ 5% | Tercapai  |
| Stock Accuracy    |   96% |  ≥ 95% | Tercapai  |
| Expired Rate      |  0,8% |   ≤ 1% | Tercapai  |
| Order Fulfillment |   94% |  ≥ 95% | Perhatian |
| Overstock Rate    |   11% |  ≤ 10% | Perhatian |

#### 8.7.5 Contoh Laporan Ketersediaan Fasilitas

| Fasilitas   | Item RKO | Tersedia | Kosong | Availability | Peringkat |
| ----------- | -------: | -------: | -----: | -----------: | --------: |
| Puskesmas A |      120 |      114 |      6 |          95% |         1 |
| Puskesmas B |      118 |      108 |     10 |          92% |         2 |
| Puskesmas C |      125 |      112 |     13 |          90% |         3 |
| RSUD        |      210 |      189 |     21 |          90% |         4 |
| Puskesmas D |      115 |       98 |     17 |          85% |         5 |

---

## 9. Data Model

### 9.1 Entitas Utama

```mermaid
erDiagram
    FASILITAS ||--o{ GUDANG : memiliki
    GUDANG ||--o{ STOK : menyimpan
    OBAT ||--o{ STOK : tercatat
    STOK ||--o{ BATCH : terdiri_dari
    GUDANG ||--o{ PENERIMAAN : menerima
    PENERIMAAN ||--o{ PENERIMAAN_ITEM : berisi
    PENERIMAAN_ITEM }o--|| BATCH : menghasilkan
    FASILITAS ||--o{ PERMINTAAN : mengajukan
    PERMINTAAN ||--o{ PERMINTAAN_ITEM : berisi
    PERMINTAAN ||--o| PENGIRIMAN : dipenuhi
    GUDANG ||--o{ PENGIRIMAN : mengirim
    PENGIRIMAN ||--o{ PENGIRIMAN_ITEM : berisi
    FASILITAS ||--o{ RKO : menyusun
    RKO ||--o{ RKO_ITEM : berisi
    FASILITAS ||--o{ PENGGUNAAN : mencatat
    PENGGUNAAN ||--o{ PENGGUNAAN_ITEM : berisi
    OBAT ||--o{ PENGGUNAAN_ITEM : dipakai
    GUDANG ||--o{ OPNAME : melaksanakan
    OPNAME ||--o{ OPNAME_ITEM : berisi
    PENGGUNA ||--o{ AUDIT_LOG : menghasilkan
```

![Entitas Utama](./diagrams/9-1-entitas-utama.png)

### 9.2 Kamus Entitas Inti

| Entitas    | Deskripsi                        | Atribut Kunci                                    |
| ---------- | -------------------------------- | ------------------------------------------------ |
| Fasilitas  | Dinas, RSUD, Puskesmas, Pustu    | id, nama, jenis, status, kode_registrasi         |
| Gudang     | Lokasi penyimpanan per fasilitas | id, fasilitas_id, nama, zona, suhu               |
| Obat       | Master item obat dan BMHP        | id, kode, nama, satuan, kategori, formularium    |
| Stok       | Saldo per item per gudang        | id, gudang_id, obat_id, jumlah, min, max, rop    |
| Batch      | Rincian batch pada stok          | id, stok_id, nomor_batch, expired, jumlah        |
| Penerimaan | Dokumen penerimaan barang        | id, gudang_id, po_id, tanggal, status            |
| Permintaan | Permintaan dari fasilitas        | id, fasilitas_id, periode, status, prioritas     |
| Pengiriman | Dokumen pengiriman               | id, gudang_id, permintaan_id, tanggal, status    |
| RKO        | Rencana kebutuhan obat           | id, fasilitas_id, periode, status, versi         |
| Penggunaan | Catatan pemakaian obat           | id, fasilitas_id, tanggal, jenis_layanan         |
| Opname     | Sesi stock opname                | id, gudang_id, tanggal, status, selisih_nilai    |
| Audit Log  | Jejak seluruh perubahan data     | id, pengguna_id, aksi, entitas, waktu, data_lama |

### 9.3 Aturan Data

1. Setiap mutasi stok wajib memiliki dokumen sumber yang valid.
2. Saldo stok dihitung dari akumulasi batch, bukan nilai yang diisi manual.
3. Nomor batch dan tanggal kedaluwarsa wajib untuk semua item farmasi.
4. Penghapusan master data menggunakan penonaktifan, bukan penghapusan fisik.
5. Audit log tidak dapat diubah atau dihapus oleh pengguna mana pun.

---

## 10. Integrasi Sistem

| Sistem                  | Tujuan Integrasi                  | Mekanisme             | Prioritas |
| ----------------------- | --------------------------------- | --------------------- | --------- |
| Katalog Elektronik LKPP | Sumber produk dan harga pengadaan | API atau ekspor-impor | Tinggi    |
| SIPNAP / e-Monev RKO    | Pelaporan nasional kefarmasian    | Ekspor format standar | Tinggi    |
| SATUSEHAT               | Interoperabilitas data kesehatan  | API sesuai standar    | Menengah  |
| SIMRS RSUD              | Data pemakaian dan stok RSUD      | API atau sinkronisasi | Menengah  |
| e-Puskesmas             | Data pelayanan dan resep          | API atau sinkronisasi | Menengah  |
| Sistem akuntansi daerah | Data nilai inventori              | Ekspor berkala        | Rendah    |

Prinsip integrasi:

- Sinkronisasi bersifat idempoten dan dapat diulang tanpa menggandakan data.
- Kegagalan integrasi dicatat dan dapat dicoba ulang secara manual.
- Data master obat mengikuti kode nasional bila tersedia.
- Semua pertukaran data menggunakan koneksi terenkripsi.

---

## 11. Non-Functional Requirements

### 11.1 Kinerja

| Parameter                          | Target                             |
| ---------------------------------- | ---------------------------------- |
| Waktu muat halaman utama           | ≤ 2 detik pada jaringan normal     |
| Waktu respons pencarian stok       | ≤ 1 detik untuk 10.000 item        |
| Waktu pembuatan laporan bulanan    | ≤ 10 menit untuk seluruh fasilitas |
| Pengguna bersamaan                 | ≥ 300 pengguna aktif               |
| Transaksi per menit pada jam sibuk | ≥ 200 transaksi                    |

### 11.2 Ketersediaan dan Ketahanan

| Parameter             | Target                             |
| --------------------- | ---------------------------------- |
| Uptime layanan        | ≥ 99,5% per bulan                  |
| Waktu pemulihan (RTO) | ≤ 4 jam                            |
| Kehilangan data (RPO) | ≤ 15 menit                         |
| Pencadangan           | Harian penuh, inkremental tiap jam |
| Mode luring           | Input tertunda untuk Pustu         |

### 11.3 Keamanan

1. Autentikasi pengguna dengan kata sandi kuat dan opsi autentikasi dua faktor.
2. Otorisasi berbasis peran dan fasilitas.
3. Enkripsi data saat transit dan saat disimpan.
4. Audit log untuk seluruh aksi kritis.
5. Pembatasan sesi dan logout otomatis setelah tidak aktif.
6. Pemisahan data antar fasilitas kecuali untuk peran Dinas.

### 11.4 Usabilitas dan Aksesibilitas

1. Antarmuka responsif untuk desktop dan tablet.
2. Alur input utama tidak lebih dari lima langkah.
3. Dukungan pemindaian barcode untuk input cepat.
4. Pesan kesalahan berbahasa Indonesia yang jelas dan dapat ditindaklanjuti.
5. Kontras warna memadai dan dapat digunakan pada layar terang.

### 11.5 Pemeliharaan

1. Konfigurasi master data dapat diubah tanpa mengubah kode.
2. Log aplikasi terpusat dan mudah ditelusuri.
3. Migrasi basis data terkelola dan dapat dibalik.
4. Dokumentasi teknis diperbarui bersamaan dengan rilis.

---

## 12. Kepatuhan Regulasi

| Regulasi                            | Pokok Pengaturan                             | Kaitan Produk                    |
| ----------------------------------- | -------------------------------------------- | -------------------------------- |
| UU 44/2009 tentang Rumah Sakit      | Kedudukan dan pembinaan rumah sakit          | Model pengelolaan RSUD           |
| PP 12/2019 tentang BLUD             | Fleksibilitas pengelolaan BLUD               | Otonomi pengadaan obat umum RSUD |
| Permenkes 72/2016                   | Standar pelayanan kefarmasian di rumah sakit | Alur farmasi RSUD                |
| Permenkes 73/2016                   | Standar pelayanan kefarmasian di apotek      | Rujukan praktik dispensing       |
| Permenkes 74/2016                   | Standar pelayanan kefarmasian di Puskesmas   | Alur farmasi Puskesmas           |
| Permenkes 26/2020                   | Perubahan atas Permenkes 74/2016             | Penyesuaian standar Puskesmas    |
| Permenkes 86/2019                   | Pedoman pengelolaan obat dan BMHP            | Distribusi bertingkat            |
| Ketentuan pengadaan barang dan jasa | Mekanisme e-Katalog dan e-Purchasing         | Modul pengadaan                  |

Catatan: nomor dan judul regulasi perlu diverifikasi ulang dengan JDIH Kementerian
Kesehatan sebelum dijadikan dasar hukum formal pada dokumen kontrak.

Prinsip kepatuhan yang diterapkan:

1. Seluruh transaksi memiliki jejak audit yang dapat diperiksa.
2. Pemisahan tugas antara pemesan, penyetuju, dan penerima.
3. Penerapan FEFO pada seluruh pengeluaran barang farmasi.
4. Penyimpanan khusus untuk narkotika, psikotropika, dan produk rantai dingin.
5. Laporan mengikuti format standar yang berlaku.

---

## 13. Risks and Mitigations

| Kode | Risiko                           | Dampak | Probabilitas | Mitigasi                                   |
| ---- | -------------------------------- | ------ | ------------ | ------------------------------------------ |
| R-01 | Kualitas data awal rendah        | Tinggi | Tinggi       | Pembersihan data dan validasi bertahap     |
| R-02 | Koneksi internet tidak stabil    | Sedang | Tinggi       | Mode luring dan sinkronisasi tertunda      |
| R-03 | Resistensi pengguna              | Tinggi | Sedang       | Pelatihan, pendampingan, dan quick win     |
| R-04 | Integrasi e-Katalog terlambat    | Sedang | Sedang       | Jalur impor manual sebagai cadangan        |
| R-05 | Kebocoran data pasien            | Tinggi | Rendah       | Enkripsi, RBAC, dan audit berkala          |
| R-06 | Anggaran pengadaan tidak menentu | Tinggi | Sedang       | Prioritas ABC-VEN dan perencanaan bertahap |
| R-07 | Ketergantungan pada satu vendor  | Sedang | Rendah       | Dokumentasi dan serah terima pengetahuan   |
| R-08 | Bencana dan kehilangan data      | Tinggi | Rendah       | Pencadangan luar lokasi dan uji pemulihan  |

---

## 14. Roadmap and Phasing

### 14.1 Fase Pengembangan

| Fase   | Fokus                                          | Durasi    | Keluaran                       |
| ------ | ---------------------------------------------- | --------- | ------------------------------ |
| Fase 0 | Discovery, pembersihan data, desain arsitektur | 4 minggu  | Dokumen desain dan data bersih |
| Fase 1 | Master data, pengguna, gudang, stok dasar      | 8 minggu  | Fondasi sistem                 |
| Fase 2 | Penerimaan, penyimpanan, pengendalian          | 10 minggu | Gudang beroperasi              |
| Fase 3 | Perencanaan dan pengadaan                      | 8 minggu  | RKO dan PO terintegrasi        |
| Fase 4 | Distribusi dan pelayanan                       | 10 minggu | Alur end-to-end                |
| Fase 5 | Pelaporan, integrasi, dan penyempurnaan        | 8 minggu  | Laporan otomatis dan integrasi |
| Fase 6 | Peluncuran bertahap dan pendampingan           | 6 minggu  | Semua fasilitas aktif          |

### 14.2 Timeline

```mermaid
gantt
    title Roadmap Implementasi
    dateFormat YYYY-MM-DD
    axisFormat %b %Y
    section Fondasi
    Discovery dan desain      :a1, 2027-01-04, 28d
    Master data dan pengguna  :a2, after a1, 56d
    section Operasi Gudang
    Penerimaan dan stok       :b1, after a2, 70d
    Pengendalian persediaan   :b2, after b1, 21d
    section Rantai Pasok
    Perencanaan dan pengadaan :c1, after b2, 56d
    Distribusi                :c2, after c1, 42d
    Pelayanan                 :c3, after c2, 28d
    section Peluncuran
    Pelaporan dan integrasi   :d1, after c3, 56d
    Rollout bertahap          :d2, after d1, 42d
```

![Timeline](./diagrams/14-2-timeline.png)

### 14.3 Strategi Peluncuran

1. Pilot pada satu Puskesmas dan satu RSUD selama satu bulan.
2. Evaluasi dan perbaikan sebelum perluasan.
3. Peluncuran bergelombang per klaster wilayah.
4. Pendampingan intensif pada dua minggu pertama tiap fasilitas.

---

## 15. Appendices

### 15.1 Glosarium

| Istilah      | Definisi                                                         |
| ------------ | ---------------------------------------------------------------- |
| BMHP         | Bahan Medis Habis Pakai                                          |
| BLUD         | Badan Layanan Umum Daerah                                        |
| RKO          | Rencana Kebutuhan Obat                                           |
| ROP          | Reorder Point, titik jumlah stok untuk memesan kembali           |
| Safety Stock | Stok pengaman untuk mengantisipasi ketidakpastian                |
| Buffer Stock | Stok penyangga pada perencanaan kebutuhan                        |
| Lead Time    | Selang waktu antara pemesanan dan penerimaan barang              |
| FEFO         | First Expired First Out, keluar berdasarkan kedaluwarsa terdekat |
| FIFO         | First In First Out, keluar berdasarkan urutan masuk              |
| ABC          | Klasifikasi item berdasarkan nilai pemakaian                     |
| VEN          | Klasifikasi item berdasarkan vital, esensial, non-esensial       |
| Stockout     | Kondisi stok suatu item kosong                                   |
| Stagnant     | Kondisi stok tidak bergerak dalam periode tertentu               |
| Opname       | Kegiatan penghitungan fisik persediaan                           |
| BAST         | Berita Acara Serah Terima                                        |
| Pustu        | Puskesmas Pembantu                                               |

### 15.2 Daftar Regulasi Rujukan

1. Undang-Undang Nomor 44 Tahun 2009 tentang Rumah Sakit.
2. Peraturan Pemerintah Nomor 12 Tahun 2019 tentang Pengelolaan Keuangan Daerah.
3. Peraturan Menteri Kesehatan Nomor 72 Tahun 2016 tentang Standar Pelayanan Kefarmasian
   di Rumah Sakit.
4. Peraturan Menteri Kesehatan Nomor 73 Tahun 2016 tentang Standar Pelayanan Kefarmasian
   di Apotek.
5. Peraturan Menteri Kesehatan Nomor 74 Tahun 2016 tentang Standar Pelayanan Kefarmasian
   di Puskesmas.
6. Peraturan Menteri Kesehatan Nomor 26 Tahun 2020 tentang Perubahan atas Permenkes
   Nomor 74 Tahun 2016.
7. Ketentuan pengadaan barang dan jasa pemerintah yang berlaku, termasuk mekanisme
   e-Katalog dan e-Purchasing.

### 15.3 Contoh Format Laporan Bulanan

| Kolom        | Deskripsi                         |
| ------------ | --------------------------------- |
| Kode Obat    | Kode item pada master data        |
| Nama Obat    | Nama generik sesuai formularium   |
| Satuan       | Satuan terkecil pengeluaran       |
| Stok Awal    | Saldo awal periode                |
| Penerimaan   | Total barang masuk                |
| Pengeluaran  | Total barang keluar               |
| Penyesuaian  | Koreksi hasil opname              |
| Stok Akhir   | Saldo akhir periode               |
| Stok Minimum | Batas minimum yang ditetapkan     |
| Keterangan   | Catatan kekosongan atau kelebihan |

### 15.4 Contoh Checklist Implementasi Fasilitas

1. Master data fasilitas dan gudang terdaftar.
2. Pengguna dan peran telah dibuat serta diuji.
3. Saldo awal stok telah dimigrasikan dan diverifikasi.
4. Lokasi rak dan zona penyimpanan telah dipetakan.
5. Perangkat pemindai barcode tersedia dan teruji.
6. Petugas telah mengikuti pelatihan dan simulasi.
7. Prosedur cadangan manual tersedia saat gangguan.
8. Jadwal stock opname pertama telah ditetapkan.

### 15.5 Dokumen Terkait

| Dokumen                | Isi                                     | Status   |
| ---------------------- | --------------------------------------- | -------- |
| `docs/UI-MOCKUP.md`    | Mockup antarmuka dan alur layar         | Terpisah |
| `docs/API-CONTRACT.md` | Kontrak API dan skema integrasi         | Terpisah |
| `docs/examples/`       | Contoh tabel dan diagram sesuai standar | Tersedia |
