import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Dimensions, Text, Animated } from "react-native";
import GradientScreenWrapper from "../../../components/GradientScreenWrapper";
import TimeTimer from "../../../components/TimeTimer";
import PrimaryButton from "../../../components/primaryButton";
import CountdownTimer from "../../../components/CountdownTimer";
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

function MonthlyReviewScreen() { 
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isAutoSwipeEnabled, setIsAutoSwipeEnabled] = useState(true);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [buttonText, setButtonText] = useState("START JOURNALING");
  const [timerText, setTimerText] = useState("10:00");
  const timerRef = useRef(null);
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const [activeTimerIndex, setActiveTimerIndex] = useState(0);
  const [fallbackTimerKey, setFallbackTimerKey] = useState(0);
  const navigation = useNavigation();
  const [reviewComplete, setReviewComplete] = useState(false);
  
  // Define the card deck with 4 cards, each with unique questions
  const cards = [
    {
      title: 'Align: Quaterly goal check',
      questions: [
        '1. How are my quaterly quests going?',
        '2. Am I on track or off track? If off track, what can I do to get back on track?',
      ],
    },
    {
      title: 'Reflect: Weekly accountability check',
      questions: [
        '1. What went well this past week? Acknowledge the progress achieved(big or small)',
        '2. What did not go so well? What did I learn from it?',
        '3. In what ways i did not act in line with my intentions for last week?',
        '4. What would I like to change(if anything) next week?',
      ],
    },
    {
      title: 'Organise: Plan for the month ahead',
      questions: [
        '1. What are the key priorities and goals we need to focus on?',
        '2. How can we adjust to stay on track with our goals?',
        '3. What are the biggest risks or challanges we anticipate, and how can we prepare for them?',
      ],
    },
    {
      title: 'Organise: Plan for the week ahead',
      questions: [
        '1. Look ahead two weeks and create calendar blocks based on upcoming projects, meetings and personal events',
        '2. How can I prepare to have a joyful week?',
        '3. What three things would I like to accomplish in order to have the best possible week?',
      ],
    },
  ];

  // Timer durations for each card (in seconds)
  const timerDurations = [4, 4, 4, 4];

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

  // Get the current card data
  const currentCard = cards[currentCardIndex];

  // Set initial time to 10 minutes when component mounts
  React.useEffect(() => {
    if (timerRef.current) {
      // Set the timer to show 10 minutes on a 60-minute circle
      timerRef.current.setInitialAngle(10);
    }
    // Start the first countdown timer automatically when screen renders
    setIsTimerRunning(true);
    setActiveTimerIndex(0);
  }, []);

  // Handle countdown timer completion - triggers auto-swipe
  const handleCountdownComplete = () => {
    if (isAutoSwipeEnabled && isTimerRunning) {
      // Animate card swipe
      Animated.timing(slideAnimation, {
        toValue: -SCREEN_WIDTH,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        // Move to next card
        const nextCardIndex = (currentCardIndex + 1) % cards.length;
        setCurrentCardIndex(nextCardIndex);
        
        // Reset animation position
        slideAnimation.setValue(0);
      });
    }
  };

  // Add a function to mark monthly ritual complete
  async function markMonthlyRitualComplete() {
    const today = new Date().toISOString().slice(0, 10);
    let habitJson = await SecureStore.getItemAsync('vero_habit_data');
    let habitObj = habitJson ? JSON.parse(habitJson) : {};
    if (!habitObj[today]) habitObj[today] = {};
    habitObj[today]['monthly_ritual'] = true;
    await SecureStore.setItemAsync('vero_habit_data', JSON.stringify(habitObj));
  }

  // Add a function to reset state
  const resetMonthlyReview = () => {
    setCurrentCardIndex(0);
    setActiveTimerIndex(0);
    setFallbackTimerKey(prev => prev + 1); // force fallback timer to reset
    setIsTimerRunning(false);
    setButtonText("START JOURNALING");
    setReviewComplete(false);
  };

  // Update timer complete logic to match WeeklyReviewScreen
  const handleTimerComplete = async (timerIndex) => {
    // If this was the 4th timer (index 3), mark monthly ritual complete and navigate
    if (timerIndex === 3) {
      setReviewComplete(true);
      setIsTimerRunning(false);
      timerRef.current?.reset();
      await markMonthlyRitualComplete();
      navigation.navigate('Insights');
      resetMonthlyReview();
      return;
    }
    // Move to next timer (no looping)
    setActiveTimerIndex(timerIndex + 1);
    setCurrentCardIndex(currentCardIndex + 1);
    setFallbackTimerKey(prev => prev + 1);
  };

  const handleFallbackTimerComplete = () => {
    // Fallback timer completed, trigger next timer
    handleTimerComplete(activeTimerIndex);
  };

  return (
    <GradientScreenWrapper>
      <View style={styles.container}>
        {/* Self-Swiping Card */}
        <Animated.View 
          style={[
            styles.cardContainer,
            {
              transform: [{ translateX: slideAnimation }]
            }
          ]}
        >
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{currentCard.title}</Text>
            {currentCard.questions.map((question, index) => (
              <Text key={index} style={styles.question}>
                {question}
              </Text>
            ))}
          </View>
        </Animated.View>
        
        {/* Countdown Timer Row */}
        <View style={styles.timerRow}>
          {timerDurations.map((duration, index) => (
            <CountdownTimer
              key={`timer-${index}`}
              duration={duration}
              isActive={!reviewComplete && index === activeTimerIndex}
              onComplete={() => handleTimerComplete(index)}
              colorIndex={index}
              showSeconds={false}
            />
          ))}
          {/* Fallback Timer */}
          <CountdownTimer
            key={`fallback-${fallbackTimerKey}`}
            duration={timerDurations[activeTimerIndex]}
            isActive={!reviewComplete}
            onComplete={handleFallbackTimerComplete}
            isFallback={true}
            showSeconds={true}
          />
        </View>
        
        <View style={styles.timerWrapper}>
          <TimeTimer 
            ref={timerRef}
            initialMinutes={60}
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
  cardContainer: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    marginHorizontal: 20,
    width: SCREEN_WIDTH - 40,
    minHeight: 300,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  question: {
    fontSize: 18,
    color: '#555',
    marginBottom: 20,
    lineHeight: 26,
  },
  timerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 15,
    marginTop: 20,
    marginBottom: 20,
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