import React, { useEffect, useState, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import './src/i18n/i18n';
import notificationService from './src/services/notificationService';

// Screens
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import OTPVerificationScreen from './src/screens/OTPVerificationScreen';
import PendingActivationScreen from './src/screens/PendingActivationScreen';
import HomeScreen from './src/screens/HomeScreen';
import OnlineStatusScreen from './src/screens/OnlineStatusScreen';
import AvailableRidesScreen from './src/screens/AvailableRidesScreen';
import ActiveRideScreen from './src/screens/ActiveRideScreen';
import EarningsScreen from './src/screens/EarningsScreen';
import VehicleScreen from './src/screens/VehicleScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import WithdrawScreen from './src/screens/WithdrawScreen';
import WithdrawalHistoryScreen from './src/screens/WithdrawalHistoryScreen';

const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigationRef = useRef();

  useEffect(() => {
    checkAuthStatus();
    
    // Listen for storage changes (when user logs in/out or gets activated)
    const interval = setInterval(checkAuthStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  // Setup push notifications when driver is logged in and activated
  useEffect(() => {
    if (isLoggedIn && isActivated) {
      setupPushNotifications();
    }

    return () => {
      notificationService.removeNotificationListeners();
    };
  }, [isLoggedIn, isActivated]);

  const setupPushNotifications = async () => {
    try {
      // Register for push notifications
      const token = await notificationService.registerForPushNotifications();
      
      if (token) {
        // Send token to backend
        await notificationService.sendTokenToBackend(token);
        console.log('✅ Push notifications registered successfully');
      }

      // Setup listeners for notifications
      notificationService.setupNotificationListeners(
        (notification) => {
          // Handle notification received while app is in FOREGROUND
          console.log('📬 New notification received in foreground:', notification);
          const data = notification.request.content.data;
          if (data?.type === 'new_ride') {
            // Show alert and offer to navigate to AvailableRides
            Alert.alert(
              '� New Ride Request!',
              notification.request.content.body || 'A passenger is waiting. Go to Available Rides to accept.',
              [
                { text: 'Ignore', style: 'cancel' },
                {
                  text: 'View Ride',
                  onPress: () => {
                    if (navigationRef.current) {
                      navigationRef.current.navigate('AvailableRides');
                    }
                  },
                },
              ],
              { sound: true }
            );
          }
        },
        (data) => {
          // Handle notification tapped (app in background/killed)
          console.log('👆 Notification tapped:', data);
          if (data.type === 'new_ride' && navigationRef.current) {
            navigationRef.current.navigate('AvailableRides');
          }
        }
      );
    } catch (error) {
      console.error('❌ Error setting up push notifications:', error);
    }
  };

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const activated = await AsyncStorage.getItem('driverActivated');
      const newAuthState = !!token;
      const newActivatedState = activated === 'true';
      
      if (newAuthState !== isLoggedIn || newActivatedState !== isActivated) {
        setIsLoggedIn(newAuthState);
        setIsActivated(newActivatedState);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName={
          !isLoggedIn ? 'Welcome' : !isActivated ? 'PendingActivation' : 'Home'
        }
        screenOptions={{
          headerStyle: { backgroundColor: '#000' },
          headerTintColor: '#FFD700',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        {!isLoggedIn ? (
          <>
            <Stack.Screen
              name="Welcome"
              component={WelcomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen
              name="OTPVerification"
              component={OTPVerificationScreen}
            />
          </>
        ) : !isActivated ? (
          <Stack.Screen
            name="PendingActivation"
            component={PendingActivationScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: 'Run Run Driver' }}
            />
            <Stack.Screen
              name="OnlineStatus"
              component={OnlineStatusScreen}
              options={{ title: 'Status' }}
            />
            <Stack.Screen
              name="AvailableRides"
              component={AvailableRidesScreen}
              options={{ title: 'Available Rides' }}
            />
            <Stack.Screen
              name="ActiveRide"
              component={ActiveRideScreen}
              options={{ title: 'Active Trip' }}
            />
            <Stack.Screen
              name="Earnings"
              component={EarningsScreen}
              options={{ title: 'Earnings' }}
            />
            <Stack.Screen
              name="Withdraw"
              component={WithdrawScreen}
              options={{ title: 'Withdraw Earnings' }}
            />
            <Stack.Screen
              name="WithdrawalHistory"
              component={WithdrawalHistoryScreen}
              options={{ title: 'Withdrawal History' }}
            />
            <Stack.Screen
              name="Vehicle"
              component={VehicleScreen}
              options={{ title: 'Vehicle' }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ title: 'Profile' }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{ title: 'Settings' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
