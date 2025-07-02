import React from 'react';
import { View, Text, Pressable, TextInput, ScrollView, Keyboard, TouchableWithoutFeedback, StyleSheet, Dimensions } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { IconButton, Checkbox } from 'react-native-paper';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Accept all necessary props for full control from parent
const SwipableGoalCards = ({
  goals,
  leftPile = [],
  rightPile = [],
  animatedCardStyle,
  gestureHandler,
  handleAdd,
  handleDelete,
  validateAndUpdateGoalTitle,
  validateAndUpdateSubgoal,
  getValidationError,
  hasValidationErrors,
  validationErrors,
  MAX_GOAL_TITLE_LENGTH,
  MAX_SUBGOAL_LENGTH,
  toggleSubgoal,
  deleteSubgoal,
  addSubgoalWithText,
  newSubgoalText,
  setNewSubgoalText
}) => {
  // Add null/undefined check for goals
  if (!goals || !Array.isArray(goals)) {
    return (
      <View style={styles.swipeZone}>
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>Loading goals...</Text>
        </View>
      </View>
    );
  }

  return (
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
        <PanGestureHandler
          key={goals[0]?.id || 'default'}
          enabled={true}
          onGestureEvent={gestureHandler}
        >
          <Animated.View style={[styles.card, animatedCardStyle]}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <ScrollView
                style={{ flexGrow: 1 }}
                contentContainerStyle={{ justifyContent: 'flex-start', paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
              >
                <TextInput
                  style={[
                    styles.cardText,
                    getValidationError && getValidationError(0) && styles.inputError
                  ]}
                  multiline={true}
                  placeholder="Enter goal title..."
                  placeholderTextColor="#999"
                  value={goals[0]?.text || ''}
                  onChangeText={(newText) => {
                    validateAndUpdateGoalTitle(0, newText);
                  }}
                />
                {getValidationError && getValidationError(0) && (
                  <Text style={styles.errorText}>{getValidationError(0)}</Text>
                )}
                <Text style={styles.charCount}>
                  {(goals[0]?.text || '').length}/{MAX_GOAL_TITLE_LENGTH}
                </Text>
                {/* Draggable subgoals */}
                {goals[0]?.subgoals?.map((sub, index) => (
                  <View key={sub.id} style={styles.subgoalContainer}>
                    <Pressable
                      onPress={() => toggleSubgoal(0, index)}
                      style={styles.subgoalButton}
                    >
                      <Checkbox
                        status={sub.isCompleted === true ? 'checked' : 'unchecked'}
                        color="#4CAF50"
                        uncheckedColor="#ccc"
                      />
                    </Pressable>
                    <View style={styles.subgoalTextContainer}>
                      <TextInput
                        value={sub.text}
                        placeholder="Enter subgoal..."
                        placeholderTextColor="#999"
                        onChangeText={(newText) => {
                          validateAndUpdateSubgoal(0, index, newText);
                        }}
                        style={[
                          styles.subgoalText,
                          sub.isCompleted && styles.completedSubgoalText,
                          getValidationError && getValidationError(0, index) && styles.inputError
                        ]}
                      />
                      <Text style={styles.charCount}>
                        {sub.text.length}/{MAX_SUBGOAL_LENGTH}
                      </Text>
                    </View>
                    <IconButton
                      icon="delete"
                      size={20}
                      onPress={() => deleteSubgoal(0, index)}
                      style={styles.deleteSubgoalButton}
                    />
                  </View>
                ))}
                {/* Show subgoal validation errors */}
                {goals[0]?.subgoals?.map((sub, index) => 
                  getValidationError && getValidationError(0, index) && (
                    <Text key={`error-${sub?.id ?? index}`} style={styles.errorText}>
                      {getValidationError(0, index)}
                    </Text>
                  )
                )}
                {/* Validation summary */}
                {hasValidationErrors && validationErrors && Object.keys(validationErrors).some(key => key.startsWith(`goal-0`) || key.startsWith(`subgoal-0`)) && (
                  <View style={styles.validationSummary}>
                    <Text style={styles.validationSummaryTitle}>Please fix the following issues:</Text>
                    {Object.entries(validationErrors)
                      .filter(([key]) => key.startsWith(`goal-0`) || key.startsWith(`subgoal-0`))
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
                      const newSubgoal = {
                        id: Date.now(),
                        text: newSubgoalText.trim(),
                        isCompleted: false
                      };
                      addSubgoalWithText(0, newSubgoalText);
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
            {/* Card number indicator at bottom center */}
            <View style={{ position: 'absolute', bottom: 8, left: 0, right: 0, alignItems: 'center' }}>
              <Text style={{ fontSize: 16, color: '#888', fontWeight: 'bold' }}>
                {`${leftPile.length + 1}/${goals.length + leftPile.length + rightPile.length}`}
              </Text>
            </View>
          </Animated.View>
        </PanGestureHandler>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
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
  subgoalContainer: {
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
  subgoalButton: {
    marginRight: 8,
  },
  subgoalTextContainer: {
    flex: 1,
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
});

export default SwipableGoalCards; 