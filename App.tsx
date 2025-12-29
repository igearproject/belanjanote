import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from './src/navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as NavigationBar from 'expo-navigation-bar';
import { Platform } from 'react-native';

import { ToastProvider } from './src/context/ToastContext';

export default function App() {
  useEffect(() => {
    if (Platform.OS === 'android') {
      // Hide the navigation bar (immersive mode)
      NavigationBar.setVisibilityAsync('hidden');
      NavigationBar.setBehaviorAsync('overlay-swipe');

      // Optional: Make it transparent if it does show up
      NavigationBar.setBackgroundColorAsync('#00000000');
    }
  }, []);

  return (
    <SafeAreaProvider>
      <ToastProvider>
        <StatusBar style="dark" />
        <AppNavigator />
      </ToastProvider>
    </SafeAreaProvider>
  );
}
