import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AppStateProvider} from './src/context/AppState';
import {AppNavigator} from './src/navigation/AppNavigator';

const App = () => (
  <SafeAreaProvider>
    <AppStateProvider>
      <AppNavigator />
    </AppStateProvider>
  </SafeAreaProvider>
);

export default App;
