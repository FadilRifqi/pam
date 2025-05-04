// filepath: /home/fadilrifqi/Projects/pam/app/config/firebaseConfig.jsx
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCEVGGJ58PSvP-9Td9ynN_nVLyIGzYLFpw',
  authDomain: 'tubes-pam-d1bc2.firebaseapp.com',
  projectId: 'tubes-pam-d1bc2',
  storageBucket: 'tubes-pam-d1bc2.firebasestorage.app',
  messagingSenderId: '184018390631',
  appId: '1:184018390631:android:940868ea1565e038c54ec2',
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { app, auth };
