import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

interface DateInputProps {
    label: string;
    value: string; // YYYY-MM-DD
    onChange: (date: string) => void;
    error?: string;
    placeholder?: string;
}

export const DateInput: React.FC<DateInputProps> = ({
    label,
    value,
    onChange,
    error,
    placeholder = 'Pilih Tanggal'
}) => {
    const [showPicker, setShowPicker] = useState(false);

    if (Platform.OS === 'web') {
        const handleWebDateChange = (e: any) => {
            onChange(e.target.value);
        };

        return (
            <View style={styles.container}>
                <Text style={styles.label}>{label}</Text>
                {/* @ts-ignore: React Native Web supports type='date' on TextInput or we can cast */}
                <input
                    type="date"
                    value={value}
                    onChange={handleWebDateChange}
                    style={{
                        padding: 12,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderStyle: 'solid',
                        borderColor: error ? '#EF4444' : '#E5E7EB',
                        fontSize: 16,
                        color: '#1F2937',
                        backgroundColor: '#F9FAFB',
                        width: '100%',
                        fontFamily: 'system-ui',
                        boxSizing: 'border-box',
                        outline: 'none'
                    } as any}
                />
                {error && <Text style={styles.errorText}>{error}</Text>}
            </View>
        );
    }

    const handleDateChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            setShowPicker(false);
        }

        if (selectedDate) {
            onChange(format(selectedDate, 'yyyy-MM-dd'));
        }
    };

    const getDateObject = () => {
        if (!value) return new Date();
        const parts = value.split('-').map(Number);
        // Basic validation for YYYY-MM-DD
        if (parts.length === 3 && parts[1] >= 1 && parts[1] <= 12) {
            return new Date(parts[0], parts[1] - 1, parts[2]);
        }
        return new Date();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity
                style={[styles.input, error ? styles.inputError : null]}
                onPress={() => setShowPicker(true)}
                activeOpacity={0.7}
            >
                <Text style={[styles.inputText, !value && styles.placeholderText]}>
                    {value || placeholder}
                </Text>
            </TouchableOpacity>
            {error && <Text style={styles.errorText}>{error}</Text>}

            {showPicker && (
                Platform.OS === 'ios' ? (
                    <Modal
                        transparent={true}
                        animationType="slide"
                        visible={showPicker}
                        onRequestClose={() => setShowPicker(false)}
                    >
                        <View style={styles.iosModalOverlay}>
                            <View style={styles.iosModalContent}>
                                <View style={styles.iosHeader}>
                                    <TouchableOpacity onPress={() => setShowPicker(false)}>
                                        <Text style={styles.iosDoneButton}>Selesai</Text>
                                    </TouchableOpacity>
                                </View>
                                <DateTimePicker
                                    value={getDateObject()}
                                    mode="date"
                                    display="spinner"
                                    onChange={handleDateChange}
                                    style={{ height: 200 }}
                                />
                            </View>
                        </View>
                    </Modal>
                ) : (
                    <DateTimePicker
                        value={getDateObject()}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    inputError: {
        borderColor: '#EF4444',
    },
    inputText: {
        fontSize: 16,
        color: '#1F2937',
    },
    placeholderText: {
        color: '#9CA3AF',
    },
    errorText: {
        fontSize: 12,
        color: '#EF4444',
        marginTop: 4,
    },
    iosModalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    iosModalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 20,
    },
    iosHeader: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        alignItems: 'flex-end',
    },
    iosDoneButton: {
        color: '#007AFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
