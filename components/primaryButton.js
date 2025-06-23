import { View, Text, StyleSheet, Pressable, Platform, Animated, Easing } from "react-native";
import React, { useRef, useEffect, useState } from "react";

function PrimaryButton({
  text = "START DEEP WORK",
  timerText = "00:00:00",
  isRunning = false,
  isPaused = false,
  isDragging = false,
  onTap,
  onLongPress,
  onLongPressEnd,
}) {
  // phase: 'timer', 'pause', 'end'
  const [phase, setPhase] = useState('timer');
  const [containerWidth, setContainerWidth] = useState(0);
  const [textWidth, setTextWidth] = useState(0);
  const marqueeAnim = useRef(new Animated.Value(0)).current;
  // Heartbeat animation value
  const heartbeatAnim = useRef(new Animated.Value(1)).current;
  // Pressed state animation value
  const pressAnim = useRef(new Animated.Value(1)).current;
  const [isPressed, setIsPressed] = useState(false);
  // Use ref for long press timeout
  const longPressTimeout = useRef();

  // Custom display cycle: 8s timer, 1s pause, 2s end
  useEffect(() => {
    let isMounted = true;
    let timeout1, timeout2, timeout3;

    function startCycle() {
      setPhase('timer');
      timeout1 = setTimeout(() => {
        if (!isMounted) return;
        setPhase('pause');
        timeout2 = setTimeout(() => {
          if (!isMounted) return;
          setPhase('end');
          timeout3 = setTimeout(() => {
            if (!isMounted) return;
            startCycle(); // repeat
          }, 2000); // 2s for 'end'
        }, 1000); // 1s for 'pause'
      }, 8000); // 8s for timer
    }

    startCycle(); // Always run the alternation cycle
    return () => {
      isMounted = false;
      if (timeout1) clearTimeout(timeout1);
      if (timeout2) clearTimeout(timeout2);
      if (timeout3) clearTimeout(timeout3);
    };
  }, [isRunning, isPaused]);

  // Marquee animation effect
  useEffect(() => {
    let marqueeLoop;
    if (textWidth > 0.4 * containerWidth && containerWidth > 0) {
      const distance = Math.max(0, textWidth - containerWidth + 24); // 24 for padding
      const duration = Math.max(3000, distance * 20); // readable pace
      marqueeAnim.setValue(0);
      marqueeLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(marqueeAnim, {
            toValue: -distance,
            duration,
            useNativeDriver: true,
            easing: Easing.linear,
          }),
          Animated.timing(marqueeAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.delay(800), // pause at start
        ])
      );
      marqueeLoop.start();
    } else {
      marqueeAnim.setValue(0);
    }
    return () => {
      if (marqueeLoop) marqueeLoop.stop();
    };
  }, [textWidth, containerWidth, phase, isRunning, isPaused]);

  // Heartbeat animation effect
  useEffect(() => {
    let heartbeatLoop;
    if (isRunning && !isPaused) {
      // Heartbeat: scale up, down, then pause (mimics heart)
      const beat = Animated.sequence([
        Animated.timing(heartbeatAnim, {
          toValue: 1.01,
          duration: 120,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(heartbeatAnim, {
          toValue: 0.97,
          duration: 120,
          useNativeDriver: true,
          easing: Easing.in(Easing.ease),
        }),
        Animated.timing(heartbeatAnim, {
          toValue: 1,
          duration: 160,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.delay(400), // pause between beats
      ]);
      heartbeatLoop = Animated.loop(beat);
      heartbeatLoop.start();
    } else {
      heartbeatAnim.setValue(1);
    }
    return () => {
      if (heartbeatLoop) heartbeatLoop.stop();
      heartbeatAnim.setValue(1);
    };
  }, [isRunning, isPaused]);

  // Animate press in/out for scale and opacity
  const handlePressIn = (e) => {
    setIsPressed(true);
    Animated.timing(pressAnim, {
      toValue: 1.05,
      duration: 80,
      useNativeDriver: true,
    }).start();
    // Long press logic
    longPressTimeout.current = setTimeout(() => {
      if (onLongPress) onLongPress();
    }, 3000);
  };
  const handlePressOut = (e) => {
    setIsPressed(false);
    Animated.timing(pressAnim, {
      toValue: 1,
      duration: 80,
      useNativeDriver: true,
    }).start();
    clearTimeout(longPressTimeout.current);
    if (onLongPressEnd) onLongPressEnd();
  };

  // Combine heartbeat and press scale
  const combinedScale = Animated.multiply(heartbeatAnim, pressAnim);
  // Opacity for iOS feedback
  const buttonOpacity = Platform.OS === 'ios' && isPressed ? 0.7 : 1;

  // Determine what text to display
  const getDisplayText = () => {
    if (isRunning || isPaused) {
      if (phase === 'timer') return timerText;
      if (phase === 'pause') return 'TAP TO PAUSE';
      if (phase === 'end') return 'LONG PRESS TO END';
    } else if (isDragging) {
      return timerText;
    } else {
      return text;
    }
  };
  const displayText = getDisplayText();

  return (
    <View style={styles.outerWrapper}>
      <Animated.View style={{ transform: [{ scale: pressAnim }] }}>
        <Pressable
          onPress={onTap}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          android_ripple={{ color: '#ffe5dc' }}
        >
          <Animated.View style={[styles.button, { transform: [{ scale: heartbeatAnim }], opacity: buttonOpacity }]}> 
            <View style={styles.textContainer} onLayout={e => setContainerWidth(e.nativeEvent.layout.width)}>
              {/* Hidden text for measurement, always rendered */}
              <Text
                style={[styles.buttonText, { position: 'absolute', opacity: 0, zIndex: -1 }]}
                numberOfLines={1}
                onLayout={e => setTextWidth(e.nativeEvent.layout.width)}
              >
                {displayText}
              </Text>
              {textWidth > 0.4 * containerWidth && containerWidth > 0 ? (
                <Animated.Text
                  style={[
                    styles.buttonText,
                    { transform: [{ translateX: marqueeAnim }] }
                  ]}
                >
                  {displayText}
                </Animated.Text>
              ) : (
                <Text
                  style={styles.buttonText}
                  numberOfLines={1}
                  ellipsizeMode='tail'
                >
                  {displayText}
                </Text>
              )}
            </View>
          </Animated.View>
        </Pressable>
      </Animated.View>
    </View>
  );
}

export default PrimaryButton;

const styles = StyleSheet.create({
  outerWrapper: {
    borderRadius: 50,
    overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
    position: 'absolute',
    bottom: 10,
    maxWidth: '60%',
    minWidth: '60%',
    alignSelf: 'center',
    
  },
  button: {
    backgroundColor: '#F67F69',
    paddingVertical: 12,
    paddingHorizontal: 3,
    borderRadius: 50,
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 1, 
  },
  textContainer: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
   
    flexDirection: 'row',
    height: 28, 
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '600',
    fontSize: 22,
    height: 28,
    lineHeight: 28,
    
  },
});
