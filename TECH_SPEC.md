# Technical Specification: Smart Shopping Tracker (Catatan Belanja Cerdas)

## 1. Overview
A mobile application to track grocery purchases, calculate consumption rates, and predict shopping needs based on usage history. The app prioritizes items by urgency and supports offline usage with data export capabilities.

## 2. Technology Stack
- **Framework**: Expo (React Native)
- **Language**: TypeScript
- **State Management**: Zustand (Lightweight and effective)
- **Local Database**: `expo-sqlite` (Required for complex date queries and history tracking)
- **UI Styling**: React Native StyleSheet with modern design principles (Vibrant colors, rounded corners, clean typography)
- **Data Export**: `expo-file-system` and `expo-sharing` (JSON format)

## 3. Data Model

### 3.1. Product (Barang)
- `id`: UUID
- `name`: String (e.g., "Beras", "Sabun Cuci")
- `category`: String
- `defaultUnit`: String (e.g., "kg", "pack", "bottle")
- `packagingSize`: Number (e.g., 5 for 5kg)
- `averageLifespanDays`: Number (Calculated - how long one unit lasts)
- `lastPurchaseDate`: Date

### 3.2. PurchaseHistory (Riwayat Belanja)
- `id`: UUID
- `productId`: UUID (Foreign Key)
- `date`: ISO8601 String
- `quantity`: Number
- `unit`: String
- `price`: Number (Optional)

## 4. Core Algorithms

### 4.1. Consumption Rate Calculation (The "Smart" Part)
- **Trigger**: Recalculated every time a new purchase is added.
- **Formula**: 
  - Find intervals between consecutive purchases of the same item.
  - `AverageInterval` = Sum(Intervals) / Count(Intervals).
  - `averageLifespanDays` = `AverageInterval` / `TypicalQuantity`.
  
### 4.2. Urgency Classification
- **Logic**:
  - `PredictedRunoutDate` = `LastPurchaseDate` + (`averageLifespanDays` * `LastQuantityPurchased`)
  - `DaysRemaining` = `PredictedRunoutDate` - `Today`
- **Priority Levels**:
  - 🔴 **Mendesak (Critical)**: `DaysRemaining` <= 1 (Habis hari ini atau besok)
  - 🟠 **Perlu Beli (High)**: `DaysRemaining` <= 3
  - 🟡 **Persiapan (Medium)**: `DaysRemaining` <= 7
  - 🟢 **Aman (Low)**: `DaysRemaining` > 7

## 5. Features

### 5.1. Smart Shopping List (Beranda)
- Automatically generated list based on Urgency.
- Sections: "Harus Beli Sekarang", "Beli Minggu Ini", "Stok Aman".
- Checkbox to mark as "Bought" (which immediately opens a modal to confirm quantity and date, then saves to History).

### 5.2. Purchase Recording (Pencatatan)
- Manual Add: Form to add new items that haven't been bought before.
- Quick Record: From the shopping list, just check the box.

### 5.3. Data Portability (No Backend)
- **Export**: Dumps the SQLite database content into a JSON file.
- **Import**: Reads a JSON file and restores the database.
- **Format**:
  ```json
  {
    "version": 1,
    "exportedAt": "2023-10-27T10:00:00Z",
    "products": [...],
    "history": [...]
  }
  ```

## 6. User Interface (UI)
- **Style**: Modern, clean, high contrast for readability while shopping.
- **Colors**: 
  - Primary: Deep Ocean Blue or Emerald Green.
  - Urgency Colors: Red (Critical), Orange (Warning), Green (Safe).
- **Interactions**: Swipe to delete, Tap to edit, Long press for details.

## 7. Implementation Phases
1. **Setup**: Initialize Expo project, setup SQLite.
2. **Core Data**: Implement CRUD for Products and History.
3. **Logic**: Implement the consumption calculator and urgency sorter.
4. **UI Construction**: Build the screens (Home, Add, History, Settings).
5. **Export/Import**: Implement file handling.
