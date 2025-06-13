import React, { useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import PrimaryButton from "../../components/primaryButton";
import CardStack from "../../components/CardStack";
import Timer from "../../components/timer";

import SetTime from "../../components/SetTimer";

function Screen2() {
  const [duration, setDuration] = useState(25 * 60); // default 25 min
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showStopwatchCard, setShowStopwatchCard] = useState(false);
  const [showSetTimeCard, setShowSetTimeCard] = useState(false);

  const handleStartStop = () => {
    if (!isTimerRunning) {
      setShowStopwatchCard(false);
    }
    setIsTimerRunning((prev) => !prev);
  };

  const handleTimeSet = (min) => {
    setDuration(min * 60);
    setShowSetTimeCard(false);
  };

  return (
    <View style={styles.screen}>
      <CardStack />

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

      {/* Time Picker Card */}
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
    </View>
  );
}

export default Screen2;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 10,
  },
  timerWrapper: {
    marginTop: 10,
    marginBottom: 140,
    alignItems: 'center',
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 160,
    alignSelf: 'center',
    width: '70%',
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
