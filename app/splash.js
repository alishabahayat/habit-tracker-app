import { useEffect, useState } from 'react';
import FadeInView from '../components/FadeInView';
import Onboarding1 from './onboarding1';
import Onboarding2 from './onboarding2';
import Onboarding3 from './onboarding3';

export default function Splash() {
  const [screenIndex, setScreenIndex] = useState(0);

  const screens = [<Onboarding1 />, <Onboarding2 />, <Onboarding3 />];

  useEffect(() => {
    if (screenIndex < screens.length - 1) {
      const timer = setTimeout(() => {
        setScreenIndex((prev) => prev + 1);
      }, 3000); // auto-slide after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [screenIndex]);

  return (
    <FadeInView key={screenIndex}>
      {screens[screenIndex]}
    </FadeInView>
  );
}
