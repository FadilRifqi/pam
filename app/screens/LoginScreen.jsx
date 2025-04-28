import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar, // Import StatusBar
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import ThemedButton from '../../components/ThemedButton';
import ThemedContent from '../../components/ThemedContent';
import ThemedInput from '../../components/ThemedInput';

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Login with:', email, password);
    router.replace('/screens/HomeScreen');
  };

  const handleForgotPassword = () => {
    router.push('/screens/ForgotPassword');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Add StatusBar here */}
      <StatusBar
        barStyle="dark-content" 
        backgroundColor="#ffffff"
        translucent={false}
      />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Login</Text>
        <View style={styles.placeholder} />
      </View>
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'position'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 30}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.contentContainer}>
            <View style={styles.imageContainer}>
              <ThemedContent
                image={require('../../assets/images/Apple.png')}
                title="Welcome Back!"
                description="Sign in to continue"
                imageSize="small"
              />
            </View>
            
            <View style={styles.inputsContainer}>
              <ThemedInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
              />
              
              <ThemedInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureEntry={true}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      
      <View style={styles.bottomContainer}>
        <ThemedButton 
          label="LOGIN"
          onPress={handleLogin}
          style={styles.loginButton}
          textStyle={styles.loginButtonText}
        />
        
        <ThemedButton 
          label="Forgot Password?"
          onPress={handleForgotPassword}
          variant="link"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  imageContainer: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  inputsContainer: {
    paddingVertical: 20,
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  loginButton: {
    backgroundColor: '#35cc8c',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#ffffff',
  },
});

export default LoginScreen;