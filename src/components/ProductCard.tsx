import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ProductWithUrgency } from '../types';
import { getUrgencyColor, getUrgencyEmoji, getUrgencyLabel, formatRelativeDate } from '../utils';

interface ProductCardProps {
    product: ProductWithUrgency;
    onPress?: () => void;
    onCheck?: () => void;
    showCheckbox?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    product,
    onPress,
    onCheck,
    showCheckbox = false,
}) => {
    const urgencyColor = getUrgencyColor(product.urgencyLevel);
    const urgencyEmoji = getUrgencyEmoji(product.urgencyLevel);
    const urgencyLabel = getUrgencyLabel(product.urgencyLevel);



    const getDaysRemainingText = () => {
        if (product.daysRemaining === null) {
            return 'Belum ada data';
        }
        if (product.daysRemaining < 0) {
            return `Sudah lewat ${Math.abs(product.daysRemaining)} hari`;
        }
        if (product.daysRemaining === 0) {
            return 'Habis hari ini';
        }
        if (product.daysRemaining === 1) {
            return 'Habis besok';
        }
        return `${product.daysRemaining} hari lagi`;
    };

    return (
        <TouchableOpacity
            style={[styles.card, { borderLeftColor: urgencyColor }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    <Text style={styles.emoji}>{urgencyEmoji}</Text>
                    <View style={styles.titleContainer}>
                        <Text style={styles.productName}>{product.name}</Text>
                        <Text style={styles.category}>{product.category}</Text>
                    </View>
                </View>
                {showCheckbox && onCheck && (
                    <TouchableOpacity
                        style={styles.checkbox}
                        onPress={onCheck}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <View style={styles.checkboxInner} />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Status</Text>
                    <Text style={[styles.infoValue, { color: urgencyColor }]}>
                        {urgencyLabel}
                    </Text>
                </View>
                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Prediksi Habis</Text>
                    <Text style={styles.infoValue}>{getDaysRemainingText()}</Text>
                </View>
            </View>

            <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Kemasan</Text>
                    <Text style={styles.infoValue}>
                        {product.packagingSize} {product.defaultUnit}
                    </Text>
                </View>
                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Terakhir Beli</Text>
                    <Text style={styles.infoValue}>{formatRelativeDate(product.lastPurchaseDate)}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderLeftWidth: 4,
        elevation: 3,
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    emoji: {
        fontSize: 32,
        marginRight: 12,
    },
    titleContainer: {
        flex: 1,
    },
    productName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 2,
    },
    category: {
        fontSize: 14,
        color: '#6B7280',
    },
    checkbox: {
        width: 28,
        height: 28,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#3B82F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    checkboxInner: {
        width: 16,
        height: 16,
        borderRadius: 4,
        backgroundColor: 'transparent',
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    infoItem: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
});
