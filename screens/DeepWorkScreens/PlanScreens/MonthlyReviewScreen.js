import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import GradientScreenWrapper from "../../../components/GradientScreenWrapper";
import TimeTimer from "../../../components/TimeTimer";
import PrimaryButton from "../../../components/primaryButton";
import SwipableQuestionCards from "../../../components/SwipableQuestionCards";
import CountdownTimer from "../../../components/CountdownTimer";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

function MonthlyReviewScreen() { 
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [activeTimerIndex, setActiveTimerIndex] = useState(0);
  const [isAutoSwipeEnabled, setIsAutoSwipeEnabled] = useState(true);
  
  // Define the card deck with 4 cards, each with unique questions
  const cards = [
    {
      title: 'Reflect',
      questions: [
        '1. What were my biggest achievements this month?',
        '2. What challenges did I overcome?',
        '3. What am I most grateful for?',
        '4. What did I learn about myself?',
      ],
    },
    {
      title: 'Analyze',
      questions: [
        '1. How did I perform against my goals?',
        '2. What habits served me well?',
        '3. What patterns emerged?',
        '4. Where did I struggle most?',
      ],
    },
    {
      title: 'Plan',
      questions: [
        '1. What are my top 3 priorities for next month?',
        '2. What new habits do I want to build?',
        '3. What do I need to let go of?',
        '4. How will I measure success?',
      ],
    },
    {
      title: 'Commit',
      questions: [
        '1. What am I committing to change?',
        '2. What support do I need?',
        '3. What will success look like?',
        '4. How will I stay accountable?',
      ],
    },
  ];

  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [buttonText, setButtonText] = useState("START JOURNALING");
  const [timerText, setTimerText] = useState("10:00");
  const timerRef = useRef(null);

  // Timer durations for each card (in seconds)
  const timerDurations = [4, 4, 4, 4];

  const handleButtonPress = () => {
    if (!isTimerRunning) {
      // Start the timer
      timerRef.current?.start();
      setIsTimerRunning(true);
      setButtonText("END JOURNALING");
      // Start the first countdown timer
      setActiveTimerIndex(0);
    } else {
      // Stop the timer
      timerRef.current?.reset();
      setIsTimerRunning(false);
      setButtonText("START JOURNALING");
      // Reset countdown timers
      setActiveTimerIndex(-1);
    }
  };

  const handleTimerEnd = () => {
    setIsTimerRunning(false);
    setButtonText("START JOURNALING");
    setActiveTimerIndex(-1);
  };

  const handleTimerTick = (secondsLeft) => {
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    setTimerText(`${minutes}:${seconds.toString().padStart(2, '0')}`);
  };

  // Handle countdown timer completion
  const handleCountdownComplete = (timerIndex) => {
    if (isAutoSwipeEnabled && isTimerRunning) {
      // Auto-swipe to next card
      const nextCardIndex = (currentCardIndex + 1) % cards.length;
      setCurrentCardIndex(nextCardIndex);
      
      // Start next timer
      const nextTimerIndex = (timerIndex + 1) % cards.length;
      setActiveTimerIndex(nextTimerIndex);
    }
  };

  // Set initial time to 10 minutes when component mounts
  React.useEffect(() => {
    if (timerRef.current) {
      // Set the timer to show 10 minutes on a 60-minute circle
      timerRef.current.setInitialAngle(10);
    }
  }, []);

  const handleCardChange = (newIndex) => {
    // Implement infinite swiping logic
    if (newIndex >= cards.length) {
      // If swiping past the last card, loop back to the first
      setCurrentCardIndex(0);
    } else if (newIndex < 0) {
      // If swiping before the first card, loop to the last
      setCurrentCardIndex(cards.length - 1);
    } else {
      setCurrentCardIndex(newIndex);
    }
  };

  // Get the current card data
  const currentCard = cards[currentCardIndex];

  return (
    <GradientScreenWrapper>
      <View style={styles.container}>
        <SwipableQuestionCards 
          title={currentCard.title} 
          questions={currentCard.questions}
          onCardChange={handleCardChange}
          currentIndex={currentCardIndex}
        />
        
        {/* Countdown Timer Row */}
        <View style={styles.timerRow}>
          {cards.map((_, index) => (
            <CountdownTimer
              key={index}
              duration={timerDurations[index]}
              onComplete={() => handleCountdownComplete(index)}
              isActive={isTimerRunning && activeTimerIndex === index}
              size={45}
            />
          ))}
          {/* Fallback Timer */}
          <CountdownTimer
            duration={timerDurations[currentCardIndex]}
            onComplete={() => handleCountdownComplete(currentCardIndex)}
            isActive={isTimerRunning && activeTimerIndex === currentCardIndex}
            size={45}
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