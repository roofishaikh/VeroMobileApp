import React, { useState, useEffect, useRef } from "react";
import ConfettiCannon from 'react-native-confetti-cannon';
import { View, StyleSheet, Pressable, Text, Dimensions, TextInput,
TouchableWithoutFeedback, Keyboard, ScrollView, Alert } from "react-native";
import PrimaryButton from "../../components/primaryButton";
import TimeTimer from '../../components/TimeTimer';
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
import { Checkbox, IconButton } from 'react-native-paper';
import { MaterialIcons } from "@expo/vector-icons";
import { initialGoals } from "../../Data/goalsData";
import * as SecureStore from 'expo-secure-store';
import DeckCardStack from '../../components/DeckCardStack';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

// Storage key for persisting goals data
const GOALS_STORAGE_KEY = 'vero_goals_data';

// Validation constants
const MAX_GOAL_TITLE_LENGTH = 100;
const MAX_SUBGOAL_LENGTH = 200;

// Validation functions
const validateGoalTitle = (title) => {
  if (!title.trim()) return "Goal title cannot be empty";
  if (title.length > MAX_GOAL_TITLE_LENGTH) return `Goal title must be ${MAX_GOAL_TITLE_LENGTH} characters or less`;
  return null; // null means valid
};

const validateSubgoal = (text, existingSubgoals, currentIndex = -1) => {
  if (!text.trim()) return "Subgoal cannot be empty";
  if (text.length > MAX_SUBGOAL_LENGTH) return `Subgoal must be ${MAX_SUBGOAL_LENGTH} characters or less`;
  
  // Check for duplicates (excluding current item)
  const duplicateIndex = existingSubgoals.findIndex((sub, idx) => 
    idx !== currentIndex && sub.text.toLowerCase().trim() === text.toLowerCase().trim()
  );
  
  if (duplicateIndex !== -1) return "Duplicate subgoal detected";
  return null; // null means valid
};

const HABIT_STORAGE_KEY = 'vero_habit_data';

// Helper to mark goal accomplished in habit tracker
async function markGoalAccomplishedToday(goalId) {
  const today = new Date().toISOString().slice(0, 10);
  let habitJson = await SecureStore.getItemAsync(HABIT_STORAGE_KEY);
  let habitObj = habitJson ? JSON.parse(habitJson) : {};
  if (!habitObj[today]) habitObj[today] = {};
  if (!habitObj[today].goals) habitObj[today].goals = [];
  if (!habitObj[today].goals.includes(goalId)) {
    habitObj[today].goals.push(goalId);
    await SecureStore.setItemAsync(HABIT_STORAGE_KEY, JSON.stringify(habitObj));
  }
}

