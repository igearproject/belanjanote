import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface HeaderProps {
    showBackButton?: boolean;
    onBackPress?: () => void;
}

export const AppHeader: React.FC<HeaderProps> = () => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../../assets/logo_full.png')}
                        style={styles.logoImage}
                    />
                    <Text style={styles.logoText}>Belanja<Text style={styles.logoTextBold}>Note</Text></Text>
                </View>
                <TouchableOpacity style={styles.profileButton}>
                    <View style={styles.profilePlaceholder}>
                        <Text style={styles.profileEmoji}>👤</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        paddingTop: Platform.OS === 'ios' ? 0 : 10,
    },
    content: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoImage: {
        width: 32,
        height: 32,
        marginRight: 8,
        borderRadius: 8,
    },
    logoText: {
        fontSize: 20,
        color: '#1F2937',
        letterSpacing: -0.5,
    },
    logoTextBold: {
        fontWeight: '800',
        color: '#3B82F6',
    },
    profileButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    profilePlaceholder: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileEmoji: {
        fontSize: 18,
    },
});
