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
        const usersString = await AsyncStorage.getItem('users') || '[]';
        const users = JSON.parse(usersString);
        
        // Find the user with the stored userId
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          const user = users.find(u => u.id === userId);
          if (user) {
            setUser({ id: user.id, email: user.email, name: user.name });
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };
    loadUser();
  }, []);

  const signUp = async (email, password, name) => {
    try {
      const userId = Date.now().toString();
      
      // Store user data in AsyncStorage
      const usersString = await AsyncStorage.getItem('users') || '[]';
      const users = JSON.parse(usersString);
      const newUser = { id: userId, email, password, name };
      users.push(newUser);
      await AsyncStorage.setItem('users', JSON.stringify(users));
      
      // Set user in context
      setUser({ id: userId, email, name });
      return true;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const signIn = async (email, password) => {
    try {
      // Get user data from AsyncStorage
      const usersString = await AsyncStorage.getItem('users') || '[]';
      const users = JSON.parse(usersString);
      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      // Store userId and set user in context
      await AsyncStorage.setItem('userId', user.id);
      setUser({ id: user.id, email: user.email, name: user.name });
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
