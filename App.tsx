import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import notifee, { EventType, AndroidImportance } from '@notifee/react-native';

import TabNavigator from '@/navigation/TabNavigator';
import ActiveCallScreen from '@/screens/ActiveCallScreen';

export type RootStackParamList = {
  MainTabs: undefined;
  ActiveCallScreen: {
    phoneNumber: string;
    direction: 'outgoing' | 'incoming';
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  useEffect(() => {
    setupNotifee();

    const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.ACTION_PRESS) {
        if (detail.pressAction?.id === 'accept') {
          console.log('Call accepted:', detail.notification?.id);
          // TODO: Navigate to ActiveCallScreen or connect WebRTC audio
        } else if (detail.pressAction?.id === 'decline') {
          console.log('Call declined:', detail.notification?.id);
          if (detail.notification?.id) {
            notifee.cancelNotification(detail.notification.id);
          }
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const setupNotifee = async () => {
    try {
      // Request notification permissions (required for Android 13+)
      await notifee.requestPermission();

      await notifee.createChannel({
        id: 'incoming_calls',
        name: 'Incoming Calls',
        importance: AndroidImportance.HIGH,
        vibration: true,
        sound: 'default',
      });
    } catch (err) {
      console.error('Notifee setup failed:', err);
    }
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          <Stack.Screen
            name="ActiveCallScreen"
            component={ActiveCallScreen}
            options={{
              animation: 'slide_from_bottom',
              presentation: 'fullScreenModal',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}