import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCEVGGJ58PSvP-9Td9ynN_nVLyIGzYLFpw",
  authDomain: "tubes-pam-d1bc2.firebaseapp.com",
  projectId: "tubes-pam-d1bc2",
  storageBucket: "tubes-pam-d1bc2.firebasestorage.app",
  messagingSenderId: "184018390631",
  appId: "1:184018390631:android:940868ea1565e038c54ec2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export default app;