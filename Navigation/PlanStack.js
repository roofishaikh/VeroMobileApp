// PlanStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DeepWorkScreen1 from '../screens/DeepWorkScreens/DeepWorkScreen1';
import DeepWorkScreen2 from '../screens/DeepWorkScreens/DeepWorkScreen2';
import DeepWorkSummary from '../screens/DeepWorkScreens/DeepWorkSummary';
import DeepWorkCompleteScreen from '../screens/DeepWorkScreens/DeepWorkCompleteScreen';
import PlanScreen from '../screens/PlanScreen';
import ShutdownScreen from '../screens/DeepWorkScreens/PlanScreens/ShutdownScreen';
import PlanModal from '../screens/DeepWorkScreens/PlanScreens/PlanModal';
import WeeklyReviewScreen from '../screens/DeepWorkScreens/PlanScreens/WeeklyReviewScreen';
import MonthlyReviewScreen from '../screens/DeepWorkScreens/PlanScreens/MonthlyReviewScreen';

const Stack = createNativeStackNavigator();

export default function PlanStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PlanHome" component={PlanModal} />
      <Stack.Screen name="DeepScreen1" component={DeepWorkScreen1} />
      <Stack.Screen name="DeepScreen2" component={DeepWorkScreen2} />
      <Stack.Screen name="DeepWorkScreen3" component={DeepWorkCompleteScreen} />
      <Stack.Screen name="DeepWorkScreen4" component={DeepWorkSummary} />
      <Stack.Screen name="ShutdownScreen" component={ShutdownScreen} />
      <Stack.Screen name="WeeklyReviewScreen" component={WeeklyReviewScreen} />
      <Stack.Screen name="MonthlyReviewScreen" component={MonthlyReviewScreen} />
    </Stack.Navigator>
  );
}
