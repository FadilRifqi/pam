import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ThemedButton = ({ 
  label, 
  onPress, 
  style, 
  textStyle, 
  icon,
  iconStyle,
  variant = 'default', // default, circle, link
  position = null // Untuk posisi absolut
}) => {
  // Style berbasis variant
  const buttonStyle = [
    styles.button,
    variant === 'circle' && styles.circleButton,
    variant === 'link' && styles.linkButton,
    position && { position: 'absolute', ...position },
    style
  ];

  // Content berbasis variant
  if (variant === 'circle') {
    return (
      <TouchableOpacity onPress={onPress} style={buttonStyle}>
        <View style={styles.circleContent}>
          {icon && <Image source={icon} style={[styles.circleIcon, iconStyle]} />}
        </View>
      </TouchableOpacity>
    );
  }
  
  if (variant === 'link') {
    return (
      <TouchableOpacity onPress={onPress} style={buttonStyle}>
        <Text style={[styles.linkText, textStyle]}>{label}</Text>
      </TouchableOpacity>
    );
  }

  // Default button
  return (
    <TouchableOpacity onPress={onPress} style={buttonStyle}>
      {icon && <Image source={icon} style={[styles.icon, iconStyle]} />}
      {label && <Text style={[styles.buttonText, textStyle]}>{label}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#35cc8c',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  // Circle variant
  circleButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    padding: 0,
  },
  circleContent: {
    width: 50,
    height: 50,
    backgroundColor: '#35cc8c',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleIcon: {
    width: 50,
    height: 50,
  },
  // Link variant
  linkButton: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
  },
  linkText: {
    color: '#35cc8c',
    fontSize: 14,
    fontWeight: 'bold',
  }
});

export default ThemedButton;