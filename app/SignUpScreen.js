// app/SignUpScreen.js
import { useRouter } from 'expo-router';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function SignUpScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/leaves.png')}
        style={styles.topLeaves}
      />
      <Text style={styles.title}>Create an Account</Text>
      <TextInput placeholder="Name" style={styles.input} />
      <TextInput
        placeholder="Email"
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
      />
      <TouchableOpacity onPress={() => router.replace('/login')}>
        <Image
          source={require('../assets/images/Next Page Button.png')}
          style={styles.button}
        />
      </TouchableOpacity>
      <Image
        source={require('../assets/images/leaf10.png')}
        style={styles.bottomLeaf}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFD3C5',
    alignItems: 'center',
    paddingTop: 60,
  },
  topLeaves: {
    width: 150,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    color: '#464646',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  input: {
    width: width * 0.8,     // ← NOW defined
    height: 45,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#464646',
  },
  button: {
    width: 60,
    height: 60,
    marginTop: 20,
  },
  bottomLeaf: {
    position: 'absolute',
    bottom: 0,
    width: 200,
    height: 100,
    resizeMode: 'contain',
  },
});
