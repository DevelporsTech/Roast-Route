/**
 * React Native Navigation Hierarchy with React Navigation 6 / 7 Type-Safe Routes
 */
import React from 'react';

export type RootStackParamList = {
  MainTabs: undefined;
  StoreDetail: { storeId: string; storeName: string };
  DrinkCustomizer: { itemId: string; storeId: string };
  LiveOrderTracker: { orderId: string };
  CaffeineWellness: undefined;
  AuthModal: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  StoreLocator: undefined;
  InteractiveMap: undefined;
  CaffeineTracker: undefined;
  RoastRewards: undefined;
};

export const AppNavigator = () => {
  return null; // Typings and structure for React Navigation integration
};
