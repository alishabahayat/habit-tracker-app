// app/login.js
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function LoginScreen({
  onPressLogin,
  onPressGoToSignUp,
}) {
  return (
    <View style={styles.container}>
      {/* Top leaves */}
      <Image
        source={require('../assets/images/leaf10.png')}
        style={styles.topImage}
      />

      {/* Title */}
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Let’s get back to thriving 🌱</Text>

      {/* Inputs */}
      <TextInput
        placeholder="Email"
        placeholderTextColor="#727272"
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="#727272"
        secureTextEntry
        style={styles.input}
      />

      {/* Login button */}
      <TouchableOpacity style={styles.button} onPress={onPressLogin}>
        <Image
          source={require('../assets/images/Next Page Button.png')}
          style={styles.arrow}
        />
      </TouchableOpacity>

      {/* Sign-up link */}
      <Text style={styles.bottomText}>
        Don’t have an account?{' '}
        <Text style={styles.linkText} onPress={onPressGoToSignUp}>
          Sign up
        </Text>
      </Text>

      {/* Bottom leaves */}
      <Image
        source={require('../assets/images/leaves.png')}
        style={styles.bottomImage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFD3C5',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  topImage: {
    position: 'absolute',
    top: 0,
    width: 200,
    height: 100,
    resizeMode: 'contain',
  },
  bottomImage: {
    position: 'absolute',
    bottom: 0,
    width: 200,
    height: 100,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#464646',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#464646',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginVertical: 10,
    color: '#464646',
  },
  button: {
    backgroundColor: '#464646',
    width: '100%',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  arrow: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
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
