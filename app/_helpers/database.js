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

// Initialize database based on platform
export const initializeDatabase = async () => {
  try {
    if (typeof window !== 'undefined') {
      // Web platform - use localStorage (basic fallback)
      database = {
        transaction: (callback) => {
          callback({
            objectStore: (storeName) => {
              return {
                add: (data) => {
                  // Get existing items
                  const items = JSON.parse(localStorage.getItem(storeName) || '[]');
                  
                  // Add new item
                  items.push(data);
                  
                  // Update storage
                  localStorage.setItem(storeName, JSON.stringify(items));
                },
                get: (id) => {
                  const items = JSON.parse(localStorage.getItem(storeName) || '[]');
                  return items.find(item => item.id === id) || null;
                },
                getAll: () => {
                  return JSON.parse(localStorage.getItem(storeName) || '[]');
                }
              };
            }
          });
        }
      };
      console.log('Database initialized successfully (Web - fallback)');
    } else {
      // Mobile platform - use SQLite (primary implementation)
      try {
        // Check if SQLite is available
        if (!SQLite || !SQLite.openDatabase) {
          throw new Error('SQLite is not available in this environment');
        }

        // Initialize SQLite
        SQLite.DEBUG(true);
        SQLite.enablePromise(true);

        // Create database
        const database_name = 'habit_tracker.db';
        const database_version = '1.0';
        const database_displayname = 'Habit Tracker Database';
        const database_size = 200000;

        database = SQLite.openDatabase(
          database_name,
          database_version,
          database_displayname,
          database_size,
          () => {
            console.log('Database created successfully');
          },
          (error) => {
            console.error('Database error:', error);
            throw error;
          }
        );

        // Wait for database to be ready
        await new Promise((resolve, reject) => {
          const check = setInterval(() => {
            if (database) {
              clearInterval(check);
              resolve();
            }
          }, 100);
        });

        // Initialize tables
        await database.executeSql(
          'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE, password TEXT)',
          []
        );

        await database.executeSql(
          'CREATE TABLE IF NOT EXISTS habits (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, emoji TEXT, activity TEXT, color TEXT, FOREIGN KEY(user_id) REFERENCES users(id))',
          []
        );

        console.log('Database initialized successfully (Mobile - primary)');
      } catch (error) {
        console.error('SQLite initialization error:', error);
        throw error;
      }
    }
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
export const createUser = async (email, password) => {
  try {
    if (typeof window !== 'undefined') {
      // Web platform - use AsyncStorage
      const usersString = await AsyncStorage.getItem('users') || '[]';
      const users = JSON.parse(usersString);
      const existingUser = users.find(u => u.email === email);
      
      if (existingUser) {
        throw new Error('User already exists');
      }

      const newUser = {
        id: Date.now(),
        email,
        password
      };
      
      users.push(newUser);
      await AsyncStorage.setItem('users', JSON.stringify(users));
      
      return { insertId: newUser.id };
    } else {
      // Mobile platform - use SQLite
      await database.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO users (email, password) VALUES (?, ?)',
          [email, password],
          (_, result) => {
            console.log('User created successfully:', result);
          },
          (error) => {
            console.error('Error creating user:', error);
            throw error;
          }
        );
      });
      return { success: true };
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
    if (typeof window !== 'undefined') {
      // Web platform - use AsyncStorage
      const usersString = await AsyncStorage.getItem('users') || '[]';
      const users = JSON.parse(usersString);
      const user = users.find(u => u.email === email && u.password === password);
      return user || null;
    } else {
      // Mobile platform - use SQLite
      return new Promise((resolve, reject) => {
        database.transaction(tx => {
          tx.executeSql(
            'SELECT * FROM users WHERE email = ? AND password = ?',
            [email, password],
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
    return new Promise((resolve, reject) => {
      database.transaction(tx => {
        tx.executeSql(
          'INSERT INTO habits (user_id, emoji, activity, color) VALUES (?, ?, ?, ?)',
          [userId, emoji, activity, color],
          (_, { insertId }) => {
            resolve(insertId);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
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



