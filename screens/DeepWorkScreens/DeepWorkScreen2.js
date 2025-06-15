import React, { useState } from "react";
import { View, StyleSheet, Pressable, Text, Dimensions } from "react-native";
import PrimaryButton from "../../components/primaryButton";
import Timer from "../../components/timer";
import GradientScreenWrapper from "../../components/GradientScreenWrapper";
import SetTime from "../../components/SetTimer";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { MaterialIcons } from "@expo/vector-icons";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

function Screen2() {
  const [duration, setDuration] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showStopwatchCard, setShowStopwatchCard] = useState(false);
  const [showSetTimeCard, setShowSetTimeCard] = useState(false);
  const [goals, setGoals] = useState([
    { id: 1, text: "Finish writing summary" },
    { id: 2, text: "Take 5 min break" },
    { id: 3, text: "Plan next session" },
  ]);
  const [nextId, setNextId] = useState(4);

  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);

  const handleSwiped = () => {
    setGoals((prev) => {
      const updated = [...prev];
      const [top] = updated.splice(0, 1);
      updated.push(top);
      return updated;
    });
    translateX.value = 0;
    rotate.value = 0;
  };

  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = event.translationX;
      rotate.value = event.translationX / 20;
    },
    onEnd: () => {
      if (Math.abs(translateX.value) > SWIPE_THRESHOLD) {
        const direction = translateX.value > 0 ? "right" : "left";
        translateX.value = withSpring(
          direction === "right" ? SCREEN_WIDTH : -SCREEN_WIDTH,
          { damping: 15, stiffness: 150 },
          () => runOnJS(handleSwiped)()
        );
      } else {
        translateX.value = withSpring(0);
        rotate.value = withSpring(0);
      }
    },
  });

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotateZ: `${rotate.value}deg` },
    ],
  }));

  const handleDelete = () => {
    setGoals((prev) => prev.slice(1));
  };

  const handleAdd = () => {
    setGoals((prev) => [...prev, { id: nextId, text: `New Goal ${nextId}` }]);
    setNextId((id) => id + 1);
  };

  const handleStartStop = () => {
    if (!isTimerRunning) setShowStopwatchCard(false);
    setIsTimerRunning((prev) => !prev);
  };

  const handleTimeSet = (min) => {
    setDuration(min * 60);
    setShowSetTimeCard(false);
  };

  return (
    <GradientScreenWrapper>
      <View style={styles.swipeZone}>
        {goals.map((goal, index) => {
          const isTop = index === 0;
          return (
            <PanGestureHandler
              key={goal.id}
              enabled={isTop}
              onGestureEvent={gestureHandler}
            >
              <Animated.View
                style={[styles.card, isTop && animatedCardStyle]}
              >
                <Text style={styles.cardText}>{goal.text}</Text>
                <View style={styles.iconRow}>
                  <Pressable onPress={handleDelete} style={styles.iconButton}>
                    <MaterialIcons name="delete" size={24} color="#F45B47" />
                  </Pressable>
                  <Pressable onPress={handleAdd} style={styles.iconButton}>
                    <MaterialIcons name="add" size={24} color="#4CAF50" />
                  </Pressable>
                </View>
              </Animated.View>
            </PanGestureHandler>
          );
        }).reverse()}
      </View>

      {/* Tapable Timer */}
      {!showStopwatchCard && !showSetTimeCard && (
        <Pressable onPress={() => setShowSetTimeCard(true)}>
          <View style={styles.timerWrapper}>
            <Timer
              duration={duration}
              isRunning={isTimerRunning}
              onComplete={() => {
                setIsTimerRunning(false);
                setShowStopwatchCard(true);
              }}
            />
          </View>
        </Pressable>
      )}

      {showSetTimeCard && (
        <View style={styles.setTimeWrapper}>
          <SetTime onSet={handleTimeSet} />
        </View>
      )}

      <View style={styles.buttonWrapper}>
        <PrimaryButton onPress={handleStartStop}>
          {isTimerRunning ? "STOP" : "START DEEP WORK"}
        </PrimaryButton>
      </View>
    </GradientScreenWrapper>
  );
}

export default Screen2;

const styles = StyleSheet.create({
  swipeZone: {
    
    width: SCREEN_WIDTH * 0.85,
    height: SCREEN_HEIGHT < 900 ? (SCREEN_HEIGHT * 0.50) : (SCREEN_HEIGHT * 0.55) ,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#000000',
    borderWidth: 1,
    alignSelf: "center",
    marginTop: 60,
    
  },
  card: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.85,
    height: SCREEN_HEIGHT < 900 ? (SCREEN_HEIGHT * 0.50) : (SCREEN_HEIGHT * 0.55) ,
    backgroundColor: '#FFF5E0',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
     borderColor: '#000000',
    borderWidth: 3,
  },
  cardText: {
    fontSize: 20,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    marginTop: 20,
    alignSelf: "center",
    position: "absolute",
    bottom: 10,
  },
  iconButton: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 30,
    elevation: 3,
  },
  timerWrapper: {
    position: 'absolute',
    top: SCREEN_HEIGHT < 900 ? 10 : -10 ,
    alignItems: 'center',
    alignSelf: 'center',
    // borderColor: '#000000',
    // borderWidth: 3,
    flex: 1,
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'baseline',
    width: '100%',
    
  },
  setTimeWrapper: {
    position: 'absolute',
    top: '35%',
    width: '85%',
    alignSelf: 'center',
    zIndex: 20,
    elevation: 10,
    
  },
});
