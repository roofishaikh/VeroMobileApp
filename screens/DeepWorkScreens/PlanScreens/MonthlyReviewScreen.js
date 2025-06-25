import React, { useState, useRef } from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import GradientScreenWrapper from "../../../components/GradientScreenWrapper";
import TimeTimer from "../../../components/TimeTimer";
import PrimaryButton from "../../../components/primaryButton";
import Screen1QuesionsCard from "../../../components/Screen1QuestiosCard";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

function MonthlyReviewScreen() { 
  const title = 'plan to rise and shine';
  const questions = [
    '1. What am I grateful for today?',
    '2. What am I avoiding?',
    '3. What am I excieted about today?',
    '4. What is one thing i must accomplish today?',
  ];

  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [buttonText, setButtonText] = useState("START JOURNALING");
  const [timerText, setTimerText] = useState("10:00");
  const timerRef = useRef(null);

  const handleButtonPress = () => {
    if (!isTimerRunning) {
      // Start the timer
      timerRef.current?.start();
      setIsTimerRunning(true);
      setButtonText("END JOURNALING");
    } else {
      // Stop the timer
      timerRef.current?.reset();
      setIsTimerRunning(false);
      setButtonText("START JOURNALING");
    }
  };

  const handleTimerEnd = () => {
    setIsTimerRunning(false);
    setButtonText("START JOURNALING");
  };

  const handleTimerTick = (secondsLeft) => {
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    setTimerText(`${minutes}:${seconds.toString().padStart(2, '0')}`);
  };

  return (
    <GradientScreenWrapper>
      <View style={styles.container}>
        <Screen1QuesionsCard title={title} questions={questions} />
        <View style={styles.timerWrapper}>
          <TimeTimer 
            ref={timerRef}
            initialMinutes={10}
            onEnd={handleTimerEnd}
            onTick={handleTimerTick}
            locked={true}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <PrimaryButton 
            text={buttonText}
            timerText={timerText}
            onTap={handleButtonPress}
            isRunning={isTimerRunning}
            isPaused={false}
            isDragging={false}
          />
        </View>
      </View>
    </GradientScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  timerWrapper: {
    position: 'absolute',
    top: SCREEN_HEIGHT < 900 ? 500 : 565,
    alignItems: 'center',
    alignSelf: 'center',
    flex: 1,
  },
  buttonWrapper: {
    position: "absolute",
    bottom: 100,
    alignSelf: "baseline",
    width: "100%",
  },
});

export default MonthlyReviewScreen; 