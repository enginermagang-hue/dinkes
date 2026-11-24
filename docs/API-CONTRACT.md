# Kontrak API Internal - SMSOD

| Atribut        | Nilai                          |
| -------------- | ------------------------------ |
| Versi Dokumen  | 1.0 (Draft)                    |
| Status         | Untuk direview                 |
| Pemilik Teknis | Tim Pengembangan               |
| Tanggal        | 24 November 2026               |
| PRD Rujukan    | `docs/PRD.md` versi 1.6        |
| Data Model     | `docs/DATA-MODEL.md` versi 1.1 |
| Tech Stack     | `docs/TECH-STACK.md` versi 1.2 |
| Target Pembaca | Developer, Frontend, QA        |

Dokumen ini mendefinisikan kontrak API internal yang dipakai frontend SMSOD (Blade,
Alpine.js, Axios) untuk berkomunikasi dengan backend Laravel. Integrasi ke sistem eksternal
(LKPP, SIPNAP, SIPD) dijelaskan terpisah pada `docs/INTEGRATION.md`.

---

## 1. Konvensi API

| Aspek           | Ketentuan                                                      |
| --------------- | -------------------------------------------------------------- |
| Base URL        | `/api/v1`                                                      |
| Format          | JSON, kecuali unduhan berkas                                   |
| Autentikasi     | Bearer token (Laravel Sanctum)                                 |
| Header wajib    | `Accept: application/json`, `Authorization: Bearer ...`        |
| Header opsional | `Idempotency-Key` untuk permintaan mutasi                      |
| Paginasi        | `page`, `per_page` (bawaan 20, maksimum 100)                   |
| Pengurutan      | `sort=nama`, `sort=-created_at`                                |
| Filter          | Query string, contoh `?fasilitas_id=1&status=draf`             |
| Tanggal         | `YYYY-MM-DD`                                                   |
| Waktu           | ISO 8601 dengan zona waktu, contoh `2027-01-05T09:00:00+07:00` |
| Uang            | Bilangan bulat rupiah tanpa desimal                            |
| Rate limit      | 60 permintaan per menit, login 5 per menit                     |
| Versi           | Perubahan merusak kompatibilitas naik ke `/api/v2`             |

---

## 2. Format Respons dan Galat

### 2.1 Respons Berhasil Satu Objek

```json
{
  "data": {
    "id": 1,
    "nama": "Gudang Farmasi Pusat"
  },
  "message": "Berhasil"
}
```

### 2.2 Respons Berhasil Daftar

```json
{
  "data": [
    { "id": 1, "nama": "Amoksisilin 500 mg" },
    { "id": 2, "nama": "Parasetamol 500 mg" }
  ],
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 150,
    "last_page": 8
  },
  "message": "Berhasil"
}
```

### 2.3 Respons Galat Validasi

```json
{
  "message": "Data yang dikirim tidak valid",
  "code": "VALIDATION_001",
  "errors": {
    "jumlah": ["Jumlah wajib diisi"],
    "tanggal": ["Tanggal tidak boleh melewati hari ini"]
  }
}
```

### 2.4 Kode Status HTTP

| Status | Makna                               |
| ------ | ----------------------------------- |
| 200    | Berhasil                            |
| 201    | Sumber daya dibuat                  |
| 204    | Berhasil tanpa isi                  |
| 400    | Permintaan tidak dapat diproses     |
| 401    | Belum terautentikasi                |
| 403    | Tidak memiliki akses                |
| 404    | Sumber daya tidak ditemukan         |
| 409    | Konflik keadaan, misalnya duplikasi |
| 422    | Galat validasi                      |
| 429    | Melebihi batas laju                 |
| 500    | Galat server                        |

---

## 3. Autentikasi dan Pengguna

