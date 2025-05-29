import * as WebBrowser from 'expo-web-browser';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig'; // Pastikan konfigurasi Firestore sudah benar
import React, { useEffect } from 'react';
import {
  GoogleSignin,
  isSuccessResponse,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from 'firebase/auth';
import { useRouter } from 'expo-router';
import { auth } from '../config/firebaseConfig';

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const router = useRouter();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '258181757491-7ie30d566fsk42qt10pi4pbca6hfofjb.apps.googleusercontent.com',
      profileImageSize: 120,
    });
  }, []);

  const handleRegister = async (name, email, password) => {
    try {
      // Jika email belum terdaftar, lanjutkan proses registrasi
      const registeredUser = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = registeredUser.user;

      const userData = { name, email, photo: profileImage };
      await AsyncStorage.setItem('userData', JSON.stringify(userData));

      router.push('/screens/Start/GoalScreen');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        return;
      }
      Alert.alert(error.code);
      console.error('Registration Error:', error.code);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsSubmitting(true);
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        const { idToken, user } = response.data;

        await AsyncStorage.setItem('userData', JSON.stringify(user));

        await handleRegister(user.name, user.email, 'password123');

        // Ambil data dari Firestore
        const userDocRef = doc(db, 'users', user.email);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const { recommendedPFC, goal, gender } = userData;

          if (!recommendedPFC || !goal || !gender) {
            router.push('/screens/Start/GoalScreen');
          } else {
            router.push('/pages/DiaryPage');
          }
        } else {
          console.warn('User document does not exist in Firestore.');
          router.push('/screens/Start/GoalScreen');
        }
      } else {
        console.error('Cancelled by user');
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            console.error('Sign-in in progress');
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            console.error('Play services not available');
            break;
          default:
            console.error('Unknown error:', error);
            break;
        }
      }
      console.error('Google Sign-In Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      {isSubmitting ? (
        <ActivityIndicator size="large" color="#4285F4" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleGoogleSignIn}>
          <Text style={styles.buttonText}>Sign in with Google</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4285F4',
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default LoginScreen;
