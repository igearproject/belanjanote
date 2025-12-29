import { Alert, Platform } from 'react-native';

/**
 * A cross-platform alert utility
 */
export const showAlert = (title: string, message?: string, buttons?: any[]) => {
    if (Platform.OS === 'web') {
        // Simple web alert
        if (buttons && buttons.length > 0) {
            // If there are buttons, we use confirm for the first non-cancel button
            const confirmButton = buttons.find(b => b.style !== 'cancel');
            const result = window.confirm(`${title}\n\n${message || ''}`);
            if (result && confirmButton && confirmButton.onPress) {
                confirmButton.onPress();
            } else {
                const cancelButton = buttons.find(b => b.style === 'cancel');
                if (cancelButton && cancelButton.onPress) {
                    cancelButton.onPress();
                }
            }
        } else {
            window.alert(`${title}\n\n${message || ''}`);
        }
    } else {
        Alert.alert(title, message, buttons);
    }
};
