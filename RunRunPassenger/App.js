import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import './src/i18n/i18n';

// Screens
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import OTPVerificationScreen from './src/screens/OTPVerificationScreen';
import HomeScreen from './src/screens/HomeScreen';
import BookRideScreen from './src/screens/BookRideScreen';
import MapLocationPickerScreen from './src/screens/MapLocationPickerScreen';
import ActiveRideScreen from './src/screens/ActiveRideScreen';
import PaymentMethodsScreen from './src/screens/PaymentMethodsScreen';
import AddPaymentMethodScreen from './src/screens/AddPaymentMethodScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import TripHistoryScreen from './src/screens/TripHistoryScreen';
import TripDetailsScreen from './src/screens/TripDetailsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import SupportScreen from './src/screens/SupportScreen';
import BusinessAccountScreen from './src/screens/BusinessAccountScreen';
import InvoicesListScreen from './src/screens/InvoicesListScreen';

const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
    
    // Listen for storage changes (when user logs in/out)
    const interval = setInterval(checkAuthStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const newAuthState = !!token;
      if (newAuthState !== isLoggedIn) {
        setIsLoggedIn(newAuthState);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null; // Or a loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isLoggedIn ? "Home" : "Welcome"}
        screenOptions={{
          headerStyle: { backgroundColor: '#FFD700' },
          headerTintColor: '#000',
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
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}
              options={{ title: 'Login' }}
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen}
              options={{ title: 'Register' }}
            />
            <Stack.Screen 
              name="OTPVerification" 
              component={OTPVerificationScreen}
              options={{ title: 'Verify OTP' }}
            />
          </>
        ) : (
          <>
            <Stack.Screen 
              name="Home" 
              component={HomeScreen}
              options={{ title: 'Run Run' }}
            />
            <Stack.Screen 
              name="BookRide" 
              component={BookRideScreen}
              options={{ title: 'Book a Ride' }}
            />
            <Stack.Screen 
              name="MapLocationPicker" 
              component={MapLocationPickerScreen}
              options={{ title: 'Select Location' }}
            />
            <Stack.Screen 
              name="ActiveRide" 
              component={ActiveRideScreen}
              options={{ title: 'Active Ride' }}
            />
            <Stack.Screen 
              name="PaymentMethods" 
              component={PaymentMethodsScreen}
              options={{ title: 'Payment Methods' }}
            />
            <Stack.Screen 
              name="AddPaymentMethod" 
              component={AddPaymentMethodScreen}
              options={{ title: 'Add Payment Method' }}
            />
            <Stack.Screen 
              name="Profile" 
              component={ProfileScreen}
              options={{ title: 'Profile' }}
            />
            <Stack.Screen 
              name="TripHistory" 
              component={TripHistoryScreen}
              options={{ title: 'Trip History' }}
            />
            <Stack.Screen 
              name="TripDetails" 
              component={TripDetailsScreen}
              options={{ title: 'Trip Details' }}
            />
            <Stack.Screen 
              name="Settings" 
              component={SettingsScreen}
              options={{ title: 'Settings' }}
            />
            <Stack.Screen 
              name="Support" 
              component={SupportScreen}
              options={{ title: 'Support' }}
            />
            <Stack.Screen 
              name="BusinessAccount" 
              component={BusinessAccountScreen}
              options={{ title: 'Business Account' }}
            />
            <Stack.Screen 
              name="InvoicesList" 
              component={InvoicesListScreen}
              options={{ title: 'Invoices' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
