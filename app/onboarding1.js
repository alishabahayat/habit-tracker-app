import { Dimensions, Image, StyleSheet, View } from 'react-native';

export default function Onboarding1() {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/leaves.png')} style={styles.leaves} />
      <Image source={require('../assets/images/logo.png')} style={styles.logo} />
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EFD3C5',
    width: width,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: 239.712,
    paddingBottom: 209.288,
  },
  leaves: {
    position: 'absolute',
    top: 0,
    width: width,
    height: 100,
    resizeMode: 'contain',
  },
  logo: {
    width: 270,
    height: 270,
    resizeMode: 'contain',
  },
});
