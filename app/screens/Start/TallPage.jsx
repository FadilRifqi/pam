import { StyleSheet, Text, View, FlatList } from 'react-native';
import React, { useState } from 'react';
import ThemedButton from '../../../components/ThemedButton';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

const ITEM_HEIGHT = 40; // Tinggi setiap item dalam daftar

const TallPage = () => {
  const [selectedMeter, setSelectedMeter] = useState('1');
  const [selectedCm, setSelectedCm] = useState('50');
  const router = useRouter();

  const handleNext = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      const parsedUserData = userData ? JSON.parse(userData) : null;
      if (!parsedUserData || !parsedUserData.email) {
        console.warn('User email not found in AsyncStorage.');
        return;
      }
      if (!parsedUserData.email) {
        console.warn('User email is not available.');
        return;
      }

      const height = `${selectedMeter}.${selectedCm}`;

      // Simpan data tinggi badan ke Firestore
      const userDocRef = doc(db, 'users', parsedUserData.email); // Gunakan email sebagai ID dokumen
      await setDoc(
        userDocRef,
        { height: height * 100 }, // Data yang akan disimpan
        { merge: true } // Gabungkan dengan data yang ada
      );

      console.log('Height saved to Firestore:', height * 100);

      // Navigasi ke halaman berikutnya
      router.push('/screens/Start/WeightPage'); // Ganti dengan route halaman berikutnya
    } catch (error) {
      console.error('Error saving height to Firestore:', error);
    }
  };

  const renderMeterItem = ({ item }) => (
    <Text
      style={[styles.scrollItem, item === selectedMeter && styles.selectedItem]}
      onPress={() => setSelectedMeter(item)} // Tambahkan onPress
    >
      {item}
    </Text>
  );

  const renderCmItem = ({ item }) => (
    <Text
      style={[styles.scrollItem, item === selectedCm && styles.selectedItem]}
      onPress={() => setSelectedCm(item)} // Tambahkan onPress
    >
      {item}
    </Text>
  );

  const handleMeterScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.y / ITEM_HEIGHT);
    setSelectedMeter(`${index + 1}`);
  };

  const handleCmScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.y / ITEM_HEIGHT);
    setSelectedCm(`${index}`);
  };

  return (
    <View style={styles.container1}>
      <Text style={styles.title}>How tall are you?</Text>
      <View style={{ width: '60%', alignSelf: 'center' }}>
        <Text style={styles.subtitle}>
          The taller you are, the more calories your body needs
        </Text>
      </View>
      <View style={styles.scrollContainer}>
        <View style={styles.scrollView}>
          <FlatList
            data={Array.from({ length: 3 }, (_, i) => `${i + 1}`)}
            keyExtractor={(item) => item}
            renderItem={renderMeterItem}
            showsVerticalScrollIndicator={false}
            snapToInterval={ITEM_HEIGHT}
            snapToAlignment="center"
            decelerationRate="normal"
            onScrollEndDrag={handleMeterScroll}
            getItemLayout={(data, index) => ({
              length: ITEM_HEIGHT,
              offset: ITEM_HEIGHT * index,
              index,
            })}
          />
          <Text style={styles.label}>M</Text>
        </View>
        <View style={styles.scrollView}>
          <FlatList
            data={Array.from({ length: 100 }, (_, i) => `${i}`)}
            keyExtractor={(item) => item}
            renderItem={renderCmItem}
            showsVerticalScrollIndicator={false}
            snapToInterval={ITEM_HEIGHT}
            snapToAlignment="center"
            decelerationRate="normal"
            onScrollEndDrag={handleCmScroll}
            getItemLayout={(data, index) => ({
              length: ITEM_HEIGHT,
              offset: ITEM_HEIGHT * index,
              index,
            })}
          />
          <Text style={styles.label}>CM</Text>
        </View>
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

export default TallPage;

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 64,
    position: 'relative',
  },
  scrollContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    width: '80%',
  },
  scrollView: {
    marginHorizontal: 10,
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
    height: ITEM_HEIGHT * 3, // Tinggi scroll view untuk menampilkan 3 item
  },
  scrollItem: {
    fontSize: 18,
    height: ITEM_HEIGHT,
    lineHeight: ITEM_HEIGHT,
    textAlign: 'center',
    color: '#000',
  },
  selectedItem: {
    color: '#35cc8c',
    fontWeight: 'bold',
  },
  label: {
    color: '#35cc8c',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
