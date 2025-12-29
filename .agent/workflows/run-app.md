---
description: Cara menjalankan aplikasi Catatan Belanja
---

# Workflow: Menjalankan Aplikasi

Ikuti langkah-langkah berikut untuk menjalankan aplikasi Catatan Belanja:

## 1. Install Dependencies (Jika Belum)
```bash
npm install
```

## 2. Jalankan Development Server
// turbo
```bash
npm start
```

## 3. Buka di Perangkat
Setelah server berjalan, Anda memiliki beberapa opsi:

### Opsi A: Menggunakan Expo Go (Recommended untuk Testing)
1. Install **Expo Go** app di smartphone Anda:
   - Android: [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)

2. Scan QR code yang muncul di terminal menggunakan:
   - Android: Expo Go app
   - iOS: Camera app (akan membuka di Expo Go)

### Opsi B: Menggunakan Emulator Android
```bash
npm run android
```

### Opsi C: Menggunakan Simulator iOS (Mac Only)
```bash
npm run ios
```

### Opsi D: Menggunakan Web Browser
```bash
npm run web
```

## 4. Testing Fitur
Setelah aplikasi terbuka:
1. Tambahkan produk pertama di tab **Produk**
2. Catat pembelian di tab **Belanja**
3. Lihat riwayat di tab **Riwayat**
4. Export/Import data di tab **Pengaturan**

## Troubleshooting

### Error: "Database not initialized"
- Restart aplikasi
- Clear cache: `npm start --clear`

### Error: Port sudah digunakan
- Hentikan proses lain yang menggunakan port 8081
- Atau gunakan port lain: `npm start --port 8082`

### Aplikasi tidak muncul di Expo Go
- Pastikan smartphone dan komputer di jaringan WiFi yang sama
- Coba scan ulang QR code
- Restart Expo Go app
