# 🛒 Catatan Belanja Cerdas

Aplikasi mobile untuk mencatat belanja dan memprediksi kebutuhan berdasarkan pola konsumsi Anda.

## ✨ Fitur Utama

- **📊 Prediksi Cerdas**: Aplikasi menghitung rata-rata durasi habisnya barang berdasarkan riwayat belanja
- **🎯 Prioritas Belanja**: Barang diurutkan otomatis berdasarkan tingkat urgensi (Mendesak, Perlu Beli, Persiapan, Aman)
- **📦 Manajemen Produk**: Tambah, edit, dan hapus produk dengan mudah
- **📜 Riwayat Lengkap**: Lihat semua transaksi pembelian yang pernah dilakukan
- **💾 Export/Import**: Backup data ke file JSON dan restore di perangkat lain
- **📱 Offline First**: Semua data tersimpan lokal, tidak perlu koneksi internet

## 🚀 Cara Menjalankan

### Prasyarat
- Node.js (v18 atau lebih baru)
- npm atau yarn
- Expo Go app di smartphone (untuk testing)

### Instalasi

1. Clone repository ini
```bash
cd catatan_belanja
```

2. Install dependencies
```bash
npm install
```

3. Jalankan aplikasi
```bash
npm start
```

4. Scan QR code dengan Expo Go app di smartphone Anda

## 📱 Cara Menggunakan

### 1. Tambah Produk
- Buka tab **Produk**
- Tap tombol **+ Tambah**
- Isi nama produk, kategori, satuan, dan ukuran kemasan
- Tap **Simpan**

### 2. Catat Pembelian
- Buka tab **Belanja**
- Centang checkbox pada produk yang baru dibeli
- Konfirmasi jumlah dan harga (opsional)
- Tap **Simpan**

### 3. Lihat Prediksi
- Tab **Belanja** menampilkan produk yang diurutkan berdasarkan urgensi:
  - 🔴 **Mendesak**: Habis dalam ≤ 1 hari
  - 🟠 **Perlu Beli**: Habis dalam ≤ 3 hari
  - 🟡 **Persiapan**: Habis dalam ≤ 7 hari
  - 🟢 **Aman**: Masih lama habisnya

### 4. Export/Import Data
- Buka tab **Pengaturan**
- Tap **Export Data** untuk backup
- Tap **Import Data** untuk restore dari file JSON

## 🏗️ Teknologi

- **Framework**: Expo (React Native)
- **Language**: TypeScript
- **State Management**: Zustand
- **Database**: expo-sqlite
- **Navigation**: React Navigation
- **Date Handling**: date-fns

## 📂 Struktur Proyek

```
src/
├── components/       # Komponen UI reusable
├── screens/          # Screen utama aplikasi
├── database/         # SQLite database layer
├── store/            # Zustand state management
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
└── navigation/       # React Navigation setup
```

## 🎨 Algoritma Prediksi

Aplikasi menggunakan algoritma sederhana namun efektif:

1. **Hitung Interval**: Mencari jarak waktu antara pembelian berturut-turut
2. **Rata-rata**: Menghitung rata-rata interval untuk mendapat durasi habis
3. **Prediksi**: Menambahkan durasi ke tanggal pembelian terakhir
4. **Prioritas**: Mengurutkan berdasarkan sisa hari hingga habis

## 📄 Lisensi

MIT License - Silakan gunakan dan modifikasi sesuai kebutuhan Anda.

## 🤝 Kontribusi

Kontribusi selalu diterima! Silakan buat issue atau pull request.

---

Dibuat dengan ❤️ menggunakan Expo & React Native
