import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ThemedButton from '../../../components/ThemedButton';
import ThemedContent from '../../../components/ThemedContent';
import ThemedScreenIndicator from '../../../components/ThemedScreenIndicator';

export default function SplashScreen() {
  const router = useRouter();
  const [screenIndex, setScreenIndex] = useState(0);

  const splashData = [
    {
      title: 'Welcome!',
      description:
        'Congratulations on taking the first step toward a healthier you!',
      image: require('../../../assets/images/splash1.png'),
    },
    {
      title: 'Effortless Tracking',
      description: 'Easily log your meals, snacks and water intake',
      image: require('../../../assets/images/splash2.png'),
    },
    {
      title: 'Goal Setting',
      description: 'Set realistic goals and watch your progress unfold',
      image: require('../../../assets/images/splash3.png'),
    },
  ];

  const handleNext = () => {
    if (screenIndex < splashData.length - 1) {
      setScreenIndex(screenIndex + 1);
    } else {
      router.replace('/screens/WelcomeScreen');
    }
  };

  return (
    <View style={styles.container}>
      <ThemedContent
        title={splashData[screenIndex].title}
        description={splashData[screenIndex].description}
        image={splashData[screenIndex].image}
        imageSize="large"
      />

      <ThemedScreenIndicator
        currentIndex={screenIndex}
        total={splashData.length}
      />

      <ThemedButton
        variant="circle"
        icon={require('../../../assets/images/next.png')}
        onPress={handleNext}
        position={{ bottom: 40, right: 30 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    position: 'relative',
  },
});
