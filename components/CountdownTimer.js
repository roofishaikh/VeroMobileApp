import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const CountdownTimer = ({ 
  duration = 4, 
  onComplete, 
  isActive = false, 
  size = 60,
  showSeconds = false 
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const progressAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isActive && !isRunning) {
      startTimer();
    } else if (!isActive && isRunning) {
      stopTimer();
    }
  }, [isActive]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startTimer = () => {
    setTimeLeft(duration);
    setIsRunning(true);
    
    // Start progress animation
    progressAnimation.setValue(1);
    Animated.timing(progressAnimation, {
      toValue: 0,
      duration: duration * 1000,
      useNativeDriver: false,
    }).start();

    intervalRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          if (onComplete) {
            onComplete();
          }
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsRunning(false);
    setTimeLeft(duration);
    progressAnimation.setValue(1);
  };

  const progressWidth = progressAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={[styles.timerBackground, { width: size, height: size }]}>
        <Animated.View 
          style={[
            styles.progressBar, 
            { 
              width: progressWidth,
              height: size,
            }
          ]} 
        />
        <View style={styles.timerContent}>
          {showSeconds ? (
            <Text style={styles.timerText}>{timeLeft}s</Text>
          ) : (
            <Text style={styles.timerText}>{timeLeft}</Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerBackground: {
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  progressBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: '#4CAF50',
    borderRadius: 28,
  },
  timerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  timerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default CountdownTimer; 