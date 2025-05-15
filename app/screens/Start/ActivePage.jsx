import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import ThemedButton from '../../../components/ThemedButton';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ActivePage = () => {
  const [selectedActive, setSelectedActive] = useState('Sedentary');
  const router = useRouter();

  const handleGoalSelection = (goal) => {
    setSelectedActive(goal);
  };

  const handleNext = async () => {
    await AsyncStorage.setItem('active', selectedActive);
    router.push('/screens/Start/TallPage');
  };
  return (
    <View style={styles.container1}>
      <Text style={styles.title}>How active are you?</Text>
      <View style={{ width: '60%', alignSelf: 'center' }}>
        <Text style={styles.subtitle}>
          A sedentary person burns fewer calories than an active person
        </Text>
      </View>
      <View style={styles.container2}>
        <TouchableOpacity
          style={
            selectedActive === 'Sedentary'
              ? styles.buttonSelected
              : styles.button
          }
          onPress={() => handleGoalSelection('Sedentary')}
        >
          <Text>Sedentary</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            selectedActive === 'Low Active'
              ? styles.buttonSelected
              : styles.button
          }
          onPress={() => handleGoalSelection('Low Active')}
        >
          <Text>Low Active</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            selectedActive === 'Active' ? styles.buttonSelected : styles.button
          }
          onPress={() => handleGoalSelection('Active')}
        >
          <Text>Active</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            selectedActive === 'Very Active'
              ? styles.buttonSelected
              : styles.button
          }
          onPress={() => handleGoalSelection('Very Active')}
        >
          <Text>Very Active</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <ThemedButton
          variant="circle"
          icon={require('../../../assets/images/next.png')}
          onPress={handleNext}
          position={{ bottom: 40, left: 140 }}
        />
      </View>
    </View>
  );
};

export default ActivePage;

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 64,
    position: 'relative',
  },
  button: {
    padding: 10,
    width: 240,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonSelected: {
    padding: 10,
    borderWidth: 1,
    width: 240,
    borderColor: '#35cc8c',
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: '#e6f9f0',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    position: 'relative',
  },
  container2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
    position: 'relative',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
});
