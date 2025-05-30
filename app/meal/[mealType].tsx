import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig'; // Pastikan konfigurasi Firestore sudah benar
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Modal,
  TextInput,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import { createSignedUrl } from '../config/oAuthHelper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

type FoodItem = {
  name: string;
  grams: number;
  calories: number;
  protein: number;
  fats: number;
  carbs: number;
};

type Nutrients = {
  calories: number;
  protein: number;
  fats: number;
  carbs: number;
};

export default function MealDetail() {
  const { mealType, dateKey, email } = useLocalSearchParams();
  const router = useRouter();
  const mealKey = (mealType as string)?.toLowerCase();
  const [currentMeal, setCurrentMeal] = useState(); // State untuk menyimpan jenis makanan
  const [items, setItems] = useState<FoodItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false); // Modal pencarian
  const [servingModalVisible, setServingModalVisible] = useState(false); // Modal untuk serving
  const [selectedFood, setSelectedFood] = useState<any>(null); // Makanan yang dipilih
  const [selectedServing, setSelectedServing] = useState<any>(null); // Serving yang dipilih
  const [servingOptions, setServingOptions] = useState<any[]>([]); // Daftar serving
  const [servingMultiplier, setServingMultiplier] = useState(1); // Jumlah serving
  const [searchQuery, setSearchQuery] = useState(''); // Input pencarian
  const [searchResults, setSearchResults] = useState<any[]>([]); // Hasil pencarian
  const [loading, setLoading] = useState(false); // Loading state

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    const fetchExistingItems = async () => {
      try {
        const userDocRef = doc(db, 'users', email, 'diary', dateKey);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const diaryData = userDoc.data();

          // Cari meal dengan type === mealType
          const meal = diaryData.meals?.find(
            (m: any) => m.type === mealType?.toString()
          );

          if (meal && meal.inputMeals) {
            setItems(meal.inputMeals.items || []); // Set items dari inputMeals
          } else {
            console.warn('No matching mealType found or inputMeals is empty.');
            setItems([]); // Set items ke array kosong jika tidak ada data
          }
        } else {
          console.warn('Diary document does not exist in Firestore.');
          setItems([]); // Set items ke array kosong jika tidak ada data
        }
      } catch (error) {
        console.error('Error fetching existing items from Firestore:', error);
      }
    };

    fetchExistingItems();
  }, [email, dateKey, mealType]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const url = createSignedUrl(
        'https://platform.fatsecret.com/rest/server.api',
        'GET',
        {
          method: 'foods.search',
          format: 'json',
          search_expression: searchQuery,
          max_results: 50,
        }
      );

      const response = await axios.get(url);
      const foods = response.data.foods.food; // Ambil data makanan
      setSearchResults(Array.isArray(foods) ? foods : [foods]); // Pastikan hasil berupa array
    } catch (error) {
      console.error('Error fetching food data:', error);
      Alert.alert('Error', 'Failed to fetch food data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFood = async (food: any) => {
    try {
      const foodId = food.food_id;
      const url = createSignedUrl(
        'https://platform.fatsecret.com/rest/server.api',
        'GET',
        {
          method: 'food.get',
          format: 'json',
          food_id: foodId,
        }
      );

      const response = await axios.get(url);
      const foodDetails = response.data.food; // Detail makanan

      const servings = Array.isArray(foodDetails.servings.serving)
        ? foodDetails.servings.serving
        : [foodDetails.servings.serving]; // Pastikan serving berupa array

      setSelectedFood(foodDetails);
      setServingOptions(servings); // Simpan daftar serving
      setServingModalVisible(true); // Tampilkan modal untuk memilih serving
    } catch (error) {
      console.error('Error fetching food details:', error);
      Alert.alert('Error', 'Failed to fetch food details.');
    }
  };

  const handleAddFood = () => {
    if (!selectedServing) return;

    const multiplier = servingMultiplier;
    const newItem: FoodItem = {
      name: selectedFood.food_name,
      grams: parseFloat(selectedServing.metric_serving_amount) * multiplier,
      calories: parseFloat(selectedServing.calories) * multiplier,
      protein: parseFloat(selectedServing.protein) * multiplier,
      fats: parseFloat(selectedServing.fat) * multiplier,
      carbs: parseFloat(selectedServing.carbohydrate) * multiplier,
    };

    setItems((prev) => [...prev, newItem]);
    setServingModalVisible(false); // Tutup modal serving
    setModalVisible(false); // Tutup modal pencarian
  };

  const handleSave = async () => {
    try {
      // Ambil data meal sebelumnya dari Firestore
      let meals = [];
      let existingInput = { water: 0 }; // Default nilai input untuk water

      if (email) {
        const userDocRef = doc(db, 'users', email, 'diary', dateKey);
        const diaryDoc = await getDoc(userDocRef);

        if (diaryDoc.exists()) {
          const diaryData = diaryDoc.data();
          meals = diaryData.meals || []; // Ambil data meals yang ada atau kosongkan
          existingInput = diaryData.input || existingInput; // Ambil data input yang ada atau gunakan default
        }
      } else {
        console.warn('User email is not available. Skipping Firestore fetch.');
      }

      // Ubah atau tambahkan meal yang sesuai dengan mealType
      const updatedMeals = [...meals];
      const index = updatedMeals.findIndex(
        (m: any) => m.type === mealType?.toString()
      );

      if (index !== -1) {
        // Jika mealType sudah ada, tambahkan inputMeals
        updatedMeals[index] = {
          ...updatedMeals[index],
          calories: totals.calories,
          inputMeals: { items },
        };
      } else {
        // Jika mealType belum ada, tambahkan sebagai item baru
        updatedMeals.push({
          type: mealType?.toString(),
          calories: totals.calories,
          inputMeals: { items },
        });
      }

      // Hitung total dari seluruh meals
      const totalInput = updatedMeals.reduce(
        (acc, meal) => {
          acc.calories += meal.calories || 0;
          acc.protein += meal.inputMeals?.items.reduce(
            (sum: number, item: FoodItem) => sum + (item.protein || 0),
            0
          );
          acc.fats += meal.inputMeals?.items.reduce(
            (sum: number, item: FoodItem) => sum + (item.fats || 0),
            0
          );
          acc.carbs += meal.inputMeals?.items.reduce(
            (sum: number, item: FoodItem) => sum + (item.carbs || 0),
            0
          );
          return acc;
        },
        { calories: 0, protein: 0, fats: 0, carbs: 0 }
      );

      // Gabungkan totalInput dengan existingInput.water
      const newData = {
        ...totalInput,
        water: existingInput.water, // Tetap gunakan nilai water dari existingInput
      };

      // Simpan ke Firestore
      if (email) {
        const userDocRef = doc(db, 'users', email, 'diary', dateKey);
        await setDoc(
          userDocRef,
          {
            input: newData, // Perbarui input dengan total dari seluruh meals dan water
            meals: updatedMeals, // Simpan updatedMeals ke Firestore
          },
          { merge: true } // Gabungkan dengan data yang ada
        );
      } else {
        console.warn('User email is not available. Skipping Firestore update.');
      }

      router.back(); // Kembali ke halaman sebelumnya
    } catch (error) {
      console.error('Error saving meal:', error);
      Alert.alert('Error', 'Failed to save meal.');
    }
  };

  const totals = items.reduce<Nutrients>(
    (acc, item) => {
      acc.calories += Number(item.calories);
      acc.protein += item.protein;
      acc.fats += item.fats;
      acc.carbs += item.carbs;
      return acc;
    },
    { calories: 0, protein: 0, fats: 0, carbs: 0 }
  );

  return (
    <ScrollView style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Image
            source={require('../../assets/images/back-button.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.title}>{mealKey.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.summary}>
        <Text>Total Calories: {totals.calories}</Text>
        <Text>Proteins: {totals.protein}g</Text>
        <Text>Fats: {totals.fats}g</Text>
        <Text>Carbs: {totals.carbs}g</Text>
      </View>

      <Text style={styles.subtitle}>Items</Text>
      {items.map((item, idx) => (
        <View key={idx} style={styles.item}>
          <Text style={styles.itemName}>
            {item.name} - {item.grams}g
          </Text>
          <Text style={styles.itemDetail}>
            Cal: {item.calories.toFixed(1)} | P: {item.protein.toFixed(1)}g | F:{' '}
            {item.fats.toFixed(1)}g | C: {item.carbs.toFixed(1)}g
          </Text>
        </View>
      ))}

      <Pressable onPress={() => setModalVisible(true)} style={styles.addBtn}>
        <Text style={styles.addText}>+ Add Food</Text>
      </Pressable>
      <Pressable onPress={handleSave} style={styles.saveBtn}>
        <Text style={styles.saveText}>Save</Text>
      </Pressable>

      {/* Modal untuk pencarian makanan */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Search Food</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Type to search..."
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
              onSubmitEditing={handleSearch}
            />
            {loading ? (
              <ActivityIndicator size="large" color="#007BFF" />
            ) : (
              <FlatList
                data={searchResults}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => handleSelectFood(item)}
                    style={styles.resultItem}
                  >
                    <Text>{item.food_name}</Text>
                    <Text style={styles.resultDetail}>
                      {item.food_description}
                    </Text>
                  </Pressable>
                )}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>No results found</Text>
                }
              />
            )}
            <View style={{ width: '100%' }}>
              <Pressable style={styles.searchButton} onPress={handleSearch}>
                <Text style={styles.closeButtonText}>Search</Text>
              </Pressable>
              <Pressable
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal untuk memilih serving */}
      <Modal
        visible={servingModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setServingModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Serving</Text>
            <FlatList
              data={servingOptions}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => setSelectedServing(item)}
                  style={[
                    styles.resultItem,
                    selectedServing === item && { backgroundColor: '#ddd' },
                  ]}
                >
                  <Text>{item.serving_description}</Text>
                </Pressable>
              )}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Enter multiplier (e.g., 1, 2)"
              keyboardType="numeric"
              value={servingMultiplier.toString()}
              onChangeText={(text) => setServingMultiplier(Number(text))}
            />
            <Pressable style={styles.addBtn} onPress={handleAddFood}>
              <Text style={styles.addText}>Add Food</Text>
            </Pressable>
            <Pressable
              style={styles.closeButton}
              onPress={() => setServingModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  summary: { marginVertical: 10 },
  subtitle: { fontSize: 18, fontWeight: '600', marginTop: 20 },
  item: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  itemName: { fontWeight: '600' },
  itemDetail: { fontSize: 12, color: 'gray' },
  addBtn: {
    marginTop: 20,
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addText: { color: '#333', fontWeight: '500', fontSize: 16 },
  saveBtn: {
    marginTop: 20,
    backgroundColor: 'green',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    borderWidth: 1,
    height: '70%', // Fixed height untuk modal
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  searchInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  scrollableContent: {
    flex: 1, // Agar konten dapat di-scroll
    width: '100%',
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
  },
  resultDetail: { fontSize: 12, color: 'gray' },
  emptyText: { marginTop: 10, fontSize: 14, color: 'gray' },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  searchButton: {
    marginTop: 10,
    backgroundColor: '#35cc8c',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'center',
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  backButton: {
    marginRight: 10,
  },
});