| Metode | Endpoint                   | Akses          | Keterangan                 |
| ------ | -------------------------- | -------------- | -------------------------- |
| POST   | `/auth/login`              | Publik         | Login kata sandi           |
| POST   | `/auth/2fa/verify`         | Sementara      | Verifikasi kode 2FA        |
| POST   | `/auth/refresh`            | Terautentikasi | Perbarui token             |
| POST   | `/auth/logout`             | Terautentikasi | Cabut token                |
| GET    | `/auth/me`                 | Terautentikasi | Profil dan peran           |
| POST   | `/auth/password/forgot`    | Publik         | Kirim tautan reset         |
| POST   | `/auth/password/reset`     | Publik         | Reset kata sandi           |
| POST   | `/auth/2fa/enable`         | Terautentikasi | Aktifkan 2FA               |
| POST   | `/auth/2fa/disable`        | Terautentikasi | Nonaktifkan 2FA            |
| GET    | `/auth/google/redirect`    | Terautentikasi | Mulai tautkan Google       |
| POST   | `/auth/google/link`        | Terautentikasi | Simpan tautan akun Google  |
| DELETE | `/auth/google/link`        | Terautentikasi | Lepas tautan Google        |
| GET    | `/google-whitelist`        | Admin Dinas    | Daftar email diizinkan     |
| POST   | `/google-whitelist`        | Admin Dinas    | Tambah email ke whitelist  |
| DELETE | `/google-whitelist/{id}`   | Admin Dinas    | Hapus email dari whitelist |
| GET    | `/pengguna`                | Admin Dinas    | Daftar pengguna            |
| POST   | `/pengguna`                | Admin Dinas    | Buat pengguna              |
| PUT    | `/pengguna/{id}`           | Admin Dinas    | Ubah pengguna              |
| PUT    | `/pengguna/{id}/peran`     | Admin Dinas    | Atur peran                 |
| PUT    | `/pengguna/{id}/fasilitas` | Admin Dinas    | Atur penugasan fasilitas   |

### 3.1 Contoh Login

```json
{
  "username": "ratna.apoteker",
  "password": "KataSandiKuat123!"
}
```

```json
{
  "data": {
    "token": "1|abcdefghijklmnop",
    "token_type": "Bearer",
    "expires_in": 28800,
    "pengguna": {
      "id": 12,
      "nama": "Ratna",
      "peran": ["APOTEKER_GUDANG"],
      "fasilitas": [1]
    }
  },
  "message": "Login berhasil"
}
```

Bila 2FA aktif, respons berisi `two_factor_required: true` dan `challenge_token` tanpa
token akses. Token akses baru diterbitkan setelah `/auth/2fa/verify` berhasil.

---

## 4. Fasilitas dan Lokasi Penyimpanan

| Metode | Endpoint                   | Akses       | Keterangan                    |
| ------ | -------------------------- | ----------- | ----------------------------- |
| GET    | `/fasilitas`               | Semua       | Daftar fasilitas sesuai akses |
| GET    | `/fasilitas/{id}`          | Semua       | Detail fasilitas              |
| POST   | `/fasilitas`               | Admin Dinas | Buat fasilitas                |
| PUT    | `/fasilitas/{id}`          | Admin Dinas | Ubah fasilitas                |
| GET    | `/fasilitas/{id}/lokasi`   | Semua       | Lokasi penyimpanan fasilitas  |
| GET    | `/lokasi-penyimpanan`      | Semua       | Daftar lokasi                 |
| POST   | `/lokasi-penyimpanan`      | Admin Dinas | Buat lokasi                   |
| PUT    | `/lokasi-penyimpanan/{id}` | Admin Dinas | Ubah lokasi                   |

```json
{
  "data": {
    "id": 3,
    "kode": "PKM-001",
    "nama": "Puskesmas A",
    "jenis": "puskesmas",
    "status": "aktif",
    "lokasi": [{ "id": 7, "nama": "Ruang Obat Puskesmas A", "jenis": "ruang_obat" }]
  },
  "message": "Berhasil"
}
```

---

## 5. Master Data

