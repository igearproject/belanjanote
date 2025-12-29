import { Product, PurchaseHistory } from '../types';
import { generateUUID } from '../utils';
import { subDays, format } from 'date-fns';

export const sampleProducts: Omit<Product, 'id' | 'createdAt'>[] = [
    {
        name: 'Beras',
        category: 'Sembako',
        defaultUnit: 'kg',
        packagingSize: 5,
        averageLifespanDays: 0,
        lastPurchaseDate: null,
    },
    {
        name: 'Minyak Goreng',
        category: 'Sembako',
        defaultUnit: 'liter',
        packagingSize: 2,
        averageLifespanDays: 0,
        lastPurchaseDate: null,
    },
    {
        name: 'Gula Pasir',
        category: 'Sembako',
        defaultUnit: 'kg',
        packagingSize: 1,
        averageLifespanDays: 0,
        lastPurchaseDate: null,
    },
    {
        name: 'Sabun Cuci Piring',
        category: 'Kebersihan',
        defaultUnit: 'botol',
        packagingSize: 1,
        averageLifespanDays: 0,
        lastPurchaseDate: null,
    },
    {
        name: 'Deterjen',
        category: 'Kebersihan',
        defaultUnit: 'pack',
        packagingSize: 1,
        averageLifespanDays: 0,
        lastPurchaseDate: null,
    },
];

/**
 * Generate sample purchase history for a product
 * This creates realistic purchase patterns
 */
export const generateSampleHistory = (
    productId: string,
    intervalDays: number,
    count: number = 3
): PurchaseHistory[] => {
    const history: PurchaseHistory[] = [];
    const today = new Date();

    for (let i = 0; i < count; i++) {
        const purchaseDate = subDays(today, intervalDays * (count - i));
        history.push({
            id: generateUUID(),
            productId,
            date: format(purchaseDate, 'yyyy-MM-dd'),
            quantity: 1,
            unit: 'unit',
            price: undefined,
        });
    }

    return history;
};
