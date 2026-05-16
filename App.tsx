import React from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AppStateProvider} from './src/context/AppState';
import {AppNavigator} from './src/navigation/AppNavigator';
import {theme} from './src/data/theme';

const App = () => (
  <SafeAreaProvider>
    <StatusBar barStyle="dark-content" backgroundColor={theme.colors.surfaceAlt} />
    <AppStateProvider>
      <AppNavigator />
    </AppStateProvider>
  </SafeAreaProvider>
);

export default App;
