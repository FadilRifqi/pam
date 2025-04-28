import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const ThemedContent = ({ 
  title, 
  description, 
  image, 
  imageSize = 'medium', // small, medium, large
  alignment = 'center', // center, left 
  titleStyle,
  descriptionStyle,
  containerStyle
}) => {
  // Ukuran gambar berdasarkan imageSize
  const imageSizeMap = {
    small: { width: 100, height: 100 },
    medium: { width: 150, height: 150 },
    large: { width: 200, height: 200 }
  };
  
  const imageStyles = [styles.image, imageSizeMap[imageSize]];
  
  return (
    <View style={[
      styles.content, 
      { alignItems: alignment === 'center' ? 'center' : 'flex-start' },
      containerStyle
    ]}>
      {image && (
        <Image 
          source={image} 
          style={imageStyles}
          resizeMode="contain" 
        />
      )}
      {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
      {description && (
        <Text style={[
          styles.description, 
          { textAlign: alignment === 'center' ? 'center' : 'left' },
          descriptionStyle
        ]}>
          {description}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
    width: '100%',
  },
  image: { 
    marginBottom: 30 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 10,
    color: '#333',
  },
  description: { 
    fontSize: 16, 
    color: '#666',
    lineHeight: 24,
    marginBottom: 20
  },
});

export default ThemedContent;