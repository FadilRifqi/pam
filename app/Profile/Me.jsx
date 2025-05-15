import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
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
  View
} from 'react-native';

const MeSettings = () => {
  const router = useRouter();
  const [userData, setUserData] = useState({
    goal: 'Lose Weight',
    age: '25',
    height: '175 cm',
    weight: '70 kg',
    gender: 'Male',
    lifestyle: 'Active'
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

  const handleBack = () => {
    router.back();
  };

  const handleEdit = (field) => {
    setEditField(field);
    setTempValue(userData[field]);
    setModalVisible(true);
  };

  const handleSave = () => {
    // Show the confirmation popup
    setSaveConfirmVisible(true);
  };

  const handleConfirmSave = () => {
    // Check if the checkbox is checked
    if (isChecked) {
      console.log('Saving user data:', userData);
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
        [
          { text: 'OK', onPress: () => console.log('Alert closed') }
        ]
      );
    }
  };

  const handleCancelSave = () => {
    // Just hide the popup
    setSaveConfirmVisible(false);
  };
  
  const handleModalDone = () => {
    // Update the user data with the temporary value
    setUserData({
      ...userData,
      [editField]: tempValue
    });
    setModalVisible(false);
  };

  const toggleCheckbox = () => {
    const toValue = isChecked ? 0 : 1;
    
    Animated.sequence([
      Animated.timing(checkAnimation, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true
      }),
      Animated.timing(checkAnimation, {
        toValue,
        duration: 150,
        useNativeDriver: true
      })
    ]).start();
    
    setIsChecked(!isChecked);
  };
  
  // Helper function to render the appropriate modal content based on field
  const renderModalContent = () => {
    switch(editField) {
      case 'goal':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose your goal</Text>
            <TouchableOpacity 
              style={tempValue === 'Lose Weight' ? styles.optionSelected : styles.option}
              onPress={() => setTempValue('Lose Weight')}
            >
              <Text style={tempValue === 'Lose Weight' ? styles.optionTextSelected : styles.optionText}>Lose Weight</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={tempValue === 'Maintain Weight' ? styles.optionSelected : styles.option}
              onPress={() => setTempValue('Maintain Weight')}
            >
              <Text style={tempValue === 'Maintain Weight' ? styles.optionTextSelected : styles.optionText}>Maintain Weight</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={tempValue === 'Gain Weight' ? styles.optionSelected : styles.option}
              onPress={() => setTempValue('Gain Weight')}
            >
              <Text style={tempValue === 'Gain Weight' ? styles.optionTextSelected : styles.optionText}>Gain Weight</Text>
            </TouchableOpacity>
          </View>
        );
      
      case 'age':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter your age</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter age (years)"
                keyboardType="numeric"
                value={tempValue}
                onChangeText={setTempValue}
              />
            </View>
          </View>
        );
      
      case 'height':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter your height</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter height (cm)"
                keyboardType="numeric"
                value={tempValue.replace(' cm', '')}
                onChangeText={(text) => setTempValue(`${text} cm`)}
              />
            </View>
          </View>
        );
      
      case 'weight':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter your weight</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter weight (kg)"
                keyboardType="numeric"
                value={tempValue.replace(' kg', '')}
                onChangeText={(text) => setTempValue(`${text} kg`)}
              />
            </View>
          </View>
        );
      
      case 'gender':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose your gender</Text>
            <TouchableOpacity 
              style={tempValue === 'Male' ? styles.optionSelected : styles.option}
              onPress={() => setTempValue('Male')}
            >
              <Text style={tempValue === 'Male' ? styles.optionTextSelected : styles.optionText}>Male</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={tempValue === 'Female' ? styles.optionSelected : styles.option}
              onPress={() => setTempValue('Female')}
            >
              <Text style={tempValue === 'Female' ? styles.optionTextSelected : styles.optionText}>Female</Text>
            </TouchableOpacity>
          </View>
        );
      
      case 'lifestyle':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose your lifestyle</Text>
            <TouchableOpacity 
              style={tempValue === 'Sedentary' ? styles.optionSelected : styles.option}
              onPress={() => setTempValue('Sedentary')}
            >
              <Text style={tempValue === 'Sedentary' ? styles.optionTextSelected : styles.optionText}>Sedentary</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={tempValue === 'Lightly Active' ? styles.optionSelected : styles.option}
              onPress={() => setTempValue('Lightly Active')}
            >
              <Text style={tempValue === 'Lightly Active' ? styles.optionTextSelected : styles.optionText}>Lightly Active</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={tempValue === 'Active' ? styles.optionSelected : styles.option}
              onPress={() => setTempValue('Active')}
            >
              <Text style={tempValue === 'Active' ? styles.optionTextSelected : styles.optionText}>Active</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={tempValue === 'Very Active' ? styles.optionSelected : styles.option}
              onPress={() => setTempValue('Very Active')}
            >
              <Text style={tempValue === 'Very Active' ? styles.optionTextSelected : styles.optionText}>Very Active</Text>
            </TouchableOpacity>
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
            <Text style={styles.dataValue}>{userData.goal}</Text>
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
            <Text style={styles.dataValue}>{userData.age}</Text>
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
            <Text style={styles.dataValue}>{userData.height}</Text>
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
            <Text style={styles.dataValue}>{userData.weight}</Text>
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
            <Text style={styles.dataValue}>{userData.gender}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.divider} />

        {/* Lifestyle */}
        <TouchableOpacity 
          style={styles.dataItem} 
          onPress={() => handleEdit('lifestyle')}
        >
          <Text style={styles.dataLabel}>Lifestyle</Text>
          <View style={styles.dataValueContainer}>
            <Text style={styles.dataValue}>{userData.lifestyle}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.divider} />
      </ScrollView>

      {/* Save Button */}
      <View style={styles.saveButtonContainer}>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
        >
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
                      transform: [{scale: checkAnimation}]
                    }
                  ]}
                />
              </TouchableOpacity>
              <Text style={styles.confirmModalText}>Update daily nutrients</Text>
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