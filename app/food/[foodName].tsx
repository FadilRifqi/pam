import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useState } from 'react';
import FoodInputModal from '../Components/FoodInputModal';

type FoodOption = {
  name: string;
  calPer100g: number;
};

type FoodOptions = {
  egg: FoodOption[];
};

const foodOptions: FoodOptions = {
  egg: [
    { name: 'Boiled egg', calPer100g: 160 },
    { name: 'Fried eggs', calPer100g: 191 },
  ],
};

export default function FoodList() {
  const { foodName, mealType } = useLocalSearchParams();
  const router = useRouter();

  // Type-safe food lookup
  const foods = foodName && foodOptions[foodName as keyof FoodOptions] ? foodOptions[foodName as keyof FoodOptions] : [];
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{foodName}</Text>
      {foods.map((food, index) => (
        <Pressable key={index} onPress={() => setSelected(food.name)}>
          <Text style={styles.item}>
            {food.name} {'\n'}
            {food.calPer100g} cal / 100g
          </Text>
        </Pressable>
      ))}

      <FoodInputModal
        visible={!!selected}
        foodName={selected}
        onCancel={() => setSelected(null)}
        onConfirm={(grams: number) => {
          const encodedFood = encodeURIComponent(selected || '');
          router.replace({
            pathname: `/meal/[mealType]`,
            params: {
              addItem: 'true',
              foodName: encodedFood,
              grams: grams.toString(),
            },
          });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  item: {
    padding: 12,
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
    marginBottom: 10,
  },
});
