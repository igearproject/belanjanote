# Quick Start Guide - Catatan Belanja Cerdas

Panduan cepat untuk mulai menggunakan aplikasi dalam 5 menit! ⚡

## 📱 Step 1: Install Expo Go

Download **Expo Go** di smartphone Anda:
- **Android**: [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iOS**: [App Store](https://apps.apple.com/app/expo-go/id982107779)

## 🚀 Step 2: Jalankan Aplikasi

Di terminal, jalankan:
```bash
npm start
```

Tunggu hingga muncul QR code.

## 📲 Step 3: Scan QR Code

- **Android**: Buka Expo Go app → Tap "Scan QR Code"
- **iOS**: Buka Camera app → Arahkan ke QR code → Tap notifikasi

## ✅ Step 4: Mulai Menggunakan!

### 4.1 Tambah Produk Pertama
1. Buka tab **Produk** (ikon 📦)
2. Tap tombol **+ Tambah**
3. Isi form:
   - **Nama**: Beras
   - **Kategori**: Sembako
   - **Satuan**: kg
   - **Ukuran Kemasan**: 5
4. Tap **Simpan**

### 4.2 Catat Pembelian Pertama
1. Kembali ke tab **Belanja** (ikon 🛒)
2. Anda akan melihat "Beras" dengan status "Belum Ada Data"
3. Centang checkbox di sebelah kanan
4. Konfirmasi jumlah: 5 kg
5. Tap **Simpan**

### 4.3 Catat Pembelian Kedua (Simulasi)
Untuk melihat prediksi bekerja, Anda perlu minimal 2 pembelian:
1. Tunggu beberapa hari, ATAU
2. Untuk testing: Edit database manual (advanced)

### 4.4 Lihat Prediksi
Setelah ada 2+ pembelian, aplikasi akan:
- Menghitung rata-rata durasi habis
- Memprediksi kapan barang akan habis lagi
- Mengurutkan berdasarkan urgency

## 🎯 Tips Penggunaan

### Untuk Hasil Terbaik:
1. **Catat Setiap Pembelian**: Semakin banyak data, semakin akurat prediksi
2. **Konsisten dengan Kemasan**: Gunakan ukuran kemasan yang sama
3. **Update Segera**: Catat pembelian sesegera mungkin setelah belanja

### Memahami Urgency Levels:
- 🔴 **Mendesak**: Beli hari ini/besok
- 🟠 **Perlu Beli**: Beli dalam 3 hari
- 🟡 **Persiapan**: Masukkan ke shopping list
- 🟢 **Aman**: Stok masih cukup

## 💾 Backup Data

### Export Data:
1. Buka tab **Pengaturan** (ikon ⚙️)
2. Tap **Export Data**
3. Pilih lokasi penyimpanan
4. File JSON akan tersimpan

### Import Data (Pindah HP):
1. Transfer file JSON ke HP baru
2. Install aplikasi di HP baru
3. Buka tab **Pengaturan**
4. Tap **Import Data**
5. Pilih file JSON yang sudah ditransfer

## 🐛 Troubleshooting

### Aplikasi tidak muncul di Expo Go?
- Pastikan HP dan laptop di WiFi yang sama
- Restart Expo Go app
- Scan ulang QR code

### Data hilang?
- Cek apakah sudah di-export sebelumnya
- Data tersimpan lokal di HP, tidak di cloud

### Prediksi tidak muncul?
- Pastikan sudah ada minimal 2 pembelian
- Cek apakah tanggal pembelian berbeda

## 📚 Dokumentasi Lengkap

- [README.md](README.md) - Overview lengkap
- [TECH_SPEC.md](TECH_SPEC.md) - Spesifikasi teknis
- [ARCHITECTURE.md](ARCHITECTURE.md) - Arsitektur aplikasi
- [API.md](API.md) - API documentation

## 🆘 Butuh Bantuan?

Buat issue di GitHub atau hubungi developer!

---

Selamat menggunakan Catatan Belanja Cerdas! 🎉
