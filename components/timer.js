import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { Dimensions, Platform } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const Timer = ({ duration, isRunning, onComplete, onPause, onResume, onReset }) => {
  const [secondsLeft, setSecondsLeft] = useState(duration);
  const [isPaused, setIsPaused] = useState(false);
  const [showControls, setShowControls] = useState(false);
  
  // Animation values
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setSecondsLeft(duration);
    setIsPaused(false);
    // Animate progress to 0 when duration changes
    Animated.timing(progressAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [duration]);

  useEffect(() => {
    if (!isRunning || secondsLeft === 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Animate completion
          Animated.sequence([
            Animated.timing(scaleAnim, {
              toValue: 1.1,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start();
          
          if (onComplete) onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  // Animate progress
  useEffect(() => {
    const progress = 1 - (secondsLeft / duration);
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [secondsLeft, duration]);

  // Pulse animation when running
  useEffect(() => {
    if (isRunning && !isPaused) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRunning, isPaused]);

  const progress = secondsLeft / duration;
  // Responsive timer size
  const size = Math.min(Math.max(SCREEN_WIDTH * 0.45, 140), 260); // 45% of width, min 140, max 260
  const strokeWidth = Math.max(6, Math.round(size * 0.04));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const displayMinutes = Math.floor(secondsLeft / 60);
  const displaySeconds = secondsLeft % 60;

  const handlePauseResume = () => {
    if (isPaused) {
      setIsPaused(false);
      if (onResume) onResume();
    } else {
      setIsPaused(true);
      if (onPause) onPause();
    }
  };

  const handleReset = () => {
    setSecondsLeft(duration);
    setIsPaused(false);
    if (onReset) onReset();
  };

  const getProgressColor = () => {
    if (progress > 0.6) return '#4CAF50'; // Green
    if (progress > 0.3) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };

  return (
    <View style={styles.container}>
      <Pressable 
        onPress={() => setShowControls(!showControls)}
        style={styles.timerPressable}
      >
        <Animated.View style={[styles.timerContainer, { transform: [{ scale: pulseAnim }] }]}>
          <Svg width={size} height={size}>
            {/* Background circle */}
            <Circle
              stroke="#F5F5F5"
              fill="transparent"
              cx={size / 2}
              cy={size / 2}
              r={radius}
              strokeWidth={strokeWidth}
            />
            {/* Progress circle */}
            <Circle
              stroke={getProgressColor()}
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
            {/* Center dot */}
            <Circle
              fill={getProgressColor()}
              cx={size / 2}
              cy={size / 2}
              r={4}
            />
          </Svg>
          
          <View style={styles.centerText}>
            <Text style={[styles.timerValue, { color: getProgressColor() }]}>
              {displayMinutes.toString().padStart(2, '0')}:
              {displaySeconds.toString().padStart(2, '0')}
            </Text>
            <Text style={styles.timerLabel}>
              {isPaused ? 'PAUSED' : isRunning ? 'WORKING' : 'READY'}
            </Text>
          </View>
        </Animated.View>
      </Pressable>

      {/* Timer Controls */}
      {showControls && (
        <Animated.View style={styles.controlsContainer}>
          <View style={styles.controlsRow}>
            <Pressable 
              onPress={handlePauseResume} 
              style={[styles.controlButton, styles.pauseButton]}
              disabled={secondsLeft === 0}
            >
              <MaterialIcons 
                name={isPaused ? "play-arrow" : "pause"} 
                size={24} 
                color="#fff" 
              />
            </Pressable>
            
            <Pressable 
              onPress={handleReset} 
              style={[styles.controlButton, styles.resetButton]}
            >
              <MaterialIcons name="refresh" size={24} color="#fff" />
            </Pressable>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

export default Timer;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginTop: Platform.select({
      ios: 0,
      android: 0,
    }),
  },
  timerPressable: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  centerText: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerValue: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  timerLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: -80,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  pauseButton: {
    backgroundColor: '#4CAF50',
  },
  resetButton: {
    backgroundColor: '#FF9800',
  },
});
