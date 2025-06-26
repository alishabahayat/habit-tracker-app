// app/login.js
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      {/* Top leaves image */}
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
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>→</Text>
      </TouchableOpacity>

      {/* Bottom text */}
      <Text style={styles.bottomText}>
        Don’t have an account? <Text style={styles.linkText}>Sign up</Text>
      </Text>

      {/* Bottom leaves image */}
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
    padding: 14,
    borderRadius: 30,
    width: 80,
    alignItems: 'center',
    marginTop: 30,
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
