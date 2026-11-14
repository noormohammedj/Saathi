import '@/global.css';

import { Fraunces_500Medium_Italic, Fraunces_600SemiBold, Fraunces_700Bold } from '@expo-google-fonts/fraunces';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, useFonts } from '@expo-google-fonts/inter';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useApp } from '@/store/app-store';
import { C } from '@/theme';

SplashScreen.preventAutoHideAsync();

function useHydrated() {
  const [hydrated, setHydrated] = useState(useApp.persist.hasHydrated());
  useEffect(() => useApp.persist.onFinishHydration(() => setHydrated(true)), []);
  return hydrated;
}

export default function RootLayout() {
  const scheme = useColorScheme();
  const hydrated = useHydrated();
  const [fontsLoaded] = useFonts({
    Fraunces_500Medium_Italic, Fraunces_600SemiBold, Fraunces_700Bold,
    Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold,
  });
  const ready = fontsLoaded && hydrated;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);
  if (!ready) return null;

  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const theme = { ...base, colors: { ...base.colors, background: scheme === 'dark' ? C.night : C.sand, primary: C.saffron } };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={theme}>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.background } }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
          <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
          <Stack.Screen name="match/[id]" options={{ presentation: 'transparentModal', animation: 'fade' }} />
          <Stack.Screen name="profile/[id]" options={{ presentation: 'modal' }} />
          <Stack.Screen name="donate/[id]" options={{ presentation: 'modal' }} />
          <Stack.Screen name="event/[id]" />
          <Stack.Screen name="circle/[id]" />
          <Stack.Screen name="chat/[id]" />
          <Stack.Screen name="rewards" />
          <Stack.Screen name="me" />
          <Stack.Screen name="admin" />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
