import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {enableScreens} from 'react-native-screens';
import {HomeScreen} from '../screens/HomeScreen';
import {CreateScreen} from '../screens/CreateScreen';
import {LibraryScreen} from '../screens/LibraryScreen';
import {SettingsScreen} from '../screens/SettingsScreen';
import {DesignStudioScreen} from '../screens/DesignStudioScreen';
import {ExportPreviewScreen} from '../screens/ExportPreviewScreen';
import {PrivacyPolicyScreen} from '../screens/PrivacyPolicyScreen';
import {theme} from '../data/theme';
import {MainTabParamList, RootStackParamList} from './types';

const isJest = Boolean(
  (globalThis as {process?: {env?: Record<string, string | undefined>}}).process?.env
    ?.JEST_WORKER_ID,
);

if (!isJest) {
  enableScreens();
}

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: theme.colors.surfaceAlt,
    primary: theme.colors.primary,
  },
};

const tabIcon = (label: string, focused: boolean) => (
  <Text style={[styles.tabIcon, focused ? styles.tabIconActive : styles.tabIconInactive]}>
    {label}
  </Text>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: theme.colors.primary,
      tabBarInactiveTintColor: '#7C8992',
      tabBarStyle: {
        height: 72,
        paddingTop: 8,
        paddingBottom: 10,
        borderTopColor: theme.colors.line,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '800',
      },
    }}>
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{tabBarIcon: ({focused}) => tabIcon('HM', focused)}}
    />
    <Tab.Screen
      name="Create"
      component={CreateScreen}
      options={{tabBarIcon: ({focused}) => tabIcon('QR', focused)}}
    />
    <Tab.Screen
      name="Library"
      component={LibraryScreen}
      options={{tabBarIcon: ({focused}) => tabIcon('LB', focused)}}
    />
    <Tab.Screen
      name="Settings"
      component={SettingsScreen}
      options={{tabBarIcon: ({focused}) => tabIcon('ST', focused)}}
    />
  </Tab.Navigator>
);

export const AppNavigator = () => (
  <NavigationContainer theme={navigationTheme}>
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="DesignStudio" component={DesignStudioScreen} />
      <Stack.Screen name="ExportPreview" component={ExportPreviewScreen} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  tabIcon: {
    fontWeight: '900',
    fontSize: 12,
  },
  tabIconActive: {
    color: theme.colors.primary,
  },
  tabIconInactive: {
    color: '#7C8992',
  },
});
