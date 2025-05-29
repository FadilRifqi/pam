import React, { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
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

interface Meal {
  type: string;
  time: string;
  calories: number; // Optional property
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
  }); // State untuk input makanan
  const router = useRouter();

  // Ambil URI gambar profil dari AsyncStorage
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const dateKey = selectedDate.toISOString().split('T')[0]; // Format YYYY-MM-DD
        const storedInput = await AsyncStorage.getItem(`input${dateKey}`);
        const storedMeals = await AsyncStorage.getItem(`meals_${dateKey}`);

        // Save to Firestore
        const userEmail = email; // Ensure email is fetched and set in state

        if (userEmail) {
          const userDocRef = doc(db, 'users', userEmail, 'diary', dateKey);

          await setDoc(userDocRef, {
            input: storedInput ? JSON.parse(storedInput) : null,
            meals: storedMeals ? JSON.parse(storedMeals) : [],
          });

          console.log('Data saved to Firestore');
        }

        if (storedMeals) {
          setMeals(JSON.parse(storedMeals));
          console.log('Meals:', JSON.parse(storedMeals));
        } else {
          setMeals([]);
        }
        if (storedInput) {
          setInput(JSON.parse(storedInput));
        } else {
          setInput({ protein: 0, fats: 0, carbs: 0, calories: 0, water: 0 });
        }
      } catch (error) {
        console.error('Error fetching meals:', error);
      }
    };
    const fetchUserData = async () => {
      try {
        const dateKey = selectedDate.toISOString().split('T')[0]; // Format YYYY-MM-DD
        const dailyData = await AsyncStorage.getItem(dateKey);
        if (dailyData) {
          setPFC(JSON.parse(dailyData));
        } else {
          setPFC({ protein: 0, fats: 0, carbs: 0, calories: 0, water: 0 });
        }
        const userData = await AsyncStorage.getItem('userData');
        const recommendedPFC = await AsyncStorage.getItem('recommendedPFC');
        if (recommendedPFC) {
          const parsedPFC = JSON.parse(recommendedPFC);
          setPFC(parsedPFC);
        }
        if (userData) {
          const parsedData = JSON.parse(userData);
          setProfileImage(parsedData.photo); // Ambil URI gambar profil
          setUserName(parsedData.name); // Ambil nama pengguna
          setEmail(parsedData.email); // Ambil email pengguna
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
      await AsyncStorage.setItem(
        `meals_${dateKey}`,
        JSON.stringify(updatedMeals)
      ); // Simpan ke AsyncStorage
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
            current={input.water}
            goal={2.5}
            lastTime="10:45 AM"
            setInput={setInput}
            input={input}
            date={selectedDate}
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
              <Button title="Add Meal" onPress={handleAddMeal} />
              <Button title="Close" onPress={() => setModalVisible(false)} />
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
