# Rak Buku

Website katalog buku pribadi dengan status baca, catatan, rating, cover buku, dan arsitektur siap integrasi Firebase + Cloudinary.

## Stack

- Vite + React
- Firebase Auth + Firestore
- Cloudinary unsigned upload preset
- CSS modular per folder `src/styles`

## Menjalankan

```bash
npm install
npm run dev
```

Salin `.env.example` menjadi `.env`, lalu isi konfigurasi Firebase dan Cloudinary.

## Struktur

```text
src/
  components/
  data/
  lib/
  pages/
  styles/
```

## Catatan Integrasi

- Data buku disiapkan di Firestore collection `books`.
- Cover buku di-upload ke Cloudinary menggunakan unsigned upload preset.
- Website publik dapat melihat daftar dan detail buku.
- Form tambah/edit hanya muncul untuk akun yang email-nya sama dengan `VITE_ADMIN_EMAIL`.
- Ganti `ISI_EMAIL_ADMIN_KAMU` di `firestore.rules` sebelum deploy rules Firebase.
