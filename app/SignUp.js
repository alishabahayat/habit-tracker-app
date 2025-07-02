import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useContext } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AuthContext } from './_contexts/AuthContext';
import { createUser } from './_helpers/database';
import { useRouter } from 'expo-router';


// assets
const LOGO = require('../assets/images/logo.png');

export default function SignUp() {
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      const result = await createUser(email, password);
      const userId = result.insertId;
      
      // Store user ID in AsyncStorage
      await AsyncStorage.setItem('userId', userId.toString());
      
      // Update auth context
      if (authContext) {
        authContext.signIn(email, password);
      }
      
      Alert.alert('Success', 'Account created successfully');
      router.push('/Home');
    } catch (error) {
      console.error('Sign up error:', error);
      Alert.alert('Error', 'Failed to create account. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={LOGO} style={styles.logo} />
      <Text style={styles.title}>Create Account</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
        <Text style={styles.signUpButtonText}>Create Account</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => router.push('/Login')}
      >
        <Text style={styles.loginButtonText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#96AA9F',
    padding: 20,
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F5F0EE',
    marginTop: 20,
  },
  inputContainer: {
    width: '100%',
    marginTop: 40,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  signUpButton: {
    backgroundColor: '#84AB66',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginButton: {
    marginTop: 10,
  },
  loginButtonText: {
    color: '#84AB66',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
