// app/Login.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AuthContext } from './_contexts/AuthContext';
import { getUser } from './_helpers/database';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const authContext = useContext(AuthContext);
  const [isInitialized, setIsInitialized] = useState(false);



  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      const user = await getUser(email, password);
      if (user) {
        await authContext.signIn(email, password);
        // Store the user ID in AsyncStorage
        await AsyncStorage.setItem('userId', user.id);
        router.push('/Welcome');
      } else {
        Alert.alert('Error', 'Invalid email or password');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logo.png')} style={styles.leaves} />
      <Text style={styles.title}>Welcome Back</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#666666"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#666666"
      />
      
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18, textAlign: 'center', width: '100%' }}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/SignUp')}>
        <Text style={styles.signUpText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFD3C5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  leaves: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#000000',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
 
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  nextButton: {
    width: 24,
    height: 24,
  },
  buttonText: {
    fontSize: 24,
    color: 'white',
  },
  bottomText: {
    marginTop: 20,
    color: '#464646',
  },
  linkText: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
