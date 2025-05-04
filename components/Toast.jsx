import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';

const Toast = ({ visible, message, type = 'info', onHide }) => {
  const [fadeAnim] = useState(new Animated.Value(0)); // Animasi fade

  useEffect(() => {
    if (visible) {
      // Tampilkan toast
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Sembunyikan toast setelah 3 detik
      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          if (onHide) onHide();
        });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        { opacity: fadeAnim },
        type === 'error' && styles.errorToast,
        type === 'success' && styles.successToast,
      ]}
    >
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
};

export default Toast;

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 50,
    left: '10%',
    right: '10%',
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  toastText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  errorToast: {
    backgroundColor: '#ff4d4d',
  },
  successToast: {
    backgroundColor: '#4caf50',
  },
});
