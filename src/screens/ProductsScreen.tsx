import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Modal,
    ScrollView,
} from 'react-native';
import { showAlert } from '../utils/alert';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../store';
import { useToast } from '../context/ToastContext';
import { ProductCard, Button, Input, AppHeader } from '../components';

export const ProductsScreen: React.FC = () => {
    const { productsWithUrgency, loadProducts, addProduct, updateProduct, deleteProduct } = useStore();
    const { showToast } = useToast();
    const [modalVisible, setModalVisible] = useState(false);
    const [editingProductId, setEditingProductId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        defaultUnit: '',
        packagingSize: '',
    });

    // Initial load is handled by AppNavigator

    const handleSaveProduct = async () => {
        if (!formData.name.trim() || !formData.category.trim() || !formData.defaultUnit.trim() || !formData.packagingSize) {
            showToast('Semua field harus diisi', 'error');
            return;
        }

        const size = parseFloat(formData.packagingSize);
        if (isNaN(size) || size <= 0) {
            showToast('Ukuran kemasan harus berupa angka positif (Contoh: 5, 10)', 'error');
            return;
        }

        try {
            if (editingProductId) {
                // Update existing product
                const productToUpdate = productsWithUrgency.find(p => p.id === editingProductId);
                if (productToUpdate) {
                    await updateProduct({
                        ...productToUpdate,
                        name: formData.name,
                        category: formData.category,
                        defaultUnit: formData.defaultUnit,
                        packagingSize: size,
                    });
                    showToast('Produk berhasil diperbarui!', 'success');
                }
            } else {
                // Add new product
                await addProduct({
                    name: formData.name,
                    category: formData.category,
                    defaultUnit: formData.defaultUnit,
                    packagingSize: size,
                });
                showToast('Produk berhasil ditambahkan!', 'success');
            }

            handleCloseModal();
        } catch (error) {
            showToast('Gagal menyimpan produk', 'error');
        }
    };

    const handleEditProduct = (product: any) => {
        setEditingProductId(product.id);
        setFormData({
            name: product.name,
            category: product.category,
            defaultUnit: product.defaultUnit,
            packagingSize: product.packagingSize.toString(),
        });
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setEditingProductId(null);
        setFormData({
            name: '',
            category: '',
            defaultUnit: '',
            packagingSize: '',
        });
    };

    const handleDeleteProduct = (productId: string, productName: string) => {
        showAlert(
            'Hapus Produk',
            `Apakah Anda yakin ingin menghapus "${productName}"? Semua riwayat pembelian akan ikut terhapus.`,
            [
                { text: 'Batal', style: 'cancel' },
                {
                    text: 'Hapus',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteProduct(productId);
                            showToast('Produk berhasil dihapus', 'success');
                        } catch (error) {
                            showToast('Gagal menghapus produk', 'error');
                        }
                    },
                },
            ]
        );
    };

    const handleProductPress = (product: any) => {
        showAlert(
            'Opsi Produk',
            `Pilih aksi untuk "${product.name}"`,
            [
                { text: 'Batal', style: 'cancel' },
                {
                    text: 'Edit',
                    onPress: () => handleEditProduct(product),
                },
                {
                    text: 'Hapus',
                    style: 'destructive',
                    onPress: () => handleDeleteProduct(product.id, product.name),
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <AppHeader />

            <View style={styles.ctaContainer}>
                <View style={styles.ctaButton}>
                    <View style={styles.ctaContent}>
                        <Text style={styles.ctaEmoji}>📦</Text>
                        <Text style={styles.ctaText}>
                            {productsWithUrgency.length} Produk Terdaftar
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => setModalVisible(true)}
                    >
                        <Text style={styles.addButtonText}>+ Tambah</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={productsWithUrgency}
                renderItem={({ item }) => (
                    <ProductCard
                        product={item}
                        onPress={() => handleProductPress(item)}
                    />
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyEmoji}>📦</Text>
                        <Text style={styles.emptyText}>Belum ada produk</Text>
                        <Text style={styles.emptySubtext}>
                            Tap tombol "+ Tambah" untuk menambahkan produk pertama
                        </Text>
                    </View>
                }
            />

            {/* Add/Edit Product Modal */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={handleCloseModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {editingProductId ? 'Edit Produk' : 'Tambah Produk Baru'}
                        </Text>

                        <ScrollView style={styles.modalForm}>
                            <Input
                                label="Nama Produk"
                                value={formData.name}
                                onChangeText={(text) => setFormData({ ...formData, name: text })}
                                placeholder="Contoh: Beras"
                            />

                            <Input
                                label="Kategori"
                                value={formData.category}
                                onChangeText={(text) => setFormData({ ...formData, category: text })}
                                placeholder="Contoh: Sembako"
                            />

                            <Input
                                label="Satuan"
                                value={formData.defaultUnit}
                                onChangeText={(text) => setFormData({ ...formData, defaultUnit: text })}
                                placeholder="Contoh: kg, pack, botol, liter"
                            />

                            <Input
                                label="Ukuran Kemasan"
                                value={formData.packagingSize}
                                onChangeText={(text) => setFormData({ ...formData, packagingSize: text })}
                                keyboardType="numeric"
                                placeholder="Contoh: 5, 10"
                            />

                            <Text style={styles.helperText}>
                                💡 Ukuran kemasan adalah jumlah dalam satu kali pembelian (misal: 5 kg, 1 pack)
                            </Text>
                        </ScrollView>

                        <View style={styles.modalButtons}>
                            <Button
                                title="Batal"
                                onPress={handleCloseModal}
                                variant="secondary"
                                style={styles.modalButton}
                            />
                            <Button
                                title="Simpan"
                                onPress={handleSaveProduct}
                                style={styles.modalButton}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
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
        paddingVertical: 12,
        paddingHorizontal: 16,
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
    addButton: {
        backgroundColor: '#3B82F6',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 10,
    },
    addButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },
    list: {
        padding: 16,
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 20,
    },
    modalForm: {
        marginBottom: 20,
    },
    helperText: {
        fontSize: 13,
        color: '#6B7280',
        fontStyle: 'italic',
        marginTop: 8,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    modalButton: {
        flex: 1,
    },
});
