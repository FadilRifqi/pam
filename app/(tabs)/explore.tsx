import { StyleSheet, Image, Platform } from 'react-native';

export default function TabTwoScreen() {
  return (
    <>
      <Image
        source={require('https://example.com/image.png')} // Replace with your image URL
        style={styles.headerImage}
      />
    </>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
