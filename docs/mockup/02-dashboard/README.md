# Mockup Dashboard

Halaman ini menggambarkan dashboard pimpinan sesuai PRD bagian 8.7.

## Cakupan Layar

- Empat kartu KPI: availability, stockout, nilai inventori, peringatan aktif.
- Pemenuhan permintaan (order fulfillment) bulan berjalan.
- Serapan anggaran per fasilitas.
- Peringatan kritis stok dan kedaluwarsa.
- Peringkat ketersediaan fasilitas.

## Aktor

| Aktor                 | Peran pada Layar                 |
| --------------------- | -------------------------------- |
| Kepala Dinas          | Melihat seluruh fasilitas        |
| Kepala Bidang Farmasi | Memantau KPI dan menindaklanjuti |
| Auditor               | Melihat tanpa hak ubah           |

## Data Dummy

Mengikuti contoh PRD: Puskesmas A sampai D dan RSUD, availability 85 sampai 95 persen.

## Catatan Implementasi

- Angka dihitung dari agregat `mutasi_stok` dan `stok`.
- Peringatan berasal dari modul pengendalian dan prediksi.
- Semua kartu dapat ditelusuri ke halaman detail.

Rujukan: `docs/PRD.md` bagian 8.7 dan `docs/API-CONTRACT.md` bagian 15.
