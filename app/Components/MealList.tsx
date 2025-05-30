import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type MealListProps = {
  name: string; // e.g., 'Breakfast'
  calories: number | undefined;
  time: string; // e.g., '10:45 AM'
  date: Date; // e.g., '2023-09-21'
  email: string | null; // User's email for routing
};

export default function MealList({
  name,
  calories,
  time,
  date,
  email,
}: MealListProps) {
  const router = useRouter();
  const dateKey = date.toISOString().split('T')[0]; // Format date to YYYY-MM-DD

  /*************  ✨ Windsurf Command ⭐  *************/
  /**
 * Handles the press event on the meal card.

/*******  a94b5df6-6615-4b70-a6fa-5db3af263881  *******/
  const handlePress = () => {
    const mealType = name; // convert 'Breakfast' => 'breakfast'
    router.push({
      pathname: '/meal/[mealType]',
      params: { mealType, dateKey, email },
    });
  };

  return (
    <Pressable onPress={handlePress} style={styles.card}>
      <View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>
      <View style={styles.caloriesContainer}>
        <Ionicons
          name="add-circle-outline"
          size={20}
          color="black"
          style={styles.addIcon}
        />
        <Text style={styles.calories}>{calories || 0} Cal</Text>
      </View>
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
  caloriesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addIcon: {
    marginRight: 8, // Jarak antara ikon dan teks kalori
  },
  calories: { fontWeight: 'bold', fontSize: 16 },
});