| Metode | Endpoint                 | Akses        | Keterangan             |
| ------ | ------------------------ | ------------ | ---------------------- |
| GET    | `/satuan`                | Semua        | Daftar satuan          |
| GET    | `/kategori-obat`         | Semua        | Daftar kategori        |
| GET    | `/diagnosa`              | Semua        | Pencarian kode ICD-10  |
| GET    | `/supplier`              | Semua        | Daftar penyedia        |
| POST   | `/supplier`              | Gudang Dinas | Tambah penyedia        |
| PUT    | `/supplier/{id}`         | Gudang Dinas | Ubah penyedia          |
| GET    | `/formularium`           | Semua        | Daftar formularium     |
| GET    | `/formularium/{id}/item` | Semua        | Item dalam formularium |
| GET    | `/obat`                  | Semua        | Pencarian dan filter   |
| GET    | `/obat/{id}`             | Semua        | Detail obat            |
| POST   | `/obat`                  | Gudang Dinas | Tambah obat            |
| PUT    | `/obat/{id}`             | Gudang Dinas | Ubah obat              |
| GET    | `/obat/{id}/harga`       | Semua        | Riwayat harga          |
| POST   | `/obat/{id}/harga`       | Gudang Dinas | Tambah harga berlaku   |

Parameter pencarian obat: `?q=amoksisilin&golongan=keras&kategori_obat_id=2&aktif=true`.

```json
{
  "data": {
    "id": 15,
    "kode": "OBT-001",
    "nama_generik": "Amoksisilin 500 mg",
    "nama_merek": null,
    "bentuk_sediaan": "Tablet",
    "kekuatan": "500 mg",
    "golongan": "keras",
    "satuan": { "id": 1, "nama": "Tablet" },
    "konversi_kemasan": 10,
    "satuan_kemasan": "Strip",
    "lead_time_hari": 7,
    "aktif": true
  },
  "message": "Berhasil"
}
```

---

## 6. Stok, Batch, dan Mutasi Stok

| Metode | Endpoint                  | Akses        | Keterangan                       |
| ------ | ------------------------- | ------------ | -------------------------------- |
| GET    | `/stok`                   | Semua        | Saldo per lokasi dan obat        |
| GET    | `/stok/{id}`              | Semua        | Detail saldo dan batch           |
| GET    | `/stok/peringatan`        | Semua        | Stok di bawah minimum atau ROP   |
| POST   | `/stok/penyesuaian`       | Gudang Dinas | Penyesuaian manual dengan alasan |
| GET    | `/batch`                  | Semua        | Daftar batch dan kedaluwarsa     |
| GET    | `/mutasi-stok`            | Semua        | Buku besar mutasi                |
| GET    | `/mutasi-stok/kartu-stok` | Semua        | Kartu stok per item per lokasi   |

Parameter mutasi: `?lokasi_penyimpanan_id=1&obat_id=15&dari=2027-01-01&sampai=2027-01-31`.

```json
{
  "data": [
    {
      "id": 9001,
      "tanggal": "2027-01-05T09:00:00+07:00",
      "jenis": "masuk",
      "sumber": "penerimaan",
      "sumber_id": 12,
      "jumlah": 5000,
      "saldo_sebelum": 0,
      "saldo_sesudah": 5000,
      "batch": { "nomor_batch": "AMX2401", "tanggal_expired": "2028-12-31" },
      "dicatat_oleh": { "id": 12, "nama": "Ratna" }
    }
  ],
  "meta": { "page": 1, "per_page": 20, "total": 1, "last_page": 1 },
  "message": "Berhasil"
}
```

Penyesuaian manual:

```json
{
  "lokasi_penyimpanan_id": 1,
  "obat_id": 15,
  "batch_id": 88,
  "jenis": "penyesuaian_turun",
  "jumlah": -40,
  "alasan": "Kemasan rusak saat penyimpanan"
}
```

---

## 7. Pengadaan

