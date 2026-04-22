import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import FeedList from './components/FeedList';
import FeedDetails from './components/FeedDetails';
import ArticleView from './components/ArticleView';
import store from './store/store';
import { colors } from './theme';
import type { RootStackParamList } from './types';

const Tab = createBottomTabNavigator<RootStackParamList>();

const ICONS: Record<
  keyof RootStackParamList,
  { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }
> = {
  Feeds: { active: 'newspaper', inactive: 'newspaper-outline' },
  FeedDetails: { active: 'document-text', inactive: 'document-text-outline' },
  ArticleView: { active: 'globe', inactive: 'globe-outline' },
};

const App = () => (
  <Provider store={store}>
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerStyle: styles.header,
            headerTitleStyle: styles.headerTitle,
            headerShadowVisible: false,
            tabBarStyle: styles.tabBar,
            tabBarLabelStyle: styles.tabBarLabel,
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.textMuted,
            tabBarHideOnKeyboard: true,
            tabBarIcon: ({ focused, color, size }) => {
              const icons = ICONS[route.name as keyof RootStackParamList];
              return (
                <Ionicons
                  name={focused ? icons.active : icons.inactive}
                  size={size}
                  color={color}
                />
              );
            },
          })}
        >
          <Tab.Screen
            name="Feeds"
            component={FeedList}
            options={{ title: 'INEGI RSS', tabBarLabel: 'Feeds' }}
          />
          <Tab.Screen
            name="FeedDetails"
            component={FeedDetails}
            options={{ title: 'Comunicados', tabBarLabel: 'Detalles' }}
          />
          <Tab.Screen
            name="ArticleView"
            component={ArticleView}
            options={({ route }) => ({
              title: route.params?.title ?? 'Visualizador',
              tabBarLabel: 'Artículo',
            })}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  </Provider>
);

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    height: Platform.select({ ios: 84, android: 64 }),
    paddingTop: 6,
    paddingBottom: Platform.select({ ios: 24, android: 8 }),
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
});

export default App;
