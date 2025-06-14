import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Dimensions, Platform } from 'react-native';


const Timer = ({ duration, isRunning }) => {
  const [secondsLeft, setSecondsLeft] = useState(duration);

  useEffect(() => {
    setSecondsLeft(duration); // Reset on new duration
  }, [duration]);

  useEffect(() => {
    if (!isRunning || secondsLeft === 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  const progress = secondsLeft / duration;
  const size = 170;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const displayMinutes = Math.floor(secondsLeft / 60);
  const displaySeconds = secondsLeft % 60;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <Circle
          stroke="#FFF5DD"
          fill="#FFF5DD"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke="#F45B47"
          fill="transparent"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.centerText}>
        <Text style={styles.timerValue}>
          {displayMinutes.toString().padStart(2, '0')}:
          {displaySeconds.toString().padStart(2, '0')}
        </Text>
        <Text style={styles.timerLabel}>min</Text>
      </View>
    </View>
  );
};

export default Timer;
const { height: screenHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: 170,
    height: 170,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginTop: Platform.select({
      ios: screenHeight * 0.03,       // 8% from top on iOS
      android: screenHeight * 0.01,   // 4% from top on Android
    }),
    //backgroundColor: '#999', // Remove this in final unless debugging layout
  },
  centerText: {
    position: 'absolute',
    alignItems: 'center',
  },
  timerValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
  },
  timerLabel: {
    fontSize: 14,
    color: '#333',
    marginTop: 2,
  },
});