| Metode | Endpoint                       | Akses           | Keterangan        |
| ------ | ------------------------------ | --------------- | ----------------- |
| GET    | `/kontrak`                     | Gudang Dinas    | Daftar kontrak    |
| POST   | `/kontrak`                     | Gudang Dinas    | Buat kontrak      |
| GET    | `/kontrak/{id}`                | Gudang Dinas    | Detail kontrak    |
| PUT    | `/kontrak/{id}`                | Gudang Dinas    | Ubah kontrak      |
| GET    | `/purchase-order`              | Gudang Dinas    | Daftar PO         |
| POST   | `/purchase-order`              | Pejabat         | Buat PO           |
| GET    | `/purchase-order/{id}`         | Gudang Dinas    | Detail PO         |
| POST   | `/purchase-order/{id}/setujui` | Kepala Bidang   | Setujui PO        |
| POST   | `/purchase-order/{id}/batal`   | Kepala Bidang   | Batalkan PO       |
| GET    | `/penerimaan`                  | Gudang Dinas    | Daftar penerimaan |
| POST   | `/penerimaan`                  | Petugas Gudang  | Catat penerimaan  |
| GET    | `/penerimaan/{id}`             | Gudang Dinas    | Detail penerimaan |
| POST   | `/penerimaan/{id}/verifikasi`  | Apoteker Gudang | Verifikasi mutu   |
| POST   | `/penerimaan/{id}/selesai`     | Apoteker Gudang | Tutup penerimaan  |

```json
{
  "purchase_order_id": 44,
  "lokasi_penyimpanan_id": 1,
  "tanggal": "2027-01-05",
  "nomor_surat_jalan": "SJ/2027/0012",
  "items": [
    {
      "po_item_id": 101,
      "obat_id": 15,
      "jumlah": 5000,
      "nomor_batch": "AMX2401",
      "tanggal_expired": "2028-12-31",
      "harga_satuan": 1200
    }
  ]
}
```

Penerimaan yang berhasil menambah `stok.jumlah`, membuat `batch`, dan menulis `mutasi_stok`
dalam satu transaksi basis data.

---

## 8. Distribusi

| Metode | Endpoint                   | Akses          | Keterangan                  |
| ------ | -------------------------- | -------------- | --------------------------- |
| GET    | `/permintaan`              | Semua          | Daftar permintaan           |
| POST   | `/permintaan`              | Puskesmas      | Buat permintaan             |
| GET    | `/permintaan/{id}`         | Semua          | Detail permintaan           |
| POST   | `/permintaan/{id}/ajukan`  | Puskesmas      | Ajukan ke Dinas             |
| POST   | `/permintaan/{id}/setujui` | Gudang Dinas   | Setujui sebagian atau penuh |
| POST   | `/permintaan/{id}/tolak`   | Gudang Dinas   | Tolak dengan alasan         |
| GET    | `/pengiriman`              | Semua          | Daftar pengiriman           |
| POST   | `/pengiriman`              | Gudang Dinas   | Buat pengiriman             |
| GET    | `/pengiriman/{id}`         | Semua          | Detail pengiriman           |
| POST   | `/pengiriman/{id}/kirim`   | Petugas Gudang | Tandai dikirim              |
| POST   | `/pengiriman/{id}/terima`  | Puskesmas      | Konfirmasi penerimaan       |

```json
{
  "permintaan_id": 31,
  "lokasi_asal_id": 1,
  "fasilitas_tujuan_id": 3,
  "tanggal_kirim": "2027-02-10",
  "kurir": "Budi",
  "nomor_resi": "DO-2027-0031",
  "items": [{ "obat_id": 15, "batch_id": 88, "jumlah": 1200 }]
}
```

---

## 9. LPLPO

| Metode | Endpoint                          | Akses         | Keterangan                   |
| ------ | --------------------------------- | ------------- | ---------------------------- |
| GET    | `/lplpo`                          | Semua         | Daftar LPLPO                 |
| POST   | `/lplpo`                          | Puskesmas     | Buat LPLPO periode baru      |
| GET    | `/lplpo/{id}`                     | Semua         | Detail LPLPO dan item        |
| PUT    | `/lplpo/{id}`                     | Puskesmas     | Ubah LPLPO berstatus draf    |
| POST   | `/lplpo/{id}/ajukan`              | Puskesmas     | Ajukan ke Dinas              |
| POST   | `/lplpo/{id}/verifikasi`          | Gudang Dinas  | Tetapkan jumlah usul         |
| POST   | `/lplpo/{id}/setujui`             | Kepala Bidang | Setujui LPLPO                |
| POST   | `/lplpo/{id}/kembalikan`          | Gudang Dinas  | Kembalikan untuk revisi      |
| POST   | `/lplpo/{id}/generate-permintaan` | Gudang Dinas  | Bentuk permintaan distribusi |
| GET    | `/lplpo/{id}/pdf`                 | Semua         | Unduh LPLPO resmi            |

