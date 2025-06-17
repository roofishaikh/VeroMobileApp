// PlanStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DeepWorkScreen1 from '../screens/DeepWorkScreens/DeepWorkScreen1';
import DeepWorkScreen2 from '../screens/DeepWorkScreens/DeepWorkScreen2';
import DeepWorkSummary from '../screens/DeepWorkScreens/DeepWorkSummary';
import DeepWorkComplete from '../screens/DeepWorkScreens/DeepWorkCompleteScreen';


const Stack = createNativeStackNavigator();

export default function PlanStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DeepScreen1" component={DeepWorkScreen1} />
      <Stack.Screen name="DeepScreen2" component={DeepWorkScreen2} />
      <Stack.Screen name="DeepWorkScreen3" component={DeepWorkComplete} />
      <Stack.Screen name="DeepWorkScreen4" component={DeepWorkSummary} />
    </Stack.Navigator>
  );
}
