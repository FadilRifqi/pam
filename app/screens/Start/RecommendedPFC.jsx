import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import ThemedButton from '../../../components/ThemedButton';
import { useRouter } from 'expo-router';

const RecommendedPFCPage = () => {
  const [recommendedPFC, setRecommendedPFC] = useState({
    protein: 0,
    fats: 0,
    carbs: 0,
    calories: 0,
  });
  const router = useRouter();

  const handleNext = () => {
    router.replace('/screens/Start/Register');
  };

  return (
    <View style={styles.container1}>
      <Text style={styles.title}>Recommended PFC</Text>
      <View style={{ width: '60%', alignSelf: 'center' }}>
        <Text style={styles.subtitle}>
          You can always change PFC in the profile
        </Text>
      </View>
      <View style={styles.container2}>
        <TouchableOpacity disabled style={styles.button}>
          <Text style={{ color: '#fff' }}>
            Proteins: {recommendedPFC.protein}g
          </Text>
        </TouchableOpacity>
        <TouchableOpacity disabled style={styles.button}>
          <Text style={{ color: '#fff' }}>Fats {recommendedPFC.fats}g</Text>
        </TouchableOpacity>
        <TouchableOpacity disabled style={styles.button}>
          <Text style={{ color: '#fff' }}>Carbs: {recommendedPFC.carbs}g</Text>
        </TouchableOpacity>
        <TouchableOpacity disabled style={styles.button}>
          <Text style={{ color: '#fff' }}>
            Calories {recommendedPFC.calories}g
          </Text>
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

export default RecommendedPFCPage;

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
    width: 160,
    backgroundColor: '#35cc8c',
    borderRadius: 5,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    position: 'relative',
  },
  container2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 8,
    width: '100%', // Lebar container agar item tetap di tengah
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
