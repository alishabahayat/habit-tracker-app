import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({
  user: null,
  signIn: () => {},
  signUp: () => {},
  signOut: () => {}
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Initialize user state from AsyncStorage
    const loadUser = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          setUser({ id: userId });
        }
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };
    loadUser();
  }, []);

  const signUp = async (email, password) => {
    try {
      const userId = Date.now().toString();
      await AsyncStorage.setItem('userId', userId);
      setUser({ id: userId, email });
      return true;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const signIn = async (email, password) => {
    try {
      // Get user ID from AsyncStorage
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        throw new Error('User not found');
      }
      
      // Set user in context
      setUser({ id: userId, email });
      return true;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('userId');
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// Add a default export for Expo Router
export default AuthProvider;
export { AuthContext };
