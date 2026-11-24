# Mockup Login dan Pengguna

Halaman ini menggambarkan autentikasi sesuai PRD bagian 8.9.

## Cakupan Layar

- Login dengan nama pengguna dan kata sandi.
- Verifikasi 2FA untuk peran yang mewajibkan.
- Login dengan Google untuk peran non-administrator yang sudah masuk whitelist.
- Tautan lupa kata sandi.

## Aktor

| Aktor         | Peran pada Layar                    |
| ------------- | ----------------------------------- |
| Pengguna      | Memasukkan kredensial dan kode 2FA  |
| Administrator | Mengelola akun dan whitelist Google |

## Data Dummy

- Pengguna contoh: `ratna.apoteker`, peran `APOTEKER_GUDANG`.
- Contoh peringatan whitelist Google ditampilkan pada tab Google.

## Catatan Implementasi

- Kata sandi minimal 12 karakter, kedaluwarsa setiap 90 hari.
- Akun terkunci sementara setelah lima percobaan gagal.
- 2FA wajib untuk administrator, kepala dinas, dan kepala bidang.
- Tautan Google harus dikaitkan manual setelah login kata sandi.

Rujukan: `docs/PRD.md` bagian 8.9 dan `docs/API-CONTRACT.md` bagian 3.
