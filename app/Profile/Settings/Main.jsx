import { useRouter } from 'expo-router';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const Main = () => {
  const router = useRouter();

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
            source={{ uri: 'https://via.placeholder.com/150' }} // Ganti dengan URL foto profil
            style={styles.profileImage}
          />
          <View style={styles.profileUserContainer}>
            <Text style={styles.username}>Username</Text>
            <Text style={styles.email}>user@example.com</Text>
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
              <Text style={styles.settingValue}>Meter</Text>
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
            <View style={styles.settingValueContainer}>
              <Text style={styles.settingValue}>200 ml</Text>
            </View>
          </View>
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
});
