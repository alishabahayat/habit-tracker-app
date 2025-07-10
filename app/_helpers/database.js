// app/_helpers/database.js
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
export async function createUser(name, email, password) {
  const key = 'users';
  const raw = await AsyncStorage.getItem(key) || '[]';
  const users = JSON.parse(raw);

  const lc = email.toLowerCase();
  if (users.some(u => u.email.toLowerCase() === lc)) {
    throw new Error('User already exists');
  }

  const newUser = {
    id: Date.now().toString(),
    name,
    email: lc,
    password
  };
  users.push(newUser);
  await AsyncStorage.setItem(key, JSON.stringify(users));
  return { insertId: newUser.id };
}

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
 * @param {Date} startDate
 * @param {string} frequency
 * @returns Promise resolving to the new habit's insertId
 */
export const addHabit = async (userId, emoji, activity, color, startDate, frequency) => {
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
      color,
      start_date: startDate.toISOString(),
      frequency: habit.frequency || {
        type: frequency,
        interval: 1,
        daysOfWeek: [],
        daysOfMonth: [],
        monthsOfYear: [],
        dayOfMonth: 1
      }
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
 * Update an existing habit.
 * @param {string} habitId
 * @param {object} updates - Object containing fields to update
 * @returns Promise resolving to the updated habit
 */
export const updateHabit = async (habitId, updates) => {
  try {
    // Get existing habits
    const existingHabits = JSON.parse(await AsyncStorage.getItem('habits') || '[]');
    console.log('Existing habits:', existingHabits);

    // Find and update the habit
    const habitIndex = existingHabits.findIndex(h => h.id === habitId);
    if (habitIndex === -1) {
      throw new Error('Habit not found');
    }

    const updatedHabit = { ...existingHabits[habitIndex], ...updates };
    existingHabits[habitIndex] = updatedHabit;

    // Save to AsyncStorage
    await AsyncStorage.setItem('habits', JSON.stringify(existingHabits));
    console.log('Updated habit:', updatedHabit);

    return updatedHabit;
  } catch (error) {
    console.error('Error updating habit:', error);
    throw error;
  }
};

/**
 * Delete a habit.
 * @param {string} habitId
 * @returns Promise resolving to true if successful
 */
export const deleteHabit = async (habitId) => {
  try {
    // Get existing habits
    const existingHabits = JSON.parse(await AsyncStorage.getItem('habits') || '[]');
    console.log('Existing habits:', existingHabits);

    // Remove the habit
    const updatedHabits = existingHabits.filter(h => h.id !== habitId);

    // Save to AsyncStorage
    await AsyncStorage.setItem('habits', JSON.stringify(updatedHabits));
    console.log('Habit deleted:', habitId);

    return true;
  } catch (error) {
    console.error('Error deleting habit:', error);
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



