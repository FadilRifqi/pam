import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { db } from '../config/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const CalorieIntakeSettings = () => {
  const router = useRouter();
  const [waterIntake, setWaterIntake] = useState();
  const [calories, setCalories] = useState();
  const [proteins, setProteins] = useState();
  const [fats, setFats] = useState();
  const [carbs, setCarbs] = useState();

  // State for modal
  const [modalVisible, setModalVisible] = useState(false);
  const [editField, setEditField] = useState(null);
  const [tempValue, setTempValue] = useState('');

  // State for save confirmation modal
  const [saveConfirmVisible, setSaveConfirmVisible] = useState(false);

  // State for checkbox
  const [isChecked, setIsChecked] = useState(true);
  const checkAnimation = useRef(new Animated.Value(1)).current;

  const handleBack = () => {
    router.back();
  };

  const handleEdit = (field) => {
    setEditField(field);

    // Tentukan nilai sementara berdasarkan field yang dipilih
    switch (field) {
      case 'calories':
        setTempValue(calories?.toString() || '');
        break;
      case 'proteins':
        setTempValue(proteins?.toString() || '');
        break;
      case 'fats':
        setTempValue(fats?.toString() || '');
        break;
      case 'carbs':
        setTempValue(carbs?.toString() || '');
        break;
      case 'water':
        setTempValue(waterIntake?.toString() || '');
        break;
      default:
        setTempValue('');
    }

    setModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      const parsedUserData = userData ? JSON.parse(userData) : null;

      if (!parsedUserData || !parsedUserData.email) {
        Alert.alert('Error', 'User email not found. Please log in again.');
        return;
      }

      // Data yang akan disimpan ke Firestore
      const updatedRecommendedPFC = {
        protein: proteins,
        fats: fats,
        carbs: carbs,
        calories: calories,
        water: waterIntake,
      };

      // Simpan data ke Firestore
      const userDocRef = doc(db, 'users', parsedUserData.email);
      await setDoc(
        userDocRef,
        { recommendedPFC: updatedRecommendedPFC },
        { merge: true }
      );

      // Tampilkan pesan sukses
      Alert.alert('Success', 'Your recommended PFC has been updated.');
      setSaveConfirmVisible(false); // Tutup modal konfirmasi
    } catch (error) {
      console.error('Error saving recommendedPFC:', error);
      Alert.alert('Error', 'Failed to save your recommended PFC.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        const parsedUserData = userData ? JSON.parse(userData) : null;

        if (parsedUserData && parsedUserData.email) {
          // Ambil dokumen pengguna dari Firestore
          const userDocRef = doc(db, 'users', parsedUserData.email);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userDataFromFirestore = userDoc.data();

            // Ambil recommendedPFC dari dokumen Firestore
            if (userDataFromFirestore.recommendedPFC) {
              const { protein, fats, carbs, calories, water } =
                userDataFromFirestore.recommendedPFC;

              // Perbarui state dengan data yang diambil
              setProteins(protein);
              setFats(fats);
              setCarbs(carbs);
              setCalories(calories);
              setWaterIntake(water);
            } else {
              console.warn('No recommendedPFC found in Firestore.');
            }
          } else {
            console.warn('User document does not exist in Firestore.');
          }
        }
      } catch (error) {
        console.error('Error fetching recommendedPFC:', error);
      }
    };

    fetchData();
  }, []);

  const handleConfirmSave = () => {
    // Check if the checkbox is checked
    if (isChecked) {
      console.log('Saving nutrition data:', userData);
      // Implement save functionality here

      // Show success message
      Alert.alert('Success', 'Your settings have been saved.');

      // Hide the popup
      setSaveConfirmVisible(false);
    } else {
      // Show notification that checkbox needs to be checked
      Alert.alert(
        'Action Required',
        'Please check the "Update daily nutrients" option to save your changes.',
        [{ text: 'OK', onPress: () => console.log('Alert closed') }]
      );
    }
  };

  const handleCancelSave = () => {
    // Just hide the popup
    setSaveConfirmVisible(false);
  };

  const toggleCheckbox = () => {
    const toValue = isChecked ? 0 : 1;

    Animated.sequence([
      Animated.timing(checkAnimation, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(checkAnimation, {
        toValue,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    setIsChecked(!isChecked);
  };

  const handleModalDone = () => {
    // Perbarui state berdasarkan field yang sedang diedit
    switch (editField) {
      case 'calories':
        setCalories(tempValue);
        break;
      case 'proteins':
        setProteins(tempValue);
        break;
      case 'fats':
        setFats(tempValue);
        break;
      case 'carbs':
        setCarbs(tempValue);
        break;
      case 'water':
        setWaterIntake(tempValue);
        break;
      default:
        break;
    }

    setModalVisible(false);
  };

  // Helper function to render the appropriate modal content based on field
  const renderModalContent = () => {
    switch (editField) {
      case 'calories':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter your daily calories</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter calories"
                keyboardType="numeric"
                value={tempValue.replace(/[^0-9]/g, '')}
                onChangeText={(text) => setTempValue(text)}
              />
            </View>
          </View>
        );

      case 'proteins':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter your protein intake</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter protein (g)"
                keyboardType="numeric"
                value={tempValue.replace('g', '')}
                onChangeText={(text) => setTempValue({ text })}
              />
            </View>
          </View>
        );

      case 'fats':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter your fat intake</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter fat (g)"
                keyboardType="numeric"
                value={tempValue.replace('g', '')}
                onChangeText={(text) => setTempValue({ text })}
              />
            </View>
          </View>
        );

      case 'carbs':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter your carb intake</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter carbs (g)"
                keyboardType="numeric"
                value={tempValue.replace('g', '')}
                onChangeText={(text) => setTempValue({ text })}
              />
            </View>
          </View>
        );

      case 'water':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter your water intake</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter water (ml)"
                keyboardType="numeric"
                value={tempValue.replace('ml', '')}
                onChangeText={(text) => setTempValue(text)}
              />
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Image
            source={require('../../assets/images/back-button.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Calorie Intake</Text>
      </View>

      {/* User Data List */}
      <ScrollView style={styles.dataContainer}>
        {/* Calories */}
        <TouchableOpacity
          style={styles.dataItem}
          onPress={() => handleEdit('calories')}
        >
          <Text style={styles.dataLabel}>Calories</Text>
          <View style={styles.dataValueContainer}>
            <Text style={styles.dataValue}>{calories}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.divider} />

        {/* Proteins */}
        <TouchableOpacity
          style={styles.dataItem}
          onPress={() => handleEdit('proteins')}
        >
          <Text style={styles.dataLabel}>Proteins</Text>
          <View style={styles.dataValueContainer}>
            <Text style={styles.dataValue}>{proteins} g</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.divider} />

        {/* Fats */}
        <TouchableOpacity
          style={styles.dataItem}
          onPress={() => handleEdit('fats')}
        >
          <Text style={styles.dataLabel}>Fats</Text>
          <View style={styles.dataValueContainer}>
            <Text style={styles.dataValue}>{fats} g</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.divider} />

        {/* Carbs */}
        <TouchableOpacity
          style={styles.dataItem}
          onPress={() => handleEdit('carbs')}
        >
          <Text style={styles.dataLabel}>Carbs</Text>
          <View style={styles.dataValueContainer}>
            <Text style={styles.dataValue}>{carbs} g</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.divider} />

        {/* Water */}
        <TouchableOpacity
          style={styles.dataItem}
          onPress={() => handleEdit('water')}
        >
          <Text style={styles.dataLabel}>Water</Text>
          <View style={styles.dataValueContainer}>
            <Text style={styles.dataValue}>{waterIntake} ml</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.divider} />
      </ScrollView>

      {/* Save Button */}
      <View style={styles.saveButtonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for editing */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalDismiss}
            onPress={() => setModalVisible(false)}
          />
          <View style={styles.modalContainer}>
            {renderModalContent()}

            <TouchableOpacity
              style={styles.doneButton}
              onPress={handleModalDone}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal for save confirmation */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={saveConfirmVisible}
        onRequestClose={handleCancelSave}
      >
        <View style={styles.confirmModalOverlay}>
          <View style={styles.confirmModalContainer}>
            <Text style={styles.confirmModalTitle}>Save</Text>

            <View style={styles.confirmModalContent}>
              <TouchableOpacity
                style={styles.checkIconContainer}
                onPress={toggleCheckbox}
              >
                <Animated.Image
                  source={require('../../assets/images/check.png')}
                  style={[
                    styles.checkIcon,
                    {
                      opacity: checkAnimation,
                      transform: [{ scale: checkAnimation }],
                    },
                  ]}
                />
              </TouchableOpacity>
              <Text style={styles.confirmModalText}>
                Update daily nutrients
              </Text>
            </View>

            <View style={styles.confirmButtonsRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelSave}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.okButton}
                onPress={handleConfirmSave}
              >
                <Text style={styles.okButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CalorieIntakeSettings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  arrowIcon: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
    tintColor: '#999',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 80,
  },
  dataContainer: {
    flex: 1,
  },
  dataItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    alignItems: 'center',
  },
  dataLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  dataValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dataValue: {
    fontSize: 16,
    color: '#35CC8C',
    marginRight: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    width: '100%',
  },
  saveButtonContainer: {
    padding: 20,
  },
  saveButton: {
    backgroundColor: '#35cc8c',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalDismiss: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
  },
  modalContent: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#35cc8c',
  },
  input: {
    width: '100%',
    height: 50,
    fontSize: 16,
    paddingHorizontal: 10,
    textAlign: 'center',
  },
  doneButton: {
    backgroundColor: '#35cc8c',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Save confirmation modal styles
  confirmModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmModalContainer: {
    width: 328,
    height: 186,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  confirmModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  confirmModalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkIconContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#35cc8c',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkIcon: {
    width: 18,
    height: 18,
    tintColor: 'white',
  },
  confirmModalText: {
    fontSize: 16,
    color: '#333',
  },
  confirmButtonsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
  },
  okButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  okButtonText: {
    fontSize: 16,
    color: '#35cc8c',
    fontWeight: 'bold',
  },
});
