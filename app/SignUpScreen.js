// app/SignUpScreen.js
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SignUpScreen({ onPressSignUp }) {
  return (
    <View style={styles.container}>
      {/* Top leaves */}
      <Image
        source={require('../assets/images/leaves.png')}
        style={styles.topLeaves}
      />

      {/* Title */}
      <Text style={styles.title}>Create an Account</Text>

      {/* Inputs */}
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

      {/* Next button */}
      <TouchableOpacity onPress={onPressSignUp}>
        <Image
          source={require('../assets/images/Next Page Button.png')}
          style={styles.button}
        />
      </TouchableOpacity>

      {/* Bottom leaf */}
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
    width: '80%',       // no more undefined `width`
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
