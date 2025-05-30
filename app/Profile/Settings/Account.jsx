import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

const Account = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  const handleBack = () => {
    router.back();
  };

  const handleChangePasswordNext = () => {
    router.push('/Profile/Settings/ChangePassword');
  };

  const handleUploadPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;

      try {
        // Save the selected photo URI to AsyncStorage
        await AsyncStorage.setItem('profileImage', imageUri);

        // Update the state with the new photo URI
        setProfileImage(imageUri);

        console.log('Profile photo updated successfully:', imageUri);
      } catch (error) {
        console.error('Error updating profile photo:', error);
      }
    }
  };

  useEffect(() => {
    // Get user data from AsyncStorage
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          setUsername(parsedUserData.name || 'Username');
          setProfileImage(parsedUserData.photo || null);
          setEmail(parsedUserData.email);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          // Implement logout functionality
          console.log('User logged out');
          // Navigate to login screen
          router.replace('/');
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Implement account deletion
            console.log('Account deleted');
            // Navigate to login screen
            router.replace('/');
          },
        },
      ]
    );
  };

  const handleSave = async () => {
    try {
      // Prepare the updated user data
      const updatedUserData = {
        name: username,
        email: email,
        photo: profileImage,
      };

      // Save the updated data to Firestore
      const userDocRef = doc(db, 'users', email); // Use email as the document ID
      await setDoc(userDocRef, updatedUserData, { merge: true });

      // Sync the updated data with AsyncStorage
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));

      Alert.alert('Success', 'Your account details have been updated.');
    } catch (error) {
      console.error('Error saving account details:', error);
      Alert.alert('Error', 'Failed to update account details.');
    }
  };

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
        <Text style={styles.title}>Account</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Profile Picture */}
        <View style={styles.profilePictureContainer}>
          <TouchableOpacity
            style={styles.profilePicture}
            onPress={handleUploadPhoto}
          >
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <Text style={styles.profileInitials}>
                {username ? username.charAt(0).toUpperCase() : 'U'}
              </Text>
            )}
            <View style={styles.addIconContainer}>
              <Image
                source={require('../../../assets/images/AddPhoto.png')}
                style={styles.addIcon}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>
        <View style={styles.divider} />

        {/* Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />
        </View>
        <View style={styles.divider} />

        {/* Change Password */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleChangePasswordNext}
        >
          <Text style={styles.actionButtonText}>Change password</Text>
        </TouchableOpacity>
        <View style={styles.divider} />

        {/* Logout */}
        <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        <View style={styles.divider} />

        {/* Delete Account */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleDeleteAccount}
        >
          <Text style={styles.deleteText}>Delete account</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
      </ScrollView>

      {/* Save Button */}
      <View style={styles.saveButtonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Account;

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
  content: {
    flex: 1,
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e6f9f0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  profileInitials: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#35cc8c',
  },
  addIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#35cc8c',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  addIcon: {
    width: 15,
    height: 15,
    tintColor: 'white',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    width: '100%',
    marginBottom: 20,
  },
  actionButton: {
    paddingVertical: 10,
    marginBottom: 20,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#35cc8c',
    fontWeight: '500',
  },
  logoutText: {
    fontSize: 16,
    color: '#ff9500',
    fontWeight: '500',
  },
  deleteText: {
    fontSize: 16,
    color: '#ff3b30',
    fontWeight: '500',
  },
  saveButtonContainer: {
    padding: 20,
    paddingBottom: 30,
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
});
