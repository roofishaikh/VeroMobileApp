import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Screen2 from './screens/DeepWorkScreens/Screen2';
import BottomNavBar from './components/BottomNavBar';
import Screen1 from './screens/DeepWorkScreens/Screen1';
import CheckInScreen1 from './screens/CheckInScreens/CheckInScreen1';
import CheckInScreen2 from './screens/CheckInScreens/CheckInScreen2';
import CheckInScreen3 from './screens/CheckInScreens/CheckInScreen3';
import CheckInScreen4 from './screens/CheckInScreens/CheckInScreen4';
import CheckInScreen5 from './screens/CheckInScreens/CheckInCompleteScreen5';
import DeepWorkSummary from './screens/DeepWorkScreens/DeepWorkSummary';
import DeepWorkComplete from './screens/DeepWorkScreens/DeepWorkCompleteScreen';
import HabitTracker from './screens/InsightsScreens/HabitTracker';


export default function App() {
  return (
    <LinearGradient
      colors={['#55355F', '#C97C76', '#FECE7D']}
      style={styles.background}
    >
       <View style={styles.screenWrapper}>
        <CheckInScreen2 />
      </View> 

      <View style={styles.bottomBarWrapper}>
        <BottomNavBar />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  
  bottomBarWrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 130, // same as your BottomNavBar height
  },
  screenWrapper:{

    flex: 1
  }
});
