import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import ThemedButton from '../../../components/ThemedButton';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

const RecommendedPFCPage = () => {
  const [recommendedPFC, setRecommendedPFC] = useState({
    protein: 0,
    fats: 0,
    carbs: 0,
    calories: 0,
    water: 2000,
  });
  const router = useRouter();

  useEffect(() => {
    calculatePFC();
  }, []);

  const calculatePFC = async () => {
    try {
      // Ambil email pengguna dari AsyncStorage
      const userData = await AsyncStorage.getItem('userData');
      const parsedUserData = userData ? JSON.parse(userData) : null;

      if (!parsedUserData || !parsedUserData.email) {
        console.error('User email not found in AsyncStorage.');
        return;
      }

      const userEmail = parsedUserData.email;

      // Ambil data dari Firestore
      const userDocRef = doc(db, 'users', userEmail);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        console.error('User document does not exist in Firestore.');
        return;
      }

      const goal = userDoc.data().goal; // Lose Weight, Keep Weight, Gain Weight
      const gender = userDoc.data().gender;
      // Ambil data dari AsyncStorage
      const active = userDoc.data().active; // Sedentary, Low Active, Active, Very Active
      const height = parseFloat(userDoc.data().height); // meter
      const weight = parseFloat(userDoc.data().weight); // kg
      const age = parseInt(userDoc.data().age); // tahun

      if (!goal || !gender || !active || !height || !weight || !age) {
        console.error('Data tidak lengkap untuk menghitung PFC');
        return;
      }

      // Hitung BMR menggunakan rumus Mifflin-St Jeor
      let BMR;
      if (gender === 'Male') {
        BMR = 10 * weight + 6.25 * height - 5 * age + 5; // Tinggi dikalikan 100 untuk cm
      } else if (gender === 'Female') {
        BMR = 10 * weight + 6.25 * height - 5 * age - 161; // Tinggi dikalikan 100 untuk cm
      } else {
        console.error('Gender tidak valid');
        return;
      }

      // Hitung TDEE berdasarkan faktor aktivitas
      let TDEE;
      switch (active) {
        case 'Sedentary':
          TDEE = BMR * 1.2;
          break;
        case 'Low Active':
          TDEE = BMR * 1.375;
          break;
        case 'Active':
          TDEE = BMR * 1.55;
          break;
        case 'Very Active':
          TDEE = BMR * 1.725;
          break;
        default:
          console.error('Level aktivitas tidak valid');
          return;
      }

      // Sesuaikan TDEE berdasarkan tujuan
      if (goal === 'Lose Weight') {
        TDEE *= 0.75; // Kurangi 25%
      } else if (goal === 'Gain Weight') {
        TDEE *= 1.2; // Tambah 20%
      }

      // Distribusi makronutrien (PFC)
      const proteinCalories = TDEE * 0.25; // 25% dari kalori total
      const fatsCalories = TDEE * 0.25; // 25% dari kalori total
      const carbsCalories = TDEE - (proteinCalories + fatsCalories); // Sisa kalori untuk karbohidrat

      const protein = Math.round(proteinCalories / 4); // 1 gram protein = 4 kalori
      const fats = Math.round(fatsCalories / 9); // 1 gram lemak = 9 kalori
      const carbs = Math.round(carbsCalories / 4); // 1 gram karbohidrat = 4 kalori
      const calories = Math.round(TDEE);

      // Simpan hasil ke state
      setRecommendedPFC({ protein, fats, carbs, calories });

      // Gabungkan semua data yang akan disimpan
      const dataToSave = {
        recommendedPFC: { protein, fats, carbs, calories },
        waterServingSize: 200,
      };

      // Simpan ke Firestore dalam satu operasi
      await setDoc(userDocRef, dataToSave, { merge: true });

      console.log('PFC yang direkomendasikan:', {
        protein,
        fats,
        carbs,
        calories,
      });
    } catch (error) {
      console.error('Error menghitung PFC:', error);
    }
  };

  const handleNext = () => {
    router.push('/pages/DiaryPage');
  };

  return (
    <View style={styles.container1}>
      <Text style={styles.title}>Recommended PFC</Text>
      <View style={{ width: '60%', alignSelf: 'center' }}>
        <Text style={styles.subtitle}>
          You can always change PFC in the profile
        </Text>
      </View>
      <View style={styles.container2}>
        <TouchableOpacity disabled style={styles.button}>
          <Text style={{ color: '#fff' }}>
            Proteins: {recommendedPFC.protein}g
          </Text>
        </TouchableOpacity>
        <TouchableOpacity disabled style={styles.button}>
          <Text style={{ color: '#fff' }}>Fats {recommendedPFC.fats}g</Text>
        </TouchableOpacity>
        <TouchableOpacity disabled style={styles.button}>
          <Text style={{ color: '#fff' }}>Carbs: {recommendedPFC.carbs}g</Text>
        </TouchableOpacity>
        <TouchableOpacity disabled style={styles.button}>
          <Text style={{ color: '#fff' }}>
            Calories {recommendedPFC.calories}g
          </Text>
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

export default RecommendedPFCPage;

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
    width: 160,
    backgroundColor: '#35cc8c',
    borderRadius: 5,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    position: 'relative',
  },
  container2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 8,
    width: '100%', // Lebar container agar item tetap di tengah
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
