# Arsitektur Aplikasi Catatan Belanja

## Overview
Aplikasi ini dibangun dengan arsitektur yang modular dan scalable menggunakan React Native (Expo) dengan TypeScript.

## Layer Architecture

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│    (Screens & Components)           │
├─────────────────────────────────────┤
│       State Management Layer        │
│          (Zustand Store)            │
├─────────────────────────────────────┤
│        Business Logic Layer         │
│      (Utils & Calculations)         │
├─────────────────────────────────────┤
│         Data Access Layer           │
│       (Database Service)            │
├─────────────────────────────────────┤
│         Storage Layer               │
│         (SQLite DB)                 │
└─────────────────────────────────────┘
```

## Folder Structure

### `/src/components`
Komponen UI yang reusable:
- **Button**: Tombol dengan variants (primary, secondary, danger)
- **Input**: Text input dengan label dan error handling
- **ProductCard**: Card untuk menampilkan informasi produk dengan urgency indicator

### `/src/screens`
Screen utama aplikasi:
- **HomeScreen**: Daftar belanja dengan grouping berdasarkan urgency
- **ProductsScreen**: Manajemen produk (CRUD)
- **HistoryScreen**: Riwayat pembelian
- **SettingsScreen**: Export/Import dan pengaturan

### `/src/database`
Layer akses database menggunakan expo-sqlite:
- Database initialization
- CRUD operations untuk Products dan Purchase History
- Export/Import functionality

### `/src/store`
State management menggunakan Zustand:
- Global state untuk products, history, dan loading states
- Actions untuk semua operasi CRUD
- Auto-recalculation untuk urgency levels

### `/src/utils`
Utility functions:
- **calculateAverageLifespan**: Menghitung rata-rata durasi habis barang
- **calculateUrgency**: Menghitung urgency level dan prediksi runout
- **formatCurrency**: Format Rupiah
- **getUrgencyColor/Label/Emoji**: Helper untuk UI urgency indicators

### `/src/types`
TypeScript type definitions untuk type safety

### `/src/navigation`
React Navigation setup dengan bottom tabs

## Data Flow

### 1. Add Purchase Flow
```
User taps checkbox → Modal opens → User confirms quantity
    ↓
Store.addPurchase() called
    ↓
Database.addPurchase() saves to SQLite
    ↓
Store.recalculateProductStats() updates averageLifespanDays
    ↓
Store.loadProducts() refreshes UI with new urgency levels
```

### 2. Urgency Calculation Flow
```
Get purchase history for product
    ↓
Calculate intervals between purchases
    ↓
Average intervals = averageLifespanDays
    ↓
Predicted runout = lastPurchaseDate + averageLifespanDays
    ↓
Days remaining = predicted runout - today
    ↓
Assign urgency level based on days remaining
```

## Key Algorithms

### Average Lifespan Calculation
```typescript
intervals = []
for each consecutive purchase pair:
  interval = days between purchases
  intervals.push(interval)

averageLifespanDays = sum(intervals) / count(intervals)
```

### Urgency Level Assignment
```typescript
if daysRemaining <= 1: CRITICAL (🔴)
else if daysRemaining <= 3: HIGH (🟠)
else if daysRemaining <= 7: MEDIUM (🟡)
else: LOW (🟢)
```

## Database Schema

### Products Table
```sql
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  defaultUnit TEXT NOT NULL,
  packagingSize REAL NOT NULL,
  averageLifespanDays REAL DEFAULT 0,
  lastPurchaseDate TEXT,
  createdAt TEXT NOT NULL
);
```

### Purchase History Table
```sql
CREATE TABLE purchase_history (
  id TEXT PRIMARY KEY,
  productId TEXT NOT NULL,
  date TEXT NOT NULL,
  quantity REAL NOT NULL,
  unit TEXT NOT NULL,
  price REAL,
  FOREIGN KEY (productId) REFERENCES products (id) ON DELETE CASCADE
);
```

## Performance Considerations

1. **Indexing**: Index pada `purchase_history(productId, date)` untuk query cepat
2. **Lazy Loading**: Products dimuat on-demand, bukan semua sekaligus
3. **Memoization**: Urgency calculations di-cache di store
4. **Optimistic Updates**: UI update langsung, database sync di background

## Security & Privacy

- **No Backend**: Semua data tersimpan lokal di device
- **No Analytics**: Tidak ada tracking atau analytics
- **Export Control**: User full control atas data mereka
- **No Permissions**: Tidak memerlukan permissions berbahaya

## Future Enhancements

1. **Cloud Sync**: Optional cloud backup dengan encryption
2. **Barcode Scanner**: Scan barcode untuk quick add products
3. **Shopping List Sharing**: Share list dengan family members
4. **Price Tracking**: Track price changes over time
5. **Budget Management**: Set budget dan track spending
6. **Notifications**: Remind when items running low