function DeepWorkScreen2({ navigation }) {
  const [showStopwatchCard, setShowStopwatchCard] = useState(false);
  const [showSetTimeCard, setShowSetTimeCard] = useState(false);
  const [centerDeck, setCenterDeck] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [nextId, setNextId] = useState(4);
  
  // Validation state
  const [validationErrors, setValidationErrors] = useState({});
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  // New subgoal input state
  const [newSubgoalText, setNewSubgoalText] = useState("");

  // Loading state for persistence
  const [isLoading, setIsLoading] = useState(true);

  // Animation state for card gestures
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  // TIMER STATE
  const timerRef = useRef();
  const [timerState, setTimerState] = useState({
    isRunning: false,
    isPaused: false,
    isDragging: false,
    timeLeft: 0,
    totalTime: 0,
    previewTime: 0,
    timeSet: false,
  });
  // For PrimaryButton text
  const [buttonText, setButtonText] = useState("START DEEP WORK");
  // Track if long press is active
  const [longPressActive, setLongPressActive] = useState(false);

  // Persistence functions
  const saveGoalsToStorage = async (goalsData) => {
    try {
      const dataToSave = {
        goals: goalsData,
        nextId: nextId,
        lastUpdated: new Date().toISOString()
      };
      await SecureStore.setItemAsync(GOALS_STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving goals to storage:', error);
    }
  };

  const loadGoalsFromStorage = async () => {
    try {
      const savedData = await SecureStore.getItemAsync(GOALS_STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setCenterDeck(parsedData.goals || initialGoals);
        setNextId(parsedData.nextId || 4);
      } else {
        // No saved data, use initial goals
        setCenterDeck(initialGoals);
        setNextId(4);
      }
    } catch (error) {
      console.error('Error loading goals from storage:', error);
      // Fallback to initial goals on error
      setCenterDeck(initialGoals);
      setNextId(4);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadGoalsFromStorage();
  }, []);

  // Save data whenever goals change
  useEffect(() => {
    if (!isLoading) {
      saveGoalsToStorage(centerDeck);
    }
  }, [centerDeck, nextId, isLoading]);

  const handleSwiped = (direction) => {
    if (centerDeck.length === 0) return;

    if (direction === 'right') {
      // Swipe right: show previous card (n-1)
      setCurrentCardIndex((prevIndex) => 
        prevIndex === 0 ? centerDeck.length - 1 : prevIndex - 1
      );
    } else if (direction === 'left') {
      // Swipe left: show next card (n+1)
      setCurrentCardIndex((prevIndex) => 
        prevIndex === centerDeck.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = event.translationX;
      rotate.value = event.translationX / 20;
      
      // Scale and opacity effects during swipe
      const progress = Math.abs(event.translationX) / SWIPE_THRESHOLD;
      scale.value = withSpring(1 - progress * 0.1, { damping: 15 });
      opacity.value = withSpring(1 - progress * 0.3, { damping: 15 });
    },
    onEnd: () => {
      if (Math.abs(translateX.value) > SWIPE_THRESHOLD) {
        const direction = translateX.value > 0 ? "right" : "left";
        translateX.value = withSpring(
          direction === "right" ? SCREEN_WIDTH : -SCREEN_WIDTH,
          { damping: 8, stiffness: 250 },
          () => {
            runOnJS(handleSwiped)(direction);
            // Reset animation values for the next card
            translateX.value = 0;
            rotate.value = 0;
            scale.value = withSpring(1);
            opacity.value = withSpring(1);
          }
        );
      } else {
        translateX.value = withSpring(0);
        rotate.value = withSpring(0);
        scale.value = withSpring(1);
        opacity.value = withSpring(1);
      }
    },
  });

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotateZ: `${rotate.value}deg` },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  const handleDelete = () => {
    if (centerDeck.length <= 1) {
      Alert.alert(
        "Cannot Delete Last Card",
        "You need at least one goal card. Add more goals before deleting this one.",
        [{ text: "OK" }]
      );
      translateX.value = withSpring(0);
      rotate.value = withSpring(0);
      return;
    }
    
    const updatedGoals = [...centerDeck];
    updatedGoals.splice(currentCardIndex, 1);
    setCenterDeck(updatedGoals);
    
    // Adjust currentCardIndex if necessary
    if (currentCardIndex >= updatedGoals.length) {
      setCurrentCardIndex(Math.max(0, updatedGoals.length - 1));
    }
  };

  const handleAdd = () => {
    const newGoal = { id: nextId, text: `New Goal ${nextId}`, subgoals: [] };
    setCenterDeck((prev) => [...prev, newGoal]);
    setNextId((id) => id + 1);
    // Navigate to the newly added card
    setCurrentCardIndex(centerDeck.length);
  };

  const handleStartStop = () => {
    if (!showStopwatchCard) setShowStopwatchCard(true);
    if (showStopwatchCard) navigation.navigate("DeepWorkScreen3");
  };

  const [showConfetti, setShowConfetti] = useState(false);

  const toggleSubgoal = (goalIndex, subIndex) => {
    const updatedGoals = [...centerDeck];
    const wasCompleted = updatedGoals[goalIndex].subgoals[subIndex].isCompleted;
    updatedGoals[goalIndex].subgoals[subIndex].isCompleted = !wasCompleted;
    setCenterDeck(updatedGoals);

    // Play appropriate sound based on action
    if (!wasCompleted) {
      // Marking as completed - play success sound and show confetti
      setShowConfetti(true);
    }

    // Check if all subgoals for this goal are now completed
    const allCompleted = updatedGoals[goalIndex].subgoals.length > 0 &&
      updatedGoals[goalIndex].subgoals.every(sg => sg.isCompleted);
    if (allCompleted) {
      // Mark this goal as accomplished for today in SecureStore
      markGoalAccomplishedToday(updatedGoals[goalIndex].id);
    }
  };
  

  const addSubgoal = (goalIndex) => {
    // Don't add empty subgoals - require user to enter text first
    Alert.alert(
      "Add Subgoal",
      "Please enter the subgoal text in the input field below, then tap 'Add Subgoal' again.",
      [{ text: "OK" }]
    );
  };

  const addSubgoalWithText = (goalIndex, text) => {
    if (!text.trim()) {
      Alert.alert("Empty Subgoal", "Please enter some text for the subgoal.");
      return;
    }

    // Check for duplicates
    const existingSubgoals = centerDeck[goalIndex].subgoals;
    const isDuplicate = existingSubgoals.some(sub => 
      sub.text.toLowerCase().trim() === text.toLowerCase().trim()
    );

    if (isDuplicate) {
      Alert.alert("Duplicate Subgoal", "This subgoal already exists.");
      return;
    }

    const updatedGoals = [...centerDeck];
    const newSubgoal = {
      id: Date.now(),
      text: text.trim(),
      isCompleted: false
    };
    updatedGoals[goalIndex].subgoals.push(newSubgoal);
    setCenterDeck(updatedGoals);
  };

  const deleteSubgoal = (goalIndex, subIndex) => {
    Alert.alert(
      "Delete Subgoal",
      "Are you sure you want to delete this subgoal?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const updatedGoals = [...centerDeck];
            updatedGoals[goalIndex].subgoals.splice(subIndex, 1);
            setCenterDeck(updatedGoals);
          }
        }
      ]
    );
  };

  // Validation helper functions
  const validateAndUpdateGoalTitle = (goalIndex, newText) => {
    const updatedGoals = [...centerDeck];
    updatedGoals[goalIndex].text = newText;
    setCenterDeck(updatedGoals);

    // Validate and update error state
    const error = validateGoalTitle(newText);
    const errorKey = `goal-${goalIndex}`;
    
    if (error) {
      setValidationErrors(prev => ({ ...prev, [errorKey]: error }));
    } else {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const validateAndUpdateSubgoal = (goalIndex, subIndex, newText) => {
    const updatedGoals = [...centerDeck];
    updatedGoals[goalIndex].subgoals[subIndex].text = newText;
    setCenterDeck(updatedGoals);

    // Validate and update error state
    const error = validateSubgoal(newText, updatedGoals[goalIndex].subgoals, subIndex);
    const errorKey = `subgoal-${goalIndex}-${subIndex}`;
    
    if (error) {
      setValidationErrors(prev => ({ ...prev, [errorKey]: error }));
    } else {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const getValidationError = (goalIndex, subIndex = null) => {
    if (subIndex !== null) {
      return validationErrors[`subgoal-${goalIndex}-${subIndex}`];
    }
    return validationErrors[`goal-${goalIndex}`];
  };

  const hasValidationErrors = () => {
    return Object.keys(validationErrors).length > 0;
  };

  const handleReorderSubgoals = (goalIndex, newSubgoalsArray) => {
    setCenterDeck(prev => {
      const updated = [...prev];
      updated[goalIndex] = {
        ...updated[goalIndex],
        subgoals: newSubgoalsArray,
      };
      return updated;
    });
  };

  // Helper: format seconds to hh:mm:ss
  const formatTime = (seconds) => {
    const totalSeconds = Math.max(0, Math.round(seconds));
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return [h, m, s].map((v) => v.toString().padStart(2, '0')).join(":");
  };

  // TimeTimer callbacks
  const handleTimerDrag = ({ minutes }) => {
    setTimerState((prev) => ({ ...prev, isDragging: true, previewTime: minutes * 60 }));
    setButtonText(formatTime(minutes * 60));
  };
  const handleTimerSet = ({ minutes, seconds }) => {
    setTimerState((prev) => ({ ...prev, isDragging: false, totalTime: seconds, timeLeft: seconds, timeSet: true }));
    setButtonText("START DEEP WORK");
  };
  const handleTimerTick = (secondsLeft) => {
    setTimerState((prev) => ({ ...prev, timeLeft: secondsLeft }));
  };
  const handleTimerStart = (isRunning) => {
    console.log('DeepWorkScreen2: handleTimerStart called with isRunning:', isRunning);
    setTimerState((prev) => ({ ...prev, isRunning, isPaused: false }));
  };
  const handleTimerPause = (isPaused) => {
    console.log('DeepWorkScreen2: handleTimerPause called with isPaused:', isPaused);
    setTimerState((prev) => ({ ...prev, isPaused }));
  };

  // Button tap logic
  const [sessionCount, setSessionCount] = useState(0);
  const handlePrimaryButtonTap = () => {
    console.log('Button tapped!', {
      isDragging: timerState.isDragging,
      timeSet: timerState.timeSet,
      totalTime: timerState.totalTime,
      isRunning: timerState.isRunning,
      isPaused: timerState.isPaused
    });
    
    if (timerState.isDragging) return; // Ignore tap while dragging
    if (!timerState.timeSet || timerState.totalTime === 0) return; // Ignore if no time set
    
    if (!timerState.isRunning && !timerState.isPaused) {
      // Starting a new session
      setSessionCount((count) => count + 1);
      console.log('Starting timer...');
      timerRef.current?.start();
    } else if (timerState.isPaused) {
      console.log('Resuming timer...');
      timerRef.current?.resume();
    } else if (timerState.isRunning) {
      console.log('Pausing timer...');
      timerRef.current?.pause();
    }
  };
  // Long press logic
  const handlePrimaryButtonLongPress = () => {
    setLongPressActive(true);
    setTimeout(() => {
      setLongPressActive(false);
      
      // Stop and reset the timer
      if (timerRef.current) {
        timerRef.current.reset();
      }
      
      // Reset timer state
      setTimerState(prev => ({
        ...prev,
        isRunning: false,
        isPaused: false,
        timeLeft: 0,
        totalTime: 0,
        timeSet: false
      }));
      
      // Reset button text
      setButtonText("START DEEP WORK");
      
      // Calculate focused time in seconds
      const focusedSeconds = (timerState.totalTime || 0) - (timerState.timeLeft || 0);
      // Format as mm:ss
      const minutes = Math.floor(focusedSeconds / 60);
      const seconds = focusedSeconds % 60;
      const focusedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      
      const currentGoal = centerDeck[currentCardIndex];
      const totalSubgoals = currentGoal?.subgoals?.length || 0;
      const completedSubgoals = currentGoal?.subgoals?.filter(sg => sg.isCompleted).length || 0;
      
      // Record this as a completed deep work session
      const updatedSessionCount = sessionCount + 1;
      setSessionCount(updatedSessionCount);
      
      navigation.navigate('Reflect', {
        goalTitle: currentGoal?.text || '',
        focusedTime,
        completedSubgoals,
        totalSubgoals,
        sessionCount: updatedSessionCount
      });
    }, 3000);
  };
  const handlePrimaryButtonLongPressEnd = () => {
    setLongPressActive(false);
  };

  const handleGoalTitleChange = (newText) => {
    if (centerDeck[currentCardIndex]) {
      const updatedGoals = [...centerDeck];
      updatedGoals[currentCardIndex] = { ...updatedGoals[currentCardIndex], text: newText };
      setCenterDeck(updatedGoals);
    }
  };

  return (
    <GradientScreenWrapper>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your goals...</Text>
        </View>
      ) : (
        <>
          {/* Main Swipe Zone */}
          <DeckCardStack
            goals={centerDeck}
            currentCardIndex={currentCardIndex}
            animatedCardStyle={animatedCardStyle}
            gestureHandler={gestureHandler}
            handleAdd={handleAdd}
            handleDelete={handleDelete}
            onGoalTitleChange={handleGoalTitleChange}
            MAX_GOAL_TITLE_LENGTH={MAX_GOAL_TITLE_LENGTH}
            MAX_SUBGOAL_LENGTH={MAX_SUBGOAL_LENGTH}
            toggleSubgoal={toggleSubgoal}
            deleteSubgoal={deleteSubgoal}
            addSubgoalWithText={addSubgoalWithText}
            newSubgoalText={newSubgoalText}
            setNewSubgoalText={setNewSubgoalText}
          />
        </>
      )}

      {/* Timer and controls, centered and spaced */}
      <View style={styles.timerControlsContainer}>
        <View style={styles.timerWrapper}>
          <TimeTimer
            ref={timerRef}
            isRunning={timerState.isRunning}
            isPaused={timerState.isPaused}
            onDrag={handleTimerDrag}
            onSet={handleTimerSet}
            onTick={handleTimerTick}
            onStart={handleTimerStart}
            onPause={handleTimerPause}
            initialMinutes={25}
          />
        </View>
      </View>

      <View style={styles.buttonWrapper}>
        <PrimaryButton
          text={buttonText}
          altText={"TAP TO PAUSE / LONG PRESS TO END"}
          timerText={formatTime(timerState.isDragging ? timerState.previewTime : timerState.timeLeft)}
          isRunning={timerState.isRunning}
          isPaused={timerState.isPaused}
          isDragging={timerState.isDragging}
          onTap={handlePrimaryButtonTap}
          onLongPress={handlePrimaryButtonLongPress}
          onLongPressEnd={handlePrimaryButtonLongPressEnd}
        />
      </View>
      {showConfetti && (
        <ConfettiCannon
          count={100}
          origin={{ x: SCREEN_WIDTH / 2, y: 0 }}
          fadeOut={true}
          autoStart={true}
          explosionSpeed={350}
          fallSpeed={2500}
          colors={['#4CAF50', '#2196F3', '#FFC107', '#F44336', '#9C27B0']}
          onAnimationEnd={() => setShowConfetti(false)}
        />
      )}
    </GradientScreenWrapper>
  );
}

const styles = StyleSheet.create({
  timerWrapper: {
    marginTop: Math.max(SCREEN_HEIGHT * 0.04, 18),
    marginBottom: Math.max(SCREEN_HEIGHT * 0.04, 18),
    alignItems: 'center',
    alignSelf: 'center',
    zIndex: 2,
    // borderWidth: 2,
    // borderColor: '#000000',
  },
  timerControlsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    // borderWidth: 2,
    // borderColor: 'blue',
  },
  setTimeWrapper: {
    position: 'absolute',
    top: '35%',
    width: '85%',
    alignSelf: 'center',
    zIndex: 5,
    elevation: 10,
    // borderWidth: 4,
    // borderColor: 'green',
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'baseline',
    width: '100%',
    // borderWidth: 2,
    // borderColor: 'red',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  addFirstCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 3,
  },
  addFirstCardText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default DeepWorkScreen2;