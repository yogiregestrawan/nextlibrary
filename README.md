# 📚 Tee's Library

Tee's Library adalah aplikasi web sederhana untuk manajemen perpustakaan digital. Aplikasi ini dibangun menggunakan **Next.js (App Router)** dan **Supabase** sebagai backend untuk autentikasi, database, dan penyimpanan file.

---

## 🚀 Fitur Utama

- ✅ Autentikasi Login & Signup menggunakan Supabase Auth
- 📚 Menambahkan, mengedit, dan menghapus data buku (CRUD)
- 📤 Upload gambar cover buku ke Supabase Storage
- 🛡️ Proteksi halaman menggunakan Middleware
- 🧾 Sistem peminjaman dan keranjang buku
- 🎨 Antarmuka pengguna modern dengan Tailwind CSS

---

## 🧱 Teknologi

- [Next.js 14 (App Router)](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [@supabase/auth-helpers-nextjs](https://supabase.com/docs/guides/auth/server-side/nextjs)

---

## 🛠️ Instalasi dan Konfigurasi

1. **Clone Repository**

```bash
git clone https://github.com/yogiregestrawan/nextlibrary.git
cd nextlibrary
```

2. **Install Dependency**

```bash
npm install
# atau
yarn install
```

3. **Buat file `.env.local`**

Isi file `.env.local` di root folder:

```env
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

> Ganti `YOUR_SUPABASE_URL` dan `YOUR_SUPABASE_ANON_KEY` dengan milikmu dari Supabase dashboard.

4. **Jalankan di Lokal**

```bash
npm run dev
# atau
yarn dev
```

---

## 🔒 Setup Supabase

### 1. Buat tabel `books`

```sql
create table books (
  id uuid primary key default uuid_generate_v4(),
  title text,
  author text,
  description text,
  price numeric,
  rating int,
  cover_url text,
  user_id uuid references auth.users(id),
  created_at timestamp with time zone default now()
);
```

### 2. Aktifkan RLS (Row Level Security)

```sql
alter table books enable row level security;
```

### 3. Tambahkan Policy

```sql
create policy "User dapat melihat data miliknya"
on books for select
using (auth.uid() = user_id);

create policy "User dapat memperbarui data miliknya"
on books for update
using (auth.uid() = user_id);

create policy "User dapat menambahkan buku"
on books for insert
with check (auth.uid() = user_id);
```

### 4. Buat Bucket Storage

- Buka Supabase > Storage > Create bucket bernama `books`
- Izinkan akses publik atau sesuaikan policy

---

## 🧪 Struktur Folder

```
app/
├── login/
│   └── page.tsx
├── signup/
│   └── page.tsx
├── books/
│   ├── page.tsx
│   ├── create/
│   │   └── page.tsx
│   ├── update/
│   │   └── page.tsx
│   ├── [id]/
│   │   └── page.tsx
├── layout.tsx
├── globals.css

components/
├── Sidebar.tsx
├── Footer.tsx
├── Navbar.tsx

lib/
├── supabaseClient.ts

middleware.ts
.env.local
```

---

## 💡 Tips Penggunaan

- Gambar buku diupload ke Supabase Storage
- Rating ditampilkan dalam bentuk bintang interaktif (★)
- Middleware proteksi otomatis mengecek session user
- Jika belum login, tidak bisa mengakses halaman `/books`

---


## 📃 Lisensi

MIT License © 2025 Tee's Library
