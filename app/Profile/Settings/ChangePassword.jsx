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
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  getAuth,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';

const ChangePassword = () => {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleChangePassword = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      Alert.alert('Error', 'No user is currently logged in.');
      return;
    }

    // Validate passwords
    if (!oldPassword) {
      Alert.alert('Error', 'Please enter your old password');
      return;
    }

    if (!newPassword) {
      Alert.alert('Error', 'Please enter your new password');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters');
      return;
    }

    try {
      // Reauthenticate the user with the old password
      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      await reauthenticateWithCredential(user, credential);

      // Update the password
      await updatePassword(user, newPassword);

      Alert.alert('Success', 'Your password has been changed successfully');
      router.back();
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        Alert.alert('Error', 'The old password is incorrect.');
      } else {
        Alert.alert('Error', 'Failed to change password. Please try again.');
      }
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
        <Text style={styles.title}>Change password</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.subtitle}>
          Please enter your old and new passwords to continue
        </Text>

        {/* Old Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Old password</Text>
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.input}
              value={oldPassword}
              onChangeText={setOldPassword}
              secureTextEntry={!showOldPassword}
              placeholder="Enter old password"
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowOldPassword(!showOldPassword)}
            >
              <Image
                source={require('../../../assets/images/eye.png')}
                style={[
                  styles.icon,
                  showOldPassword && { tintColor: '#35cc8c' },
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.divider} />

        {/* New Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>New password</Text>
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNewPassword}
              placeholder="Enter new password"
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowNewPassword(!showNewPassword)}
            >
              <Image
                source={require('../../../assets/images/eye.png')}
                style={[
                  styles.icon,
                  showNewPassword && { tintColor: '#35cc8c' },
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.divider} />

        {/* Repeat New Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Repeat new password</Text>
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              placeholder="Repeat new password"
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Image
                source={require('../../../assets/images/eye.png')}
                style={[
                  styles.icon,
                  showConfirmPassword && { tintColor: '#35cc8c' },
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.divider} />
      </ScrollView>

      {/* Change Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.changeButton}
          onPress={handleChangePassword}
        >
          <Text style={styles.changeButtonText}>Change</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChangePassword;

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
    marginLeft: 60,
  },
  content: {
    flex: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    lineHeight: 22,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 10,
  },
  eyeIcon: {
    padding: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    width: '100%',
    marginBottom: 20,
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: 30,
  },
  changeButton: {
    backgroundColor: '#35cc8c',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  changeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
