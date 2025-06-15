import React, { useState, useCallback } from "react";
import { Text, View, StyleSheet, Pressable, Dimensions } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import PrimaryButton from "../../components/primaryButton";
import Screen1QuestiosCard from "../../components/Screen1QuestiosCard";
import OutterContainer from "../../components/OutterContainer";
import GradientScreenWrapper from "../../components/GradientScreenWrapper";
import Timer from "../../components/timer";

export default function Screen1({ navigation }) {
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  function startTimer(minutes) {
    setSelectedDuration(minutes * 60);
    setIsTimerRunning(true);
    setIsPaused(false);
  }

  function pauseAndNavigate() {
    setIsPaused(true);              // Pause timer
    setIsTimerRunning(false);       // Stop the timer
    navigation.navigate('Focus');
  }

  // When screen comes back into focus, reset UI
  useFocusEffect(
    useCallback(() => {
      // Reset all states when returning from another screen
      setIsTimerRunning(false);
      setIsPaused(false);
      setSelectedDuration(null);
    }, [])
  );

  return (
    <GradientScreenWrapper>
      <OutterContainer>
        <Text style={styles.titleText}>plan to rise and shine</Text>

        <Screen1QuestiosCard />

        {/* Show selection buttons before timer starts */}
        {!isTimerRunning && (
          <View style={styles.timerSetup}>
            <Text style={styles.timerPrompt}>Complete ritual in</Text>
            <View style={styles.buttonGroup}>
              <Pressable style={styles.timeButton} onPress={() => startTimer(5)}>
                <Text style={styles.timeText}>5 min</Text>
              </Pressable>
              <Pressable style={styles.timeButton} onPress={() => startTimer(10)}>
                <Text style={styles.timeText}>10 min</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Show timer only if running */}
        {isTimerRunning && (
          <View style={styles.timerWrapper}>
            <Timer
              duration={selectedDuration}
              isRunning={isTimerRunning}
              isPaused={isPaused}
            />
          </View>
        )}

        {/* Show button only if timer is running */}
        {isTimerRunning && (
          <PrimaryButton onPress={pauseAndNavigate}>
            COMPLETE RITUAL
          </PrimaryButton>
        )}
      </OutterContainer>
    </GradientScreenWrapper>
  );
}

const styles = StyleSheet.create({
  titleText: {
    fontWeight: "bold",
    fontSize: 24,
    color: "#ed9aed",
    marginBottom: 20,
  },
  timerSetup: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    position: "absolute",
    bottom: 80,
  },
  timerPrompt: {
    fontSize: 18,
    fontWeight: "500",
    color: "#444",
    marginBottom: 10,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  timeButton: {
    backgroundColor: "#F67F69",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  timeText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  timerWrapper: {
    alignItems: "center",
    marginVertical: 20,
    position: "absolute",
    bottom: 80,
  },
});
