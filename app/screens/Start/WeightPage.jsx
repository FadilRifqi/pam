import { StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useState } from 'react';
import ThemedButton from '../../../components/ThemedButton';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

const WeightPage = () => {
  const [weight, setWeight] = useState('');
  const router = useRouter();

  const handleNext = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      const parsedUserData = userData ? JSON.parse(userData) : null;
      if (!parsedUserData || !parsedUserData.email) {
        console.warn('User email not found in AsyncStorage.');
        return;
      }
      if (!parsedUserData.email) {
        console.warn('User email is not available.');
        return;
      }

      // Simpan data tinggi badan ke Firestore
      const userDocRef = doc(db, 'users', parsedUserData.email); // Gunakan email sebagai ID dokumen
      await setDoc(
        userDocRef,
        { weight: weight }, // Data yang akan disimpan
        { merge: true } // Gabungkan dengan data yang ada
      );

      console.log('Weight saved to Firestore:', weight);

      // Navigasi ke halaman berikutnya
      router.push('/screens/Start/AgePage'); // Ganti dengan route halaman berikutnya
    } catch (error) {
      console.error('Error saving Weight to Firestore:', error);
    }
  };

  return (
    <View style={styles.container1}>
      <Text style={styles.title}>What’s your weight?</Text>
      <View style={{ width: '60%', alignSelf: 'center' }}>
        <Text style={styles.subtitle}>
          Please enter your weight in kilograms
        </Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter weight (kg)"
          keyboardType="numeric"
          value={weight}
          onChangeText={(text) => setWeight(text)}
        />
      </View>
      <View style={styles.container}>
        <ThemedButton
          variant="circle"
          icon={require('../../../assets/images/next.png')}
          onPress={handleNext}
          position={{ bottom: 40, left: 140 }}
        />
      </View>
    </View>
  );
};

export default WeightPage;

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 64,
    position: 'relative',
  },
  inputContainer: {
    marginTop: 100,
    width: '80%',
    alignItems: 'center',
    borderBottomWidth: 2, // Tambahkan border bawah
    borderBottomColor: '#35cc8c', // Warna hijau dari kode sebelumnya
  },
  input: {
    width: '100%',
    height: 50,
    fontSize: 16,
    paddingHorizontal: 10,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    position: 'relative',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
});
