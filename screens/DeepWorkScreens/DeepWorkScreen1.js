import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import PrimaryButton from "../../components/primaryButton";
import Timer from "../../components/timer";
import GradientScreenWrapper from "../../components/GradientScreenWrapper";
import SetTime from "../../components/SetTimer";
import Screen1QuestiosCard from "../../components/Screen1QuestiosCard";



const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

 function DeepWorkScreen1({navigation}) {
  const [duration, setDuration] = useState(5 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showStopwatchCard, setShowStopwatchCard] = useState(false);
  const [showSetTimeCard, setShowSetTimeCard] = useState(false);

  const handleStartStop = () => {
    if (!isTimerRunning) setShowStopwatchCard(false);
    setIsTimerRunning((prev) => !prev);
    if (isTimerRunning) navigation.navigate('DeepScreen2')
  };

  const handleTimeSet = (min) => {
    setDuration(min * 60);
    setShowSetTimeCard(false);
  };

  return (
    <GradientScreenWrapper>
      <View style={styles.container}>
        <Screen1QuestiosCard />

        {/* Tapable Timer */}
        {!showStopwatchCard && !showSetTimeCard && (
          <TouchableOpacity onPress={() => setShowSetTimeCard(true)} activeOpacity={0.8}
           style={styles.timerWrapper}>
            <Timer
              duration={duration}
              isRunning={isTimerRunning}
              onComplete={() => {
                setIsTimerRunning(false);
                setShowStopwatchCard(true);
              }}
            />
          </TouchableOpacity>
        )}

        {/* Time Options */}
        {showSetTimeCard && (
          <View style={styles.setTimeWrapper}>
            <View style={styles.timeButtonsRow}>
              {[5, 10].map((min) => (
                <TouchableOpacity
                  key={min}
                  onPress={() => handleTimeSet(min)}
                  style={styles.timeButton}
                  activeOpacity={0.7}
                >
                  <Text style={styles.timeText}>{min} min</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Start/Stop Button */}
        <View style={styles.buttonWrapper}>
          <PrimaryButton onPress={handleStartStop}>
            {isTimerRunning ? "STOP" : "START"}
          </PrimaryButton>
        </View>
      </View>
    </GradientScreenWrapper>
  );
}

export default DeepWorkScreen1;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  timerWrapper: {
    position: 'absolute',
    top: SCREEN_HEIGHT < 900 ? 500 : 565 ,
    alignItems: 'center',
    alignSelf: 'center',
    // borderColor: '#000000',
    // borderWidth: 3,
    flex: 1,
  },
  buttonWrapper: {
    position: "absolute",
    bottom: 100,
    alignSelf: "baseline",
    width: "100%",
  },
  setTimeWrapper: {
    marginTop: SCREEN_HEIGHT < 900 ? 550 : 615,
    width: "85%",
    alignSelf: "center",
    zIndex: 20,
    elevation: 10,
  },
  timeButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  timeButton: {
    backgroundColor: "#F67F69",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  timeText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
