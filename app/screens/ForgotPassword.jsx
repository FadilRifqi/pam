import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';

import ThemedButton from '../../components/ThemedButton';
import ThemedContent from '../../components/ThemedContent';
import ThemedInput from '../../components/ThemedInput';

const ForgotPasswordScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleSendCode = () => {
    console.log('Sending code to:', email);
    // Implementasi logika untuk mengirim kode
    alert(`Code sent to ${email}`);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <FontAwesome name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Forgot Password</Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.contentContainer}>
          <ThemedContent
            title="Reset Password"
            description="We will send a password code to your email account"
            imageSize="small"
            containerStyle={styles.messageContainer}
          />
          
          <ThemedInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
          />
        </View>
        
        <View style={styles.bottomContainer}>
          <ThemedButton 
            label="SEND CODE"
            onPress={handleSendCode}
            style={styles.sendButton}
            textStyle={styles.sendButtonText}
          />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
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
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  messageContainer: {
    marginBottom: 40,
  },
  bottomContainer: {
    padding: 20,
    marginBottom: 60,
  },
  sendButton: {
    backgroundColor: '#35cc8c',
  },
  sendButtonText: {
    color: '#ffffff',
  },
});

export default ForgotPasswordScreen;