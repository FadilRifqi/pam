import React, { useState, useEffect } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig'; // Ensure auth is properly configured
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NutrientIndicator from '../Components/NutrientIndicator';
import WaterIntake from '../Components/WaterIntake';
import MealCard from '../Components/MealList';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import Footer from '../Components/Footer';

interface PFCProps {
  protein: number;
  fats: number;
  carbs: number;
  calories: number;
  water: number;
}

type FoodItem = {
  name: string;
  grams: number;
  calories: number;
  protein: number;
  fats: number;
  carbs: number;
};

interface Meal {
  type: string;
  time: string;
  calories: number; // Optional property
  inputMeals: FoodItem[]; // Array of food items
}

function DiaryPage() {
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [PFC, setPFC] = useState<PFCProps>({
    protein: 0,
    fats: 0,
    carbs: 0,
    calories: 0,
    water: 0,
  });
  const [input, setInput] = useState<PFCProps>({
    protein: 0,
    fats: 0,
    carbs: 0,
    calories: 0,
    water: 0,
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null); // State untuk email
  const [meals, setMeals] = useState<Meal[]>([]); // State untuk daftar makanan
  const [modalVisible, setModalVisible] = useState(false); // State untuk modal
  const [mealInput, setMealInput] = useState<Meal>({
    type: '',
    time: '',
    calories: 0,
    inputMeals: [],
  }); // State untuk input makanan
  const [waterServingSize, setWaterServingSize] = useState<number>(200); // Ukuran porsi air
  const router = useRouter();

  // Ambil URI gambar profil dari AsyncStorage
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const dateKey = selectedDate.toISOString().split('T')[0]; // Format YYYY-MM-DD

        // Ambil email pengguna dari AsyncStorage
        const userData = await AsyncStorage.getItem('userData');
        const parsedUserData = userData ? JSON.parse(userData) : null;

        if (!parsedUserData || !parsedUserData.email) {
          console.error('User email not found in AsyncStorage.');
          return;
        }

        const userEmail = parsedUserData.email;

        // Ambil data dari Firestore
        const diaryDocRef = doc(db, 'users', userEmail, 'diary', dateKey);
        const diaryDoc = await getDoc(diaryDocRef);

        if (diaryDoc.exists()) {
          const diaryData = diaryDoc.data();
          const { input, meals } = diaryData;

          if (meals) {
            const mealsArray = Object.values(meals as Meal).filter(
              (meal) => typeof meal === 'object' && meal?.type
            );
            setMeals(mealsArray); // Set meals sebagai array
          } else {
            setMeals([]);
          }

          if (input) {
            setInput(input); // Set input dari Firestore
          } else {
            setInput({ protein: 0, fats: 0, carbs: 0, calories: 0, water: 0 });
          }
        } else {
          console.warn('Diary document does not exist in Firestore.');
          setMeals([]);
          setInput({ protein: 0, fats: 0, carbs: 0, calories: 0, water: 0 });
        }
      } catch (error) {
        console.error('Error fetching meals from Firestore:', error);
      }
    };
    const fetchUserData = async () => {
      try {
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

        if (userDoc.exists()) {
          const userDataFromFirestore = userDoc.data();
          const { recommendedPFC, waterServingSize } = userDataFromFirestore;

          if (waterServingSize) {
            setWaterServingSize(waterServingSize); // Set ukuran porsi air dari Firestore
          } else {
            console.warn('Water serving size not found in Firestore.');
            setWaterServingSize(200); // Set default ukuran porsi air
          }

          if (recommendedPFC) {
            setPFC(recommendedPFC); // Set PFC dari Firestore
          } else {
            console.warn('Recommended PFC not found in Firestore.');
            setPFC({ protein: 0, fats: 0, carbs: 0, calories: 0, water: 0 });
          }

          // Set data pengguna lainnya
          setProfileImage(parsedUserData.photo);
          setUserName(parsedUserData.name);
          setEmail(parsedUserData.email);
        } else {
          console.error('User document does not exist in Firestore.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
    fetchMeals();
  }, [selectedDate]);

  const handleDateChange = (event: any, date?: Date) => {
    if (date) setSelectedDate(date);
    setCalendarVisible(false);
  };

  const handleAddMeal = async () => {
    try {
      const dateKey = selectedDate.toISOString().split('T')[0]; // Format YYYY-MM-DD
      const updatedMeals = [...meals, mealInput];
      setMeals(updatedMeals); // Update state

      // Simpan ke AsyncStorage
      await AsyncStorage.setItem(
        `meals_${dateKey}`,
        JSON.stringify(updatedMeals)
      );

      // Simpan ke Firestore
      if (email) {
        const diaryDocRef = doc(db, 'users', email, 'diary', dateKey);
        await setDoc(
          diaryDocRef,
          { meals: updatedMeals }, // Simpan meals
          { merge: true } // Gabungkan dengan data yang ada
        );
      } else {
        console.warn('User email is not available. Skipping Firestore update.');
      }

      setModalVisible(false); // Tutup modal
      setMealInput({ type: '', time: '', calories: 0 }); // Reset input
      Alert.alert('Success', 'Meal added successfully!');
    } catch (error) {
      console.error('Error adding meal:', error);
      Alert.alert('Error', 'Failed to add meal.');
    }
  };

  const handleUserProfile = () => {
    router.push('/Profile/Main');
  };

  return (
    <View style={styles.viewStyle}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={handleUserProfile}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <Image
              source={{
                uri: profileImage || 'https://placekitten.com/100/100', // Default jika tidak ada gambar
              }}
              style={styles.avatar}
            />
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                maxWidth: 80,
                marginLeft: 6,
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {userName || 'User Name'}
            </Text>
          </Pressable>
          <Text style={styles.today}>{selectedDate.toDateString()}</Text>
          <Pressable onPress={() => setCalendarVisible(true)}>
            <Text style={styles.calendar}>📅</Text>
          </Pressable>
        </View>

        {/* Calendar Modal */}
        {calendarVisible && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="calendar"
            onChange={handleDateChange}
          />
        )}

        {/* Nutrients */}
        <View style={styles.section}>
          <NutrientIndicator
            protein={{ value: input.protein, goal: PFC.protein }}
            fats={{ value: input.fats, goal: PFC.fats }}
            carbs={{ value: input.carbs, goal: PFC.carbs }}
            calories={{ value: input.calories, goal: PFC.calories }}
          />
        </View>

        {/* Water Intake */}
        <View style={styles.section}>
          <WaterIntake
            servingSize={waterServingSize / 1000}
            current={input.water}
            goal={PFC.water / 1000}
            setInput={setInput}
            input={input}
            date={selectedDate}
            email={email}
          />
        </View>

        {/* Meals */}
        <View style={styles.mealHeader}>
          <Text style={styles.mealTitle}>Meals</Text>
          <Pressable onPress={() => setModalVisible(true)}>
            <Text style={{ fontSize: 20 }}>＋</Text>
          </Pressable>
        </View>
        {meals.map((meal, index) => (
          <MealCard
            key={index}
            name={meal.type}
            calories={meal.calories}
            time={meal.time}
            date={selectedDate}
            email={email} // Ensure email is not null
          />
        ))}

        {/* Footer */}

        {/* Modal untuk Menambahkan Makanan */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add Meal</Text>
              <TextInput
                style={styles.input}
                placeholder="Meal Type (e.g., Breakfast, Lunch)"
                value={mealInput.type}
                onChangeText={(text) =>
                  setMealInput({ ...mealInput, type: text })
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Time (e.g., 10:45 AM)"
                value={mealInput.time}
                onChangeText={(text) =>
                  setMealInput({ ...mealInput, time: text })
                }
              />
              <View style={{ width: '100%', flexDirection: 'column', gap: 10 }}>
                <Button
                  color={'#35cc8c'}
                  title="Add Meal"
                  onPress={handleAddMeal}
                />
                <Button
                  color={'#007BFF'}
                  title="Close"
                  onPress={() => setModalVisible(false)}
                />
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 72,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  today: { fontSize: 18, fontWeight: '500' },
  calendar: { fontSize: 20 },
  section: { marginVertical: 20 },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  mealTitle: { fontSize: 16, fontWeight: '600' },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default DiaryPage;
