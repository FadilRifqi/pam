import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  GoogleSignin,
  isSuccessResponse,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {
  Alert,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import ThemedButton from '../../components/ThemedButton';
import ThemedContent from '../../components/ThemedContent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebaseConfig';

const WelcomeScreen = () => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '258181757491-7ie30d566fsk42qt10pi4pbca6hfofjb.apps.googleusercontent.com',
      profileImageSize: 120,
    });
  }, []);

  const handleStart = () => {
    router.push('/screens/Start/Register');
  };

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
      setModalVisible(false); // Tutup modal
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        const { idToken, user } = response.data;

        await AsyncStorage.setItem('userData', JSON.stringify(user));

        await handleRegister(user.name, user.email, 'password123');

        // Registrasi pengguna jika belum ada
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
    }
  };

  const handleSignInManually = () => {
    setModalVisible(false);
    router.push('/screens/LoginScreen');
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainContainer}>
        <ThemedContent
          image={require('../../assets/images/Apple.png')}
          title="Welcome!"
          description="Track your health journey with our app"
          imageSize="large"
        />
      </View>

      <View style={styles.bottomContainer}>
        <ThemedButton
          label="START"
          onPress={handleStart}
          style={styles.startButton}
          textStyle={styles.startButtonText}
        />

        <View style={styles.signInContainer}>
          <Text style={styles.alreadyText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.signInText}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Sign In</Text>

                <ThemedButton
                  label="Sign in with Google"
                  onPress={handleGoogleSignIn}
                  style={styles.googleButton}
                  textStyle={styles.googleButtonText}
                />
                <ThemedButton
                  label="Sign In"
                  onPress={handleSignInManually}
                  style={styles.manualButton}
                  textStyle={styles.manualButtonText}
                />

                <ThemedButton
                  label="Cancel"
                  onPress={() => setModalVisible(false)}
                  variant="link"
                />
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    justifyContent: 'space-between',
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  bottomContainer: {
    width: '100%',
    marginTop: 50,
    marginBottom: 40,
  },
  startButton: {
    backgroundColor: '#35cc8c',
    paddingVertical: 18,
    borderRadius: 12,
    marginBottom: 20,
    width: '100%',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alreadyText: {
    fontSize: 14,
    color: '#666666',
  },
  signInText: {
    fontSize: 14,
    color: '#35cc8c',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: height / 4,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  modalContent: {
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  googleButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 15,
    width: '100%',
  },
  googleButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  manualButton: {
    backgroundColor: '#35cc8c',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 15,
    width: '100%',
  },
  manualButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default WelcomeScreen;
