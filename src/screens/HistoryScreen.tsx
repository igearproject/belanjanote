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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../store';
import { format, parseISO } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { formatCurrency } from '../utils';
import { AppHeader, Input, Button, StatisticsModal, DateInput } from '../components';
import { showAlert } from '../utils/alert';
import { useToast } from '../context/ToastContext';
import { PurchaseHistory } from '../types';

export const HistoryScreen: React.FC = () => {
    const { purchaseHistory, products, loadPurchaseHistory, updatePurchase, deletePurchase } = useStore();
    const { showToast } = useToast();
    const [modalVisible, setModalVisible] = useState(false);
    const [statsVisible, setStatsVisible] = useState(false);
    const [editingPurchase, setEditingPurchase] = useState<PurchaseHistory | null>(null);
    const [formData, setFormData] = useState({
        quantity: '',
        price: '',
        date: '',
    });

    useEffect(() => {
        // Initial load is handled by AppNavigator
    }, []);

    const getProductName = (productId: string) => {
        const product = products.find((p) => p.id === productId);
        return product?.name || 'Produk Tidak Diketahui';
    };

    const formatDate = (dateString: string) => {
        try {
            return format(parseISO(dateString), 'dd MMM yyyy', { locale: idLocale });
        } catch {
            return dateString;
        }
    };

    const groupByDate = () => {
        const grouped: { [key: string]: typeof purchaseHistory } = {};

        purchaseHistory.forEach((purchase) => {
            const date = purchase.date;
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(purchase);
        });

        return Object.entries(grouped).sort((a, b) => b[0].localeCompare(a[0]));
    };

    const groupedHistory = groupByDate();

    const handleEditPurchase = (purchase: PurchaseHistory) => {
        setEditingPurchase(purchase);
        setFormData({
            quantity: purchase.quantity.toString(),
            price: purchase.price ? purchase.price.toString() : '',
            date: purchase.date,
        });
        setModalVisible(true);
    };

    const handleSavePurchase = async () => {
        if (!editingPurchase) return;

        const qty = parseFloat(formData.quantity);
        const prc = parseFloat(formData.price);

        if (!formData.quantity || isNaN(qty) || qty <= 0) {
            showToast('Jumlah harus berupa angka positif (Contoh: 1, 2.5)', 'error');
            return;
        }

        if (!formData.price || isNaN(prc) || prc < 0) {
            showToast('Harga harus diisi dengan angka valid', 'error');
            return;
        }

        if (!formData.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
            showToast('Format tanggal salah (Gunakan YYYY-MM-DD)', 'error');
            return;
        }

        try {
            await updatePurchase({
                ...editingPurchase,
                quantity: qty,
                price: prc,
                date: formData.date,
            });
            showToast('Riwayat pembelian diperbarui', 'success');
            setModalVisible(false);
            setEditingPurchase(null);
        } catch (error) {
            showToast('Gagal memperbarui riwayat', 'error');
        }
    };

    const handleDeletePurchase = (purchaseId: string) => {
        showAlert(
            'Hapus Riwayat',
            'Apakah Anda yakin ingin menghapus catatan pembelian ini?',
            [
                { text: 'Batal', style: 'cancel' },
                {
                    text: 'Hapus',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deletePurchase(purchaseId);
                            showToast('Riwayat dihapus', 'success');
                        } catch (error) {
                            showToast('Gagal menghapus riwayat', 'error');
                        }
                    },
                },
            ]
        );
    };

    const handleHistoryPress = (purchase: PurchaseHistory) => {
        const productName = getProductName(purchase.productId);
        showAlert(
            'Opsi Riwayat',
            `Aksi untuk pembelian ${productName}`,
            [
                { text: 'Batal', style: 'cancel' },
                {
                    text: 'Edit',
                    onPress: () => handleEditPurchase(purchase),
                },
                {
                    text: 'Hapus',
                    style: 'destructive',
                    onPress: () => handleDeletePurchase(purchase.id),
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <AppHeader />

            <View style={styles.ctaContainer}>
                <TouchableOpacity
                    style={styles.ctaButton}
                    onPress={() => setStatsVisible(true)}
                    activeOpacity={0.8}
                >
                    <View style={styles.ctaContent}>
                        <Text style={styles.ctaEmoji}>📊</Text>
                        <View>
                            <Text style={styles.ctaText}>
                                {purchaseHistory.length} Transaksi Tercatat
                            </Text>
                            <Text style={styles.ctaSubtext}>
                                Ketuk untuk lihat statistik lengkap
                            </Text>
                        </View>
                    </View>
                    <Text style={styles.ctaArrow}>→</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={groupedHistory}
                renderItem={({ item: [date, purchases] }) => (
                    <View style={styles.dateGroup}>
                        <Text style={styles.dateHeader}>{formatDate(date)}</Text>
                        {purchases.map((purchase) => (
                            <TouchableOpacity
                                key={purchase.id}
                                style={styles.historyCard}
                                onPress={() => handleHistoryPress(purchase)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.historyMain}>
                                    <Text style={styles.productName}>
                                        {getProductName(purchase.productId)}
                                    </Text>
                                    <Text style={styles.quantity}>
                                        {purchase.quantity} {purchase.unit}
                                    </Text>
                                </View>
                                {purchase.price && (
                                    <Text style={styles.price}>{formatCurrency(purchase.price)}</Text>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
                keyExtractor={([date]) => date}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyEmoji}>📜</Text>
                        <Text style={styles.emptyText}>Belum ada riwayat</Text>
                        <Text style={styles.emptySubtext}>
                            Riwayat pembelian akan muncul di sini
                        </Text>
                    </View>
                }
            />

            <StatisticsModal
                visible={statsVisible}
                onClose={() => setStatsVisible(false)}
            />

            {/* Edit Purchase Modal */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Edit Pembelian</Text>
                        <Text style={styles.modalSubtitle}>
                            {editingPurchase ? getProductName(editingPurchase.productId) : ''}
                        </Text>

                        <ScrollView style={styles.modalForm}>
                            <DateInput
                                label="Tanggal"
                                value={formData.date}
                                onChange={(text) => setFormData({ ...formData, date: text })}
                            />

                            <Input
                                label="Jumlah"
                                value={formData.quantity}
                                onChangeText={(text) => setFormData({ ...formData, quantity: text })}
                                keyboardType="numeric"
                                placeholder="Contoh: 1, 2.5"
                            />

                            <Input
                                label={`Satuan: ${editingPurchase?.unit}`}
                                value={editingPurchase?.unit || ''}
                                editable={false}
                            />

                            <Input
                                label="Harga Total"
                                value={formData.price}
                                onChangeText={(text) => setFormData({ ...formData, price: text })}
                                keyboardType="numeric"
                                placeholder="Contoh: 50000"
                            />
                        </ScrollView>

                        <View style={styles.modalButtons}>
                            <Button
                                title="Batal"
                                onPress={() => setModalVisible(false)}
                                variant="secondary"
                                style={styles.modalButton}
                            />
                            <Button
                                title="Simpan"
                                onPress={handleSavePurchase}
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
    ctaSubtext: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    ctaArrow: {
        fontSize: 20,
        color: '#9CA3AF',
        fontWeight: '600',
    },
    list: {
        padding: 16,
    },
    dateGroup: {
        marginBottom: 24,
    },
    dateHeader: {
        fontSize: 16,
        fontWeight: '700',
        color: '#374151',
        marginBottom: 12,
    },
    historyCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 8,
        elevation: 2,
        boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.05)',
    },
    historyMain: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    productName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        flex: 1,
    },
    quantity: {
        fontSize: 14,
        fontWeight: '600',
        color: '#3B82F6',
    },
    price: {
        fontSize: 14,
        color: '#6B7280',
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
        marginBottom: 4,
    },
    modalSubtitle: {
        fontSize: 16,
        color: '#6B7280',
        marginBottom: 20,
    },
    modalForm: {
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    modalButton: {
        flex: 1,
    },
});
