# API Documentation

## Store API (Zustand)

### State
```typescript
interface AppState {
  products: Product[];
  productsWithUrgency: ProductWithUrgency[];
  purchaseHistory: PurchaseHistory[];
  isLoading: boolean;
  error: string | null;
}
```

### Actions

#### `initializeApp(): Promise<void>`
Initialize database dan load products.
```typescript
const { initializeApp } = useStore();
await initializeApp();
```

#### `loadProducts(): Promise<void>`
Load semua products dan calculate urgency.
```typescript
const { loadProducts } = useStore();
await loadProducts();
```

#### `addProduct(product): Promise<void>`
Tambah product baru.
```typescript
const { addProduct } = useStore();
await addProduct({
  name: 'Beras',
  category: 'Sembako',
  defaultUnit: 'kg',
  packagingSize: 5,
});
```

#### `updateProduct(product): Promise<void>`
Update product yang sudah ada.
```typescript
const { updateProduct } = useStore();
await updateProduct({
  id: 'product-id',
  name: 'Beras Premium',
  // ... other fields
});
```

#### `deleteProduct(productId): Promise<void>`
Hapus product dan semua history-nya.
```typescript
const { deleteProduct } = useStore();
await deleteProduct('product-id');
```

#### `addPurchase(purchase): Promise<void>`
Tambah purchase baru dan recalculate stats.
```typescript
const { addPurchase } = useStore();
await addPurchase({
  productId: 'product-id',
  date: '2024-01-15',
  quantity: 5,
  unit: 'kg',
  price: 50000,
});
```

#### `exportData(): Promise<void>`
Export semua data ke JSON file.
```typescript
const { exportData } = useStore();
await exportData();
```

#### `importData(jsonString): Promise<void>`
Import data dari JSON string.
```typescript
const { importData } = useStore();
await importData(jsonString);
```

## Database API

### `initDatabase(): Promise<void>`
Initialize SQLite database dan create tables.

### `getProducts(): Promise<Product[]>`
Get semua products.

### `getProductById(id): Promise<Product | null>`
Get product by ID.

### `addProduct(product): Promise<void>`
Insert product baru.

### `updateProduct(product): Promise<void>`
Update existing product.

### `deleteProduct(id): Promise<void>`
Delete product dan cascade delete history.

### `getPurchaseHistory(productId?): Promise<PurchaseHistory[]>`
Get purchase history, optionally filtered by productId.

### `addPurchase(purchase): Promise<void>`
Insert purchase baru.

### `getAllData(): Promise<{products, history}>`
Get semua data untuk export.

### `importData(products, history): Promise<void>`
Import data (clear existing first).

## Utils API

### `calculateAverageLifespan(purchases): number`
Calculate average days between purchases.
```typescript
const avgDays = calculateAverageLifespan(purchaseHistory);
```

### `calculateUrgency(product, lastPurchase): ProductWithUrgency`
Calculate urgency level dan predicted runout date.
```typescript
const productWithUrgency = calculateUrgency(product, lastPurchase);
```

### `getUrgencyColor(level): string`
Get color hex untuk urgency level.
```typescript
const color = getUrgencyColor('critical'); // '#EF4444'
```

### `getUrgencyLabel(level): string`
Get Indonesian label untuk urgency level.
```typescript
const label = getUrgencyLabel('critical'); // 'Mendesak'
```

### `getUrgencyEmoji(level): string`
Get emoji untuk urgency level.
```typescript
const emoji = getUrgencyEmoji('critical'); // '🔴'
```

### `formatCurrency(amount): string`
Format number ke Rupiah.
```typescript
const formatted = formatCurrency(50000); // 'Rp 50.000'
```

### `generateUUID(): string`
Generate UUID v4.
```typescript
const id = generateUUID();
```

## Types

### Product
```typescript
interface Product {
  id: string;
  name: string;
  category: string;
  defaultUnit: string;
  packagingSize: number;
  averageLifespanDays: number;
  lastPurchaseDate: string | null;
  createdAt: string;
}
```

### PurchaseHistory
```typescript
interface PurchaseHistory {
  id: string;
  productId: string;
  date: string; // ISO format: 'yyyy-MM-dd'
  quantity: number;
  unit: string;
  price?: number;
}
```

### ProductWithUrgency
```typescript
interface ProductWithUrgency extends Product {
  predictedRunoutDate: string | null;
  daysRemaining: number | null;
  urgencyLevel: 'critical' | 'high' | 'medium' | 'low' | 'unknown';
  lastQuantityPurchased: number | null;
}
```

### ExportData
```typescript
interface ExportData {
  version: number;
  exportedAt: string;
  products: Product[];
  history: PurchaseHistory[];
}
```

## Component Props

### Button
```typescript
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}
```

### Input
```typescript
interface InputProps extends TextInputProps {
  label: string;
  error?: string;
}
```

### ProductCard
```typescript
interface ProductCardProps {
  product: ProductWithUrgency;
  onPress?: () => void;
  onCheck?: () => void;
  showCheckbox?: boolean;
}
```
