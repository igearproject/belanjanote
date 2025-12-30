# 🛒 Catatan Belanja Cerdas

[![Expo Build Android](https://img.shields.io/badge/Platform-Android-green?logo=android&logoColor=white)](./releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Aplikasi mobile cerdas untuk mencatat belanja, memantau persediaan barang, dan memprediksi kapan barang Anda akan habis berdasarkan pola konsumsi harian.

---

## 📥 Download & Instal (Cepat)

Ingin langsung mencoba? Tidak perlu ribet dengan script! Cukup ikuti langkah mudah ini:

1. 📂 Buka folder [**releases**](./releases) di repository ini.
2. 📥 Cari dan download file dengan ekstensi **.apk** (contoh: `application-xyz.apk`).
3. 📱 Kirim file tersebut ke HP Android Anda.
4. ⚙️ Izinkan "Install from unknown sources" di pengaturan HP jika muncul peringatan.
5. 🚀 Instal dan mulai catat belanjamu!

---

## ✨ Fitur Unggulan

*   **📊 Prediksi Cerdas**: Menghitung otomatis kapan barang akan habis.
*   **🎯 Prioritas Belanja**: Label warna (Merah/Oranye/Kuning/Hijau) untuk tingkat urgensi belanja.
*   **📜 History Belanja**: Lacak semua pengeluaran dan tanggal pembelian sebelumnya.
*   **💾 Backup & Restore**: Amankan datamu dengan fitur Export/Import JSON.
*   **📱 Offline-First**: Data tersimpan aman di perangkatmu, tanpa perlu internet!

---

## 📷 Cuplikan Urgensi Belanja

*   🔴 **Mendesak**: Habis hari ini atau sudah habis.
*   🟠 **Perlu Beli**: Habis dalam 3 hari ke depan.
*   🟡 **Persiapan**: Habis dalam waktu kurang dari seminggu.
*   🟢 **Aman**: Stok masih sangat mencukupi.

---

## 🛠️ Untuk Developer (Cara Menjalankan)

Jika Anda ingin memodifikasi atau berkontribusi, ikuti langkah berikut:

### Prasyarat
- [Node.js](https://nodejs.org/) (v18+)
- [Expo Go](https://expo.dev/expo-go) terinstal di HP

### Setup
```bash
# Clone repo
git clone https://github.com/igearproject/belanjanote.git
cd catatan_belanja

# Install dependencies
npm install

# Start development server
npm start
``` 
Scan QR Code yang muncul menggunakan aplikasi **Expo Go**.

---

## 🏗️ Teknologi

*   **Framework**: [Expo](https://expo.dev/) (React Native)
*   **Database**: SQLite via `expo-sqlite`
*   **State**: [Zustand](https://github.com/pmndrs/zustand)
*   **Styles**: Standard StyleSheet (Cross-platform ready)

---

## 🤝 Kontribusi & Dukungan

Ada ide fitur baru? Temukan bug? Silakan buat **Issue** atau kirim **Pull Request**. Kami sangat terbuka untuk kolaborasi!

Dibuat dengan ❤️ oleh **igearproject**
