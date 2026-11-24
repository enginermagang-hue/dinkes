# Mockup Stok dan Mutasi

Halaman ini menggambarkan modul penyimpanan dan pengendalian sesuai PRD bagian 8.3 dan 8.6.

## Cakupan Layar

- Filter stok per lokasi, obat, dan status.
- Tabel saldo stok dengan minimum, ROP, dan status.
- Kartu stok dari tabel `mutasi_stok`.
- Daftar batch mendekati kedaluwarsa dan usulan redistribusi.

## Aktor

| Aktor           | Peran pada Layar                  |
| --------------- | --------------------------------- |
| Apoteker Gudang | Memantau saldo dan mutasi         |
| Petugas Gudang  | Menyiapkan opname dan penyesuaian |
| Auditor         | Melihat riwayat tanpa hak ubah    |

## Data Dummy

Mengikuti PRD: OBT-001 Amoksisilin, OBT-007 Salbutamol, OBT-008 Insulin Glargine,
OBT-010 Vaksin Campak, dan kartu stok Januari 2027.

## Catatan Implementasi

- Saldo berasal dari agregat `mutasi_stok`, bukan input manual.
- Status dihitung dari perbandingan saldo dengan ROP dan safety stock.
- Batch mendekati kedaluwarsa memakai urutan FEFO.

Rujukan: `docs/PRD.md` bagian 8.3 dan 8.6, serta `docs/API-CONTRACT.md` bagian 6.