```json
{
  "fasilitas_id": 3,
  "periode": "2027-01-01",
  "items": [
    {
      "obat_id": 15,
      "jumlah_minta": 400,
      "catatan": "Kebutuhan triwulan"
    }
  ]
}
```

Saat dibuat, sistem mengisi `stok_awal`, `stok_akhir`, dan `jumlah_pakai` dari agregat
`mutasi_stok`. Nilai tersebut tidak dapat diubah manual kecuali oleh peran Dinas.

---

## 10. Perencanaan (RKO)

| Metode | Endpoint            | Akses         | Keterangan                    |
| ------ | ------------------- | ------------- | ----------------------------- |
| GET    | `/rko`              | Semua         | Daftar RKO                    |
| POST   | `/rko`              | Apoteker      | Buat RKO                      |
| GET    | `/rko/{id}`         | Semua         | Detail RKO dan item           |
| PUT    | `/rko/{id}`         | Apoteker      | Ubah RKO berstatus draf       |
| POST   | `/rko/{id}/hitung`  | Apoteker      | Hitung kebutuhan otomatis     |
| POST   | `/rko/{id}/ajukan`  | Apoteker      | Ajukan RKO                    |
| POST   | `/rko/{id}/setujui` | Kepala Bidang | Setujui RKO                   |
| GET    | `/rko/konsolidasi`  | Kepala Bidang | Konsolidasi seluruh fasilitas |

```json
{
  "data": {
    "id": 9,
    "nomor": "RKO/PKM-A/2027-Q1",
    "periode": "2027-01-01",
    "status": "diajukan",
    "versi": 1,
    "items": [
      {
        "obat_id": 15,
        "pemakaian_periode": 3600,
        "sisa_stok": 400,
        "buffer": 300,
        "kebutuhan": 3500
      }
    ]
  },
  "message": "Berhasil"
}
```

---

## 11. Pelayanan

| Metode | Endpoint                    | Akses    | Keterangan                     |
| ------ | --------------------------- | -------- | ------------------------------ |
| GET    | `/penggunaan`               | Semua    | Daftar catatan pelayanan       |
| POST   | `/penggunaan`               | Apoteker | Buat catatan pelayanan         |
| GET    | `/penggunaan/{id}`          | Semua    | Detail dan item                |
| POST   | `/penggunaan/{id}/serahkan` | Apoteker | Serahkan obat dan kurangi stok |

```json
{
  "fasilitas_id": 3,
  "tanggal": "2027-01-15",
  "jenis_layanan": "rawat_jalan",
  "diagnosa_id": 456,
  "pasien_ref": "PSN-2027-000123",
  "items": [
    {
      "obat_id": 15,
      "batch_id": 88,
      "jumlah": 10,
      "dosis": "3 x 1 tablet"
    }
  ]
}
```

Penyerahan obat gagal dengan `STOK_001` bila saldo tidak mencukupi. Permintaan tidak boleh
membuat stok bernilai negatif.

---

## 12. Pengendalian

| Metode | Endpoint                              | Akses          | Keterangan                   |
| ------ | ------------------------------------- | -------------- | ---------------------------- |
| GET    | `/opname`                             | Semua          | Daftar sesi opname           |
| POST   | `/opname`                             | Petugas Gudang | Mulai sesi opname            |
| GET    | `/opname/{id}`                        | Semua          | Detail dan item opname       |
| POST   | `/opname/{id}/item`                   | Petugas Gudang | Input hasil hitung fisik     |
| POST   | `/opname/{id}/selesai`                | Apoteker       | Tutup dan sesuaikan stok     |
| GET    | `/peringatan-dini`                    | Semua          | Daftar peringatan aktif      |
| POST   | `/peringatan-dini/{id}/tindak-lanjut` | Apoteker       | Tandai sudah ditindaklanjuti |

