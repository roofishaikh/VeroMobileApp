import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = StyleSheet.create({
  leftPileContainer: {
    position: 'absolute',
    left: 20,
    top: '63%',
    transform: [{ translateY: -50 }],
    alignItems: 'center',
    zIndex: 10,
  },
  rightPileContainer: {
    position: 'absolute',
    right: 20,
    top: '63%',
    transform: [{ translateY: -50 }],
    alignItems: 'center',
    zIndex: 10,
  },
  pileIcon: {
    width: SCREEN_WIDTH < 400 ? 36 : 50,
    height: SCREEN_WIDTH < 400 ? 36 : 50,
    backgroundColor: '#fff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pileCounter: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  pileLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

const CardPilesRL = ({
  leftPile,
  rightPile,
  leftPileScale,
  rightPileScale,
  leftColor = '#4CAF50',
  rightColor = '#2196F3',
  leftLabel = 'Left Pile',
  rightLabel = 'Right Pile',
}) => {
  return (
    <>
      {/* Left Pile */}
      <View style={styles.leftPileContainer}>
        <Animated.View style={[styles.pileIcon, { transform: [{ scale: leftPileScale }] }]}> 
          <MaterialIcons name="layers" size={24} color={leftColor} />
        </Animated.View>
        <Text style={styles.pileCounter}>{leftPile.length}</Text>
        {/* {leftLabel ? <Text style={styles.pileLabel}>{leftLabel}</Text> : null} */}
      </View>
      {/* Right Pile */}
      <View style={styles.rightPileContainer}>
        <Animated.View style={[styles.pileIcon, { transform: [{ scale: rightPileScale }] }]}> 
          <MaterialIcons name="layers" size={24} color={rightColor} />
        </Animated.View>
        <Text style={styles.pileCounter}>{rightPile.length}</Text>
        {/* {rightLabel ? <Text style={styles.pileLabel}>{rightLabel}</Text> : null} */}
      </View>
    </>
  );
};

export default CardPilesRL; 