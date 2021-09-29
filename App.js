import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackRoutes from './src/routes';
import { StatusBar } from 'react-native';

export default function App() {

  

  return (
    <NavigationContainer>
      <StatusBar />
      <StackRoutes />
    </NavigationContainer>
  );
}