import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { ProductsScreen } from '../screens/ProductsScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { useStore } from '../store';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';

const Tab = createBottomTabNavigator();

export const AppNavigator: React.FC = () => {
    const { initializeApp, isLoading } = useStore();

    useEffect(() => {
        initializeApp();
    }, []);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text style={styles.loadingText}>Memuat aplikasi...</Text>
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: '#3B82F6',
                    tabBarInactiveTintColor: '#9CA3AF',
                    tabBarStyle: {
                        backgroundColor: '#FFFFFF',
                        borderTopWidth: 1,
                        borderTopColor: '#E5E7EB',
                        paddingBottom: 8,
                        paddingTop: 8,
                        height: 60,
                    },
                    tabBarLabelStyle: {
                        fontSize: 12,
                        fontWeight: '600',
                    },
                }}
            >
                <Tab.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                        tabBarLabel: 'Belanja',
                        tabBarIcon: ({ color, size }) => (
                            <Text style={{ fontSize: size, color }}>🛒</Text>
                        ),
                    }}
                />
                <Tab.Screen
                    name="Products"
                    component={ProductsScreen}
                    options={{
                        tabBarLabel: 'Produk',
                        tabBarIcon: ({ color, size }) => (
                            <Text style={{ fontSize: size, color }}>📦</Text>
                        ),
                    }}
                />
                <Tab.Screen
                    name="History"
                    component={HistoryScreen}
                    options={{
                        tabBarLabel: 'Riwayat',
                        tabBarIcon: ({ color, size }) => (
                            <Text style={{ fontSize: size, color }}>📜</Text>
                        ),
                    }}
                />
                <Tab.Screen
                    name="Settings"
                    component={SettingsScreen}
                    options={{
                        tabBarLabel: 'Pengaturan',
                        tabBarIcon: ({ color, size }) => (
                            <Text style={{ fontSize: size, color }}>⚙️</Text>
                        ),
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#6B7280',
    },
});
