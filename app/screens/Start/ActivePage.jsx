import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import ThemedButton from '../../../components/ThemedButton';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

const ActivePage = () => {
  const [selectedActive, setSelectedActive] = useState('Sedentary');
  const router = useRouter();

  const handleGoalSelection = (goal) => {
    setSelectedActive(goal);
  };

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
        { active: selectedActive }, // Data yang akan disimpan
        { merge: true } // Gabungkan dengan data yang ada
      );

      console.log('selectedActive saved to Firestore:', selectedActive);

      // Navigasi ke halaman berikutnya
      router.push('/screens/Start/TallPage'); // Ganti dengan route halaman berikutnya
    } catch (error) {
      console.error('Error saving selectedActive to Firestore:', error);
    }
  };
  return (
    <View style={styles.container1}>
      <Text style={styles.title}>How active are you?</Text>
      <View style={{ width: '60%', alignSelf: 'center' }}>
        <Text style={styles.subtitle}>
          A sedentary person burns fewer calories than an active person
        </Text>
      </View>
      <View style={styles.container2}>
        <TouchableOpacity
          style={
            selectedActive === 'Sedentary'
              ? styles.buttonSelected
              : styles.button
          }
          onPress={() => handleGoalSelection('Sedentary')}
        >
          <Text>Sedentary</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            selectedActive === 'Low Active'
              ? styles.buttonSelected
              : styles.button
          }
          onPress={() => handleGoalSelection('Low Active')}
        >
          <Text>Low Active</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            selectedActive === 'Active' ? styles.buttonSelected : styles.button
          }
          onPress={() => handleGoalSelection('Active')}
        >
          <Text>Active</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            selectedActive === 'Very Active'
              ? styles.buttonSelected
              : styles.button
          }
          onPress={() => handleGoalSelection('Very Active')}
        >
          <Text>Very Active</Text>
        </TouchableOpacity>
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

export default ActivePage;

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 64,
    position: 'relative',
  },
  button: {
    padding: 10,
    width: 240,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonSelected: {
    padding: 10,
    borderWidth: 1,
    width: 240,
    borderColor: '#35cc8c',
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: '#e6f9f0',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    position: 'relative',
  },
  container2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
    position: 'relative',
  },
  title: {
    fontSize: 18,
    fontselectedActive: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
});
