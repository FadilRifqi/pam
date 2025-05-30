import { usePathname, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
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
  const [position, setPosition] = React.useState('CENTER');

  // Helper untuk cek apakah route aktif
  const isActive = (path: string) => pathname === path;

  const _renderIcon = (routeName: string, selectedTab: string) => {
    const isActiveRoute = routeName === selectedTab;

    switch (routeName) {
      case 'recipes':
        return (
          <View style={styles.tabItem}>
            <Image
              source={require('../../assets/images/recipes.png')}
              style={[
                styles.tabIconImage,
                isActiveRoute && styles.activeIconImage,
              ]}
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
              style={[
                styles.tabIconImage,
                isActiveRoute && styles.activeIconImage,
              ]}
            />
            <Text style={[styles.tabText, isActiveRoute && styles.activeText]}>
              Reports
            </Text>
          </View>
        );
      case 'diary':
        return (
          <View style={styles.tabItem}>
            <Image
              source={require('../../assets/images/diary.png')}
              style={[
                styles.tabIconImage,
                isActiveRoute && styles.activeIconImage,
              ]}
            />
            <Text style={[styles.tabText, isActiveRoute && styles.activeText]}>
              Diary
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  const renderTabBar = ({
    routeName,
    selectedTab,
    navigate,
  }: {
    routeName: string;
    selectedTab: string;
    navigate: (routeName: string) => void;
  }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          // Navigate using expo-router instead of curved-bottom-bar navigation
          if (routeName === 'recipes') {
            router.push('/pages/Recipes_Pages');
          } else if (routeName === 'reports') {
            router.push('/pages/Reports_Page');
          } else {
            router.push('/pages/DiaryPage');
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
    if (pathname === '/pages/Reports_Page') return 'reports';
    if (pathname === '/pages/Recipes_Pages') return 'recipes';
    if (pathname === '/pages/DiaryPage') return 'diary';
    return 'diary'; // default to first tab
  };

  const getPosition = (pathname: string) => {
    switch (pathname) {
      case '/pages/Recipes_Pages/recipes':
      case '/pages/Recipes_Pages':
        setPosition('LEFT');
        break;
      case '/pages/Reports_Page/reports':
      case '/pages/Reports_Page':
        setPosition('RIGHT');
        break;
      case '/pages/DiaryPage/diary':
      case '/pages/DiaryPage':
        setPosition('CENTER');
        break;
    }
  };

  useEffect(() => {
    getPosition(pathname);
  }, [pathname]);

  const getScreensByPath = (pathname: string) => {
    switch (pathname) {
      case '/pages/DiaryPage/diary':
      case '/pages/DiaryPage':
        return [
          { name: 'recipes', position: 'LEFT' },
          { name: 'diary', position: 'CENTER' },
          { name: 'reports', position: 'RIGHT' },
        ];
      case '/pages/Reports_Page/reports':
      case '/pages/Reports_Page':
        return [
          { name: 'recipes', position: 'LEFT' },
          { name: 'reports', position: 'CENTER' },
          { name: 'diary', position: 'RIGHT' },
        ];
      case '/pages/Recipes_Pages/recipes':
      case '/pages/Recipes_Pages':
        return [
          { name: 'diary', position: 'LEFT' },
          { name: 'recipes', position: 'CENTER' },
          { name: 'reports', position: 'RIGHT' },
        ];
    }
  };

  const DummyScreen = () => <View />;

  return (
    <View>
      <CurvedBottomBarExpo.Navigator
        type="DOWN"
        style={styles.bottomBar}
        shadowStyle={styles.shadow}
        height={65}
        circleWidth={80}
        bgColor="#DBFBED"
        initialRouteName={getCurrentTab()}
        borderTopLeftRight={true}
        width={undefined}
        id={undefined}
        borderColor={undefined}
        borderWidth={undefined}
        circlePosition={position}
        backBehavior={undefined}
        renderCircle={({ selectedTab, navigate }) => {
          let iconSource;
          let label;
          let targetPath;

          switch (pathname) {
            case '/pages/Recipes_Pages/recipes':
              iconSource = require('../../assets/images/recipes.png');
              label = 'Recipes';
              targetPath = '/pages/Recipes_Pages';
              break;
            case '/pages/Reports_Page/reports':
              iconSource = require('../../assets/images/reports.png');
              label = 'Reports';
              targetPath = '/pages/Reports_Page';
              break;
            case '/pages/DiaryPage/diary':
            default:
              iconSource = require('../../assets/images/diary.png');
              label = 'Diary';
              targetPath = '/pages/DiaryPage';
              break;
          }

          const isActiveRoute = pathname === targetPath;

          return (
            <Animated.View style={styles.btnCircleUp}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => router.push(targetPath)}
              >
                <Image
                  source={iconSource}
                  style={[
                    styles.centerIconImage,
                    isActiveRoute && styles.activeCenterIconImage,
                  ]}
                />
                <Text
                  style={[
                    styles.centerText,
                    isActiveRoute && styles.activeCenterText,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          );
        }}
        tabBar={renderTabBar}
      >
        {getScreensByPath(pathname)?.map((screen) => (
          <CurvedBottomBarExpo.Screen
            key={screen.name}
            name={screen.name}
            position={screen.position}
            component={DummyScreen}
          />
        ))}
      </CurvedBottomBarExpo.Navigator>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
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
