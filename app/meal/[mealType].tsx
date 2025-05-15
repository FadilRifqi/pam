import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
} from 'react-native';
import { createSignedUrl } from '../config/oAuthHelper';
import axios from 'axios';

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
  const { mealType } = useLocalSearchParams();
  const router = useRouter();
  const mealKey = (mealType as string)?.toLowerCase();

  const [items, setItems] = useState<FoodItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false); // State untuk modal
  const [searchQuery, setSearchQuery] = useState(''); // Input pencarian
  const [searchResults, setSearchResults] = useState<any[]>([]); // Hasil pencarian
  const [loading, setLoading] = useState(false); // Loading state

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

  const handleAddFood = (food: any) => {
    const newItem: FoodItem = {
      name: food.food_name,
      grams: 100, // Default 100g, bisa diubah sesuai kebutuhan
      calories: food.food_description.match(/(\d+) calories/)?.[1] || 0,
      protein: 10, // Dummy value, bisa diubah sesuai kebutuhan
      fats: 5, // Dummy value, bisa diubah sesuai kebutuhan
      carbs: 20, // Dummy value, bisa diubah sesuai kebutuhan
    };
    setItems((prev) => [...prev, newItem]);
    setModalVisible(false); // Tutup modal
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
      <Text style={styles.title}>{mealKey.toUpperCase()}</Text>

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
            Cal: {item.calories} | P: {item.protein}g | F: {item.fats}g | C:{' '}
            {item.carbs}g
          </Text>
        </View>
      ))}

      <Pressable onPress={() => setModalVisible(true)} style={styles.addBtn}>
        <Text style={styles.addText}>+ Add Food</Text>
      </Pressable>

      <Pressable
        style={styles.saveBtn}
        onPress={() => Alert.alert('Saved!', 'Meal has been saved.')}
      >
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
                    onPress={() => handleAddFood(item)}
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
            <Pressable
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
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
    width: '80%',
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
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
  },
  resultDetail: { fontSize: 12, color: 'gray' },
  emptyText: { marginTop: 10, fontSize: 14, color: 'gray' },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
