import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ThemedButton from '../../components/ThemedButton';
import ThemedContent from '../../components/ThemedContent';

const WelcomeScreen = () => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  
  const handleStart = () => {
    router.push('/screens/HomeScreen');
  };

  const handleGoogleSignIn = () => {
    setModalVisible(false);
    router.push('/screens/LoginScreen');
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainContainer}>
        <ThemedContent
          image={require('../../assets/images/Apple.png')}
          title="Welcome!"
          description="Track your health journey with our app"
          imageSize="large"
        />
      </View>

      <View style={styles.bottomContainer}>
        <ThemedButton 
          label="START" 
          onPress={handleStart} 
          style={styles.startButton}
          textStyle={styles.startButtonText}
        />
        
        <View style={styles.signInContainer}>
          <Text style={styles.alreadyText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.signInText}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={e => e.stopPropagation()}
            >
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Sign In</Text>
                
                <ThemedButton 
                  label="Sign in with Google"
                  onPress={handleGoogleSignIn}
                  style={styles.googleButton}
                  textStyle={styles.googleButtonText}
                />
                
                <ThemedButton 
                  label="Cancel"
                  onPress={() => setModalVisible(false)}
                  variant="link"
                />
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    justifyContent: 'space-between',
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  bottomContainer: {
    width: '100%',
    marginTop: 50,
    marginBottom: 40,
  },
  startButton: {
    backgroundColor: '#35cc8c',
    paddingVertical: 18,
    borderRadius: 12,
    marginBottom: 20,
    width: '100%',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alreadyText: {
    fontSize: 14,
    color: '#666666',
  },
  signInText: {
    fontSize: 14,
    color: '#35cc8c',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: height / 4,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  modalContent: {
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  googleButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 15,
    width: '100%',
  },
  googleButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default WelcomeScreen;