```json
{
  "lokasi_penyimpanan_id": 1,
  "tanggal": "2027-01-31",
  "items": [
    {
      "obat_id": 15,
      "batch_id": 88,
      "stok_fisik": 4350,
      "keterangan": "Selisih hitung"
    }
  ]
}
```

Saat sesi ditutup, selisih dicatat sebagai mutasi `penyesuaian_naik` atau
`penyesuaian_turun` dan `stok.jumlah` disesuaikan.

---

## 13. Anggaran

| Metode | Endpoint              | Akses            | Keterangan                     |
| ------ | --------------------- | ---------------- | ------------------------------ |
| GET    | `/pagu-anggaran`      | Semua            | Daftar pagu per fasilitas      |
| POST   | `/pagu-anggaran`      | Kepala Dinas     | Tetapkan pagu                  |
| GET    | `/pagu-anggaran/{id}` | Semua            | Detail pagu dan serapan        |
| PUT    | `/pagu-anggaran/{id}` | Kepala Dinas     | Ubah pagu                      |
| GET    | `/mutasi-anggaran`    | Semua            | Riwayat komitmen dan realisasi |
| POST   | `/mutasi-anggaran`    | Pejabat Keuangan | Catat mutasi anggaran          |
| GET    | `/anggaran/realisasi` | Semua            | Rekap realisasi per periode    |

```json
{
  "data": {
    "fasilitas": { "id": 3, "nama": "Puskesmas A" },
    "periode": 2027,
    "sumber_dana": "apbd",
    "pagu": 150000000,
    "komitmen": 12000000,
    "realisasi": 87500000,
    "sisa": 50500000,
    "serapan": 58.33
  },
  "message": "Berhasil"
}
```

---

## 14. Prediksi

| Metode | Endpoint               | Akses         | Keterangan                   |
| ------ | ---------------------- | ------------- | ---------------------------- |
| GET    | `/prediksi`            | Semua         | Hasil prediksi per item      |
| GET    | `/prediksi/peringatan` | Semua         | Peringatan risiko kekosongan |
| GET    | `/prediksi/akurasi`    | Kepala Bidang | Akurasi model per periode    |
| POST   | `/prediksi/jalankan`   | Kepala Bidang | Picu perhitungan (asinkron)  |

```json
{
  "data": [
    {
      "obat": { "id": 15, "nama_generik": "Amoksisilin 500 mg" },
      "fasilitas": { "id": 3, "nama": "Puskesmas A" },
      "periode_prediksi": "2027-03-01",
      "prediksi_jumlah": 4200,
      "confidence": 85.0,
      "metode": "exponential_smoothing",
      "faktor_pendorong": "Tren naik dan musim hujan"
    }
  ],
  "meta": { "page": 1, "per_page": 20, "total": 1, "last_page": 1 },
  "message": "Berhasil"
}
```

`POST /prediksi/jalankan` mengembalikan `202 Accepted` dengan `job_id`. Hasil tersedia
setelah event `PrediksiSelesai` dikirim.

---

## 15. Laporan dan Ekspor

| Metode | Endpoint                  | Akses    | Keterangan                         |
| ------ | ------------------------- | -------- | ---------------------------------- |
| GET    | `/laporan/stok`           | Semua    | Rekap stok per lokasi              |
| GET    | `/laporan/mutasi`         | Semua    | Rekap mutasi per periode           |
| GET    | `/laporan/ketersediaan`   | Semua    | Availability rate per fasilitas    |
| GET    | `/laporan/kedaluwarsa`    | Semua    | Daftar batch mendekati kedaluwarsa |
| GET    | `/laporan/sipnap`         | Operator | Unduh CSV format SIPNAP            |
| GET    | `/laporan/sipd`           | Operator | Unduh Excel format SIPD            |
| GET    | `/laporan/lplpo/{id}/pdf` | Semua    | Unduh LPLPO resmi                  |

