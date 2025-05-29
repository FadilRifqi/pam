import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import { db } from '../../config/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Alert } from 'react-native';

const Main = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [waterServingSize, setWaterServingSize] = useState(200);
  const [modalVisible, setModalVisible] = useState(false);
  const [tempWaterServingSize, setTempWaterServingSize] = useState('');
  const router = useRouter();

  const handleEditWaterServingSize = () => {
    setTempWaterServingSize(waterServingSize.toString());
    setModalVisible(true);
  };

  const handleSaveWaterServingSize = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      const parsedUserData = JSON.parse(userData);

      if (parsedUserData && parsedUserData.email) {
        const userDocRef = doc(db, 'users', parsedUserData.email);

        await setDoc(
          userDocRef,
          { waterServingSize: parseInt(tempWaterServingSize) },
          { merge: true }
        );

        setWaterServingSize(parseInt(tempWaterServingSize));
        setModalVisible(false);

        Alert.alert('Success', 'Water serving size updated successfully.');
      }
    } catch (error) {
      console.error('Error updating water serving size:', error);
      Alert.alert('Error', 'Failed to update water serving size.');
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleLanguageNext = () => {
    router.push('/Profile/Settings/Language');
  };

  const handleChangePasswordNext = () => {
    router.push('/Profile/Settings/ChangePassword');
  };

  const handleAccountNext = () => {
    router.push('/Profile/Settings/Account');
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        const parsedUserData = JSON.parse(userData);

        if (userData) {
          setUsername(parsedUserData.name || 'Username');
          setProfileImage(parsedUserData.photo || null);
          setEmail(parsedUserData.email || 'Email not available');
        }

        if (parsedUserData && parsedUserData.email) {
          const userDocRef = doc(db, 'users', parsedUserData.email);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userDataFromFirestore = userDoc.data();
            setWaterServingSize(userDataFromFirestore.waterServingSize || 200);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Image
            source={require('../../../assets/images/back-button.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
        {/* Foto Profil */}
        <TouchableOpacity
          onPress={handleAccountNext}
          style={styles.profileContainer}
        >
          <Image
            source={{ uri: profileImage }} // Ganti dengan URL foto profil
            style={styles.profileImage}
          />
          <View style={styles.profileUserContainer}>
            <Text style={styles.username}>{username}</Text>
            <Text style={styles.email}>{email}</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* Settings Sections */}
        <View style={styles.settingsSection}>
          <View style={styles.settingItem}>
            <View style={styles.settingLabelGroup}>
              <Image
                source={require('../../../assets/images/weight-unit.png')}
                style={styles.settingIcon}
              />
              <Text style={styles.settingLabel}>Weight Unit</Text>
            </View>
            <View style={styles.settingValueContainer}>
              <Text style={styles.settingValue}>Kilograms</Text>
            </View>
          </View>
          <View style={styles.divider} />

          <View style={styles.settingItem}>
            <View style={styles.settingLabelGroup}>
              <Image
                source={require('../../../assets/images/height-unit.png')}
                style={styles.settingIcon}
              />
              <Text style={styles.settingLabel}>Height Unit</Text>
            </View>
            <View style={styles.settingValueContainer}>
              <Text style={styles.settingValue}>Centimeter</Text>
            </View>
          </View>
          <View style={styles.divider} />

          <View style={styles.settingItem}>
            <View style={styles.settingLabelGroup}>
              <Image
                source={require('../../../assets/images/water-service.png')}
                style={styles.settingIcon}
              />
              <Text style={styles.settingLabel}>Water serving size</Text>
            </View>
            <TouchableOpacity onPress={handleEditWaterServingSize}>
              <Text style={styles.settingValue}>{waterServingSize} ml</Text>
            </TouchableOpacity>
          </View>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                {/* Tombol Close */}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>X</Text>
                </TouchableOpacity>

                <Text style={styles.modalTitle}>Edit Water Serving Size</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter water serving size (ml)"
                  keyboardType="numeric"
                  value={tempWaterServingSize}
                  onChangeText={setTempWaterServingSize}
                />
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveWaterServingSize}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleLanguageNext}
          >
            <View style={styles.settingLabelGroup}>
              <Image
                source={require('../../../assets/images/Language.png')}
                style={styles.settingIcon}
              />
              <Text style={styles.settingLabel}>Language</Text>
            </View>
            <View style={styles.settingValueContainer}>
              <Text style={styles.settingValue}>English</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.divider} />

          <View style={styles.settingItem}>
            <View style={styles.settingLabelGroup}>
              <Image
                source={require('../../../assets/images/theme.png')}
                style={styles.settingIcon}
              />
              <Text style={styles.settingLabel}>Theme</Text>
            </View>
            <View style={styles.settingValueContainer}>
              <Text style={styles.settingValue}>System</Text>
            </View>
          </View>
          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleChangePasswordNext}
          >
            <Text style={styles.settingLabelPassword}>Change Password</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
        </View>

        {/* Version Info */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version: 0.0.6</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default Main;

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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 100,
  },
  scrollContainer: {
    flex: 1,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 10,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#35cc8c',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  userInfo: {
    justifyContent: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  settingsSection: {
    marginBottom: 30,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  settingLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  settingLabelPassword: {
    fontSize: 16,
    color: '#35CC8C',
  },
  settingIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  settingValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 16,
    color: '#35CC8C',
    marginRight: 8,
  },
  arrowIcon: {
    width: 12,
    height: 12,
    tintColor: '#999',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    width: '100%',
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  versionText: {
    fontSize: 14,
    color: '#999',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 60,
    backgroundColor: '#e6f9f0',
    borderWidth: 1,
    borderColor: '#35cc8c',
    marginRight: 17,
  },
  profileContainer: {
    alignItems: 'left',
    flexDirection: 'row',
  },
  profileUserContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: 24,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4, // Space between username and email
  },
  email: {
    fontSize: 14,
    color: '#35CC8C',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparansi untuk latar belakang
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%', // Lebar modal
    backgroundColor: 'white', // Warna latar belakang modal
    borderRadius: 10, // Sudut melengkung
    padding: 20, // Padding di dalam modal
    alignItems: 'center', // Pusatkan konten secara horizontal
  },
  modalTitle: {
    fontSize: 18, // Ukuran font judul
    fontWeight: 'bold', // Teks tebal
    marginBottom: 20, // Jarak bawah judul
    textAlign: 'center', // Teks rata tengah
  },
  input: {
    width: '100%', // Lebar input mengikuti lebar modal
    height: 50, // Tinggi input
    borderWidth: 1, // Garis tepi
    borderColor: '#ddd', // Warna garis tepi
    borderRadius: 5, // Sudut melengkung
    paddingHorizontal: 10, // Padding horizontal
    fontSize: 16, // Ukuran font
    marginBottom: 20, // Jarak bawah input
  },
  saveButton: {
    backgroundColor: '#35cc8c', // Warna tombol
    paddingVertical: 15, // Padding vertikal
    paddingHorizontal: 30, // Padding horizontal
    borderRadius: 5, // Sudut melengkung
    alignItems: 'center', // Pusatkan teks
  },
  saveButtonText: {
    color: 'white', // Warna teks
    fontSize: 16, // Ukuran font teks
    fontWeight: 'bold', // Teks tebal
  },
  closeButton: {
    position: 'absolute', // Posisi absolut di dalam modal
    top: 10, // Jarak dari atas
    right: 10, // Jarak dari kanan
    backgroundColor: '#ddd', // Warna latar belakang tombol
    width: 30, // Lebar tombol
    height: 30, // Tinggi tombol
    borderRadius: 15, // Membuat tombol berbentuk lingkaran
    justifyContent: 'center', // Pusatkan teks secara vertikal
    alignItems: 'center', // Pusatkan teks secara horizontal
  },
  closeButtonText: {
    color: '#333', // Warna teks
    fontSize: 16, // Ukuran font
    fontWeight: 'bold', // Teks tebal
  },
});
