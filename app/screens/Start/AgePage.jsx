import { StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useState } from 'react';
import ThemedButton from '../../../components/ThemedButton';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

const AgePage = () => {
  const [age, setAge] = useState(0);
  const router = useRouter();

  const handleNext = async () => {
    try {
      // Ambil email pengguna dari AsyncStorage
      const userData = await AsyncStorage.getItem('userData');
      const parsedUserData = userData ? JSON.parse(userData) : null;

      if (!parsedUserData || !parsedUserData.email) {
        console.warn('User email not found in AsyncStorage.');
        return;
      }

      const userEmail = parsedUserData.email;

      // Simpan age ke Firestore
      const userDocRef = doc(db, 'users', userEmail);
      await setDoc(
        userDocRef,
        { age: age }, // Simpan age
        { merge: true } // Gabungkan dengan data yang ada
      );

      console.log('age saved to Firestore:', age);

      // Lanjutkan ke halaman berikutnya
      router.push('/screens/Start/RecommendedPFC');
    } catch (error) {
      console.error('Error saving goal to Firestore:', error);
      Alert.alert('Error', 'Failed to save goal. Please try again.');
    }
  };

  return (
    <View style={styles.container1}>
      <Text style={styles.title}>What’s your age?</Text>
      <View style={{ width: '60%', alignSelf: 'center' }}>
        <Text style={styles.subtitle}>
          Required number of calories varies with age
        </Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Age (years)"
          keyboardType="numeric"
          value={age}
          onChangeText={(text) => setAge(text)}
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

export default AgePage;

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
