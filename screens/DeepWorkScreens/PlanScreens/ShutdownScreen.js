import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import GradientScreenWrapper from "../../../components/GradientScreenWrapper";
import TimeTimer from "../../../components/TimeTimer";
import PrimaryButton from "../../../components/primaryButton";
import Screen1QuesionsCard from "../../../components/Screen1QuestiosCard";
import * as SecureStore from 'expo-secure-store';
import CountdownTimer from "../../../components/CountdownTimer";
import { useNavigation } from '@react-navigation/native';


const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const HABIT_STORAGE_KEY = 'vero_habit_data';

async function markEveningRitualComplete() {
  const today = new Date().toISOString().slice(0, 10);
  let habitJson = await SecureStore.getItemAsync(HABIT_STORAGE_KEY);
  let habitObj = habitJson ? JSON.parse(habitJson) : {};
  if (!habitObj[today]) habitObj[today] = {};
  habitObj[today].evening = true;
  await SecureStore.setItemAsync(HABIT_STORAGE_KEY, JSON.stringify(habitObj));
}

function ShutdownScreen() {
  const title = 'Evening Rituals';
  const questions = [
    '1. What am I grateful for today?',
    '2. How can I improve?',
    '3. What did I learn today?',
    '4. Did I give my best today?',
  ];

  const [timerRunning, setTimerRunning] = useState(true);
  const [timerKey, setTimerKey] = useState(0);
  const timerRef = useRef();
  const navigation = useNavigation();

  async function markEveningRitualComplete() {
    const today = new Date().toISOString().slice(0, 10);
    let habitJson = await SecureStore.getItemAsync(HABIT_STORAGE_KEY);
    let habitObj = habitJson ? JSON.parse(habitJson) : {};
    if (!habitObj[today]) habitObj[today] = {};
    habitObj[today].evening = true;
    await SecureStore.setItemAsync(HABIT_STORAGE_KEY, JSON.stringify(habitObj));
  }

  useEffect(() => {
    setTimerRunning(true);
    setTimerKey(prev => prev + 1);
  }, []);

  const handleTimerComplete = async () => {
    setTimerRunning(false);
    await markEveningRitualComplete();
  };

  return (
    <GradientScreenWrapper>
      <View style={styles.container}>
        <Screen1QuesionsCard title={title} questions={questions} />
        <View style={styles.timerWrapper}>
          <CountdownTimer
            key={timerKey}
            ref={timerRef}
            duration={4}
            isActive={timerRunning}
            onComplete={handleTimerComplete}
            colorIndex={0}
            showSeconds={true}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <PrimaryButton
            text="END RITUAL"
            onTap={() => navigation.navigate('Insights')}
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

export default ShutdownScreen; 