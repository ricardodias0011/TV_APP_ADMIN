import React, { Suspense } from 'react';
import StatusBar, { StatusBar as ViewStatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';

import 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import Routes from "./src/routes"
import { AuthProvider } from './src/contexts/auth';
import { Theme } from './theme';
import LoadingScreen from './src/screens/loading';

export default function App() {
  NavigationBar?.setBackgroundColorAsync(Theme.bgcolor);
  NavigationBar?.setButtonStyleAsync("light");
  StatusBar?.setStatusBarStyle('light')

  return (
    <Suspense fallback={<LoadingScreen />}>
      <ViewStatusBar translucent backgroundColor={'transparent'} />
      <View style={{ flex: 1, backgroundColor: Theme.bgcolor }}>
        <AuthProvider>
          <Routes />
          <Toast />
        </AuthProvider>
      </View>
    </Suspense>
  );
}

