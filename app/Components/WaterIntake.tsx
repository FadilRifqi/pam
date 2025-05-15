import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';

export default function WaterIntake({
  goal,
  lastTime,
  setInput,
  input,
  date,
}: any) {
  const percentage = Math.round((input.water / goal) * 100);
  const [addWater, setAddWater] = useState<number>();
  const dateKey = date.toISOString().split('T')[0];

  const handleAddWater = async () => {
    try {
      setInput((prevInput: any) => {
        const updatedInput = {
          ...prevInput,
          water: parseFloat((prevInput.water + 0.2).toFixed(1)), // Tambahkan 0.2
        };
        AsyncStorage.setItem(`input${dateKey}`, JSON.stringify(updatedInput)); // Simpan nilai terbaru
        return updatedInput; // Kembalikan nilai terbaru
      });
    } catch (error) {
      console.error('Error adding water intake:', error);
      Alert.alert('Error', 'Failed to add water intake.');
    }
  };

  const handleRemoveWater = async () => {
    try {
      setInput((prevInput: any) => {
        const updatedInput = {
          ...prevInput,
          water: parseFloat((prevInput.water - 0.2).toFixed(1)), // Kurangi 0.2
        };
        AsyncStorage.setItem(`input${dateKey}`, JSON.stringify(updatedInput)); // Simpan nilai terbaru
        return updatedInput; // Kembalikan nilai terbaru
      });
    } catch (error) {
      console.error('Error removing water intake:', error);
      Alert.alert('Error', 'Failed to remove water intake.');
    }
  };

  useEffect(() => {
    const fetchWaterSettings = async () => {
      try {
        const storedWater = await AsyncStorage.getItem('waterSettings');
        if (storedWater) {
          setAddWater(JSON.parse(storedWater));
        } else {
          setAddWater(0.2); // Default value
        }
      } catch (error) {
        console.error('Error fetching water settings:', error);
      }
    };
    fetchWaterSettings();
  }, []);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.label}>Water</Text>
        <Text style={styles.amount}>
          {input.water} / {goal} L
        </Text>
        <Text style={styles.time}>Last time {lastTime}</Text>
      </View>
      <View style={styles.right}>
        <Pressable onPress={handleAddWater}>
          <Text style={styles.button}>＋</Text>
        </Pressable>
        <View style={styles.progress}>
          <View style={[styles.fill, { height: `${percentage}%` }]} />
        </View>
        <Pressable onPress={handleRemoveWater}>
          <Text style={styles.button}>−</Text>
        </Pressable>
        <Text style={styles.percent}>{percentage}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#f6f6f6',
    borderRadius: 12,
  },
  label: { fontSize: 14 },
  amount: { fontSize: 16, fontWeight: 'bold' },
  time: { fontSize: 12, color: 'gray' },
  right: { alignItems: 'center' },
  progress: {
    height: 60,
    width: 20,
    backgroundColor: '#ddd',
    borderRadius: 10,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    marginVertical: 5,
  },
  fill: { width: '100%', backgroundColor: '#64b5f6' },
  button: { fontSize: 20 },
  percent: { fontSize: 12 },
});
