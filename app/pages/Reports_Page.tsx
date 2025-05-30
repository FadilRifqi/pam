import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import Footer from '../Components/Footer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig'; // Pastikan konfigurasi Firestore sudah benar

const screenWidth = Dimensions.get('window').width;

type WeightEntry = {
  id: string;
  weight: number;
  fromBeginning?: number;
  date: string;
};

const ReportsScreen = () => {
  const [currentWeight, setCurrentWeight] = useState('');
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([]);
  const [initialWeight, setInitialWeight] = useState<number | null>(null);
  const [weightUnit, setWeightUnit] = useState<string>('Kilograms');

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil email pengguna dari AsyncStorage
        const userData = await AsyncStorage.getItem('userData');
        const parsedUserData = userData ? JSON.parse(userData) : null;

        if (!parsedUserData || !parsedUserData.email) {
          console.error('User email not found in AsyncStorage.');
          return;
        }

        const userEmail = parsedUserData.email; // Ambil email dari AsyncStorage
        const userDocRef = doc(db, 'users', userEmail, 'data', 'weight');
        const userDocRefUnit = doc(db, 'users', parsedUserData.email);
        const userDoc = await getDoc(userDocRef);
        const userDocUnit = await getDoc(userDocRefUnit);

        let historyArray: WeightEntry[] = [];
        let initialWeight = null;

        if (userDoc.exists()) {
          const data = userDoc.data();
          const unitData = userDocUnit.data();

          setWeightUnit(unitData?.weightUnit || 'Kilograms');
          historyArray = data.weightHistory || [];
          initialWeight = data.initialWeight || null;
        }

        // Ambil tanggal hari ini dalam format yg sama
        const todayDate = new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });

        if (initialWeight !== null) {
          setInitialWeight(initialWeight);

          // Cek apakah berat awal sudah ada di history untuk hari ini
          const hasInitialInHistory = historyArray.some(
            (entry) =>
              entry.weight === initialWeight && entry.date === todayDate
          );

          // Kalau belum ada, tambahkan di awal history
          if (!hasInitialInHistory) {
            const newEntry: WeightEntry = {
              id: Date.now().toString(),
              weight: initialWeight,
              fromBeginning: 0, // Karena ini berat awal
              date: todayDate,
            };
            historyArray = [newEntry, ...historyArray];

            // Simpan kembali ke Firestore
            await setDoc(
              userDocRef,
              { weightHistory: historyArray },
              { merge: true }
            );
          }
        }

        setWeightHistory(historyArray);
      } catch (error) {
        console.error('Error fetching data:', error);
        setWeightHistory([]);
      }
    };

    fetchData();
  }, []);

  const addWeightEntry = async () => {
    if (!currentWeight) {
      Alert.alert('Error', 'Please enter a valid weight');
      return;
    }

    let parsedWeight = parseFloat(currentWeight);
    parsedWeight =
      weightUnit === 'Kilograms' ? parsedWeight : parsedWeight / 2.205;
    if (isNaN(parsedWeight) || parsedWeight <= 0) {
      Alert.alert('Error', 'Please enter a positive number');
      return;
    }

    try {
      // Ambil email pengguna dari AsyncStorage
      const userData = await AsyncStorage.getItem('userData');
      const parsedUserData = userData ? JSON.parse(userData) : null;

      if (!parsedUserData || !parsedUserData.email) {
        console.error('User email not found in AsyncStorage.');
        return;
      }

      const userEmail = parsedUserData.email;
      const userDocRef = doc(db, 'users', userEmail, 'data', 'weight');

      // Jika ini pertama kali menambah berat, simpan sebagai initialWeight
      if (weightHistory.length === 0) {
        setInitialWeight(parsedWeight);
        await setDoc(
          userDocRef,
          { initialWeight: parsedWeight },
          { merge: true }
        );
      }

      const newEntry: WeightEntry = {
        id: Date.now().toString(),
        weight: parsedWeight,
        fromBeginning:
          initialWeight !== null ? parsedWeight - initialWeight : 0,
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      };

      const updatedHistory = [newEntry, ...weightHistory];
      setWeightHistory(updatedHistory);

      // Simpan weightHistory ke Firestore
      await setDoc(
        userDocRef,
        { weightHistory: updatedHistory },
        { merge: true }
      );

      setCurrentWeight('');
    } catch (error) {
      console.error('Error adding weight entry to Firestore:', error);
      Alert.alert('Error', 'Failed to add weight entry.');
    }
  };

  const clearWeightHistory = () => {
    Alert.alert('Confirm', 'Are you sure you want to delete all weight data?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            // Ambil email pengguna dari AsyncStorage
            const userData = await AsyncStorage.getItem('userData');
            const parsedUserData = userData ? JSON.parse(userData) : null;

            if (!parsedUserData || !parsedUserData.email) {
              console.error('User email not found in AsyncStorage.');
              return;
            }

            const userEmail = parsedUserData.email;
            const userDocRef = doc(db, 'users', userEmail, 'data', 'weight');

            // Hapus weightHistory dari Firestore
            await setDoc(userDocRef, { weightHistory: [] }, { merge: true });

            // Ambil berat awal dari Firestore
            const userDoc = await getDoc(userDocRef);
            let newHistory: WeightEntry[] = [];

            if (userDoc.exists()) {
              const data = userDoc.data();
              const initialWeight = data.initialWeight;

              if (initialWeight !== null) {
                const todayDate = new Date().toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });

                const initialEntry: WeightEntry = {
                  id: Date.now().toString(),
                  weight: initialWeight,
                  fromBeginning: 0, // Karena ini adalah berat awal
                  date: todayDate,
                };

                newHistory = [initialEntry];
              }
            }

            // Perbarui state
            setWeightHistory(newHistory);
          } catch (error) {
            console.error('Error clearing weight history:', error);
            Alert.alert('Error', 'Failed to clear history.');
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: WeightEntry }) => (
    <View style={styles.weightEntry}>
      <View style={styles.weightRow}>
        <Text style={styles.weightLabel}>Weight</Text>
        <Text style={styles.weightValue}>
          {weightUnit === 'Kilograms'
            ? item.weight.toFixed(2) + ' kg'
            : (item.weight * 2.205).toFixed(2) + ' lbs'}
        </Text>
      </View>
      {item.fromBeginning !== undefined && (
        <View style={styles.weightRow}>
          <Text style={styles.weightLabel}>Change from start</Text>
          <Text
            style={[
              styles.weightValue,
              {
                color:
                  item.fromBeginning > 0
                    ? 'red'
                    : item.fromBeginning < 0
                    ? 'green'
                    : 'black',
              },
            ]}
          >
            {item.fromBeginning > 0 ? '+' : ''}
            {weightUnit === 'Kilograms'
              ? item.fromBeginning.toFixed(1) + ' kg'
              : (item.fromBeginning * 2.205).toFixed(1) + ' lbs'}
          </Text>
        </View>
      )}
      <Text style={styles.weightDate}>{item.date}</Text>
      <View style={styles.divider} />
    </View>
  );

  const chartEntries = weightHistory
    .slice(0, 6) // Ambil 6 entri pertama
    .map((_, index, arr) => arr[arr.length - 1 - index]); // Balik urutan data

  const chartData = {
    labels: chartEntries.map((entry) => entry.date),
    datasets: [
      {
        data: chartEntries.map((entry) =>
          weightUnit === 'Kilograms' ? entry.weight : entry.weight * 2.205
        ),
        color: (opacity = 1) => `rgba(35, 204, 140, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.header}>Weight Progress</Text>

        {weightHistory.length > 0 ? (
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{ height: 440 }}
          >
            <LineChart
              data={chartData}
              width={chartData.labels.length * 150} // Lebar dinamis berdasarkan jumlah label
              height={220} // Tinggi dinamis
              yAxisSuffix={weightUnit === 'Kilograms' ? ' kg' : ' lbs'}
              yAxisInterval={1}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(35, 204, 140, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '4',
                  strokeWidth: '2',
                  stroke: '#35CC8C',
                },
                propsForLabels: {
                  transform: [{ rotate: '-45deg' }], // Membuat label miring 45 derajat
                  fontSize: 10, // Ukuran font label
                  textAnchor: 'end', // Menyesuaikan posisi teks
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          </ScrollView>
        ) : (
          <Text
            style={{ textAlign: 'center', marginBottom: 16, color: '#999' }}
          >
            No weight data yet.
          </Text>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.weightInput}
            placeholder={
              weightUnit === 'Kilograms'
                ? 'Enter weight (kg)'
                : 'Enter weight (lbs)'
            }
            keyboardType="numeric"
            value={currentWeight}
            onChangeText={setCurrentWeight}
          />
          <TouchableOpacity style={styles.addButton} onPress={addWeightEntry}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.clearButton}
          onPress={clearWeightHistory}
        >
          <Text style={styles.clearButtonText}>Clear History</Text>
        </TouchableOpacity>

        <FlatList
          data={weightHistory}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      </View>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginBottom: 36,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  weightInput: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#35CC8C',
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: '#aaa',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 20,
  },
  weightEntry: {
    marginBottom: 16,
  },
  weightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  weightLabel: {
    fontSize: 16,
    color: '#666',
  },
  weightValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  weightDate: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 8,
  },
});

export default ReportsScreen;
