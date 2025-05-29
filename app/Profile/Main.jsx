import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const ProfilSettings = () => {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [calorie, setCalorie] = useState(0);

  const handleBack = () => {
    router.back();
  };

  const handleMeNext = () => {
    router.push('/Profile/Me');
  };

  const handleCalorieIntakeNext = () => {
    router.push('/Profile/CalorieIntake');
  };

  const handleAboutNext = () => {
    router.push('/Profile/About');
  };

  const handleContactUstNext = () => {
    router.push('/Profile/ContactUs');
  };

  const handleSettingstNext = () => {
    router.push('/Profile/Settings/Main');
  };

  const handleAccountNext = () => {
    router.push('/Profile/Settings/Account');
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userData');
    router.replace('/');
  };

  useEffect(() => {
    // Get user data from AsyncStorage
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        const parsedUserData = JSON.parse(userData);
        if (userData) {
          setUsername(parsedUserData.name || 'Username');
          setProfileImage(parsedUserData.photo || null);
          setEmail(parsedUserData.email);
        }
        if (!parsedUserData.email) {
          console.warn('User email is not available.');
          return;
        }

        // Reference to the user's document in Firestore
        const userDocRef = doc(db, 'users', parsedUserData.email);

        // Fetch the document
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();

          // Assuming the PFC data is stored under a field called "recommendedPFC"
          const { recommendedPFC } = userData;

          if (recommendedPFC) {
            setCalorie(recommendedPFC.calories || 0); // Update state with calorie data
            console.log('Recommended PFC data:', recommendedPFC);
          } else {
            console.warn('No recommended PFC data found.');
          }
        } else {
          console.warn('User document does not exist.');
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
            source={require('../../assets/images/back-button.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Profil</Text>
      </View>

      {/* Foto Profil */}
      <TouchableOpacity
        onPress={handleAccountNext}
        style={styles.profileContainer}
      >
        <Image
          source={{ uri: profileImage }} // Ganti dengan URL foto profil
          style={styles.profileImage}
        />
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.email}>{email}</Text>
      </TouchableOpacity>

      {/* Tombol Hijau */}
      <View style={styles.greenButtonsContainer}>
        <TouchableOpacity style={styles.greenButton} onPress={handleMeNext}>
          <Text style={styles.greenButtonText}>Me</Text>
          <Image
            source={require('../../assets/images/Me-button.png')} // Ganti dengan path ikon Anda
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.greenButton}
          onPress={handleCalorieIntakeNext}
        >
          <Text style={styles.greenButtonText}>Calorie Intake</Text>
          <Text style={styles.greenButtonRightText}>{calorie}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.greenButton}>
          <Text style={styles.greenButtonText}>Weight Unit</Text>
          <Text style={styles.greenButtonRightText}>Kilograms</Text>
        </TouchableOpacity>
      </View>

      {/* Garis Pembatas */}
      <View style={styles.divider} />

      {/* Tombol Lainnya */}
      <View style={styles.otherButtonsContainer}>
        <TouchableOpacity style={styles.otherButton}>
          <Image
            source={require('../../assets/images/darktheme.png')} // Ganti dengan path ikon Anda
            style={styles.icon}
          />
          <Text style={styles.otherButtonText}>Dark Theme</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.otherButton}>
          <Image
            source={require('../../assets/images/contactus.png')} // Ganti dengan path ikon Anda
            style={styles.icon}
          />
          <Text style={styles.otherButtonText} onPress={handleContactUstNext}>
            Contact Us
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.otherButton}>
          <Image
            source={require('../../assets/images/aboutapp.png')} // Ganti dengan path ikon Anda
            style={styles.icon}
          />
          <Text style={styles.otherButtonText} onPress={handleAboutNext}>
            About App
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.otherButton}>
          <Image
            source={require('../../assets/images/settings.png')} // Ganti dengan path ikon Anda
            style={styles.icon}
          />
          <Text style={styles.otherButtonText} onPress={handleSettingstNext}>
            Settings
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout} style={styles.otherButton}>
          <Image
            source={require('../../assets/images/logout.png')} // Ganti dengan path ikon Anda
            style={styles.icon}
          />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfilSettings;

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
  backText: {
    fontSize: 16,
    color: '#35cc8c',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 115,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e6f9f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#35cc8c',
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  greenButtonsContainer: {
    flexDirection: 'column',
    marginBottom: 20,
  },
  greenButton: {
    backgroundColor: '#35cc8c',
    paddingVertical: 15,
    marginVertical: 5,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    width: '100%',
  },
  greenButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  greenButtonRightText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 20,
  },
  otherButtonsContainer: {
    marginBottom: 20,
  },
  otherButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomColor: '#ddd',
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
    resizeMode: 'contain',
  },
  otherButtonText: {
    fontSize: 16,
    color: '#333',
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#CB2030',
    fontWeight: 'bold',
  },
});
