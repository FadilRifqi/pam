import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CurvedBottomBarExpo } from 'react-native-curved-bottom-bar';

const Footer = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Helper untuk cek apakah route aktif
  const isActive = (path) => pathname === path;

  const _renderIcon = (routeName, selectedTab) => {
    const isActiveRoute = routeName === selectedTab;
    
    switch (routeName) {
      case 'recipes':
        return (
          <View style={styles.tabItem}>
            <Image 
              source={require('../../assets/images/recipes.png')} 
              style={[styles.tabIconImage, isActiveRoute && styles.activeIconImage]}
            />
            <Text style={[styles.tabText, isActiveRoute && styles.activeText]}>
              Recipes
            </Text>
          </View>
        );
      case 'reports':
        return (
          <View style={styles.tabItem}>
            <Image 
              source={require('../../assets/images/reports.png')} 
              style={[styles.tabIconImage, isActiveRoute && styles.activeIconImage]}
            />
            <Text style={[styles.tabText, isActiveRoute && styles.activeText]}>
              Reports
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  const renderTabBar = ({ routeName, selectedTab, navigate }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          // Navigate using expo-router instead of curved-bottom-bar navigation
          if (routeName === 'recipes') {
            router.push('/pages/Recipes_Pages');
          } else if (routeName === 'reports') {
            router.push('/pages/Reports_Page');
          }
        }}
        style={styles.tabbarItem}
      >
        {_renderIcon(routeName, selectedTab)}
      </TouchableOpacity>
    );
  };

  // Determine current tab based on pathname
  const getCurrentTab = () => {
    if (pathname === '/pages/Recipes_Pages') return 'recipes';
    if (pathname === '/pages/Reports_Page') return 'reports';
    if (pathname === '/pages/DiaryPage') return 'diary';
    return 'recipes'; // default to first tab
  };

  const DummyScreen = () => <View />;

  return (
    <View style={styles.container}>
      <CurvedBottomBarExpo.Navigator
        type="DOWN"
        style={styles.bottomBar}
        shadowStyle={styles.shadow}
        height={65}
        circleWidth={60}
        bgColor="#DBFBED"
        initialRouteName={getCurrentTab()}
        borderTopLeftRight={true}
        width={undefined}
        id={undefined}
        borderColor={undefined}
        borderWidth={undefined}
        circlePosition={undefined}
        backBehavior={undefined}
        renderCircle={({ selectedTab, navigate }) => {
          const isDiaryActive = selectedTab === 'diary' || isActive('/pages/DiaryPage');
          
          return (
            <Animated.View style={styles.btnCircleUp}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => router.push('/pages/DiaryPage')}
              >
                <Image 
                  source={require('../../assets/images/diary.png')} 
                  style={[
                    styles.centerIconImage,
                    isDiaryActive && styles.activeCenterIconImage
                  ]}
                />
                <Text style={[
                  styles.centerText,
                  isDiaryActive && styles.activeCenterText
                ]}>
                  Diary
                </Text>
              </TouchableOpacity>
            </Animated.View>
          );
        }}
        tabBar={renderTabBar}
      >
        <CurvedBottomBarExpo.Screen
          name="recipes"
          position="LEFT"
          component={DummyScreen}
        />
        <CurvedBottomBarExpo.Screen
          name="diary"
          position="CENTER"
          component={DummyScreen}
        />
        <CurvedBottomBarExpo.Screen
          name="reports"
          position="RIGHT"
          component={DummyScreen}
        />
      </CurvedBottomBarExpo.Navigator>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0, // Padding bottom
    left: 15,   // Padding left
    right: 15,  // Padding right
    height: 80,
    borderRadius: 20,
    // overflow: 'hidden',
  },
  shadow: {
    shadowColor: '#DDDDDD',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBar: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  btnCircleUp: {
    width: 80,
    height: 80,
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    bottom: 43,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tabbarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconImage: {
    width: 24,
    height: 24,
    marginBottom: 2,
    tintColor: '#666',
    resizeMode: 'contain',
  },
  activeIconImage: {
    tintColor: '#4CAF50',
    width: 26,
    height: 26,
  },
  tabText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  activeText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  centerIconImage: {
    width: 28,
    height: 28,
    tintColor: 'white',
    resizeMode: 'contain',
    marginBottom: 2,
  },
  activeCenterIconImage: {
    width: 30,
    height: 30,
    tintColor: '#FFF',
  },
  centerText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '500',
    textAlign: 'center',
  },
  activeCenterText: {
    fontSize: 11,
    color: '#FFF',
    fontWeight: 'bold',
  },
});