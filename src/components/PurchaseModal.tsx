import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Input } from './Input';
import { Button } from './Button';
import { DateInput } from './DateInput';
import { useStore } from '../store';
import { Product } from '../types';
import { format } from 'date-fns';
import { useToast } from '../context/ToastContext';

interface PurchaseModalProps {
    visible: boolean;
    onClose: () => void;
    preselectedProduct?: Product | null;
}

export const PurchaseModal: React.FC<PurchaseModalProps> = ({
    visible,
    onClose,
    preselectedProduct,
}) => {
    const { products, addProduct, addPurchase } = useStore();
    const { showToast } = useToast();

    // Form State
    const [productName, setProductName] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isNewProduct, setIsNewProduct] = useState(false);

    // New Product Details
    const [category, setCategory] = useState('');
    const [unit, setUnit] = useState('');
    const [packagingSize, setPackagingSize] = useState('');

    // Purchase Details
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [date, setDate] = useState('');

    // Search State
    const [suggestions, setSuggestions] = useState<Product[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        if (visible) {
            resetForm();
            if (preselectedProduct) {
                selectProduct(preselectedProduct);
            }
        }
    }, [visible, preselectedProduct]);

    const resetForm = () => {
        setProductName('');
        setSelectedProduct(null);
        setIsNewProduct(false);
        setCategory('');
        setUnit('');
        setPackagingSize('');
        setQuantity('');
        setPrice('');
        setDate(format(new Date(), 'yyyy-MM-dd'));
        setSuggestions([]);
        setShowSuggestions(false);
    };

    const handleNameChange = (text: string) => {
        setProductName(text);
        setSelectedProduct(null); // Reset selection when typing

        if (text.length > 0) {
            const filtered = products.filter(p =>
                p.name.toLowerCase().includes(text.toLowerCase())
            );
            setSuggestions(filtered);
            setShowSuggestions(true);

            // Check if exact match exists to toggle "New Product" mode
            const exactMatch = products.find(p => p.name.toLowerCase() === text.toLowerCase());
            setIsNewProduct(!exactMatch);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
            setIsNewProduct(false);
        }
    };

    const selectProduct = (product: Product) => {
        setProductName(product.name);
        setSelectedProduct(product);
        setUnit(product.defaultUnit);
        setPackagingSize(product.packagingSize.toString());
        setSuggestions([]);
        setShowSuggestions(false);
        setIsNewProduct(false);

        // Auto-fill quantity with packaging size as a starting point
        setQuantity(product.packagingSize.toString());
    };

    const handleSubmit = async () => {
        if (!productName.trim()) {
            showToast('Nama barang harus diisi', 'error');
            return;
        }

        const qty = parseFloat(quantity);
        const prc = parseFloat(price);

        if (!quantity || isNaN(qty) || qty <= 0) {
            showToast('Jumlah harus berupa angka positif (Contoh: 1, 2.5)', 'error');
            return;
        }

        if (!price || isNaN(prc) || prc < 0) {
            showToast('Harga harus diisi dengan angka valid', 'error');
            return;
        }

        if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) {
            showToast('Format tanggal salah (Gunakan YYYY-MM-DD)', 'error');
            return;
        }

        try {
            let productId = selectedProduct?.id;
            let currentUnit = unit;

            // If new product or no ID (meaning we're creating one)
            if (!productId) {
                if (!category.trim() || !unit.trim() || !packagingSize) {
                    showToast('Mohon lengkapi data produk baru (Kategori, Satuan, Ukuran)', 'error');
                    return;
                }

                const size = parseFloat(packagingSize);
                if (isNaN(size) || size <= 0) {
                    showToast('Ukuran kemasan harus angka positif (Contoh: 5, 10)', 'error');
                    return;
                }

                // Create new product
                productId = await addProduct({
                    name: productName,
                    category,
                    defaultUnit: unit,
                    packagingSize: size,
                });
                currentUnit = unit;
            } else {
                // Use existing product's unit
                currentUnit = selectedProduct!.defaultUnit;
            }

            // Add Purchase
            await addPurchase({
                productId: productId!,
                date: date,
                quantity: qty,
                unit: currentUnit,
                price: prc,
            });

            showToast('Pembelian berhasil dicatat!', 'success');
            onClose();
        } catch (error) {
            console.error(error);
            showToast('Gagal menyimpan data', 'error');
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.modalOverlay}
            >
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.modalTitle}>Catat Belanja</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.closeButton}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.formContainer} keyboardShouldPersistTaps="handled">
                        {/* Product Name Search */}
                        <View style={styles.inputGroup}>
                            <Input
                                label="Nama Barang"
                                value={productName}
                                onChangeText={handleNameChange}
                                placeholder="Cari atau ketik nama barang baru..."
                            />

                            {/* Suggestions Dropdown */}
                            {showSuggestions && suggestions.length > 0 && (
                                <View style={styles.suggestionsContainer}>
                                    {suggestions.map((item) => (
                                        <TouchableOpacity
                                            key={item.id}
                                            style={styles.suggestionItem}
                                            onPress={() => selectProduct(item)}
                                        >
                                            <Text style={styles.suggestionName}>{item.name}</Text>
                                            <Text style={styles.suggestionDetail}>
                                                {item.category} • {item.packagingSize} {item.defaultUnit}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>

                        {/* New Product Fields */}
                        {(!selectedProduct && productName.length > 0) && (
                            <View style={styles.newProductSection}>
                                <Text style={styles.sectionLabel}>✨ Produk Baru</Text>
                                <Input
                                    label="Kategori"
                                    value={category}
                                    onChangeText={setCategory}
                                    placeholder="Contoh: Sembako"
                                />
                                <View style={styles.row}>
                                    <View style={{ flex: 1, marginRight: 8 }}>
                                        <Input
                                            label="Satuan"
                                            value={unit}
                                            onChangeText={setUnit}
                                            placeholder="Contoh: kg, pcs, liter"
                                        />
                                    </View>
                                    <View style={{ flex: 1, marginLeft: 8 }}>
                                        <Input
                                            label="Ukuran Kemasan"
                                            value={packagingSize}
                                            onChangeText={setPackagingSize}
                                            keyboardType="numeric"
                                            placeholder="Contoh: 1, 0.5"
                                        />
                                    </View>
                                </View>
                            </View>
                        )}

                        {/* Purchase Details */}
                        <View style={styles.purchaseSection}>
                            <Text style={styles.sectionLabel}>📝 Detail Pembelian</Text>

                            <DateInput
                                label="Tanggal"
                                value={date}
                                onChange={setDate}
                            />

                            <View style={styles.row}>
                                <View style={{ flex: 1, marginRight: 8 }}>
                                    <Input
                                        label="Jumlah Dibeli"
                                        value={quantity}
                                        onChangeText={setQuantity}
                                        keyboardType="numeric"
                                        placeholder="Contoh: 50000"
                                    />
                                </View>
                                <View style={{ flex: 1, marginLeft: 8 }}>
                                    <Input
                                        label="Satuan"
                                        value={selectedProduct ? selectedProduct.defaultUnit : unit}
                                        editable={false}
                                        placeholder="-"
                                    />
                                </View>
                            </View>

                            <Input
                                label="Harga Total"
                                value={price}
                                onChangeText={setPrice}
                                keyboardType="numeric"
                                placeholder="Rp 0"
                            />
                        </View>
                    </ScrollView>

                    <View style={styles.footer}>
                        <Button
                            title="Simpan"
                            onPress={handleSubmit}
                        />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: '90%',
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
    },
    closeButton: {
        fontSize: 24,
        color: '#9CA3AF',
        padding: 4,
    },
    formContainer: {
        flex: 1,
        padding: 20,
    },
    inputGroup: {
        marginBottom: 20,
        zIndex: 10, // Ensure suggestions float on top
    },
    suggestionsContainer: {
        position: 'absolute',
        top: 70, // Adjust based on Input height
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        elevation: 4,
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        maxHeight: 200,
        zIndex: 100,
    },
    suggestionItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    suggestionName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    suggestionDetail: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    newProductSection: {
        backgroundColor: '#F9FAFB',
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    purchaseSection: {
        marginBottom: 20,
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#374151',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    row: {
        flexDirection: 'row',
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
});
