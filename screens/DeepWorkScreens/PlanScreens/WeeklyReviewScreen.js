import React from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import GradientScreenWrapper from "../../../components/GradientScreenWrapper";
import TimeTimer from "../../../components/TimeTimer";
import PrimaryButton from "../../../components/primaryButton";
import Screen1QuesionsCard from "../../../components/Screen1QuestiosCard";


const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

function WeeklyReviewScreen() { const title = 'plan to rise and shine';
  const questions = [
    '1. What am I grateful for today?',
    '2. What am I avoiding?',
    '3. What am I excieted about today?',
    '4. What is one thing i must accomplish today?',
  ];

  return (
    <GradientScreenWrapper>
      <View style={styles.container}>
        <Screen1QuesionsCard title={title} questions={questions} />
        <View style={styles.timerWrapper}>
          <TimeTimer />
        </View>
        <View style={styles.buttonWrapper}>
          <PrimaryButton onPress={() => console.log('Finish Journaling pressed')}>
            FINISH JOURNALING
          </PrimaryButton>
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

export default WeeklyReviewScreen; 