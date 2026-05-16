# Panduan Migrasi ke Supabase Mandiri & Hosting Vercel

Aplikasi **BakulAmbulance.com** saat ini dibangun menggunakan framework **TanStack Start** dengan integrasi database **Supabase**. Dokumen ini dirancang khusus untuk memandu Anda melakukan penyiapan database mandiri dan men-deploy aplikasi secara terpisah di akun **Vercel** Anda sendiri, melepaskan ketergantungan dari *cloud environment* Lovable.dev.

---

## Bagian 1: Penyiapan Supabase Mandiri

### Langkah 1: Buat Proyek Baru
1. Buka [Dasbor Supabase](https://supabase.com/dashboard) dan masuk atau buat akun baru.
2. Klik tombol **New Project**, pilih organisasi Anda, lalu tentukan nama proyek (misal: `bakulambulance-db`) dan kata sandi database yang kuat. Pilih region terdekat (misal: Singapore).
3. Tunggu beberapa menit hingga proyek selesai disiapkan.

### Langkah 2: Eksekusi Skrip SQL Skema & RLS
Di dasbor Supabase Anda, arahkan ke menu **SQL Editor** di bilah sisi kiri, lalu klik **New Query**.

Salin dan tempel kode SQL gabungan di bawah ini yang mencakup seluruh pembuatan tabel, pengaktifan *Row Level Security* (RLS), kebijakan otorisasi, serta penyiapan *storage bucket* untuk gambar CMS:

```sql
-- 1. PEMBUATAN TABEL UTAMA
CREATE TABLE public.specifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.galleries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  thumbnail_url TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. MENGAKTIFKAN RLS (ROW LEVEL SECURITY)
ALTER TABLE public.specifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- 3. KEBIJAKAN AKSES BACA PUBLIK (Untuk Pengunjung Situs)
CREATE POLICY "Public can read specifications" ON public.specifications FOR SELECT USING (true);
CREATE POLICY "Public can read galleries" ON public.galleries FOR SELECT USING (true);
CREATE POLICY "Public can read articles" ON public.articles FOR SELECT USING (true);

-- 4. KEBIJAKAN AKSES TULIS (Khusus Pengguna Terautentikasi / Admin CMS)
CREATE POLICY "Authenticated can insert specifications" ON public.specifications FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update specifications" ON public.specifications FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated can delete specifications" ON public.specifications FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated can insert galleries" ON public.galleries FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update galleries" ON public.galleries FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated can delete galleries" ON public.galleries FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated can insert articles" ON public.articles FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update articles" ON public.articles FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated can delete articles" ON public.articles FOR DELETE TO authenticated USING (true);

-- 5. PEMBUATAN STORAGE BUCKET & KEBIJAKANNYA (Untuk Unggahan Gambar CMS)
INSERT INTO storage.buckets (id, name, public) VALUES ('cms-images', 'cms-images', true);

CREATE POLICY "Public can view cms-images" ON storage.objects FOR SELECT USING (bucket_id = 'cms-images');
CREATE POLICY "Authenticated can upload cms-images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'cms-images');
CREATE POLICY "Authenticated can update cms-images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'cms-images');
CREATE POLICY "Authenticated can delete cms-images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'cms-images');
```

Klik tombol **Run** (atau tekan `Cmd/Ctrl + Enter`) untuk mengeksekusi skrip. Pastikan tidak ada pesan *error* yang muncul di log bawah.

### Langkah 3: Ambil Kredensial API
1. Di bilah sisi kiri dasbor Supabase, buka menu **Project Settings** (ikon roda gigi).
2. Pilih tab **API**.
3. Di bagian **Project URL**, salin URL Anda (contoh: `https://abcdefghijkl.supabase.co`).
4. Di bagian **Project API Keys**, salin kunci **`anon` / `public`**.

---

## Bagian 2: Pengujian & Konfigurasi Lokal

Untuk menguji koneksi database baru Anda secara lokal sebelum men-deploy:

1. Buka berkas `.env` di komputer Anda.
2. Ganti isinya dengan kredensial dari Langkah 3 di atas:

```env
SUPABASE_URL="https://<PROJECT_ID>.supabase.co"
SUPABASE_PUBLISHABLE_KEY="<YOUR_ANON_KEY>"
VITE_SUPABASE_PROJECT_ID="<PROJECT_ID>"
VITE_SUPABASE_URL="https://<PROJECT_ID>.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="<YOUR_ANON_KEY>"
```

3. Jalankan aplikasi secara lokal dengan perintah:
   ```bash
   bun run dev
   # atau
   npm run dev
   ```
4. Buka `http://localhost:3000/admin`, lalu daftar (*Sign Up*) menggunakan email dan kata sandi untuk membuat akun admin pertama Anda di database Supabase yang baru.

---

## Bagian 3: Deployment ke Vercel

### Langkah 1: Dorong Kode ke Git
Pastikan proyek Anda telah di-push ke penyedia repositori Git seperti GitHub, GitLab, atau Bitbucket.

### Langkah 2: Buat Proyek di Vercel
1. Masuk ke [Dasbor Vercel](https://vercel.com).
2. Klik tombol **Add New** lalu pilih **Project**.
3. Hubungkan akun Git Anda dan klik **Import** pada repositori BakulAmbulance.

### Langkah 3: Atur Environment Variables
Pada halaman konfigurasi impor proyek, buka menu akordeon **Environment Variables**. Tambahkan variabel-variabel berikut satu per satu:

| Name | Value |
| :--- | :--- |
| `VITE_SUPABASE_URL` | `https://<PROJECT_ID>.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `<YOUR_ANON_KEY>` |
| `SUPABASE_URL` | `https://<PROJECT_ID>.supabase.co` |
| `SUPABASE_PUBLISHABLE_KEY` | `<YOUR_ANON_KEY>` |

### Langkah 4: Pengaturan Build Command
Aplikasi ini menggunakan **TanStack Start** yang kompatibel penuh dengan Vercel. Pengaturan otomatis bawaan Vercel umumnya sudah tepat, namun pastikan nilainya sebagai berikut:
- **Framework Preset**: *Vite* (atau *Other*)
- **Build Command**: `bun run build` (atau `npm run build`)
- **Install Command**: `bun install` (atau `npm install`)
- **Output Directory**: Biarkan *default*

Klik tombol **Deploy** dan tunggu proses pembangunan selesai.

---

## Tips & Troubleshooting

1. **Pendaftaran Akun Tambahan**: 
   Karena halaman `/admin` memiliki tab *Sign Up*, siapa saja yang mengetahui URL tersebut dapat mendaftar. **Praktik Terbaik**: Setelah Anda berhasil membuat akun admin Anda sendiri, Anda dapat menonaktifkan pembuatan pengguna baru dari menu **Authentication -> Providers -> Email** di Dasbor Supabase Anda (matikan opsi *Confirm email* jika tidak dikonfigurasi SMTP, atau nonaktifkan pendaftaran publik sepenuhnya jika didukung).
2. **Ketergantungan Plugin Lovable**:
   Jika pada saat *build* di Vercel terjadi kendala terkait pustaka `@lovable.dev/vite-tanstack-config` (karena mencari *environment* Cloudflare), Anda dapat mengganti impor di berkas `vite.config.ts` untuk menggunakan pustaka standar murni dari TanStack Start:
   ```typescript
   import { defineConfig } from 'vite';
   import { tanstackStart } from '@tanstack/react-start/plugin/vite';
   export default defineConfig({
     plugins: [tanstackStart()]
   });
   ```
