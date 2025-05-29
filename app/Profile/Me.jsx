import { useRouter } from 'expo-router';
import { useRef, useState, useEffect } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const MeSettings = () => {
  const router = useRouter();
  const [goal, setGoal] = useState('');
  const [age, setAge] = useState(0);
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);
  const [gender, setGender] = useState('');
  const [active, setActive] = useState('');
  const [email, setEmail] = useState(null); // Tambahkan state untuk email
  const [recommendedPFC, setRecommendedPFC] = useState({
    protein: 0,
    fats: 0,
    carbs: 0,
    calories: 0,
  });

  // State for modal
  const [modalVisible, setModalVisible] = useState(false);
  const [editField, setEditField] = useState(null);
  const [tempValue, setTempValue] = useState('');

  // State for save confirmation modal
  const [saveConfirmVisible, setSaveConfirmVisible] = useState(false);

  // State for checkbox
  const [isChecked, setIsChecked] = useState(true);
  const checkAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Ambil email dari AsyncStorage
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        const parsedUserData = JSON.parse(userData);
        if (userData) {
          setEmail(parsedUserData.email); // Simpan email ke state
        }

        // Ambil data pengguna dari Firestore
        const userDocRef = doc(db, 'users', parsedUserData.email);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setGoal(userData.goal || '');
          setAge(userData.age || 0);
          setHeight(userData.height || 0);
          setWeight(userData.weight || 0);
          setGender(userData.gender || '');
          setActive(userData.active || '');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleEdit = (field) => {
    console.log(`Editing field: ${field}`);

    setEditField(field);
    setTempValue(
      field === 'goal'
        ? goal
        : field === 'age'
        ? age
        : field === 'height'
        ? height
        : field === 'weight'
        ? weight
        : field === 'gender'
        ? gender
        : active
    );
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!email) {
      Alert.alert('Error', 'User email not found. Please log in again.');
      return;
    }

    try {
      // Data yang akan disimpan ke Firestore
      const updatedUserData = {
        goal,
        age,
        height,
        weight,
        gender,
        active,
      };

      // Hitung BMR menggunakan rumus Mifflin-St Jeor
      let BMR;
      if (gender === 'Male') {
        BMR = 10 * weight + 6.25 * height - 5 * age + 5; // Tinggi dikalikan 100 untuk cm
      } else if (gender === 'Female') {
        BMR = 10 * weight + 6.25 * height - 5 * age - 161; // Tinggi dikalikan 100 untuk cm
      } else {
        console.error('Invalid gender');
        return;
      }

      // Hitung TDEE berdasarkan faktor aktivitas
      let TDEE;
      switch (active) {
        case 'Sedentary':
          TDEE = BMR * 1.2;
          break;
        case 'Low Active':
          TDEE = BMR * 1.375;
          break;
        case 'Active':
          TDEE = BMR * 1.55;
          break;
        case 'Very Active':
          TDEE = BMR * 1.725;
          break;
        default:
          console.error('Invalid activity level');
          return;
      }

      // Sesuaikan TDEE berdasarkan tujuan
      if (goal === 'Lose Weight') {
        TDEE *= 0.75; // Kurangi 25%
      } else if (goal === 'Gain Weight') {
        TDEE *= 1.2; // Tambah 20%
      }

      // Distribusi makronutrien (PFC)
      const proteinCalories = TDEE * 0.25; // 25% dari kalori total
      const fatsCalories = TDEE * 0.25; // 25% dari kalori total
      const carbsCalories = TDEE - (proteinCalories + fatsCalories); // Sisa kalori untuk karbohidrat

      const protein = Math.round(proteinCalories / 4); // 1 gram protein = 4 kalori
      const fats = Math.round(fatsCalories / 9); // 1 gram lemak = 9 kalori
      const carbs = Math.round(carbsCalories / 4); // 1 gram karbohidrat = 4 kalori
      const calories = Math.round(TDEE);

      // Simpan hasil ke state
      const recommendedPFC = { protein, fats, carbs, calories };
      setRecommendedPFC(recommendedPFC);

      // Gabungkan data pengguna dan recommendedPFC
      const userDataToSave = {
        ...updatedUserData,
        recommendedPFC,
      };

      // Simpan data ke Firestore
      const userDocRef = doc(db, 'users', email); // Gunakan email sebagai ID dokumen
      await setDoc(userDocRef, userDataToSave, { merge: true });

      // Tampilkan pesan sukses
      Alert.alert(
        'Success',
        'Your settings and recommended PFC have been saved.'
      );
    } catch (error) {
      console.error('Error saving user data:', error);
      Alert.alert('Error', 'Failed to save your settings.');
    }
  };

  const handleModalDone = () => {
    // Update state berdasarkan field yang sedang diedit
    if (editField === 'goal') setGoal(tempValue);
    else if (editField === 'age') setAge(tempValue);
    else if (editField === 'height') setHeight(tempValue);
    else if (editField === 'weight') setWeight(tempValue);
    else if (editField === 'gender') setGender(tempValue);
    else if (editField === 'active') setActive(tempValue);

    setModalVisible(false);
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
        <Text style={styles.title}>Me</Text>
      </View>

      {/* User Data List */}
      <ScrollView style={styles.dataContainer}>
        {/* Goal */}
        <TouchableOpacity
          style={styles.dataItem}
          onPress={() => handleEdit('goal')}
        >
          <Text style={styles.dataLabel}>Goal</Text>
          <View style={styles.dataValueContainer}>
            <Text style={styles.dataValue}>{goal}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.divider} />

        {/* Age */}
        <TouchableOpacity
          style={styles.dataItem}
          onPress={() => handleEdit('age')}
        >
          <Text style={styles.dataLabel}>Age</Text>
          <View style={styles.dataValueContainer}>
            <Text style={styles.dataValue}>{age}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.divider} />

        {/* Height */}
        <TouchableOpacity
          style={styles.dataItem}
          onPress={() => handleEdit('height')}
        >
          <Text style={styles.dataLabel}>Height</Text>
          <View style={styles.dataValueContainer}>
            <Text style={styles.dataValue}>{height}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.divider} />

        {/* Weight */}
        <TouchableOpacity
          style={styles.dataItem}
          onPress={() => handleEdit('weight')}
        >
          <Text style={styles.dataLabel}>Weight</Text>
          <View style={styles.dataValueContainer}>
            <Text style={styles.dataValue}>{weight}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.divider} />

        {/* Gender */}
        <TouchableOpacity
          style={styles.dataItem}
          onPress={() => handleEdit('gender')}
        >
          <Text style={styles.dataLabel}>Gender</Text>
          <View style={styles.dataValueContainer}>
            <Text style={styles.dataValue}>{gender}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.divider} />

        {/* Lifestyle */}
        <TouchableOpacity
          style={styles.dataItem}
          onPress={() => handleEdit('active')}
        >
          <Text style={styles.dataLabel}>Lifestyle</Text>
          <View style={styles.dataValueContainer}>
            <Text style={styles.dataValue}>{active}</Text>
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
            {editField === 'goal' && (
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Choose your goal</Text>
                <TouchableOpacity
                  style={
                    tempValue === 'Lose Weight'
                      ? styles.optionSelected
                      : styles.option
                  }
                  onPress={() => setTempValue('Lose Weight')}
                >
                  <Text
                    style={
                      tempValue === 'Lose Weight'
                        ? styles.optionTextSelected
                        : styles.optionText
                    }
                  >
                    Lose Weight
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={
                    tempValue === 'Maintain Weight'
                      ? styles.optionSelected
                      : styles.option
                  }
                  onPress={() => setTempValue('Maintain Weight')}
                >
                  <Text
                    style={
                      tempValue === 'Maintain Weight'
                        ? styles.optionTextSelected
                        : styles.optionText
                    }
                  >
                    Maintain Weight
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={
                    tempValue === 'Gain Weight'
                      ? styles.optionSelected
                      : styles.option
                  }
                  onPress={() => setTempValue('Gain Weight')}
                >
                  <Text
                    style={
                      tempValue === 'Gain Weight'
                        ? styles.optionTextSelected
                        : styles.optionText
                    }
                  >
                    Gain Weight
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {editField === 'age' && (
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Enter your age</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter age (years)"
                    keyboardType="numeric"
                    value={tempValue.toString()}
                    onChangeText={setTempValue}
                  />
                </View>
              </View>
            )}

            {editField === 'height' && (
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Enter your height</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter height (cm)"
                    keyboardType="numeric"
                    value={tempValue.toString()}
                    onChangeText={setTempValue}
                  />
                </View>
              </View>
            )}

            {editField === 'weight' && (
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Enter your weight</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter weight (kg)"
                    keyboardType="numeric"
                    value={tempValue.toString()}
                    onChangeText={setTempValue}
                  />
                </View>
              </View>
            )}

            {editField === 'gender' && (
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Choose your gender</Text>
                <TouchableOpacity
                  style={
                    tempValue === 'Male' ? styles.optionSelected : styles.option
                  }
                  onPress={() => setTempValue('Male')}
                >
                  <Text
                    style={
                      tempValue === 'Male'
                        ? styles.optionTextSelected
                        : styles.optionText
                    }
                  >
                    Male
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={
                    tempValue === 'Female'
                      ? styles.optionSelected
                      : styles.option
                  }
                  onPress={() => setTempValue('Female')}
                >
                  <Text
                    style={
                      tempValue === 'Female'
                        ? styles.optionTextSelected
                        : styles.optionText
                    }
                  >
                    Female
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {editField === 'active' && (
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  Choose your activity level
                </Text>
                <TouchableOpacity
                  style={
                    tempValue === 'Sedentary'
                      ? styles.optionSelected
                      : styles.option
                  }
                  onPress={() => setTempValue('Sedentary')}
                >
                  <Text
                    style={
                      tempValue === 'Sedentary'
                        ? styles.optionTextSelected
                        : styles.optionText
                    }
                  >
                    Sedentary
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={
                    tempValue === 'Low Active'
                      ? styles.optionSelected
                      : styles.option
                  }
                  onPress={() => setTempValue('Low Active')}
                >
                  <Text
                    style={
                      tempValue === 'Low Active'
                        ? styles.optionTextSelected
                        : styles.optionText
                    }
                  >
                    Low Active
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={
                    tempValue === 'Active'
                      ? styles.optionSelected
                      : styles.option
                  }
                  onPress={() => setTempValue('Active')}
                >
                  <Text
                    style={
                      tempValue === 'Active'
                        ? styles.optionTextSelected
                        : styles.optionText
                    }
                  >
                    Active
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={
                    tempValue === 'Very Active'
                      ? styles.optionSelected
                      : styles.option
                  }
                  onPress={() => setTempValue('Very Active')}
                >
                  <Text
                    style={
                      tempValue === 'Very Active'
                        ? styles.optionTextSelected
                        : styles.optionText
                    }
                  >
                    Very Active
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              style={styles.doneButton}
              onPress={handleModalDone}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MeSettings;

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
    marginLeft: 130,
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
  option: {
    padding: 15,
    width: '100%',
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  optionSelected: {
    padding: 15,
    width: '100%',
    borderWidth: 1,
    borderColor: '#35cc8c',
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
    backgroundColor: '#e6f9f0',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  optionTextSelected: {
    fontSize: 16,
    color: '#35cc8c',
    fontWeight: 'bold',
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
