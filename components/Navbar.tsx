// NavigationBar.js
import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

function NavigationBar({ navigation }) {
  return (
    <View style={styles.navbar}>
      <Button title="Home" onPress={() => navigation.navigate('Home')} />
      <Button title="About" onPress={() => navigation.navigate('About')} />
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#333',
    padding: 10,
  },
});

export default NavigationBar;
