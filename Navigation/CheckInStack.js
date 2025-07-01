import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CheckInScreen1 from '../screens/CheckInScreens/CheckInScreen1';
import CheckInScreen2 from '../screens/CheckInScreens/CheckInScreen2';
import CheckInScreen3 from '../screens/CheckInScreens/CheckInScreen3';
import CheckInScreen4 from '../screens/CheckInScreens/CheckInScreen4';
import CheckInCompleteScreen5 from '../screens/CheckInScreens/CheckInCompleteScreen5';

const Stack = createNativeStackNavigator();

export default function CheckInStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CheckInScreen1" component={CheckInScreen1} />
      <Stack.Screen name="CheckInScreen2" component={CheckInScreen2} />
      <Stack.Screen name="CheckInScreen3" component={CheckInScreen3} />
      <Stack.Screen name="CheckInScreen4" component={CheckInScreen4} />
      <Stack.Screen name="CheckInCompleteScreen5" component={CheckInCompleteScreen5} />
    </Stack.Navigator>
  );
} 