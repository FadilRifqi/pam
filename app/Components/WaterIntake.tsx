import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig'; // Pastikan konfigurasi Firestore sudah benar

export default function WaterIntake({
  goal,
  setInput,
  input,
  date,
  email,
  servingSize,
}: any) {
  const percentage = Math.round((input.water / goal) * 100);
  const dateKey = date.toISOString().split('T')[0];

  const handleAddWater = async () => {
    try {
      console.log('Adding water intake...');
      setInput((prevInput: any) => {
        const updatedInput = {
          ...prevInput,
          water: parseFloat((prevInput.water + servingSize).toFixed(1)), // Tambahkan servingSize
        };

        console.log('Updated input:', updatedInput);

        // Simpan ke Firestore
        const userEmail = email; // Pastikan email pengguna tersedia
        if (userEmail) {
          console.log('User email:', userEmail);
          const userDocRef = doc(db, 'users', userEmail, 'diary', dateKey);
          setDoc(
            userDocRef,
            { input: updatedInput },
            { merge: true } // Gabungkan dengan data yang ada
          )
            .then(() => console.log('Saved to Firestore:', updatedInput))
            .catch((error) =>
              console.error('Error saving to Firestore:', error)
            );
        } else {
          console.warn(
            'User email is not available. Skipping Firestore update.'
          );
        }

        return updatedInput; // Kembalikan nilai terbaru
      });
    } catch (error) {
      console.error('Error adding water intake:', error);
      Alert.alert('Error', 'Failed to add water intake.');
    }
  };

  const handleRemoveWater = async () => {
    try {
      console.log('Removing water intake...');
      setInput((prevInput: any) => {
        const updatedInput = {
          ...prevInput,
          water: parseFloat((prevInput.water - servingSize).toFixed(1)), // Kurangi servingSize
        };

        console.log('Updated input:', updatedInput);

        // Simpan ke Firestore
        const userEmail = email; // Pastikan email pengguna tersedia
        if (userEmail) {
          console.log('User email:', userEmail);
          const userDocRef = doc(db, 'users', userEmail, 'diary', dateKey);
          setDoc(
            userDocRef,
            { input: updatedInput },
            { merge: true } // Gabungkan dengan data yang ada
          )
            .then(() => console.log('Saved to Firestore:', updatedInput))
            .catch((error) =>
              console.error('Error saving to Firestore:', error)
            );
        } else {
          console.warn(
            'User email is not available. Skipping Firestore update.'
          );
        }

        return updatedInput; // Kembalikan nilai terbaru
      });
    } catch (error) {
      console.error('Error removing water intake:', error);
      Alert.alert('Error', 'Failed to remove water intake.');
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.label}>Water</Text>
        <Text style={styles.amount}>
          {input.water} / {goal} L
        </Text>
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
