import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../config/firebaseConfig';
import ThemedButton from '../../../components/ThemedButton';
import Toast from '../../../components/Toast';
import { useRouter } from 'expo-router';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [activeInput, setActiveInput] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '', type: '' });
  const router = useRouter();

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password) => {
    // Contoh aturan: minimal 6 karakter
    return password.length >= 6;
  };

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      await AsyncStorage.setItem('profileImage', result.assets[0].uri);
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setToast({
        visible: true,
        message: 'All fields are required.',
        type: 'error',
      });
      return;
    }

    if (!isValidEmail(email)) {
      setToast({
        visible: true,
        message: 'Invalid email format.',
        type: 'error',
      });
      return;
    }

    if (!isValidPassword(password)) {
      setToast({
        visible: true,
        message: 'Password must be at least 6 characters.',
        type: 'error',
      });
      return;
    }

    try {
      // Buat akun pengguna di Firebase Authentication
      const registeredUser = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = registeredUser.user;

      // Perbarui profil pengguna dengan displayName
      await updateProfile(user, {
        displayName: name,
      });

      // Simpan data pengguna ke AsyncStorage
      const userData = { name, email, photo: profileImage };
      await AsyncStorage.setItem('userData', JSON.stringify(userData));

      // Arahkan ke halaman berikutnya
      router.push('/screens/Start/GoalScreen');
    } catch (error) {
      setToast({ visible: true, message: error.message, type: 'error' });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TouchableOpacity style={styles.imagePicker} onPress={handleImagePick}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <Text style={styles.imagePickerText}>Upload Profile Picture</Text>
        )}
      </TouchableOpacity>
      <TextInput
        style={[styles.input, activeInput === 'name' && styles.activeInput]}
        placeholder="Name"
        value={name}
        onChangeText={setName}
        onFocus={() => setActiveInput('name')}
        onBlur={() => setActiveInput(null)}
      />
      <TextInput
        style={[styles.input, activeInput === 'email' && styles.activeInput]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        onFocus={() => setActiveInput('email')}
        onBlur={() => setActiveInput(null)}
        keyboardType="email-address"
      />
      <TextInput
        style={[styles.input, activeInput === 'password' && styles.activeInput]}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        onFocus={() => setActiveInput('password')}
        onBlur={() => setActiveInput(null)}
        secureTextEntry
      />
      <ThemedButton
        label="Register"
        onPress={handleRegister}
        style={styles.button}
      />
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast({ ...toast, visible: false })}
      />
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  imagePicker: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e6f9f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#35cc8c',
  },
  imagePickerText: {
    color: '#35cc8c',
    textAlign: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  activeInput: {
    borderColor: '#35cc8c',
  },
  button: {
    marginTop: 10,
    width: '100%',
    backgroundColor: '#35cc8c',
  },
});
