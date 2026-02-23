# 🚀 UangKasKu - Backend API

Modul backend untuk aplikasi UangKasKu. Dibangun menggunakan arsitektur RESTful yang kokoh (Controller-Service Pattern), dengan lapisan keamanan JWT, dan Object-Relational Mapping (ORM) yang aman (Type-Safe) menggunakan Prisma.

## 🏗️ Tech Stack (Arsitektur Sistem)

*   **Runtime:** Node.js (ES Modules)
*   **Framework:** Express.js (^5.2.1)
*   **Database ORM:** Prisma (^7.4.0) dengan `adapter-pg`
*   **Keamanan & Kriptografi:** `bcrypt` (Hashing Kata Sandi), `jsonwebtoken` (Otorisasi Sesi)
*   **Validasi Input:** `express-validator`

---

## ⚙️ Persyaratan Lingkungan (Prerequisites)

Sebelum menjalankan mesin ini, pastikan sistem lokal Anda memenuhi persyaratan minimum:

*   Node.js (LTS Version disarankan)
*   NPM / Yarn
*   Database PostgreSQL yang aktif (Atau URL dari layanan seperti Supabase/Neon)

## 🛠️ Instalasi & Inisialisasi Lokal

Jalankan perintah berikut secara berurutan di dalam folder `apps/backend/` untuk mempersiapkan lingkungan.

```bash
# 1. Pasang semua dependensi
npm install

# 2. Sinkronisasi Prisma dengan Database (Sangat Penting!)
# Ini akan membuat client JavaScript dan menyelaraskan skema database
npx prisma generate
npx prisma db push
```

### Konfigurasi `.env` (Environment Variables)

Salin `.env.example` ke `.env` (jika ada), atau buat file `.env` baru di *root* folder `backend`. Parameter berikut **wajib** diisi agar server dapat menyala tanpa *crash*:

```env
# URL Koneksi PostgreSQL (Format URI)
DATABASE_URL="postgresql://user:password@localhost:5432/uangkasku?schema=public"

# Kunci Rahasia untuk Penandatanganan Token JWT (Gunakan string acak yang kuat)
JWT_SECRET="super_secret_key_change_in_production"

# (Opsional) Port Server
PORT=3000
```

---

## 🚀 Menjalankan Server

**Mode Pengembangan (Development):**
Server akan dimuat ulang secara otomatis (Live Reload) setiap kali Anda menyimpan perubahan kode berkat `nodemon`.
```bash
npm run dev
```

**Mode Produksi (Production):**
```bash
npm start
```
*API sekarang menerima koneksi di `http://localhost:3000` (atau port yang Anda tentukan).*

---

## 📡 Dokumentasi Endpoint API (Kontrak REST)

Struktur hierarki layanan yang diekspos oleh modul ini. 

*(Catatan: Rute dengan 🔒 memerlukan Header `Authorization: Bearer <token>`)*

### 1. Modul Otentikasi (`/api/auth/login`)
| Metode | Endpoint | Deskripsi | Muatan (Body) |
| :--- | :--- | :--- | :--- |
| `POST` | `/` | Otentikasi pengguna dan dapatkan JWT | `{ email, password }` |

### 2. Modul Karyawan (`/api/karyawan`)
| Metode | Endpoint | Deskripsi | Otorisasi |
| :--- | :--- | :--- | :--- |
| `GET`  | `/` | Mengambil daftar seluruh karyawan aktif | 🔒 Diperlukan |
| `POST` | `/` | Mendaftarkan karyawan baru | 🔒 Diperlukan |

### 3. Modul Transaksi (`/api/transactions`)
| Metode | Endpoint | Deskripsi | Otorisasi |
| :--- | :--- | :--- | :--- |
| `GET`  | `/` | Mengambil log semua transaksi | 🔒 Diperlukan |
| `POST` | `/` | Membuat pencatatan transaksi baru (Pemasukan/Pengeluaran) | 🔒 Diperlukan |
| `PUT`  | `/:id` | Mengedit parameter transaksi spesifik | 🔒 Diperlukan |
| `DELETE`| `/:id` | Menghapus (Soft Delete) transaksi | 🔒 Diperlukan |

---

## 🧭 Panduan Struktur Direktori (Arsitektur Internal)

Basis kode ini mematuhi pemisahan tanggung jawab (Separation of Concerns). Jika Anda ingin berkontribusi, patuhi batas lapisan ini:

*   **`src/routes/`**: *Router* HTTP. Hanya bertanggung jawab mencocokkan URL dengan *Controller* dan menyuntikkan *Middleware*.
*   **`src/controllers/`**: Konduktor HTTP. Menangani `req`/`res`, mengekstrak parameter, memanggil *Services*, dan memformat JSON respons. **DILARANG** meletakkan logika Prisma di sini.
*   **`src/services/`**: Otak Aplikasi. Mengandung aturan logika bisnis inti (hashing, kalkulasi, kueri Prisma). Agnostik terhadap Express (tidak tahu apa itu HTTP/req/res).
*   **`src/middleware/`**: Satpam API. (Misal: Global Error Handler, JWT Verifier).
