import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

type WeightEntry = {
  id: string;
  weight: number;
  fromBeginning?: number;
  date: string;
};

const ReportsScreen = () => {
  const [currentWeight, setCurrentWeight] = useState('');
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([
    { id: '1', weight: 100, fromBeginning: undefined, date: 'Aliqui 21, 2022 | 82.5 kg' },
    { id: '2', weight: 85, fromBeginning: undefined, date: 'Aliqui 21, 2022 | 82.5 kg' },
    { id: '3', weight: 90, fromBeginning: undefined, date: 'Aliqui 21, 2022 | 82.5 kg' },
    { id: '4', weight: 85, fromBeginning: undefined, date: 'Aliqui 21, 2022 | 82.5 kg' },
    { id: '5', weight: 90, fromBeginning: undefined, date: 'Aliqui 21, 2022 | 82.5 kg' },
    { id: '6', weight: 75, fromBeginning: undefined, date: 'Aliqui 21, 2022 | 82.5 kg' },
    { id: '7', weight: 3122, fromBeginning: 3123, date: 'Burdens' },
    { id: '8', weight: 3016, fromBeginning: undefined, date: 'Burdens' },
  ]);

  const addWeightEntry = () => {
    if (!currentWeight) return;
    
    const newEntry: WeightEntry = {
      id: Date.now().toString(),
      weight: parseFloat(currentWeight),
      date: new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }) + ` | ${currentWeight} kg`,
    };
    
    setWeightHistory([newEntry, ...weightHistory]);
    setCurrentWeight('');
  };

  const renderItem = ({ item }: { item: WeightEntry }) => (
    <View style={styles.weightEntry}>
      <View style={styles.weightRow}>
        <Text style={styles.weightLabel}>Weight</Text>
        <Text style={styles.weightValue}>{item.weight}</Text>
      </View>
      {item.fromBeginning !== undefined && (
        <View style={styles.weightRow}>
          <Text style={styles.weightLabel}>From beginning</Text>
          <Text style={styles.weightValue}>{item.fromBeginning}</Text>
        </View>
      )}
      <Text style={styles.weightDate}>{item.date}</Text>
      <View style={styles.divider} />
    </View>
  );

  // Prepare data for the chart
  const chartData = {
    labels: weightHistory.slice(0, 6).map((_, index) => (index + 1).toString()),
    datasets: [
      {
        data: weightHistory.slice(0, 6).map(item => item.weight),
        color: (opacity = 1) => `rgba(255, 99, 71, ${opacity})`, // tomato
        strokeWidth: 2,
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Weight Progress</Text>
      
      <LineChart
        data={chartData}
        width={screenWidth - 32}
        height={220}
        yAxisSuffix=""
        yAxisInterval={1}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 99, 71, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: '#ff6347',
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
      
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
      
      <FlatList
        data={weightHistory}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
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
    backgroundColor: 'tomato',
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
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