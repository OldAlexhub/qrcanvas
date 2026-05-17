import React from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {enableScreens} from 'react-native-screens';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {HomeScreen} from '../screens/HomeScreen';
import {CreateScreen} from '../screens/CreateScreen';
import {LibraryScreen} from '../screens/LibraryScreen';
import {SettingsScreen} from '../screens/SettingsScreen';
import {DesignStudioScreen} from '../screens/DesignStudioScreen';
import {ExportPreviewScreen} from '../screens/ExportPreviewScreen';
import {PrivacyPolicyScreen} from '../screens/PrivacyPolicyScreen';
import {theme} from '../data/theme';
import {MainTabParamList, RootStackParamList} from './types';
import {TabBarIcon, TabBarIconName} from '../components/TabBarIcon';

const isJest = Boolean(
  (globalThis as {process?: {env?: Record<string, string | undefined>}}).process?.env
    ?.JEST_WORKER_ID,
);

if (!isJest) {
  enableScreens();
}

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();
const TAB_BAR_BASE_HEIGHT = 62;
const TAB_BAR_MIN_BOTTOM_PADDING = 10;

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: theme.colors.surfaceAlt,
    primary: theme.colors.primary,
  },
};

const tabIcon = (name: TabBarIconName) => (
  {focused, color, size}: {focused: boolean; color: string; size: number},
) => (
  <TabBarIcon name={name} focused={focused} color={color} size={size} />
);

const MainTabs = () => {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, TAB_BAR_MIN_BOTTOM_PADDING);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: '#7C8992',
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          height: TAB_BAR_BASE_HEIGHT + bottomPadding,
          paddingTop: 8,
          paddingBottom: bottomPadding,
          borderTopColor: theme.colors.line,
          backgroundColor: theme.colors.surface,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '800',
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{tabBarIcon: tabIcon('home')}}
      />
      <Tab.Screen
        name="Create"
        component={CreateScreen}
        options={{tabBarIcon: tabIcon('create')}}
      />
      <Tab.Screen
        name="Library"
        component={LibraryScreen}
        options={{tabBarIcon: tabIcon('library')}}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{tabBarIcon: tabIcon('settings')}}
      />
    </Tab.Navigator>
  );
};

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
