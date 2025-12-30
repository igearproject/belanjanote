import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const PrivacyPolicyScreen: React.FC = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Kebijakan Privasi</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>Kembali</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>1. Informasi yang Kami Kumpulkan</Text>
                    <Text style={styles.text}>
                        BelanjaNote adalah aplikasi yang berfokus pada privasi. Kami tidak mengumpulkan data pribadi di server kami. Semua data belanja, daftar produk, dan riwayat transaksi Anda disimpan secara lokal di perangkat Anda menggunakan database SQLite.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>2. Penggunaan Data</Text>
                    <Text style={styles.text}>
                        Data yang Anda masukkan digunakan semata-mata untuk fungsi aplikasi, termasuk:
                        {"\n"}• Menghitung rata-rata konsumsi barang.
                        {"\n"}• Memberikan prediksi kapan barang akan habis.
                        {"\n"}• Menampilkan riwayat belanja Anda.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>3. Penyimpanan Data & Keamanan</Text>
                    <Text style={styles.text}>
                        Karena data disimpan secara lokal, keamanan data Anda bergantung pada keamanan perangkat Anda sendiri. Fitur "Export Data" memungkinkan Anda membuat cadangan data dalam format JSON. Kami menyarankan Anda untuk menjaga file ini dengan aman.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>4. Izin Perangkat</Text>
                    <Text style={styles.text}>
                        Aplikasi mungkin memerlukan izin tertentu:
                        {"\n"}• <Text style={styles.bold}>Penyimpanan:</Text> Untuk menyimpan database dan melakukan fitur export/import data.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>5. Perubahan Kebijakan</Text>
                    <Text style={styles.text}>
                        Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan akan berlaku segera setelah dipublikasikan di halaman ini.
                    </Text>
                </View>

                <View style={styles.sectionLast}>
                    <Text style={styles.sectionTitle}>Hubungi Kami</Text>
                    <Text style={styles.text}>
                        Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami di support@sipintek.com.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        backgroundColor: '#FFFFFF',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
    },
    backButton: {
        padding: 8,
    },
    backButtonText: {
        fontSize: 16,
        color: '#3B82F6',
        fontWeight: '600',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    section: {
        marginBottom: 24,
    },
    sectionLast: {
        marginBottom: 40,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 10,
    },
    text: {
        fontSize: 15,
        color: '#4B5563',
        lineHeight: 22,
    },
    bold: {
        fontWeight: '700',
    },
});
