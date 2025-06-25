import { useEffect, useRef } from 'react';
import { Dimensions, FlatList } from 'react-native';
import Onboarding1 from './onboarding1';
import Onboarding2 from './onboarding2';
import Onboarding3 from './onboarding3';
import Splash from './splash';

const { width } = Dimensions.get('window');
const screens = [Splash, Onboarding1, Onboarding2, Onboarding3];

export default function OnboardingCarousel() {
  const flatListRef = useRef(null);
  const screenIndex = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      screenIndex.current += 1;
      if (screenIndex.current < screens.length) {
        flatListRef.current.scrollToIndex({ index: screenIndex.current });
      }
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <FlatList
      ref={flatListRef}
      data={screens}
      horizontal
      pagingEnabled
      scrollEnabled={false}
      showsHorizontalScrollIndicator={false}
      keyExtractor={(_, i) => i.toString()}
      renderItem={({ item: Screen }) => <Screen />}
    />
  );
}
