import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import React, { useEffect } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../../firebaseConfig';

const LoginScreen = () => {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId:
      '184018390631-35mfn2akp5upjkm5ic99g37ljp4d28u1.apps.googleusercontent.com', // Replace with your Google Client ID
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;

      // Create a credential with the token
      const credential = GoogleAuthProvider.credential(id_token);

      // Sign in with Firebase using the credential
      signInWithCredential(auth, credential)
        .then(() => {
          Alert.alert('Success', 'You are signed in with Google!');
        })
        .catch((error) => {
          console.error(error);
          Alert.alert('Error', error.message);
        });
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TouchableOpacity
        style={styles.button}
        disabled={!request}
        onPress={() => {
          promptAsync();
        }}
      >
        <Text style={styles.buttonText}>Sign in with Google</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4285F4',
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default LoginScreen;
