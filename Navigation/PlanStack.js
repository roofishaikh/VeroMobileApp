// PlanStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DeepWorkScreen1 from '../screens/DeepWorkScreens/DeepWorkScreen1';
import DeepWorkScreen2 from '../screens/DeepWorkScreens/DeepWorkScreen2';
import DeepWorkSummary from '../screens/DeepWorkScreens/DeepWorkSummary';
import DeepWorkCompleteScreen from '../screens/DeepWorkScreens/DeepWorkCompleteScreen';
import PlanScreen from '../screens/PlanScreen';

const Stack = createNativeStackNavigator();

export default function PlanStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PlanHome" component={PlanScreen} />
      <Stack.Screen name="DeepScreen1" component={DeepWorkScreen1} />
      <Stack.Screen name="DeepScreen2" component={DeepWorkScreen2} />
      <Stack.Screen name="DeepWorkScreen3" component={DeepWorkCompleteScreen} />
      <Stack.Screen name="DeepWorkScreen4" component={DeepWorkSummary} />
    </Stack.Navigator>
  );
}