Endpoint unduhan mengembalikan `Content-Disposition: attachment` dengan tipe berkas yang
sesuai. Contoh respons galat bila periode belum tersedia:

```json
{
  "message": "Data periode belum lengkap",
  "code": "LAPORAN_001"
}
```

---

## 16. WebSocket dan Event

Kanal Reverb bersifat privat dan diautorisasi per pengguna atau per fasilitas.

| Nama Event          | Kanal            | Payload Inti                                  |
| ------------------- | ---------------- | --------------------------------------------- |
| `StokKritis`        | `fasilitas.{id}` | `obat_id`, `nama_obat`, `jumlah`, `lokasi_id` |
| `PeringatanBaru`    | `fasilitas.{id}` | `tingkat`, `estimasi_hari`, `rekomendasi`     |
| `PenerimaanSelesai` | `fasilitas.{id}` | `penerimaan_id`, `nomor`, `jumlah_item`       |
| `LplpoDiajukan`     | `pengguna.{id}`  | `lplpo_id`, `fasilitas`, `periode`            |
| `PrediksiSelesai`   | `pengguna.{id}`  | `job_id`, `jumlah_item`, `selesai_at`         |

```json
{
  "event": "StokKritis",
  "channel": "private-fasilitas.3",
  "data": {
    "obat_id": 15,
    "nama_obat": "Amoksisilin 500 mg",
    "jumlah": 120,
    "lokasi_id": 7
  }
}
```

---

## 17. Daftar Kode Galat

| Kode             | Status | Makna                                        |
| ---------------- | ------ | -------------------------------------------- |
| `AUTH_001`       | 401    | Kredensial tidak valid                       |
| `AUTH_002`       | 401    | Verifikasi 2FA diperlukan                    |
| `AUTH_003`       | 423    | Akun terkunci sementara                      |
| `AUTH_004`       | 403    | Tidak berhak atas fasilitas ini              |
| `VALIDATION_001` | 422    | Galat validasi masukan                       |
| `STOK_001`       | 409    | Stok tidak mencukupi                         |
| `STOK_002`       | 409    | Batch kedaluwarsa tidak boleh dipakai        |
| `STOK_003`       | 409    | Mutasi akan membuat saldo negatif            |
| `BATCH_001`      | 409    | Nomor batch duplikat pada item yang sama     |
| `LPLPO_001`      | 409    | LPLPO periode tersebut sudah ada             |
| `LPLPO_002`      | 409    | LPLPO sudah disetujui dan tidak dapat diubah |
| `RKO_001`        | 409    | Periode RKO tidak valid                      |
| `ANGGARAN_001`   | 409    | Sisa pagu tidak mencukupi                    |
| `ANGGARAN_002`   | 409    | Periode anggaran sudah ditutup               |
| `OPNAME_001`     | 409    | Sesi opname masih berjalan                   |
| `PREDIKSI_001`   | 422    | Data historis kurang dari 12 bulan           |
| `LAPORAN_001`    | 422    | Data periode belum lengkap                   |
| `RATE_001`       | 429    | Melebihi batas laju permintaan               |
| `SERVER_001`     | 500    | Galat tak terduga pada server                |

---

## 18. Dokumen Terkait

| Dokumen               | Isi                                   | Status   |
| --------------------- | ------------------------------------- | -------- |
| `docs/PRD.md`         | Kebutuhan produk dan fungsional       | Tersedia |
| `docs/DATA-MODEL.md`  | Skema basis data dan kamus kolom      | Tersedia |
| `docs/INTEGRATION.md` | Integrasi sistem eksternal            | Tersedia |
| `docs/TECH-STACK.md`  | Tech stack dan arsitektur teknis      | Tersedia |
| `docs/mockup/`        | Mockup antarmuka dan katalog komponen | Tersedia |
