import { differenceInDays, parseISO, addDays, format, isToday, isYesterday } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { Product, PurchaseHistory, ProductWithUrgency, UrgencyLevel } from '../types';

/**
 * Calculate the average lifespan of a product based on purchase history
 */
export const calculateAverageLifespan = (purchases: PurchaseHistory[]): number => {
    if (purchases.length < 2) {
        return 0; // Not enough data
    }

    // Sort by date ascending
    const sorted = [...purchases].sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let totalInterval = 0;
    let intervalCount = 0;

    for (let i = 1; i < sorted.length; i++) {
        const interval = differenceInDays(parseISO(sorted[i].date), parseISO(sorted[i - 1].date));
        if (interval > 0) {
            totalInterval += interval;
            intervalCount++;
        }
    }

    return intervalCount > 0 ? Math.round(totalInterval / intervalCount) : 0;
};

/**
 * Calculate urgency level and predicted runout date for a product
 */
export const calculateUrgency = (
    product: Product,
    lastPurchase: PurchaseHistory | null
): ProductWithUrgency => {
    if (!product.lastPurchaseDate || !lastPurchase || product.averageLifespanDays === 0) {
        return {
            ...product,
            predictedRunoutDate: null,
            daysRemaining: null,
            urgencyLevel: 'unknown',
            lastQuantityPurchased: lastPurchase?.quantity || null,
        };
    }

    const lastPurchaseDate = parseISO(product.lastPurchaseDate);
    const predictedRunoutDate = addDays(lastPurchaseDate, product.averageLifespanDays);
    const daysRemaining = differenceInDays(predictedRunoutDate, new Date());

    let urgencyLevel: UrgencyLevel;
    if (daysRemaining <= 1) {
        urgencyLevel = 'critical';
    } else if (daysRemaining <= 3) {
        urgencyLevel = 'high';
    } else if (daysRemaining <= 7) {
        urgencyLevel = 'medium';
    } else {
        urgencyLevel = 'low';
    }

    return {
        ...product,
        predictedRunoutDate: format(predictedRunoutDate, 'yyyy-MM-dd'),
        daysRemaining,
        urgencyLevel,
        lastQuantityPurchased: lastPurchase.quantity,
    };
};

/**
 * Get urgency color for UI
 */
export const getUrgencyColor = (level: UrgencyLevel): string => {
    switch (level) {
        case 'critical':
            return '#EF4444'; // Red
        case 'high':
            return '#F97316'; // Orange
        case 'medium':
            return '#EAB308'; // Yellow
        case 'low':
            return '#22C55E'; // Green
        default:
            return '#9CA3AF'; // Gray
    }
};

/**
 * Get urgency label in Indonesian
 */
export const getUrgencyLabel = (level: UrgencyLevel): string => {
    switch (level) {
        case 'critical':
            return 'Mendesak';
        case 'high':
            return 'Perlu Beli';
        case 'medium':
            return 'Persiapan';
        case 'low':
            return 'Aman';
        default:
            return 'Belum Ada Data';
    }
};

/**
 * Get urgency emoji
 */
export const getUrgencyEmoji = (level: UrgencyLevel): string => {
    switch (level) {
        case 'critical':
            return '🔴';
        case 'high':
            return '🟠';
        case 'medium':
            return '🟡';
        case 'low':
            return '🟢';
        default:
            return '⚪';
    }
};

/**
 * Format currency in Indonesian Rupiah
 */
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
};

/**
 * Generate UUID v4
 */
export const generateUUID = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};
/**
 * Format date to human readable relative time (Indonesian)
 */
export const formatRelativeDate = (dateString: string | null): string => {
    if (!dateString) return '-';
    try {
        const date = parseISO(dateString);

        if (isToday(date)) return 'Hari ini';
        if (isYesterday(date)) return 'Kemarin';

        const diff = differenceInDays(new Date(), date);

        if (diff < 7) return `${diff} hari yang lalu`;
        if (diff < 30) return `${Math.floor(diff / 7)} minggu yang lalu`;

        return format(date, 'dd MMM yyyy', { locale: idLocale });
    } catch {
        return '-';
    }
};
