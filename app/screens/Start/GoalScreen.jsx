import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import ThemedButton from '../../../components/ThemedButton';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

const GoalScreen = () => {
  const [selectedGoal, setSelectedGoal] = useState('Lose Weight');
  const router = useRouter();

  const handleGoalSelection = (goal) => {
    setSelectedGoal(goal);
  };

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

      // Simpan goal ke Firestore
      const userDocRef = doc(db, 'users', userEmail);
      await setDoc(
        userDocRef,
        { goal: selectedGoal }, // Simpan goal
        { merge: true } // Gabungkan dengan data yang ada
      );

      console.log('Goal saved to Firestore:', selectedGoal);

      // Lanjutkan ke halaman berikutnya
      router.push('/screens/Start/GenderPage');
    } catch (error) {
      console.error('Error saving goal to Firestore:', error);
      Alert.alert('Error', 'Failed to save goal. Please try again.');
    }
  };

  return (
    <View style={styles.container1}>
      <Text style={styles.title}>What’s your goal?</Text>
      <View style={{ width: '60%', alignSelf: 'center' }}>
        <Text style={styles.subtitle}>
          We will calculate daily calories according to your goal
        </Text>
      </View>
      <View style={styles.container2}>
        <TouchableOpacity
          style={
            selectedGoal === 'Lose Weight'
              ? styles.buttonSelected
              : styles.button
          }
          onPress={() => handleGoalSelection('Lose Weight')}
        >
          <Text>Lose Weight</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            selectedGoal === 'Keep Weight'
              ? styles.buttonSelected
              : styles.button
          }
          onPress={() => handleGoalSelection('Keep Weight')}
        >
          <Text>Keep Weight</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            selectedGoal === 'Gain Weight'
              ? styles.buttonSelected
              : styles.button
          }
          onPress={() => handleGoalSelection('Gain Weight')}
        >
          <Text>Gain Weight</Text>
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

export default GoalScreen;

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
