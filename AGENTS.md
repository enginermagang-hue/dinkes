# Project Instructions — dinkes

## Ringkasan Project

Project `dinkes` menggunakan sistem formatting Markdown terpusat untuk memastikan
semua file `.md` (dokumentasi, tabel, diagram) ditulis secara konsisten dan rapi,
baik oleh manusia maupun oleh AI agent.

## Markdown Conventions (Wajib Diikuti)

Saat menulis atau mengedit file `.md` di project ini, ikuti aturan berikut:

### Format Umum

- Gunakan **ATX heading** (`#`, `##`, `###`) — jangan gunakan setext/underline style.
- Gunakan **fenced code block** dengan backtick (` ``` `), selalu sertakan
  language tag (mis. `markdown`, `mermaid`, `js`, `json`, `bash`).
- Gunakan **dash (`-`)** untuk unordered list, bukan asterisk (`*`) atau plus (`+`).
- Gunakan **angka berurutan** (`1.`, `2.`, `3.`) untuk ordered list.
- Gunakan `---` untuk horizontal rule.
- Batasi panjang baris maksimal **100 karakter**, kecuali pada tabel dan code block.
- Akhiri setiap file dengan **satu baris kosong** (final newline).
- Hindari HTML inline — kecuali `<br>`, `<details>`, dan `<summary>` yang diizinkan.

### Tabel

- Tabel **harus rata** (pipe-aligned) agar mudah dibaca di source dan saat di-render.
- Gunakan format Prettier-compatible dengan alignment marker (`:---`, `:---:`, `---:`).
- Contoh tabel yang benar ada di `docs/examples/tables.md`.

### Diagram/Bagan

- **Semua diagram wajib menggunakan Mermaid** (bukan PlantUML, Graphviz, atau ASCII art).
- Jenis yang didukung: flowchart, sequenceDiagram, classDiagram, gantt, erDiagram,
  pie, stateDiagram, dan lainnya yang didukung Mermaid.
- Setiap diagram ditaruh di dalam fenced code block dengan tag `mermaid`.
- Contoh diagram yang benar ada di `docs/examples/diagrams.md`.

### Gambar Tertanam (Opsi B)

Diagram Mermaid dirender otomatis di GitHub/VS Code, tetapi **juga** harus di-export
ke PNG agar bisa dibaca di editor biasa, PDF, email, dan dokumen non-teknis.

Workflow saat menulis diagram:

1. Tulis blok Mermaid di file `.md`.
2. Jalankan `npm run mermaid:export`.
3. Script akan membuat PNG di folder `diagrams/` di sebelah file `.md`, dengan nama
   otomatis dari heading terdekat (misal `## Flowchart` → `diagrams/flowchart.png`).
   Jika heading sama muncul lebih dari sekali, diberi suffix `-2`, `-3`, dst.
4. Tempel PNG tepat setelah blok Mermaid dengan sintaks:
   `![Deskripsi](./diagrams/nama.png)`.
5. Commit file `.md` **dan** PNG ke repo agar selalu sinkron.

Aturan penamaan PNG:

- Gunakan huruf kecil dan dash (kebab-case), hasil slugify otomatis dari heading.
- Contoh: `## Sequence Diagram` → `diagrams/sequence-diagram.png`.
- Jika diagram diubah, jalankan ulang `npm run mermaid:export` agar PNG diperbarui.

### Workflow Diagram Otomatis

Ada dua mekanisme otomatis yang menjaga PNG tetap sinkron dengan blok Mermaid:

**1. Watcher real-time (saat development):**

- Jalankan `npm run mermaid:watch` di terminal terpisah.
- Saat file `.md` berubah, watcher menunggu 500 ms (debounce) lalu mengekspor ulang
  hanya blok Mermaid yang berubah.
- Cache hash di `.cache/mermaid-hashes.json` dipakai untuk melewati diagram yang tidak
  berubah. File cache ini tidak di-commit.
- Log terminal menampilkan diagram mana yang diperbarui atau dilewati.

**2. Pre-commit hook (saat commit):**

- Setiap `git commit` otomatis menjalankan `npm run mermaid:export`.
- PNG yang berubah otomatis di-`git add` sebelum commit dilanjutkan.
- Ini menjamin commit selalu berisi PNG yang sesuai dengan sumber Mermaid.

**Rekomendasi:** Nyalakan watcher saat aktif menulis atau mengubah diagram, lalu
bergantung pada pre-commit hook sebagai jaring pengaman saat commit.

## Referensi Konfigurasi

Sebelum mengedit file Markdown, baca dan ikuti file konfigurasi berikut:

- `.prettierrc` — aturan formatting otomatis (printWidth, proseWrap, dll).
- `.markdownlint.json` — aturan linting (40+ rule konsistensi).
- `.prettierignore` — file yang dikecualikan dari formatting.
- `.markdownlintignore` — file yang dikecualikan dari linting.
- `docs/examples/tables.md` — contoh tabel yang sudah sesuai standar.
- `docs/examples/diagrams.md` — contoh diagram Mermaid yang sudah sesuai standar.

## Workflow Verifikasi (Wajib)

Setelah selesai menulis atau mengedit file `.md`, jalankan:

```bash
npm run md:check
```

Perintah ini menjalankan `prettier --check` dan `markdownlint` sekaligus.
**Pastikan semua check lolos (hijau) sebelum menyelesaikan tugas.**

Jika ada error formatting atau linting, jalankan:

```bash
npm run md:fix
```

Perintah ini akan:

1. Memformat ulang semua file `.md` dengan Prettier (termasuk merapikan tabel).
2. Memperbaiki error linting yang bisa diperbaiki otomatis dengan markdownlint.

Kemudian jalankan `npm run md:check` lagi untuk memastikan hasilnya bersih.

## Command Reference

| Command                      | Fungsi                                                 |
| ---------------------------- | ------------------------------------------------------ |
| `npm run format`             | Format semua `.md` dengan Prettier                     |
| `npm run format:check`       | Cek format tanpa mengubah file                         |
| `npm run lint`               | Jalankan markdownlint pada semua `.md`                 |
| `npm run lint:fix`           | Fix error linting otomatis                             |
| `npm run md:check`           | Cek format + lint (digunakan di CI)                    |
| `npm run md:fix`             | Format + fix lint sekaligus                            |
| `npm run md:format`          | Jalankan automation script (`scripts/format-md.js`)    |
| `npm run mermaid:export`     | Export semua blok Mermaid ke PNG di folder `diagrams/` |
| `npm run mermaid:watch`      | Watcher real-time: update PNG saat `.md` berubah       |
| `npm run mermaid:export:all` | Export PNG + format + verifikasi                       |

## Larangan

- Jangan mengedit file di dalam `node_modules/`, `dist/`, atau `build/`.
- Jangan menulis diagram menggunakan selain sintaks Mermaid.
- Jangan mengabaikan error dari `npm run md:check` — selalu perbaiki sebelum selesai.
- Jangan membuat file `.md` tanpa final newline.
