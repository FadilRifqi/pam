import { useRouter } from 'expo-router';
import React from 'react';
import { 
  Image, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View,
  ScrollView
} from 'react-native';

const AboutSettings = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
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
        <Text style={styles.title}>About</Text>
      </View>

      <ScrollView style={styles.contentContainer}>
        <View style={styles.aboutSection}>
          <Text style={styles.appTitle}>About App</Text>
          <Text style={styles.appDescription}>
            Calorie Tracker - an Android app developed and designed by a single developer to assist you on your journey to achieving dream physique.
          </Text>
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>
            We provide with all the necessary features such as:
          </Text>
          
          <View style={styles.featureItem}>
            <Image 
              source={require('../../assets/images/aboutapp.png')} 
              style={styles.featureIcon} 
            />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureName}>Diary</Text>
              <Text style={styles.featureDescription}>
                to log your meals and water intake
              </Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.featureItem}>
            <Image 
              source={require('../../assets/images/aboutapp.png')} 
              style={styles.featureIcon} 
            />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureName}>Reports</Text>
              <Text style={styles.featureDescription}>
                to keep a track on your weight
              </Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.featureItem}>
            <Image 
              source={require('../../assets/images/aboutapp.png')} 
              style={styles.featureIcon} 
            />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureName}>Recipes</Text>
              <Text style={styles.featureDescription}>
                to quickly come up with something to cook
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.versionSection}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
          <Text style={styles.copyrightText}>© 2024 Calorie Tracker</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default AboutSettings;

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
    marginLeft: 120,
  },
  contentContainer: {
    flex: 1,
  },
  aboutSection: {
    marginBottom: 30,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  appDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  featuresSection: {
    marginBottom: 30,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  featureIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginRight: 15,
    tintColor: '#35cc8c',
  },
  featureTextContainer: {
    flex: 1,
  },
  featureName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    width: '100%',
  },
  versionSection: {
    marginTop: 40,
    marginBottom: 20,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 5,
  },
  copyrightText: {
    fontSize: 14,
    color: '#999',
  },
});