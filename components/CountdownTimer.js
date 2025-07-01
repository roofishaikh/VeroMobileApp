import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';

const CountdownTimer = ({ 
  duration = 4, 
  onComplete, 
  isActive = false, 
  size = 60,
  showSeconds = false,
  colorIndex = 0, // 0: red, 1: blue, 2: green, 3: yellow, 4: purple
  isFallback = false // New prop to identify fallback timer
}) => {
  const [key, setKey] = useState(0);
  const [timeLeft, setTimeLeft] = useState(duration);

  // Define colors for each timer
  const colors = ['#F44336', '#2196F3', '#4CAF50', '#FFEB3B', '#9C27B0']; // red, blue, green, yellow, purple

  useEffect(() => {
    if (isActive) {
      // Reset the timer when it becomes active
      setKey(prevKey => prevKey + 1);
      setTimeLeft(duration);
    }
  }, [isActive, duration]);

  // Custom fallback timer logic
  useEffect(() => {
    if (isFallback && isActive) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isFallback, isActive, onComplete]);

  const formatTime = (remainingTime) => {
    if (showSeconds) {
      return `${remainingTime}s`;
    }
    return remainingTime.toString();
  };

  // Render fallback timer (simple grey background with time)
  if (isFallback) {
    return (
      <View style={[styles.container, { width: size, height: size }]}>
        <View style={[styles.fallbackTimer, { width: size, height: size }]}>
          <Text style={styles.fallbackTimerText}>
            {formatTime(timeLeft)}
          </Text>
        </View>
      </View>
    );
  }

  // Render regular countdown timer
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <CountdownCircleTimer
        key={key}
        isPlaying={isActive} // Only play when this timer is active
        duration={duration}
        colors={[colors[colorIndex]]} // Use single color based on index
        size={size}
        strokeWidth={4}
        onComplete={onComplete}
        trailColor="#f0f0f0"
        strokeLinecap="round"
      >
        {({ remainingTime }) => (
          <View style={styles.timerContent}>
            {showSeconds && (
              <Text style={styles.timerText}>
                {formatTime(remainingTime)}
              </Text>
            )}
          </View>
        )}
      </CountdownCircleTimer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  fallbackTimer: {
    backgroundColor: '#808080', // Grey background
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#666666',
  },
  fallbackTimerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text
  },
});

export default CountdownTimer; 