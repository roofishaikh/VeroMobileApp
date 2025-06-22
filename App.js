import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';

// Screens
import DeepWorkScreen1 from './screens/DeepWorkScreens/DeepWorkScreen1';
import DeepWorkScreen2 from './screens/DeepWorkScreens/DeepWorkScreen2';
import CheckInScreen1 from './screens/CheckInScreens/CheckInScreen1';
import DeepWorkSummary from './screens/DeepWorkScreens/DeepWorkSummary';
import HabitTracker from './screens/InsightsScreens/HabitTracker';
import DeepWorkCompleteScreen from './screens/DeepWorkScreens/DeepWorkCompleteScreen';
import PlanModal from './screens/DeepWorkScreens/PlanScreens/PlanModal';

// Icons
import Plan from './assets/icons/plan.svg';
import Focus from './assets/icons/focus.svg';
import Checkin from './assets/icons/checkin.svg';
import Reflect from './assets/icons/reflect.svg';
import Insights from './assets/icons/insights.svg';
import PlanStack from './Navigation/PlanStack';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

/**
 * Bottom Tabs (used inside Stack)
 */
function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#fdfdfd',
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          height: 100,
          paddingBottom: 13,
          paddingTop: 20,
          position: 'absolute',
        },
        tabBarIcon: ({ focused, size }) => {
          let IconComponent;

          switch (route.name) {
            case 'Plan':
              IconComponent = Plan;
              break;
            case 'Focus':
              IconComponent = Focus;
              break;
            case 'Check-In':
              IconComponent = Checkin;
              break;
            case 'Reflect':
              IconComponent = Reflect;
              break;
            case 'Insights':
              IconComponent = Insights;
              break;
          }

          return <IconComponent width={60} height={60} />;
        },
      })}
    >
      <Tab.Screen name="Plan" component={PlanStack} />
      <Tab.Screen name="Focus" component={DeepWorkScreen2} />
      <Tab.Screen name="Check-In" component={CheckInScreen1} />
      <Tab.Screen name="Reflect" component={DeepWorkSummary} />
      <Tab.Screen name="Insights" component={HabitTracker} />
    </Tab.Navigator>
  );
}

/**
 * Main App Component
 */
export default function App() {
  return (
    <PaperProvider theme={DefaultTheme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <LinearGradient colors={['#55355F', '#C97C76', '#FECE7D']} style={styles.background}>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="HomeTabs" component={BottomTabs} />
              <Stack.Screen name="DeepScreen1" component={DeepWorkScreen1} />
              <Stack.Screen name="DeepScreen2" component={DeepWorkScreen2} />
              <Stack.Screen name="DeepWorkScreen3" component={DeepWorkCompleteScreen} />
              <Stack.Screen name="DeepWorkScreen4" component={DeepWorkSummary} />
            </Stack.Navigator>
          </NavigationContainer>
        </LinearGradient>
      </GestureHandlerRootView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
});
