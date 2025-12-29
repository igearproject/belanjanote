import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';
import { showAlert } from '../utils/alert';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../store';
import { Button, AppHeader } from '../components';
import * as DocumentPicker from 'expo-document-picker';
import { File } from 'expo-file-system';

export const SettingsScreen: React.FC = () => {
    const { exportData, importData, products, purchaseHistory } = useStore();
    const [loading, setLoading] = useState(false);

    const handleExport = async () => {
        try {
            setLoading(true);
            await exportData();
            showAlert('Berhasil', 'Data berhasil diekspor!');
        } catch (error) {
            showAlert('Error', 'Gagal mengekspor data');
        } finally {
            setLoading(false);
        }
    };

    const handleImport = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/json',
                copyToCacheDirectory: true,
            });

            if (result.canceled) {
                return;
            }

            const fileUri = result.assets[0].uri;

            let fileContent: string;
            if (fileUri.startsWith('file://')) {
                // Mobile: use File API
                const file = new File(fileUri);
                fileContent = await file.text();
            } else {
                // Web: fetch the file content
                const response = await fetch(fileUri);
                fileContent = await response.text();
            }

            showAlert(
                'Konfirmasi Import',
                'Import data akan menghapus semua data yang ada. Apakah Anda yakin?',
                [
                    { text: 'Batal', style: 'cancel' },
                    {
                        text: 'Import',
                        style: 'destructive',
                        onPress: async () => {
                            try {
                                setLoading(true);
                                await importData(fileContent);
                            } catch (error) {
                                showAlert('Error', 'Gagal mengimport data. Pastikan file valid.');
                            } finally {
                                setLoading(false);
                            }
                        },
                    },
                ]
            );
        } catch (error) {
            showAlert('Error', 'Gagal membaca file');
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <AppHeader />

            <ScrollView style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Data</Text>

                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Total Produk</Text>
                            <Text style={styles.infoValue}>{products.length}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Total Transaksi</Text>
                            <Text style={styles.infoValue}>{purchaseHistory.length}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Backup & Restore</Text>

                    <Button
                        title="📤 Export Data"
                        onPress={handleExport}
                        loading={loading}
                        style={styles.button}
                    />

                    <Button
                        title="📥 Import Data"
                        onPress={handleImport}
                        variant="secondary"
                        loading={loading}
                        style={styles.button}
                    />

                    <View style={styles.helpCard}>
                        <Text style={styles.helpTitle}>💡 Cara Menggunakan</Text>
                        <Text style={styles.helpText}>
                            • <Text style={styles.helpBold}>Export:</Text> Simpan data Anda ke file JSON yang bisa dipindahkan ke perangkat lain.
                        </Text>
                        <Text style={styles.helpText}>
                            • <Text style={styles.helpBold}>Import:</Text> Restore data dari file JSON. Semua data lama akan diganti.
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Tentang Aplikasi</Text>

                    <View style={styles.aboutCard}>
                        <Image
                            source={require('../../assets/Gemini_belanja_note_logo_3d.png')}
                            style={styles.aboutLogo}
                        />
                        <Text style={styles.aboutTitle}>BelanjaNote by Sipintek.com</Text>
                        <Text style={styles.aboutVersion}>Versi 1.0.0</Text>
                        <Text style={styles.aboutDescription}>
                            Aplikasi untuk mencatat belanja dan memprediksi kebutuhan berdasarkan pola konsumsi Anda.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 12,
    },
    infoCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        elevation: 3,
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    infoLabel: {
        fontSize: 16,
        color: '#6B7280',
    },
    infoValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#3B82F6',
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 8,
    },
    button: {
        marginBottom: 12,
    },
    helpCard: {
        backgroundColor: '#EFF6FF',
        borderRadius: 12,
        padding: 16,
        marginTop: 16,
        borderWidth: 1,
        borderColor: '#BFDBFE',
    },
    helpTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E40AF',
        marginBottom: 12,
    },
    helpText: {
        fontSize: 14,
        color: '#1E40AF',
        marginBottom: 8,
        lineHeight: 20,
    },
    helpBold: {
        fontWeight: '700',
    },
    aboutCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        elevation: 3,
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    },
    aboutLogo: {
        width: 80,
        height: 80,
        marginBottom: 16,
        borderRadius: 16,
    },
    aboutTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 4,
    },
    aboutVersion: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 12,
    },
    aboutDescription: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 20,
    },
});
