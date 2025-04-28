import React from 'react';
import { StyleSheet, View } from 'react-native';

const ThemedScreenIndicator = ({ currentIndex, total = 3, style }) => {
  return (
    <View style={[styles.indicatorContainer, style]}>
      {[...Array(total)].map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            currentIndex === index ? styles.activeDot : styles.inactiveDot
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#35cc8c', // Hijau untuk dot aktif
  },
  inactiveDot: {
    backgroundColor: '#D3D3D3', // Abu-abu untuk dot tidak aktif
  },
});

export default ThemedScreenIndicator;