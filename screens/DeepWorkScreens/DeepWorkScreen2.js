import React, { useState } from "react";
import ConfettiCannon from 'react-native-confetti-cannon';
import { View, StyleSheet, Pressable, Text, Dimensions, TextInput,
TouchableWithoutFeedback, Keyboard, ScrollView, Alert } from "react-native";
import PrimaryButton from "../../components/primaryButton";
import Timer from "../../components/timer";
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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;




function DeepWorkScreen2({ navigation }) {
  const [duration, setDuration] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showStopwatchCard, setShowStopwatchCard] = useState(false);
  const [showSetTimeCard, setShowSetTimeCard] = useState(false);
  const [goals, setGoals] = useState(initialGoals);
  const [nextId, setNextId] = useState(4);

  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);

  const handleSwiped = () => {
    setGoals((prev) => {
      const updated = [...prev];
      const [top] = updated.splice(0, 1);
      updated.push(top);
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
          () => runOnJS(handleSwiped)()
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
    setGoals((prev) => prev.slice(1));
  };

  const handleAdd = () => {
    setGoals((prev) => [...prev, { id: nextId, text: `New Goal ${nextId}`, subgoals: [] }]);
    setNextId((id) => id + 1);
  };

  const handleStartStop = () => {
    if (!isTimerRunning) setShowStopwatchCard(false);
    setIsTimerRunning((prev) => !prev);
    if (isTimerRunning) navigation.navigate("DeepWorkScreen3");
  };

  const handleTimeSet = (min) => {
    setDuration(min * 60);
    setShowSetTimeCard(false);
  };

    const [showConfetti, setShowConfetti] = useState(false);

  const toggleSubgoal = (goalIndex, subIndex) => {
    const updatedGoals = [...goals];
    const wasCompleted = updatedGoals[goalIndex].subgoals[subIndex].isCompleted;
    updatedGoals[goalIndex].subgoals[subIndex].isCompleted = !wasCompleted;
    setGoals(updatedGoals);

    // Only trigger confetti when marking as completed (not when unchecking)
    if (!wasCompleted) {
      setShowConfetti(true);
    }
  };
  

  const addSubgoal = (goalIndex) => {
    const updatedGoals = [...goals];
    const newSubgoal = {
      id: Date.now(),
      text: "New subgoal",
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

  return (
    <GradientScreenWrapper>
      <View style={styles.swipeZone}>
        {goals.map((goal, index) => {
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
                      style={styles.cardText}
                      multiline={true}
                      value={goal.text}
                      onChangeText={(newText) => {
                        const updatedGoals = [...goals];
                        updatedGoals[index].text = newText;
                        setGoals(updatedGoals);
                      }}
                    />

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
                        <TextInput
                          value={sub.text}
                          onChangeText={(newText) => {
                            const updatedGoals = [...goals];
                            updatedGoals[index].subgoals[subIdx].text = newText;
                            setGoals(updatedGoals);
                          }}
                          style={[
                            styles.subgoalText,
                            sub.isCompleted && styles.completedSubgoalText
                          ]}
                        />
                        <IconButton
                          icon="delete"
                          size={20}
                          onPress={() => deleteSubgoal(index, subIdx)}
                          style={styles.deleteSubgoalButton}
                        />
                      </View>
                    ))}
                    
                    <Pressable 
                      onPress={() => addSubgoal(index)}
                      style={styles.addSubgoalButton}
                    >
                      <MaterialIcons name="add-circle" size={24} color="#4CAF50" />
                      <Text style={styles.addSubgoalText}>Add Subgoal</Text>
                    </Pressable>
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
        }).reverse()}
      </View>

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

export default DeepWorkScreen2;

const styles = StyleSheet.create({
  swipeZone: {
    width: SCREEN_WIDTH * 0.85,
    height: SCREEN_HEIGHT < 900 ? (SCREEN_HEIGHT * 0.50) : (SCREEN_HEIGHT * 0.55),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#f60000',
    borderWidth: 1,
    alignSelf: "center",
    marginTop: 60,
  },
  card: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.85,
    height: SCREEN_HEIGHT < 900 ? (SCREEN_HEIGHT * 0.50) : (SCREEN_HEIGHT * 0.55),
    backgroundColor: '#FFF5E0',
    borderRadius: 16,
    justifyContent: 'center',
    //alignItems: 'center',
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    borderColor: '#000000',
    borderWidth: 3,
  },
  cardText: {
    fontSize: 30,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: "bold",
    // borderColor: "#000000",
    // borderWidth: 2,
     
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
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    marginTop: 20,
    alignSelf: "center",
    position: "absolute",
    bottom: 10,
    // borderColor: "#000000",
    // borderWidth: 2,
  },
  iconButton: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 30,
    elevation: 3,
    // borderColor: "#000000",
    // borderWidth: 2,
  },
  timerWrapper: {
    position: 'absolute',
    top: SCREEN_HEIGHT < 900 ? 10 : -10,
    alignItems: 'center',
    alignSelf: 'center',
    flex: 1,
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'baseline',
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
  deleteSubgoalButton: {
    margin: 0,
    padding: 0,
  },
  addSubgoalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginTop: 10,
    alignSelf: 'center',
  },
  addSubgoalText: {
    color: '#4CAF50',
    marginLeft: 5,
    fontSize: 16,
  },
});
