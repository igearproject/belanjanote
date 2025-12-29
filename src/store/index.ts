import { create } from 'zustand';
import { Product, PurchaseHistory, ProductWithUrgency, ExportData } from '../types';
import * as db from '../database';
import { Paths, File } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { calculateAverageLifespan, calculateUrgency, generateUUID } from '../utils';
import { format } from 'date-fns';
import { Platform } from 'react-native';

interface AppState {
    products: Product[];
    productsWithUrgency: ProductWithUrgency[];
    purchaseHistory: PurchaseHistory[];
    isLoading: boolean;
    error: string | null;

    // Actions
    initializeApp: () => Promise<void>;
    loadProducts: () => Promise<void>;
    loadPurchaseHistory: (productId?: string) => Promise<void>;
    addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'averageLifespanDays' | 'lastPurchaseDate'>) => Promise<string>;
    updateProduct: (product: Product) => Promise<void>;
    deleteProduct: (productId: string) => Promise<void>;
    addPurchase: (purchase: Omit<PurchaseHistory, 'id'>) => Promise<void>;
    updatePurchase: (purchase: PurchaseHistory) => Promise<void>;
    deletePurchase: (purchaseId: string) => Promise<void>;
    recalculateProductStats: (productId: string) => Promise<void>;
    exportData: () => Promise<void>;
    importData: (jsonString: string) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
    products: [],
    productsWithUrgency: [],
    purchaseHistory: [],
    isLoading: false,
    error: null,

    initializeApp: async () => {
        try {
            set({ isLoading: true, error: null });
            await db.initDatabase();
            await get().loadProducts();
            await get().loadPurchaseHistory();
            set({ isLoading: false });
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
            console.error('Error initializing app:', error);
        }
    },

    loadProducts: async () => {
        try {
            const products = await db.getProducts();

            // Calculate urgency for each product
            const productsWithUrgency: ProductWithUrgency[] = [];

            for (const product of products) {
                const history = await db.getPurchaseHistory(product.id);
                const lastPurchase = history.length > 0 ? history[0] : null;
                const productWithUrgency = calculateUrgency(product, lastPurchase);
                productsWithUrgency.push(productWithUrgency);
            }

            // Sort by urgency (critical first, then by days remaining)
            productsWithUrgency.sort((a, b) => {
                const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3, unknown: 4 };
                const urgencyDiff = urgencyOrder[a.urgencyLevel] - urgencyOrder[b.urgencyLevel];

                if (urgencyDiff !== 0) return urgencyDiff;

                // If same urgency, sort by days remaining (ascending)
                if (a.daysRemaining !== null && b.daysRemaining !== null) {
                    return a.daysRemaining - b.daysRemaining;
                }

                return 0;
            });

            set({ products, productsWithUrgency });
        } catch (error) {
            set({ error: (error as Error).message });
            console.error('Error loading products:', error);
        }
    },

    loadPurchaseHistory: async (productId?: string) => {
        try {
            const history = await db.getPurchaseHistory(productId);
            set({ purchaseHistory: history });
        } catch (error) {
            set({ error: (error as Error).message });
            console.error('Error loading purchase history:', error);
        }
    },

    addProduct: async (productData) => {
        try {
            const product: Product = {
                ...productData,
                id: generateUUID(),
                averageLifespanDays: 0,
                lastPurchaseDate: null,
                createdAt: new Date().toISOString(),
            };

            await db.addProduct(product);
            await get().loadProducts();
            return product.id;
        } catch (error) {
            set({ error: (error as Error).message });
            console.error('Error adding product:', error);
            throw error;
        }
    },

    updateProduct: async (product) => {
        try {
            await db.updateProduct(product);
            await get().loadProducts();
        } catch (error) {
            set({ error: (error as Error).message });
            console.error('Error updating product:', error);
            throw error;
        }
    },

    deleteProduct: async (productId) => {
        try {
            await db.deleteProduct(productId);
            await get().loadProducts();
        } catch (error) {
            set({ error: (error as Error).message });
            console.error('Error deleting product:', error);
            throw error;
        }
    },

    addPurchase: async (purchaseData) => {
        try {
            const purchase: PurchaseHistory = {
                ...purchaseData,
                id: generateUUID(),
            };

            await db.addPurchase(purchase);
            await get().recalculateProductStats(purchase.productId);
            await get().loadProducts();
            await get().loadPurchaseHistory();
        } catch (error) {
            set({ error: (error as Error).message });
            console.error('Error adding purchase:', error);
            throw error;
        }
    },

    updatePurchase: async (purchase) => {
        try {
            await db.updatePurchase(purchase);
            await get().recalculateProductStats(purchase.productId);
            await get().loadProducts();
            await get().loadPurchaseHistory();
        } catch (error) {
            set({ error: (error as Error).message });
            console.error('Error updating purchase:', error);
            throw error;
        }
    },

    deletePurchase: async (purchaseId) => {
        try {
            const purchase = get().purchaseHistory.find(p => p.id === purchaseId);
            await db.deletePurchase(purchaseId);

            if (purchase) {
                await get().recalculateProductStats(purchase.productId);
            }

            await get().loadProducts();
            await get().loadPurchaseHistory();
        } catch (error) {
            set({ error: (error as Error).message });
            console.error('Error deleting purchase:', error);
            throw error;
        }
    },

    recalculateProductStats: async (productId) => {
        try {
            const product = await db.getProductById(productId);
            if (!product) return;

            const history = await db.getPurchaseHistory(productId);

            if (history.length > 0) {
                const averageLifespanDays = calculateAverageLifespan(history);
                const lastPurchaseDate = history[0].date; // Already sorted by date DESC

                const updatedProduct: Product = {
                    ...product,
                    averageLifespanDays,
                    lastPurchaseDate,
                };

                await db.updateProduct(updatedProduct);
            }
        } catch (error) {
            console.error('Error recalculating product stats:', error);
            throw error;
        }
    },

    exportData: async () => {
        try {
            const { products, history } = await db.getAllData();

            const exportData: ExportData = {
                version: 1,
                exportedAt: new Date().toISOString(),
                products,
                history,
            };

            const jsonString = JSON.stringify(exportData, null, 2);
            const fileName = `catatan_belanja_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.json`;

            if (Platform.OS === 'web') {
                // Web platform: use blob download
                const blob = new Blob([jsonString], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            } else {
                // Mobile platform: use FileSystem + Sharing
                const file = new File(Paths.document, fileName);
                await file.create();
                await file.write(jsonString);

                if (await Sharing.isAvailableAsync()) {
                    await Sharing.shareAsync(file.uri, {
                        mimeType: 'application/json',
                        dialogTitle: 'Export Data Catatan Belanja',
                    });
                } else {
                    throw new Error('Sharing tidak tersedia di perangkat ini');
                }
            }
        } catch (error) {
            set({ error: (error as Error).message });
            console.error('Error exporting data:', error);
            throw error;
        }
    },

    importData: async (jsonString) => {
        try {
            const data: ExportData = JSON.parse(jsonString);

            if (data.version !== 1) {
                throw new Error('Format data tidak didukung');
            }

            await db.importData(data.products, data.history);
            await get().loadProducts();

            alert('Data berhasil diimport!');
        } catch (error) {
            set({ error: (error as Error).message });
            console.error('Error importing data:', error);
            throw error;
        }
    },
}));
