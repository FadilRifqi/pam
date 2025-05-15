import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import Footer from '../Components/Footer';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil history dan berat awal dari AsyncStorage
        const storedHistory = await AsyncStorage.getItem('weightHistory');
        let historyArray: WeightEntry[] = storedHistory
          ? JSON.parse(storedHistory)
          : [];

        const storedInitialWeight = await AsyncStorage.getItem('weight');

        // Ambil tanggal hari ini dalam format yg sama
        const todayDate = new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });

        if (storedInitialWeight) {
          const weightNum = parseFloat(storedInitialWeight);
          setInitialWeight(weightNum);

          // Cek apakah berat awal sudah ada di history untuk hari ini
          const hasInitialInHistory = historyArray.some(
            (entry) => entry.weight === weightNum && entry.date === todayDate
          );

          // Kalau belum ada, tambahkan di awal history
          if (!hasInitialInHistory) {
            const newEntry: WeightEntry = {
              id: Date.now().toString(),
              weight: weightNum,
              fromBeginning: 0, // Karena ini berat awal
              date: todayDate,
            };
            historyArray = [newEntry, ...historyArray];

            // Simpan kembali ke AsyncStorage
            await AsyncStorage.setItem(
              'weightHistory',
              JSON.stringify(historyArray)
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

  // Save history setiap kali history berubah
  useEffect(() => {
    const saveHistory = async () => {
      try {
        await AsyncStorage.setItem(
          'weightHistory',
          JSON.stringify(weightHistory)
        );
      } catch (error) {
        console.error('Error saving weight history:', error);
      }
    };

    saveHistory();
  }, [weightHistory]);

  const addWeightEntry = async () => {
    if (!currentWeight) {
      Alert.alert('Error', 'Please enter a valid weight');
      return;
    }

    const parsedWeight = parseFloat(currentWeight);
    if (isNaN(parsedWeight) || parsedWeight <= 0) {
      Alert.alert('Error', 'Please enter a positive number');
      return;
    }

    // Jika ini pertama kali menambah berat, simpan sebagai initialWeight
    if (weightHistory.length === 0) {
      await AsyncStorage.setItem('weight', parsedWeight.toString());
      setInitialWeight(parsedWeight);
    }

    const newEntry: WeightEntry = {
      id: Date.now().toString(),
      weight: parsedWeight,
      fromBeginning: initialWeight !== null ? parsedWeight - initialWeight : 0,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };

    setWeightHistory([newEntry, ...weightHistory]);
    setCurrentWeight('');
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
            // Hapus weightHistory dari AsyncStorage
            await AsyncStorage.removeItem('weightHistory');

            // Ambil berat awal dari AsyncStorage
            const storedWeight = await AsyncStorage.getItem('weight');
            let newHistory: WeightEntry[] = [];

            if (storedWeight) {
              const initialWeight = parseFloat(storedWeight);

              // Tambahkan berat awal sebagai entri pertama
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

            // Perbarui state dan simpan kembali ke AsyncStorage
            setWeightHistory(newHistory);
            await AsyncStorage.setItem(
              'weightHistory',
              JSON.stringify(newHistory)
            );
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
        <Text style={styles.weightValue}>{item.weight} kg</Text>
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
            {item.fromBeginning.toFixed(1)} kg
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
        data: chartEntries.map((entry) => entry.weight),
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
          <LineChart
            data={chartData}
            width={screenWidth - 32}
            height={220}
            yAxisSuffix=" kg"
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
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
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
            placeholder="Enter weight (kg)"
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
