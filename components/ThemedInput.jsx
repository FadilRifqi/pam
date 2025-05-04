import { FontAwesome } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const ThemedInput = ({ 
  label,
  value,
  onChangeText,
  placeholder,
  secureEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  containerStyle
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const animationValue = useRef(new Animated.Value(0)).current;
  
  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(animationValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };
  
  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(animationValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };
  
  // Interpolasi untuk properties
  const borderColor = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ddd', '#35cc8c']
  });
  
  const borderWidth = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1]
  });
  
  const shadowOpacity = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.2]
  });
  
  return (
    <View style={[styles.inputContainer, containerStyle]}>
      {label && <Text style={styles.inputLabel}>{label}</Text>}
      
      <Animated.View style={[
        styles.inputWrapper,
        { 
          borderWidth,
          borderColor,
          shadowOpacity,
          shadowColor: '#35cc8c',
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 4,
          elevation: isFocused ? 2 : 0,
        }
      ]}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          secureTextEntry={secureEntry && !showPassword}
          underlineColorAndroid="transparent"
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        
        {secureEntry && (
          <TouchableOpacity 
            onPress={() => setShowPassword(!showPassword)}
            style={styles.passwordToggle}
          >
            <FontAwesome 
              name={showPassword ? "eye-slash" : "eye"} 
              size={20} 
              color={isFocused ? '#35cc8c' : '#666'}
            />
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 20,
    width: '100%',
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
    color: '#333',
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'visible',
    backgroundColor: '#fff',
    height: 50,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
  },
  passwordToggle: {
    paddingHorizontal: 15,
    height: '100%',
    justifyContent: 'center',
  },
});

export default ThemedInput;