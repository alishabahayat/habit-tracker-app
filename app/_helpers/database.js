// app/database.js
import SQLite from 'react-native-sqlite-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Platform-specific database
let database = null;

// Database API interface
const dbInterface = {
  users: [],
  habits: []
};

// Add a default export for Expo Router
export default function DatabaseDefault() {
  return null;
}

// Initialize database
export const initializeDatabase = async () => {
  try {
    // Mobile platform - use AsyncStorage
    database = {
      transaction: (callback) => {
        callback({
          objectStore: (storeName) => {
            return {
              add: async (data) => {
                try {
                  // Get existing items
                  const items = JSON.parse(await AsyncStorage.getItem(storeName) || '[]');
                  
                  // Add new item
                  items.push(data);
                  
                  // Update storage
                  await AsyncStorage.setItem(storeName, JSON.stringify(items));
                } catch (error) {
                  console.error('Error adding item to AsyncStorage:', error);
                  throw error;
                }
              },
              get: async (id) => {
                try {
                  const items = JSON.parse(await AsyncStorage.getItem(storeName) || '[]');
                  return items.find(item => item.id === id) || null;
                } catch (error) {
                  console.error('Error getting item from AsyncStorage:', error);
                  throw error;
                }
              },
              getAll: async () => {
                try {
                  return JSON.parse(await AsyncStorage.getItem(storeName) || '[]');
                } catch (error) {
                  console.error('Error getting all items from AsyncStorage:', error);
                  throw error;
                }
              }
            };
          }
        });
      }
    };
    console.log('Database initialized successfully (Mobile - AsyncStorage)');
    return database;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
};

/**
 * Create a new user.
 * @param {string} email
 * @param {string} password
 * @returns Promise resolving to the new user's insertId
 */
export const createUser = async (name, email, password) => {
  try {
    const lowerCaseEmail = email.toLowerCase();
    if (typeof window !== 'undefined') {
      // Web platform - use AsyncStorage
      const usersString = await AsyncStorage.getItem('users') || '[]';
      const users = JSON.parse(usersString);
      const existingUser = users.find(u => u.email.toLowerCase() === lowerCaseEmail);
      
      if (existingUser) {
        throw new Error('User already exists');
      }

      const newUser = {
        id: Date.now().toString(),
        name,
        email: lowerCaseEmail,
        password
      };
      
      users.push(newUser);
      await AsyncStorage.setItem('users', JSON.stringify(users));
      
      return { insertId: newUser.id };
    } else {
      // Mobile platform - use SQLite
      await database.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
          [name, lowerCaseEmail, password],
          (_, result) => {
            console.log('User created successfully:', result);
            return { insertId: result.insertId };
          },
          (error) => {
            console.error('Error creating user:', error);
            throw error;
          }
        );
      });
    }
  } catch (error) {
    console.error('Error in createUser:', error);
    throw error;
  }
};

/**
 * Get a user by email and password.
 * @param {string} email
 * @param {string} password
 * @returns Promise resolving to the user object, or null if not found
 */
export const getUser = async (email, password) => {
  try {
    const lowerCaseEmail = email.toLowerCase();
    if (typeof window !== 'undefined') {
      // Web platform - use AsyncStorage
      const usersString = await AsyncStorage.getItem('users') || '[]';
      const users = JSON.parse(usersString);
      const user = users.find(u => u.email.toLowerCase() === lowerCaseEmail && u.password === password);
      return user || null;
    } else {
      // Mobile platform - use SQLite
      return new Promise((resolve, reject) => {
        database.transaction(tx => {
          tx.executeSql(
            'SELECT * FROM users WHERE LOWER(email) = ? AND password = ?',
            [lowerCaseEmail, password],
            (_, { rows }) => {
              resolve(rows.length > 0 ? rows.item(0) : null);
            },
            (_, error) => {
              reject(error);
            }
          );
        });
      });
    }
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

/**
 * Insert a new habit.
 * @param {number} userId
 * @param {string} emoji
 * @param {string} activity
 * @param {string} color
 * @returns Promise resolving to the new habit's insertId
 */
export const addHabit = async (userId, emoji, activity, color) => {
  try {
    console.log('Adding habit with userId:', userId);
    
    // Get existing habits
    const existingHabits = JSON.parse(await AsyncStorage.getItem('habits') || '[]');
    console.log('Existing habits:', existingHabits);
    
    // Create new habit
    const newHabit = {
      id: Date.now().toString(),
      user_id: userId,
      emoji,
      name: activity,
      color
    };
    console.log('New habit:', newHabit);
    
    // Add to habits array
    existingHabits.push(newHabit);
    
    // Save to AsyncStorage
    await AsyncStorage.setItem('habits', JSON.stringify(existingHabits));
    console.log('Updated habits saved to storage:', existingHabits);
    
    return newHabit.id;
  } catch (error) {
    console.error('Error adding habit:', error);
    throw error;
  }
};

/**
 * Get one habit by its ID.
 * @param {number} habitId
 * @returns Promise resolving to the habit object, or null if none
 */
export const getHabit = async (habitId) => {
  try {
    return new Promise((resolve, reject) => {
      database.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM habits WHERE id = ? LIMIT 1',
          [habitId],
          (_, { rows }) => {
            resolve(rows.length > 0 ? rows.item(0) : null);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  } catch (error) {
    console.error('Error getting habit:', error);
    throw error;
  }
};



