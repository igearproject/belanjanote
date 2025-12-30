import React, { useEffect } from 'react';
import { NavigationContainer, LinkingOptions, NavigatorScreenParams } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen, ProductsScreen, HistoryScreen, SettingsScreen, PrivacyPolicyScreen } from '../screens';
import { useStore } from '../store';
import { ActivityIndicator, View, StyleSheet, Text, Platform } from 'react-native';

export type MainTabParamList = {
    Home: undefined;
    Products: undefined;
    History: undefined;
    Settings: undefined;
};

export type RootStackParamList = {
    Main: NavigatorScreenParams<MainTabParamList>;
    PrivacyPolicy: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const TabNavigator = () => {
    return (
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
                    tabBarIcon: ({ color, size }: { color: string; size: number }) => (
                        <Text style={{ fontSize: size, color }}>🛒</Text>
                    ),
                }}
            />
            <Tab.Screen
                name="Products"
                component={ProductsScreen}
                options={{
                    tabBarLabel: 'Produk',
                    tabBarIcon: ({ color, size }: { color: string; size: number }) => (
                        <Text style={{ fontSize: size, color }}>📦</Text>
                    ),
                }}
            />
            <Tab.Screen
                name="History"
                component={HistoryScreen}
                options={{
                    tabBarLabel: 'Riwayat',
                    tabBarIcon: ({ color, size }: { color: string; size: number }) => (
                        <Text style={{ fontSize: size, color }}>📜</Text>
                    ),
                }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    tabBarLabel: 'Pengaturan',
                    tabBarIcon: ({ color, size }: { color: string; size: number }) => (
                        <Text style={{ fontSize: size, color }}>⚙️</Text>
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

const linking: LinkingOptions<RootStackParamList> = {
    prefixes: ['belanjanote://', 'https://belanjanote.sipintek.com'],
    config: {
        screens: {
            Main: {
                screens: {
                    Home: 'home',
                    Products: 'products',
                    History: 'history',
                    Settings: 'settings',
                }
            },
            PrivacyPolicy: 'privacy-policy',
        },
    },
};

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
        <NavigationContainer linking={linking}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Main" component={TabNavigator} />
                <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
            </Stack.Navigator>
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
