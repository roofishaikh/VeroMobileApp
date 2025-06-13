import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

// Import cleaned SVG icons
import Plan from '../assets/icons/plan.svg';
import Focus from '../assets/icons/focus.svg';
import Checkin from '../assets/icons/checkin.svg';
import Reflect from '../assets/icons/reflect.svg';
import Insights from '../assets/icons/insights.svg';
import Screen2 from '../screens/DeepWorkScreens/Screen2';

const navItems = [
  {  icon: Plan, onPress: () => {} }, //implement react-navigation - screen2
  {  icon: Focus, onPress: () => console.log('Focus') },
  {  icon: Checkin, onPress: () => console.log('Check-In') },
  {  icon: Reflect, onPress: () => console.log('Reflect') },
  {  icon: Insights, onPress: () => console.log('Insights') },
];

function BottomNavBar() {
  return (
    <View style={styles.bottomBar}>
      {navItems.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <Pressable key={index} onPress={item.onPress}>
            <View style={styles.navItem}>
              <IconComponent width={75} height={75} />
             
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

export default BottomNavBar;

const styles = StyleSheet.create({
  bottomBar: {
    width: '100%',
    height: 125,
    backgroundColor: '#fdfdfd',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 13,
    paddingTop: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: '600',
    color: '#333',
  },
  screenWrapper: {
    flex: 1,
  },
});
