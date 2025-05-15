import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';

const Language = () => {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const languages = [
    { name: 'English', localName: 'English' },
    { name: 'Indonesia', localName: 'Indonesia' },
  ];

  const handleBack = () => {
    router.back();
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    // Here you would typically save the language preference
    // For example: AsyncStorage.setItem('userLanguage', language);
    
    // Navigate back after selection
    setTimeout(() => {
      router.back();
    }, 300);
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
        <Text style={styles.title}>Language</Text>
      </View>

      {/* Language List */}
      <ScrollView style={styles.languageContainer}>
        {languages.map((language, index) => (
          <React.Fragment key={language.name}>
            <TouchableOpacity
              style={styles.languageItem}
              onPress={() => handleLanguageSelect(language.name)}
            >
              <View style={styles.languageTextContainer}>
                <Text style={styles.languageName}>{language.localName}</Text>
                {language.localName !== language.name && (
                  <Text style={styles.languageEnglishName}>{language.name}</Text>
                )}
              </View>
              {selectedLanguage === language.name && (
                <Image
                  source={require('../../../assets/images/check.png')}
                  style={styles.checkIcon}
                />
              )}
            </TouchableOpacity>
            {index < languages.length - 1 && <View style={styles.divider} />}
          </React.Fragment>
        ))}
      </ScrollView>
    </View>
  );
};

export default Language;

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
  languageContainer: {
    flex: 1,
    marginTop: 10,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  languageTextContainer: {
    flex: 1,
  },
  languageName: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  languageEnglishName: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  checkIcon: {
    width: 20,
    height: 20,
    tintColor: '#35cc8c',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    width: '100%',
  },
});