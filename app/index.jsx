import React, { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');

        if (userData) {
          // Jika userData ada, arahkan ke halaman Home
          const recommendedPFC = await AsyncStorage.getItem('recommendedPFC');
          if (!recommendedPFC) {
            // Jika recommendedPFC tidak ada, arahkan ke halaman GoalScreen
            setInitialRoute({ href: '/screens/Start/GoalScreen' });
          }
          setInitialRoute({
            href: '/pages/DiaryPage',
            data: JSON.parse(userData),
          });
        } else {
          // Jika tidak ada userData, arahkan ke halaman SplashScreen
          setInitialRoute({ href: '/screens/Splash/SplashScreen' });
        }
      } catch (error) {
        console.error('Error checking userData:', error);
        setInitialRoute({ href: '/screens/Splash/SplashScreen' });
      }
    };

    checkUserData();
  }, []);

  if (!initialRoute) {
    // Tampilkan layar kosong atau loader sementara menunggu pengecekan
    return null;
  }

  return <Redirect href={initialRoute.href} />;
}
