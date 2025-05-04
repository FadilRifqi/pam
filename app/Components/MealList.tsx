import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

type MealListProps = {
  name: string; // e.g., 'Breakfast'
  calories: number;
  time: string; // e.g., '10:45 AM'
};

export default function MealList({ name, calories, time }: MealListProps) {
  const router = useRouter();

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Handles the press event on the meal card. 

/*******  a94b5df6-6615-4b70-a6fa-5db3af263881  *******/
  const handlePress = () => {
    const mealType = name.toLowerCase(); // convert 'Breakfast' => 'breakfast'
    router.push({ pathname: '/meal/[mealType]', params: { mealType } });
  };

  return (
    <Pressable onPress={handlePress} style={styles.card}>
      <View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>
      <Text style={styles.calories}>{calories} Cal</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  name: { fontWeight: '600', fontSize: 16 },
  time: { fontSize: 12, color: 'gray' },
  calories: { fontWeight: 'bold', fontSize: 16 },
});
