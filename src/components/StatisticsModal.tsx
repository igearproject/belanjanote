import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useStore } from '../store';
import { format, subDays, subMonths, subYears, startOfDay, startOfWeek, startOfMonth, startOfYear, isSameDay, isSameWeek, isSameMonth, isSameYear, parseISO, getMonth, getYear } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { formatCurrency } from '../utils';

interface StatisticsModalProps {
    visible: boolean;
    onClose: () => void;
}

type ChartPeriod = 'day' | 'week' | 'month' | 'year';

export const StatisticsModal: React.FC<StatisticsModalProps> = ({ visible, onClose }) => {
    const { purchaseHistory, products } = useStore();
    const [period, setPeriod] = useState<ChartPeriod>('month');

    const screenWidth = Dimensions.get('window').width;

    // --- Chart Data Calculation ---
    const chartData = useMemo(() => {
        const now = new Date();
        let labels: string[] = [];
        let data: number[] = [];
        let groupedData: { [key: string]: number } = {};

        // 1. Determine Range and Grouping
        if (period === 'day') {
            // Last 7 days
            for (let i = 6; i >= 0; i--) {
                const d = subDays(now, i);
                const key = format(d, 'yyyy-MM-dd');
                groupedData[key] = 0;
                labels.push(format(d, 'dd/MM'));
            }
        } else if (period === 'week') {
            // Last 4 weeks
            for (let i = 3; i >= 0; i--) {
                const d = subDays(now, i * 7);
                const key = format(startOfWeek(d), 'yyyy-MM-dd');
                groupedData[key] = 0;
                labels.push(`M${4 - i}`);
            }
        } else if (period === 'month') {
            // Last 6 months
            for (let i = 5; i >= 0; i--) {
                const d = subMonths(now, i);
                const key = format(startOfMonth(d), 'yyyy-MM');
                groupedData[key] = 0;
                labels.push(format(d, 'MMM'));
            }
        } else if (period === 'year') {
            // Last 5 years
            for (let i = 4; i >= 0; i--) {
                const d = subYears(now, i);
                const key = format(startOfYear(d), 'yyyy');
                groupedData[key] = 0;
                labels.push(format(d, 'yyyy'));
            }
        }

        // 2. Aggregate Data
        purchaseHistory.forEach(purchase => {
            if (!purchase.price) return;
            const pDate = parseISO(purchase.date);
            let key = '';

            if (period === 'day') {
                if (pDate >= subDays(startOfDay(now), 6)) {
                    key = format(pDate, 'yyyy-MM-dd');
                }
            } else if (period === 'week') {
                if (pDate >= subDays(startOfWeek(now), 21)) { // Approx 3 weeks back + current
                    key = format(startOfWeek(pDate), 'yyyy-MM-dd');
                }
            } else if (period === 'month') {
                if (pDate >= subMonths(startOfMonth(now), 5)) {
                    key = format(startOfMonth(pDate), 'yyyy-MM');
                }
            } else if (period === 'year') {
                if (pDate >= subYears(startOfYear(now), 4)) {
                    key = format(startOfYear(pDate), 'yyyy');
                }
            }

            if (key && groupedData.hasOwnProperty(key)) {
                groupedData[key] += purchase.price;
            }
        });

        data = Object.values(groupedData);

        return {
            labels,
            datasets: [{ data }],
        };
    }, [purchaseHistory, period]);

    // --- Top 5 Items Calculation ---
    const topProducts = useMemo(() => {
        const counts: { [key: string]: number } = {};

        purchaseHistory.forEach(p => {
            counts[p.productId] = (counts[p.productId] || 0) + 1;
        });

        const sortedIds = Object.keys(counts).sort((a, b) => counts[b] - counts[a]).slice(0, 5);

        return sortedIds.map(id => {
            const product = products.find(p => p.id === id);
            return {
                name: product?.name || 'Unknown',
                count: counts[id]
            };
        });
    }, [purchaseHistory, products]);

    // --- Monthly Expenses List ---
    const monthlyExpenses = useMemo(() => {
        const expenses: { [key: string]: number } = {};

        purchaseHistory.forEach(p => {
            if (!p.price) return;
            const key = format(parseISO(p.date), 'MMMM yyyy', { locale: idLocale });
            expenses[key] = (expenses[key] || 0) + p.price;
        });

        return Object.entries(expenses).sort((a, b) => {
            // Sort by date descending (needs parsing back or smart sorting)
            // Simple hack: compare year and month index
            // Better: just rely on the fact that keys are unique, but sorting might be tricky with just strings.
            // Let's re-do with a sortable key.
            return 0;
        }).map(([month, total]) => ({ month, total }));

        // Better approach for sorting
        const groupedMap = new Map<string, number>();
        purchaseHistory.forEach(p => {
            if (!p.price) return;
            const d = parseISO(p.date);
            const sortKey = format(d, 'yyyy-MM');
            const displayKey = format(d, 'MMMM yyyy', { locale: idLocale });
            // We use a composite object or just sort keys first
        });

        // Re-implementation for sorted list
        const temp: { date: Date, total: number }[] = [];
        purchaseHistory.forEach(p => {
            if (!p.price) return;
            const d = startOfMonth(parseISO(p.date));
            const existing = temp.find(t => isSameMonth(t.date, d) && isSameYear(t.date, d));
            if (existing) {
                existing.total += p.price;
            } else {
                temp.push({ date: d, total: p.price });
            }
        });

        return temp.sort((a, b) => b.date.getTime() - a.date.getTime()).map(t => ({
            month: format(t.date, 'MMMM yyyy', { locale: idLocale }),
            total: t.total
        }));

    }, [purchaseHistory]);


    return (
        <Modal
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
            presentationStyle="pageSheet"
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Statistik Pengeluaran</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeText}>Tutup</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.content}>
                    {/* Chart Section */}
                    <View style={styles.chartSection}>
                        <Text style={styles.sectionTitle}>Grafik Pengeluaran</Text>

                        <View style={styles.segmentControl}>
                            {(['day', 'week', 'month', 'year'] as ChartPeriod[]).map((p) => (
                                <TouchableOpacity
                                    key={p}
                                    style={[styles.segmentButton, period === p && styles.segmentActive]}
                                    onPress={() => setPeriod(p)}
                                >
                                    <Text style={[styles.segmentText, period === p && styles.segmentTextActive]}>
                                        {p === 'day' ? 'Hari' : p === 'week' ? 'Minggu' : p === 'month' ? 'Bulan' : 'Tahun'}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <LineChart
                            data={chartData}
                            width={screenWidth - 32}
                            height={220}
                            chartConfig={{
                                backgroundColor: '#ffffff',
                                backgroundGradientFrom: '#ffffff',
                                backgroundGradientTo: '#ffffff',
                                decimalPlaces: 0,
                                color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                                style: {
                                    borderRadius: 16,
                                },
                                propsForDots: {
                                    r: '4',
                                    strokeWidth: '2',
                                    stroke: '#3B82F6',
                                },
                            }}
                            bezier
                            style={styles.chart}
                            formatYLabel={(y) => {
                                const val = parseFloat(y);
                                if (val >= 1000000) return (val / 1000000).toFixed(1) + 'jt';
                                if (val >= 1000) return (val / 1000).toFixed(0) + 'rb';
                                return val.toString();
                            }}
                        />
                    </View>

                    {/* Top 5 Items */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>🏆 5 Barang Sering Dibeli</Text>
                        {topProducts.length > 0 ? (
                            topProducts.map((item, index) => (
                                <View key={index} style={styles.topItem}>
                                    <Text style={styles.topRank}>#{index + 1}</Text>
                                    <Text style={styles.topName}>{item.name}</Text>
                                    <Text style={styles.topCount}>{item.count}x</Text>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.emptyText}>Belum ada data pembelian</Text>
                        )}
                    </View>

                    {/* Monthly Expenses List */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>📅 Total Pengeluaran Bulanan</Text>
                        {monthlyExpenses.length > 0 ? (
                            monthlyExpenses.map((item, index) => (
                                <View key={index} style={styles.expenseItem}>
                                    <Text style={styles.expenseMonth}>{item.month}</Text>
                                    <Text style={styles.expenseTotal}>{formatCurrency(item.total)}</Text>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.emptyText}>Belum ada data pengeluaran</Text>
                        )}
                    </View>

                    <View style={{ height: 40 }} />
                </ScrollView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    closeButton: {
        padding: 8,
    },
    closeText: {
        color: '#3B82F6',
        fontWeight: '600',
        fontSize: 16,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    chartSection: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#374151',
        marginBottom: 16,
    },
    segmentControl: {
        flexDirection: 'row',
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        padding: 4,
        marginBottom: 16,
    },
    segmentButton: {
        flex: 1,
        paddingVertical: 6,
        alignItems: 'center',
        borderRadius: 6,
    },
    segmentActive: {
        backgroundColor: '#FFFFFF',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
    segmentText: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '500',
    },
    segmentTextActive: {
        color: '#3B82F6',
        fontWeight: '600',
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
    section: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    topItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    topRank: {
        width: 30,
        fontSize: 16,
        fontWeight: '700',
        color: '#9CA3AF',
    },
    topName: {
        flex: 1,
        fontSize: 16,
        color: '#1F2937',
        fontWeight: '500',
    },
    topCount: {
        fontSize: 14,
        color: '#3B82F6',
        fontWeight: '600',
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    expenseItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    expenseMonth: {
        fontSize: 16,
        color: '#374151',
    },
    expenseTotal: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    emptyText: {
        textAlign: 'center',
        color: '#9CA3AF',
        fontStyle: 'italic',
        marginTop: 8,
    },
});
