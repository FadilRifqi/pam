import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';

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
  const { mealType, foodName, grams, addItem } = useLocalSearchParams();
  const router = useRouter();
  const mealKey = (mealType as string)?.toLowerCase();

  const [items, setItems] = useState<FoodItem[]>([]);

  useEffect(() => {
    if (addItem && foodName && grams) {
      const newItem: FoodItem = {
        name: decodeURIComponent(foodName as string),
        grams: Number(grams),
        calories: 200,
        protein: 10,
        fats: 8,
        carbs: 20,
      };
      setItems((prev) => [...prev, newItem]);
  
      router.replace({
        pathname: '/meal/[mealType]',
        params: { mealType: mealKey },
      });
    }
  }, [addItem, foodName, grams]);

  const totals = items.reduce<Nutrients>(
    (acc, item) => {
      acc.calories += item.calories;
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
            Cal: {item.calories} | P: {item.protein}g | F: {item.fats}g | C: {item.carbs}g
          </Text>
        </View>
      ))}

      <Pressable
        onPress={() => router.push(`/food/index?mealType=${mealKey}`)}
        style={styles.addBtn}
      >
        <Text style={styles.addText}>+ Add Food</Text>
      </Pressable>

      <Pressable
        style={styles.saveBtn}
        onPress={() => Alert.alert('Saved!', 'Meal has been saved.')}
      >
        <Text style={styles.saveText}>Save</Text>
      </Pressable>
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
});
