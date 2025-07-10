import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useEffect, useState } from 'react';

// Initialize AsyncStorage
const initializeStorage = async () => {
  try {
    const users = await AsyncStorage.getItem('users');
    if (users) {
      console.log('Users loaded from storage:', users);
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
};

// Initialize storage when app starts
initializeStorage();

const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Initialize user state from AsyncStorage
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          const usersString = await AsyncStorage.getItem('users') || '[]';
          const users = JSON.parse(usersString);
          const foundUser = users.find(u => u.id === userId);
          if (foundUser) {
            console.log('Loading user from storage:', { id: foundUser.id, email: foundUser.email, name: foundUser.name });
            setUser({ id: foundUser.id, email: foundUser.email, name: foundUser.name });
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };
    loadUser();
  }, []);

  // Auth functions
  const signIn = async (email, password) => {
    email = email.toLowerCase().trim();
    try {
      const usersString = await AsyncStorage.getItem('users') || '[]';
      const users = JSON.parse(usersString);
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        await AsyncStorage.setItem('userId', user.id);
        console.log('Signing in user:', { id: user.id, email: user.email, name: user.name });
        setUser({ id: user.id, email: user.email, name: user.name });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error signing in:', error);
      return false;
    }
  };

  const signUp = async (email, password, name) => {
     email = email.toLowerCase().trim();
    try {
      const usersString = await AsyncStorage.getItem('users') || '[]';
      const users = JSON.parse(usersString);
      const newUser = {
        id: Date.now().toString(),
        email,
        password,
        name
      };
      users.push(newUser);
      await AsyncStorage.setItem('users', JSON.stringify(users));
      await AsyncStorage.setItem('userId', newUser.id);
      console.log('Creating new user:', { id: newUser.id, email, name });
      setUser({ id: newUser.id, email, name });
      return true;
    } catch (error) {
      console.error('Error signing up:', error);
      return false;
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('userId');
      console.log('Signing out user');
      setUser(null);
      return true;
    } catch (error) {
      console.error('Error signing out:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};



// Export context and provider
export { AuthContext, AuthProvider };
