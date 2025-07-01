import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Dimensions, Text, Animated } from "react-native";
import GradientScreenWrapper from "../../../components/GradientScreenWrapper";
import TimeTimer from "../../../components/TimeTimer";
import PrimaryButton from "../../../components/primaryButton";
import CountdownTimer from "../../../components/CountdownTimer";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

function WeeklyReviewScreen() { 
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isAutoSwipeEnabled, setIsAutoSwipeEnabled] = useState(true);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [buttonText, setButtonText] = useState("START JOURNALING");
  const [timerText, setTimerText] = useState("10:00");
  const timerRef = useRef(null);
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const [activeTimerIndex, setActiveTimerIndex] = useState(0);
  const [fallbackTimerKey, setFallbackTimerKey] = useState(0);
  
  // Define the card deck with 4 cards, each with unique questions
  const cards = [
    {
      title: 'Align',
      questions: [
        '1. What am I grateful for today?',
        '2. What am I avoiding?',
        '3. What am I excited about today?',
      ],
    },
    {
      title: 'Reflect',
      questions: [
        '1. What did I learn this week?',
        '2. What challenged me?',
        '3. What am I proud of?',
      ],
    },
    {
      title: 'Organize',
      questions: [
        '1. What are my top priorities for next week?',
        '2. What can I delegate or defer?',
        '3. What habits do I want to improve?',
      ],
    },
    {
      title: 'Commit',
      questions: [
        '1. What am I committing to change?',
        '2. What support do I need?',
        '3. What will success look like?',
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

  const handleTimerComplete = (timerIndex) => {
    // Move to next timer
    const nextTimerIndex = (timerIndex + 1) % timerDurations.length;
    setActiveTimerIndex(nextTimerIndex);
    
    // Move to next card
    const nextCardIndex = (currentCardIndex + 1) % cards.length;
    setCurrentCardIndex(nextCardIndex);
    
    // Reset fallback timer to sync with next timer
    setFallbackTimerKey(prev => prev + 1);
  };

  const handleFallbackTimerComplete = () => {
    // Fallback timer completed, trigger next timer
    handleTimerComplete(activeTimerIndex);
  };

  // Get the current card data
  const currentCard = cards[currentCardIndex];

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
              isActive={index === activeTimerIndex}
              onComplete={() => handleTimerComplete(index)}
              colorIndex={index}
              showSeconds={false}
            />
          ))}
          
          {/* Fallback Timer */}
          <CountdownTimer
            key={`fallback-${fallbackTimerKey}`}
            duration={timerDurations[activeTimerIndex]}
            isActive={true}
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
    paddingHorizontal: 20,
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

export default WeeklyReviewScreen; 