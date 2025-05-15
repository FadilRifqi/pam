import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { 
  Image, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View,
  ScrollView,
  TextInput,
  Linking
} from 'react-native';

const ContactUsSettings = () => {
  const router = useRouter();
  const [message, setMessage] = useState('');

  const handleBack = () => {
    router.back();
  };

  const handleSend = () => {
    // Implement sending functionality here
    console.log('Sending message:', message);
    alert('Message sent successfully!');
    setMessage('');
  };

  const handleEmailPress = () => {
    Linking.openURL('mailto:itamiomw@gmail.com');
  };

  const handleInstagramPress = () => {
    Linking.openURL('https://instagram.com/itamiomw');
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
        <Text style={styles.title}>Contact Us</Text>
      </View>

      <ScrollView style={styles.contentContainer}>
        <Text style={styles.description}>
          Don't hesitate to contact us if you find a bug or have a suggestion. 
          We highly appreciate any feedback provided, as it helps us improve your Calorie Tracker.
        </Text>

        <View style={styles.contactInfoSection}>
          <Text style={styles.sectionTitle}>Contact Info</Text>
          
          <TouchableOpacity onPress={handleEmailPress} style={styles.contactItem}>
            <Image 
              source={require('../../assets/images/contactus.png')} 
              style={styles.contactIcon} 
            />
            <Text style={styles.contactText}>itamiomw@gmail.com</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleInstagramPress} style={styles.contactItem}>
            <Image 
              source={require('../../assets/images/contactus.png')} 
              style={styles.contactIcon} 
            />
            <Text style={styles.contactText}>@itamiomw</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.messageSection}>
          <Text style={styles.sectionTitle}>Message</Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.messageInput}
              placeholder="I found a bug..."
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
          </View>
          
          <Text style={styles.supportingText}>
            Please provide as much detail as possible to help us understand your feedback.
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.sendButton}
          onPress={handleSend}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
        
        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
};

export default ContactUsSettings;

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
  contentContainer: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 30,
  },
  contactInfoSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  contactIcon: {
    width: 24,
    height: 24,
    marginRight: 15,
    tintColor: '#35cc8c',
    resizeMode: 'contain'
  },
  contactText: {
    fontSize: 16,
    color: '#333',
  },
  messageSection: {
    marginBottom: 20,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  messageInput: {
    fontSize: 16,
    minHeight: 100,
  },
  supportingText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 20,
  },
  sendButton: {
    backgroundColor: '#35cc8c',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomSpace: {
    height: 40,
  }
});