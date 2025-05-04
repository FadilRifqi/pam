import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Button,
  TouchableOpacity,
  View,
  Alert
} from 'react-native';

// Import Firebase JS SDK
import { auth } from '../../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, getAuth, signInWithCredential } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';


import ThemedButton from '../../components/ThemedButton';
import ThemedContent from '../../components/ThemedContent';
import ThemedInput from '../../components/ThemedInput';

GoogleSignin.configure({
  webClientId: '',
});

function GoogleSignIn() {
  return (
    <Button
      title="Google Sign-In"
      onPress={() => onGoogleButtonPress().then(() => console.log('Signed in with Google!'))}
    />
  );
}

async function onGoogleButtonPress() {
  // Check if your device supports Google Play
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  // Get the users ID token
  const signInResult = await GoogleSignin.signIn();

  // Try the new style of google-sign in result, from v13+ of that module
  idToken = signInResult.data?.idToken;
  if (!idToken) {
    // if you are using older versions of google-signin, try old style result
    idToken = signInResult.idToken;
  }
  if (!idToken) {
    throw new Error('No ID token found');
  }

  // Create a Google credential with the token
  const googleCredential = GoogleAuthProvider.credential(signInResult.data.idToken);

  // Sign-in the user with the credential
  return signInWithCredential(getAuth(), googleCredential);
}

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Move signUpTest inside the component so it can access email and password
  const signUpTest = () => {
    createUserWithEmailAndPassword(auth, "testemail@gmail.com", "password")
      .then(() => {
        console.log('User account created & signed in!');
        navigation.navigate('HomeScreen');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        Alert.alert('User ' + email + ' signed in!');
        router.replace('/screens/HomeScreen');
      })
      .catch((err) => {
        console.log(err);
      });
  };
  
  const handleForgotPassword = () => {
    router.push('/screens/ForgotPassword');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
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
          onPress={handleLogin} // Changed to handleLogin for correct functionality
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