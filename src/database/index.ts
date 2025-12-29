import * as SQLite from 'expo-sqlite';
import { Product, PurchaseHistory } from '../types';

const DB_NAME = 'catatan_belanja.db';

let db: SQLite.SQLiteDatabase | null = null;

export const initDatabase = async (): Promise<void> => {
    try {
        db = await SQLite.openDatabaseAsync(DB_NAME, {});

        // Create products table
        await db.execAsync(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        defaultUnit TEXT NOT NULL,
        packagingSize REAL NOT NULL,
        averageLifespanDays REAL DEFAULT 0,
        lastPurchaseDate TEXT,
        createdAt TEXT NOT NULL
      );
    `);

        // Create purchase_history table
        await db.execAsync(`
      CREATE TABLE IF NOT EXISTS purchase_history (
        id TEXT PRIMARY KEY,
        productId TEXT NOT NULL,
        date TEXT NOT NULL,
        quantity REAL NOT NULL,
        unit TEXT NOT NULL,
        price REAL,
        FOREIGN KEY (productId) REFERENCES products (id) ON DELETE CASCADE
      );
    `);

        // Create index for faster queries
        await db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_purchase_product_date 
      ON purchase_history (productId, date DESC);
    `);

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
};

export const getDatabase = (): SQLite.SQLiteDatabase => {
    if (!db) {
        throw new Error('Database not initialized. Call initDatabase() first.');
    }
    return db;
};

// Product CRUD operations
export const addProduct = async (product: Product): Promise<void> => {
    const database = getDatabase();
    await database.runAsync(
        `INSERT INTO products (id, name, category, defaultUnit, packagingSize, averageLifespanDays, lastPurchaseDate, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            product.id,
            product.name,
            product.category,
            product.defaultUnit,
            product.packagingSize,
            product.averageLifespanDays,
            product.lastPurchaseDate,
            product.createdAt,
        ]
    );
};

export const updateProduct = async (product: Product): Promise<void> => {
    const database = getDatabase();
    await database.runAsync(
        `UPDATE products 
     SET name = ?, category = ?, defaultUnit = ?, packagingSize = ?, 
         averageLifespanDays = ?, lastPurchaseDate = ?
     WHERE id = ?`,
        [
            product.name,
            product.category,
            product.defaultUnit,
            product.packagingSize,
            product.averageLifespanDays,
            product.lastPurchaseDate,
            product.id,
        ]
    );
};

export const deleteProduct = async (productId: string): Promise<void> => {
    const database = getDatabase();
    await database.runAsync('DELETE FROM products WHERE id = ?', [productId]);
};

export const getProducts = async (): Promise<Product[]> => {
    const database = getDatabase();
    const result = await database.getAllAsync<Product>('SELECT * FROM products ORDER BY name ASC');
    return result;
};

export const getProductById = async (productId: string): Promise<Product | null> => {
    const database = getDatabase();
    const result = await database.getFirstAsync<Product>(
        'SELECT * FROM products WHERE id = ?',
        [productId]
    );
    return result || null;
};

// Purchase History CRUD operations
export const addPurchase = async (purchase: PurchaseHistory): Promise<void> => {
    const database = getDatabase();
    await database.runAsync(
        `INSERT INTO purchase_history (id, productId, date, quantity, unit, price)
     VALUES (?, ?, ?, ?, ?, ?)`,
        [purchase.id, purchase.productId, purchase.date, purchase.quantity, purchase.unit, purchase.price || null]
    );
};

export const getPurchaseHistory = async (productId?: string): Promise<PurchaseHistory[]> => {
    const database = getDatabase();
    if (productId) {
        return await database.getAllAsync<PurchaseHistory>(
            'SELECT * FROM purchase_history WHERE productId = ? ORDER BY date DESC',
            [productId]
        );
    }
    return await database.getAllAsync<PurchaseHistory>(
        'SELECT * FROM purchase_history ORDER BY date DESC'
    );
};

export const updatePurchase = async (purchase: PurchaseHistory): Promise<void> => {
    const database = getDatabase();
    await database.runAsync(
        `UPDATE purchase_history 
     SET date = ?, quantity = ?, unit = ?, price = ?
     WHERE id = ?`,
        [purchase.date, purchase.quantity, purchase.unit, purchase.price || null, purchase.id]
    );
};

export const deletePurchase = async (purchaseId: string): Promise<void> => {
    const database = getDatabase();
    await database.runAsync('DELETE FROM purchase_history WHERE id = ?', [purchaseId]);
};

// Get all data for export
export const getAllData = async (): Promise<{ products: Product[]; history: PurchaseHistory[] }> => {
    const products = await getProducts();
    const history = await getPurchaseHistory();
    return { products, history };
};

// Import data (clear existing data first)
export const importData = async (products: Product[], history: PurchaseHistory[]): Promise<void> => {
    const database = getDatabase();

    // Clear existing data
    await database.runAsync('DELETE FROM purchase_history');
    await database.runAsync('DELETE FROM products');

    // Insert products
    for (const product of products) {
        await addProduct(product);
    }

    // Insert history
    for (const purchase of history) {
        await addPurchase(purchase);
    }
};
