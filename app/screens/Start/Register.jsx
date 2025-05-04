import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import ThemedButton from '../../../components/ThemedButton';
import { useRouter } from 'expo-router';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [activeInput, setActiveInput] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const router = useRouter();

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
    const userData = { name, email, password, profileImage };
    await AsyncStorage.setItem('userData', JSON.stringify(userData));
    setIsRegistered(true);
  };

  const handleGoToLogin = () => {
    router.replace('/screens/Start/Login');
  };

  const handleResend = () => {
    alert('Activation link resent to your email!');
  };

  if (isRegistered) {
    return (
      <View style={styles.container}>
        <Text style={styles.subtitle}>
          We have sent an account activation link to your email,{'\u00A0'}
          <Text style={{ color: '#35cc8c' }}>{email}</Text>. Please activate
          your account before logging in.
        </Text>
        <ThemedButton
          label="Go to Login"
          onPress={handleGoToLogin}
          style={styles.button}
        />
        <TouchableOpacity onPress={handleResend} style={styles.buttonResend}>
          <Text style={styles.TextResend}>Resend Activation Link</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
  buttonResend: {
    marginTop: 16,
    width: '100%',
    color: '#35cc8c',
  },
  TextResend: {
    color: '#35cc8c',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
