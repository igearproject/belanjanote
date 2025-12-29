import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    RefreshControl,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../store';
import { ProductCard, AppHeader, PurchaseModal } from '../components';
import { ProductWithUrgency } from '../types';

export const HomeScreen: React.FC = () => {
    const { productsWithUrgency, loadProducts } = useStore();
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductWithUrgency | null>(null);

    // Initial load is handled by AppNavigator

    const onRefresh = async () => {
        setRefreshing(true);
        await loadProducts();
        setRefreshing(false);
    };

    const handleCheckProduct = (product: ProductWithUrgency) => {
        setSelectedProduct(product);
        setModalVisible(true);
    };

    const handleOpenManualPurchase = () => {
        setSelectedProduct(null);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedProduct(null);
    };

    const groupedProducts = {
        critical: productsWithUrgency.filter((p) => p.urgencyLevel === 'critical'),
        high: productsWithUrgency.filter((p) => p.urgencyLevel === 'high'),
        medium: productsWithUrgency.filter((p) => p.urgencyLevel === 'medium'),
        low: productsWithUrgency.filter((p) => p.urgencyLevel === 'low'),
        unknown: productsWithUrgency.filter((p) => p.urgencyLevel === 'unknown'),
    };

    const renderSection = (title: string, products: ProductWithUrgency[], emoji: string) => {
        if (products.length === 0) return null;

        return (
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                    {emoji} {title} ({products.length})
                </Text>
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        showCheckbox
                        onCheck={() => handleCheckProduct(product)}
                    />
                ))}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <AppHeader />

            <View style={styles.ctaContainer}>
                <TouchableOpacity
                    style={styles.ctaButton}
                    activeOpacity={0.8}
                    onPress={handleOpenManualPurchase}
                >
                    <View style={styles.ctaContent}>
                        <Text style={styles.ctaEmoji}>📝</Text>
                        <Text style={styles.ctaText}>Catat Belanja Manual</Text>
                    </View>
                    <Text style={styles.ctaArrow}>+</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={[1]} // Dummy data to use FlatList for scroll
                renderItem={() => (
                    <View style={styles.content}>
                        {renderSection('Harus Beli Sekarang', groupedProducts.critical, '🔴')}
                        {renderSection('Perlu Beli Segera', groupedProducts.high, '🟠')}
                        {renderSection('Persiapan', groupedProducts.medium, '🟡')}
                        {renderSection('Stok Aman', groupedProducts.low, '🟢')}
                        {renderSection('Belum Ada Data', groupedProducts.unknown, '⚪')}

                        {productsWithUrgency.length === 0 && (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyEmoji}>📦</Text>
                                <Text style={styles.emptyText}>Belum ada barang terdaftar</Text>
                                <Text style={styles.emptySubtext}>
                                    Tambahkan barang pertama Anda dengan tombol "Catat Belanja Manual"
                                </Text>
                            </View>
                        )}
                    </View>
                )}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                keyExtractor={() => 'content'}
            />

            <PurchaseModal
                visible={modalVisible}
                onClose={handleCloseModal}
                preselectedProduct={selectedProduct}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    ctaContainer: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
    },
    ctaButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingVertical: 14,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 4,
        boxShadow: '0px 4px 12px rgba(59, 130, 246, 0.1)',
        borderWidth: 1,
        borderColor: '#EBF2FF',
    },
    ctaContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ctaEmoji: {
        fontSize: 20,
        marginRight: 12,
    },
    ctaText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
    },
    ctaArrow: {
        fontSize: 24,
        fontWeight: '700',
        color: '#3B82F6',
    },
    content: {
        padding: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 12,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyEmoji: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#9CA3AF',
        textAlign: 'center',
        paddingHorizontal: 40,
    },
});
