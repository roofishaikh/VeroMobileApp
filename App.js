// App.js
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';

// Screens
import DeepWorkScreen1 from './screens/DeepWorkScreens/DeepWorkScreen1';
import DeepWorkScreen2 from './screens/DeepWorkScreens/DeepWorkScreen2';
import CheckInScreen1 from './screens/CheckInScreens/CheckInScreen1';
import DeepWorkSummary from './screens/DeepWorkScreens/DeepWorkSummary';
import HabitTracker from './screens/InsightsScreens/HabitTracker';

// Icons
import Plan from './assets/icons/plan.svg';
import Focus from './assets/icons/focus.svg';
import Checkin from './assets/icons/checkin.svg';
import Reflect from './assets/icons/reflect.svg';
import Insights from './assets/icons/insights.svg';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <LinearGradient
      colors={['#55355F', '#C97C76', '#FECE7D']}
      style={styles.background}
    >
      <NavigationContainer>
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

              return <IconComponent width={60} height={60}/>;
            },
          })}
        >
          <Tab.Screen name="Plan" component={DeepWorkScreen1} />
          <Tab.Screen name="Focus" component={DeepWorkScreen2} />
          <Tab.Screen name="Check-In" component={CheckInScreen1} />
          <Tab.Screen name="Reflect" component={DeepWorkSummary} />
          <Tab.Screen name="Insights" component={HabitTracker} />
        </Tab.Navigator>
      </NavigationContainer>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
});
