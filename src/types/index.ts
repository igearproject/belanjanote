export interface Product {
    id: string;
    name: string;
    category: string;
    defaultUnit: string;
    packagingSize: number;
    averageLifespanDays: number;
    lastPurchaseDate: string | null;
    createdAt: string;
}

export interface PurchaseHistory {
    id: string;
    productId: string;
    date: string;
    quantity: number;
    unit: string;
    price?: number;
}

export interface ProductWithUrgency extends Product {
    predictedRunoutDate: string | null;
    daysRemaining: number | null;
    urgencyLevel: 'critical' | 'high' | 'medium' | 'low' | 'unknown';
    lastQuantityPurchased: number | null;
}

export interface ExportData {
    version: number;
    exportedAt: string;
    products: Product[];
    history: PurchaseHistory[];
}

export type UrgencyLevel = 'critical' | 'high' | 'medium' | 'low' | 'unknown';
