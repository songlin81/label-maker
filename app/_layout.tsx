import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const [loaded] = useFonts({
    VolvoNovum3Bold: require('../assets/fonts/VolvoNovum3-Bold.ttf'),
    VolvoNovum3Italic: require('../assets/fonts/VolvoNovum3-Italic.ttf'),
    VolvoNovum3BoldItalic: require('../assets/fonts/VolvoNovum3-BoldItalic.ttf'),
  });

  useEffect(() => {
    async function prepare() {
      try {

        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        await new Promise(resolve => setTimeout(resolve, 4000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
      }
    }
    prepare();
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}