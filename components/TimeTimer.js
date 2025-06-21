import React, { useRef, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, PanResponder, Pressable, Animated, Dimensions } from 'react-native';
import Svg, { Path, Circle, Line, Text as SvgText } from 'react-native-svg';
import { MaterialIcons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TIMER_SIZE = Math.min(Math.max(SCREEN_WIDTH * 0.42, 150), 140); // Restore original size
const STROKE_WIDTH = Math.max(5, Math.round(TIMER_SIZE * 0.06));
const RADIUS = (TIMER_SIZE - STROKE_WIDTH) / 2 - 4; // Reduce radius by 24px
const CENTER = TIMER_SIZE / 2;
const MINUTES_MAX = 60;
const DEGREES_PER_MINUTE = 360 / MINUTES_MAX;
const OUTER_PADDING = 30; // Add extra space for numbers
const OUTER_SIZE = TIMER_SIZE + OUTER_PADDING * 2;

// Simplified arc function for timer display
function createTimerArc(x, y, radius, progress) {
  // progress should be 0 to 1 (0 = empty, 1 = full)
  // For timer: we want to show remaining time, so we start full and shrink
  
  if (progress <= 0) {
    return ''; // No arc when timer is done
  }
  
  if (progress >= 1) {
    // Full circle - create a complete pie slice
    const startRad = -Math.PI / 2; // Top
    const endRad = startRad + (2 * Math.PI); // Full circle
    
    const startX = x + radius * Math.cos(startRad);
    const startY = y + radius * Math.sin(startRad);
    const endX = x + radius * Math.cos(endRad);
    const endY = y + radius * Math.sin(endRad);
    
    return `M ${x} ${y} L ${startX} ${startY} A ${radius} ${radius} 0 1 1 ${endX} ${endY} Z`;
  }
  
  // Calculate the end angle (remaining time)
  const endAngle = progress * 360;
  
  // Convert to radians, starting from top (12 o'clock)
  const startRad = -Math.PI / 2; // Top
  const endRad = startRad + (endAngle * Math.PI / 180);
  
  // Calculate points
  const startX = x + radius * Math.cos(startRad);
  const startY = y + radius * Math.sin(startRad);
  const endX = x + radius * Math.cos(endRad);
  const endY = y + radius * Math.sin(endRad);
  
  // Determine if we need large arc flag
  const largeArcFlag = endAngle > 180 ? 1 : 0;
  
  // Create the pie slice path (filled sector)
  return `M ${x} ${y} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
}

// Helper to render tick marks
const renderTicks = () => {
  const ticks = [];
  for (let i = 0; i < 60; i += 1) {
    const angle = (i * 6 - 90) * (Math.PI / 180);
    let tickLength, tickColor, tickWidth;
    if (i % 15 === 0) {
      // Hour bar (0, 15, 30, 45)
      tickLength = 12;
      tickColor = '#000000'; // Black for hour bars
      tickWidth = 2;
    } else if (i % 5 === 0) {
      // 5-minute bar
      tickLength = 12;
      tickColor = '#000000'; // Black for hour bars
      tickWidth = 2;
    } else {
      // Minute bar
      tickLength = 8;
      tickColor = '#CCC';
      tickWidth = 1;
    }
    // All ticks should touch the circumference of the timer circle
    const outerR = RADIUS + STROKE_WIDTH / 10; // Circumference of timer
    const innerR = outerR + tickLength;
    const x1 = CENTER + OUTER_PADDING + outerR * Math.cos(angle);
    const y1 = CENTER + OUTER_PADDING + outerR * Math.sin(angle);
    const x2 = CENTER + OUTER_PADDING + innerR * Math.cos(angle);
    const y2 = CENTER + OUTER_PADDING + innerR * Math.sin(angle);
    ticks.push(
      <Line
        key={`tick-${i}`}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={tickColor}
        strokeWidth={tickWidth}
      />
    );
  }
  return ticks;
};

// Helper to render numbers
const renderNumbers = () => {
  const numbers = [];
  for (let i = 0; i < 60; i += 5) {
    const angle = (i * 6 - 90) * (Math.PI / 180);
    const num = i === 0 ? '0' : String(i);
    const numR = RADIUS + STROKE_WIDTH / 2 + 23; // Place numbers just outside the timer
    const nx = CENTER + OUTER_PADDING + numR * Math.cos(angle);
    const ny = CENTER + OUTER_PADDING + numR * Math.sin(angle) + 5;
    numbers.push(
      <SvgText
        key={`num-${i}`}
        x={nx}
        y={ny}
        fontSize={13}
        fontWeight="bold"
        fill="#222"
        textAnchor="middle"
      >
        {num}
      </SvgText>
    );
  }
  return numbers;
};

const TimeTimer = () => {
  const [totalMinutes, setTotalMinutes] = useState(25);
  const [minutesLeft, setMinutesLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragAngle, setDragAngle] = useState(null);
  const [previewMinutes, setPreviewMinutes] = useState(null);
  const [setAngle, setSetAngle] = useState(null); // Store the angle where time was set
  const intervalRef = useRef(null);
  const svgRef = useRef(null);
  
  // Use refs to store drag values that persist during release
  const dragAngleRef = useRef(null);
  const previewMinutesRef = useRef(null);

  // Memoized drag handler to prevent recreation on every render
  const handleDrag = useCallback((nativeEvent) => {
    const { locationX, locationY } = nativeEvent;
    // Calculate position relative to the center of the timer
    const dx = locationX - CENTER;
    const dy = locationY - CENTER;
    // Calculate angle from center (0 degrees at top, clockwise)
    let angle = Math.atan2(dx, -dy) * (180 / Math.PI);
    if (angle < 0) angle += 360;
    // Snap angle to nearest minute bar (6 degrees per minute)
    const snappedAngle = Math.round(angle / DEGREES_PER_MINUTE) * DEGREES_PER_MINUTE;
    // Ensure angle is within valid range (0-360)
    const clampedAngle = Math.max(0, Math.min(360, snappedAngle));
    setDragAngle(clampedAngle);
    dragAngleRef.current = clampedAngle;
    // Snap minutes to nearest bar (1-60)
    const minutes = Math.max(1, Math.round((clampedAngle / 360) * MINUTES_MAX));
    setPreviewMinutes(minutes);
    previewMinutesRef.current = minutes;
  }, []);

  // Timer countdown effect (minutes only)
  useEffect(() => {
    if (isRunning && minutesLeft > 0) {
      intervalRef.current = setInterval(() => {
        setMinutesLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 60000); // 1 minute interval
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, minutesLeft]);

  // Calculate progress and arc (minutes only)
  const progress = minutesLeft / totalMinutes;
  
  // Use drag angle when dragging, set angle when not dragging but time was set by drag, otherwise use progress
  let currentProgress;
  if (isDragging && dragAngle !== null) {
    currentProgress = dragAngle / 360;
  } else if (setAngle !== null) {
    // Calculate progress based on the set angle and remaining time
    const setProgress = setAngle / 360;
    const remainingProgress = progress * setProgress;
    currentProgress = remainingProgress;
  } else {
    currentProgress = progress;
  }
  
  // Create the arc path (centered with OUTER_PADDING)
  const arcPath = createTimerArc(CENTER + OUTER_PADDING, CENTER + OUTER_PADDING, RADIUS, currentProgress);

  // Drag to set time - improved pan responder
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        setIsDragging(true);
        handleDrag(evt.nativeEvent);
      },
      onPanResponderMove: (evt, gestureState) => {
        handleDrag(evt.nativeEvent);
      },
      onPanResponderRelease: (evt, gestureState) => {
        setIsDragging(false);
        // Use ref values instead of state values
        if (dragAngleRef.current !== null && previewMinutesRef.current !== null) {
          setTotalMinutes(previewMinutesRef.current);
          setMinutesLeft(previewMinutesRef.current);
          // Store the angle where the time was set
          setSetAngle(dragAngleRef.current);
          // Start the timer automatically
          setIsRunning(true);
        }
        setPreviewMinutes(null);
        setDragAngle(null);
        dragAngleRef.current = null;
        previewMinutesRef.current = null;
      },
      onPanResponderTerminate: () => {
        setIsDragging(false);
        setPreviewMinutes(null);
        setDragAngle(null);
        dragAngleRef.current = null;
        previewMinutesRef.current = null;
      },
    })
  ).current;

  // Timer display (minutes only)
  const displayMinutes = isDragging && previewMinutes !== null
    ? previewMinutes
    : minutesLeft;

  // Debug logging (remove in production)
  useEffect(() => {
    console.log('Timer State:', {
      totalMinutes,
      minutesLeft,
      isRunning,
      isDragging,
      setAngle: setAngle?.toFixed(2),
      progress: progress.toFixed(2),
      currentProgress: currentProgress.toFixed(2)
    });
  }, [totalMinutes, minutesLeft, isRunning, isDragging, setAngle, progress, currentProgress]);

  return (
    <View style={styles.container}>
      <View style={styles.svgWrapper} {...panResponder.panHandlers}>
        <Svg width={OUTER_SIZE} height={OUTER_SIZE} ref={svgRef}>
          {/* Background circle (no border, maximized) */}
          <Circle
            cx={CENTER + OUTER_PADDING}
            cy={CENTER + OUTER_PADDING}
            r={TIMER_SIZE / 2 - 7}
            fill="#fff"
          />
          {/* Tick marks (bars) */}
          {renderTicks()}
          {/* Numbers */}
          {renderNumbers()}
          {/* Red arc */}
          {arcPath && arcPath.length > 0 && (
            <Path
              d={arcPath}
              fill="#FF0000"
              stroke="#FF0000"
              strokeWidth={2}
            />
          )}
          {/* Center dot */}
          <Circle
            cx={CENTER + OUTER_PADDING}
            cy={CENTER + OUTER_PADDING}
            r={8}
            fill="#F45B47"
          />
        </Svg>
        {/* Timer value in center */}
        <View style={[styles.centerText, { left: OUTER_PADDING, right: OUTER_PADDING }]} pointerEvents="none">
          {/* <Text style={styles.timerValue}>
            {displayMinutes.toString().padStart(2, '0')}:{displaySeconds.toString().padStart(2, '0')}
          </Text> */}
          <Text style={styles.timerLabel}>{isRunning ? 'RUNNING' : isDragging ? 'SET TIME' : 'READY'}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: OUTER_SIZE + 30,
    // borderColor: 'black',
    // borderWidth: 1,
    position: 'absolute',
    top: Dimensions.get("window").height > 900 ? -10 : -30,
  
  },
  svgWrapper: {
    width: OUTER_SIZE,
    height: OUTER_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    // borderColor: 'red',
    // borderWidth: 1,
    borderRadius: OUTER_SIZE / 2 ,
  },
  centerText: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerValue: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#222',
    
  },
  timerLabel: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
    
  },
});

export default TimeTimer; 