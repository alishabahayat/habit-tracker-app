// app/index.js
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { initializeDatabase } from './_helpers/database';
import { AuthContext, AuthProvider } from './_contexts/AuthContext';
import Splash from './Splash';

export default function Index() {
  // Initialize database when app starts
  useEffect(() => {
    const initApp = async () => {
      try {
        await initializeDatabase();
        console.log('App initialized successfully');
      } catch (error) {
        console.error('Failed to initialize app:', error);
        Alert.alert('Error', 'Failed to initialize app. Please try again.');
      }
    };
    initApp();
  }, []);

  return (
    <AuthProvider>
      <View style={{ flex: 1, backgroundColor: '#EFD3C5' }}>
        <Splash />
      </View>
    </AuthProvider>
  );
}
