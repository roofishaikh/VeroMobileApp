import React, { useState, useEffect } from "react";
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

function DeepWorkScreen2({ navigation }) {
  const [showStopwatchCard, setShowStopwatchCard] = useState(false);
  const [showSetTimeCard, setShowSetTimeCard] = useState(false);
  const [goals, setGoals] = useState(initialGoals);
  const [nextId, setNextId] = useState(4);
  
  // Validation state
  const [validationErrors, setValidationErrors] = useState({});
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  // New subgoal input state
  const [newSubgoalText, setNewSubgoalText] = useState("");

  // Loading state for persistence
  const [isLoading, setIsLoading] = useState(true);

  // Pile state for visual representation
  const [leftPile, setLeftPile] = useState([]);
  const [rightPile, setRightPile] = useState([]);

  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  
  // Animated values for pile animations
  const leftPileScale = useSharedValue(1);
  const rightPileScale = useSharedValue(1);

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
        setGoals(parsedData.goals || initialGoals);
        setNextId(parsedData.nextId || 4);
      } else {
        // No saved data, use initial goals
        setGoals(initialGoals);
        setNextId(4);
      }
    } catch (error) {
      console.error('Error loading goals from storage:', error);
      // Fallback to initial goals on error
      setGoals(initialGoals);
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
      saveGoalsToStorage(goals);
    }
  }, [goals, nextId, isLoading]);

  const handleSwiped = (direction) => {
    if (goals.length <= 1) {
      Alert.alert(
        "Cannot Swipe Last Card",
        "You need at least one goal card. Add more goals before swiping this one.",
        [{ text: "OK" }]
      );
      translateX.value = withSpring(0);
      rotate.value = withSpring(0);
      return;
    }

    setGoals((prev) => {
      const updated = [...prev];
      const [top] = updated.splice(0, 1);
      
      // Move card to appropriate pile based on direction
      if (direction === 'left') {
        setLeftPile(prevPile => [...prevPile, top]);
        leftPileScale.value = withSpring(1.3, { damping: 10, stiffness: 100 }, () => {
          leftPileScale.value = withSpring(1);
        });
      } else if (direction === 'right') {
        setRightPile(prevPile => [...prevPile, top]);
        rightPileScale.value = withSpring(1.3, { damping: 10, stiffness: 100 }, () => {
          rightPileScale.value = withSpring(1);
        });
      }
      
      return updated;
    });
    translateX.value = 0;
    rotate.value = 0;
  };

  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = event.translationX;
      rotate.value = event.translationX / 20;
    },
    onEnd: () => {
      if (Math.abs(translateX.value) > SWIPE_THRESHOLD) {
        const direction = translateX.value > 0 ? "right" : "left";
        translateX.value = withSpring(
          direction === "right" ? SCREEN_WIDTH : -SCREEN_WIDTH,
          { damping: 15, stiffness: 150 },
          () => runOnJS(handleSwiped)(direction)
        );
      } else {
        translateX.value = withSpring(0);
        rotate.value = withSpring(0);
      }
    },
  });

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotateZ: `${rotate.value}deg` },
    ],
  }));

  const handleDelete = () => {
    if (goals.length <= 1) {
      Alert.alert(
        "Cannot Delete Last Card",
        "You need at least one goal card. Add more goals before deleting this one.",
        [{ text: "OK" }]
      );
      return;
    }
    setGoals((prev) => prev.slice(1));
  };

  const handleAdd = () => {
    setGoals((prev) => [...prev, { id: nextId, text: `New Goal ${nextId}`, subgoals: [] }]);
    setNextId((id) => id + 1);
  };

  const handleStartStop = () => {
    if (!showStopwatchCard) setShowStopwatchCard(true);
    if (showStopwatchCard) navigation.navigate("DeepWorkScreen3");
  };

  const [showConfetti, setShowConfetti] = useState(false);

  const toggleSubgoal = (goalIndex, subIndex) => {
    const updatedGoals = [...goals];
    const wasCompleted = updatedGoals[goalIndex].subgoals[subIndex].isCompleted;
    updatedGoals[goalIndex].subgoals[subIndex].isCompleted = !wasCompleted;
    setGoals(updatedGoals);

    // Play appropriate sound based on action
    if (!wasCompleted) {
      // Marking as completed - play success sound and show confetti
      setShowConfetti(true);
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
    const existingSubgoals = goals[goalIndex].subgoals;
    const isDuplicate = existingSubgoals.some(sub => 
      sub.text.toLowerCase().trim() === text.toLowerCase().trim()
    );

    if (isDuplicate) {
      Alert.alert("Duplicate Subgoal", "This subgoal already exists.");
      return;
    }

    const updatedGoals = [...goals];
    const newSubgoal = {
      id: Date.now(),
      text: text.trim(),
      isCompleted: false
    };
    updatedGoals[goalIndex].subgoals.push(newSubgoal);
    setGoals(updatedGoals);
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
            const updatedGoals = [...goals];
            updatedGoals[goalIndex].subgoals.splice(subIndex, 1);
            setGoals(updatedGoals);
          }
        }
      ]
    );
  };

  // Validation helper functions
  const validateAndUpdateGoalTitle = (goalIndex, newText) => {
    const updatedGoals = [...goals];
    updatedGoals[goalIndex].text = newText;
    setGoals(updatedGoals);

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
    const updatedGoals = [...goals];
    updatedGoals[goalIndex].subgoals[subIndex].text = newText;
    setGoals(updatedGoals);

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

  return (
    <GradientScreenWrapper>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your goals...</Text>
        </View>
      ) : (
        <>
          {/* Left Pile - Positioned absolutely */}
          <View style={styles.leftPileContainer}>
            <Animated.View style={[styles.pileIcon, { transform: [{ scale: leftPileScale }] }]}>
              <MaterialIcons name="layers" size={24} color="#4CAF50" />
            </Animated.View>
            <Text style={styles.pileCounter}>{leftPile.length}</Text>
            <Text style={styles.pileLabel}>Left Pile</Text>
          </View>

          {/* Right Pile - Positioned absolutely */}
          <View style={styles.rightPileContainer}>
            <Animated.View style={[styles.pileIcon, { transform: [{ scale: rightPileScale }] }]}>
              <MaterialIcons name="layers" size={24} color="#2196F3" />
            </Animated.View>
            <Text style={styles.pileCounter}>{rightPile.length}</Text>
            <Text style={styles.pileLabel}>Right Pile</Text>
          </View>

          {/* Main Swipe Zone - Restored to original */}
          <View style={styles.swipeZone}>
            {goals.length === 0 ? (
              <View style={styles.emptyStateContainer}>
                <Text style={styles.emptyStateText}>No goals available</Text>
                <Pressable onPress={handleAdd} style={styles.addFirstCardButton}>
                  <MaterialIcons name="add" size={24} color="#4CAF50" />
                  <Text style={styles.addFirstCardText}>Add Your First Goal</Text>
                </Pressable>
              </View>
            ) : (
              goals.map((goal, index) => {
                const isTop = index === 0;
                return (
                  <PanGestureHandler
                    key={goal.id}
                    enabled={isTop}
                    onGestureEvent={gestureHandler}
                  >
                    <Animated.View style={[styles.card, isTop && animatedCardStyle]}>
                      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <ScrollView
                          style={{ flexGrow: 1 }}
                          contentContainerStyle={{ justifyContent: 'flex-start', paddingBottom: 20 }}
                          showsVerticalScrollIndicator={false}
                        >
                          <TextInput
                            style={[
                              styles.cardText,
                              getValidationError(index) && styles.inputError
                            ]}
                            multiline={true}
                            placeholder="Enter goal title..."
                            placeholderTextColor="#999"
                            value={goal.text}
                            onChangeText={(newText) => {
                              validateAndUpdateGoalTitle(index, newText);
                            }}
                          />
                          {getValidationError(index) && (
                            <Text style={styles.errorText}>{getValidationError(index)}</Text>
                          )}
                          <Text style={styles.charCount}>
                            {goal.text.length}/{MAX_GOAL_TITLE_LENGTH}
                          </Text>

                          {goal.subgoals.map((sub, subIdx) => (
                            <View key={sub.id} style={styles.subgoalRow}>
                              <Pressable 
                                onPress={() => toggleSubgoal(index, subIdx)}
                                style={styles.checkboxContainer}
                              >
                                <Checkbox
                                  status={sub.isCompleted ? 'checked' : 'unchecked'}
                                  color="#4CAF50"
                                  uncheckedColor="#ccc"
                                  style={styles.checkbox}
                                />
                              </Pressable>
                              <View style={styles.subgoalInputContainer}>
                                <TextInput
                                  value={sub.text}
                                  placeholder="Enter subgoal..."
                                  placeholderTextColor="#999"
                                  onChangeText={(newText) => {
                                    validateAndUpdateSubgoal(index, subIdx, newText);
                                  }}
                                  style={[
                                    styles.subgoalText,
                                    sub.isCompleted && styles.completedSubgoalText,
                                    getValidationError(index, subIdx) && styles.inputError
                                  ]}
                                />
                                <Text style={styles.charCount}>
                                  {sub.text.length}/{MAX_SUBGOAL_LENGTH}
                                </Text>
                              </View>
                              <IconButton
                                icon="delete"
                                size={20}
                                onPress={() => deleteSubgoal(index, subIdx)}
                                style={styles.deleteSubgoalButton}
                              />
                            </View>
                          ))}
                          
                          {/* Show subgoal validation errors */}
                          {goal.subgoals.map((sub, subIdx) => 
                            getValidationError(index, subIdx) && (
                              <Text key={`error-${sub.id}`} style={styles.errorText}>
                                {getValidationError(index, subIdx)}
                              </Text>
                            )
                          )}
                          
                          {/* Validation summary */}
                          {hasValidationErrors() && Object.keys(validationErrors).some(key => key.startsWith(`goal-${index}`) || key.startsWith(`subgoal-${index}`)) && (
                            <View style={styles.validationSummary}>
                              <Text style={styles.validationSummaryTitle}>Please fix the following issues:</Text>
                              {Object.entries(validationErrors)
                                .filter(([key]) => key.startsWith(`goal-${index}`) || key.startsWith(`subgoal-${index}`))
                                .map(([key, error]) => (
                                  <Text key={key} style={styles.validationSummaryItem}>• {error}</Text>
                                ))}
                            </View>
                          )}
                          
                          {/* Add Subgoal Input Section */}
                          <View style={styles.addSubgoalSection}>
                            <TextInput
                              style={styles.newSubgoalInput}
                              placeholder="Enter new subgoal text..."
                              placeholderTextColor="#999"
                              value={newSubgoalText}
                              onChangeText={setNewSubgoalText}
                              multiline={true}
                            />
                            <Pressable 
                              onPress={() => {
                                addSubgoalWithText(index, newSubgoalText);
                                setNewSubgoalText(""); // Clear input after adding
                              }}
                              style={[
                                styles.addSubgoalButton,
                                !newSubgoalText.trim() && styles.addSubgoalButtonDisabled
                              ]}
                              disabled={!newSubgoalText.trim()}
                            >
                              <MaterialIcons 
                                name="add-circle" 
                                size={24} 
                                color={newSubgoalText.trim() ? "#4CAF50" : "#ccc"} 
                              />
                              <Text style={[
                                styles.addSubgoalText,
                                !newSubgoalText.trim() && styles.addSubgoalTextDisabled
                              ]}>
                                Add Subgoal
                              </Text>
                            </Pressable>
                          </View>
                        </ScrollView>
                      </TouchableWithoutFeedback>
                      <View style={styles.iconRow}>
                        <Pressable onPress={handleDelete} style={styles.iconButton}>
                          <MaterialIcons name="delete" size={24} color="#F45B47" />
                        </Pressable>
                        <Pressable onPress={handleAdd} style={styles.iconButton}>
                          <MaterialIcons name="add" size={24} color="#4CAF50" />
                        </Pressable>
                      </View>
                    </Animated.View>
                  </PanGestureHandler>
                );
              }).reverse()
            )}
          </View>
        </>
      )}

      {/* Timer and controls, centered and spaced */}
      <View style={styles.timerControlsContainer}>
        <View style={styles.timerWrapper}>
          <TimeTimer />
        </View>
      </View>

      <View style={styles.buttonWrapper}>
        <PrimaryButton onPress={handleStartStop}>
          {showStopwatchCard ? "STOP" : "START DEEP WORK"}
        </PrimaryButton>
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
  container: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  leftPileContainer: {
    position: 'absolute',
    left: 20,
    top: '50%',
    transform: [{ translateY: -50 }],
    alignItems: 'center',
    zIndex: 10,
  },
  rightPileContainer: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -50 }],
    alignItems: 'center',
    zIndex: 10,
  },
  swipeZone: {
    width: Math.min(SCREEN_WIDTH * 0.85, 420),
    height: SCREEN_HEIGHT < 700 ? SCREEN_HEIGHT * 0.45 : SCREEN_HEIGHT * 0.50,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#f60000',
    borderWidth: 1,
    alignSelf: "center",
    marginTop: 60,
  },
  card: {
    position: 'absolute',
    width: Math.min(SCREEN_WIDTH * 0.85, 420),
    height: SCREEN_HEIGHT < 700 ? SCREEN_HEIGHT * 0.45 : SCREEN_HEIGHT * 0.50,
    backgroundColor: '#FFF5E0',
    borderRadius: 16,
    justifyContent: 'center',
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    borderColor: '#000000',
    borderWidth: 3,
  },
  pileIcon: {
    width: SCREEN_WIDTH < 400 ? 36 : 50,
    height: SCREEN_WIDTH < 400 ? 36 : 50,
    backgroundColor: '#fff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pileCounter: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  pileLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  cardText: {
    fontSize: 30,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: "bold",
  },
  inputError: {
    borderColor: '#F45B47',
    borderWidth: 1,
  },
  errorText: {
    color: '#F45B47',
    marginBottom: 10,
  },
  charCount: {
    alignSelf: 'flex-end',
    color: '#999',
  },
  subgoalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    flexWrap: 'wrap',
    maxWidth: '100%',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  checkboxContainer: {
    marginRight: 8,
  },
  checkbox: {
    margin: 0,
    padding: 0,
  },
  subgoalInputContainer: {
    flex: 1,
  },
  subgoalText: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    flex: 1,
    flexShrink: 1,
    padding: 4,
    color: '#000',
    marginRight: 8,
  },
  completedSubgoalText: {
    textDecorationLine: 'line-through',
    color: '#888',
    borderBottomColor: '#888',
  },
  deleteSubgoalButton: {
    margin: 0,
    padding: 0,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    marginTop: 20,
    alignSelf: "center",
    position: "absolute",
    bottom: 10,
  },
  iconButton: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 30,
    elevation: 3,
  },
  validationSummary: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  validationSummaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  validationSummaryItem: {
    fontSize: 16,
    marginBottom: 5,
  },
  addSubgoalSection: {
    flexDirection: 'column',
    padding: 10,
    marginTop: 10,
  },
  newSubgoalInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  addSubgoalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    alignSelf: 'center',
  },
  addSubgoalButtonDisabled: {
    opacity: 0.5,
  },
  addSubgoalText: {
    color: '#4CAF50',
    marginLeft: 5,
    fontSize: 16,
  },
  addSubgoalTextDisabled: {
    color: '#ccc',
  },
  timerWrapper: {
    marginTop: Math.max(SCREEN_HEIGHT * 0.04, 18),
    marginBottom: Math.max(SCREEN_HEIGHT * 0.04, 18),
    alignItems: 'center',
    alignSelf: 'center',
    zIndex: 2,
  },
  timerControlsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  setTimeWrapper: {
    position: 'absolute',
    top: '35%',
    width: '85%',
    alignSelf: 'center',
    zIndex: 20,
    elevation: 10,
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'baseline',
    width: '100%',
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