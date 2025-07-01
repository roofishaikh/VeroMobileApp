import React from 'react';
import { View, Text, Pressable, TextInput, ScrollView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { IconButton, Checkbox } from 'react-native-paper';
import DraggableFlatList from 'react-native-draggable-flatlist';

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
  setNewSubgoalText,
  styles,
  onReorderSubgoals
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
                <DraggableFlatList
                  data={(goals[0]?.subgoals || []).filter(Boolean)}
                  keyExtractor={item => item.id.toString()}
                  renderItem={({ item, index, drag, isActive }) => {
                    if (!item) return null;
                    return (
                      <View
                        style={{
                          backgroundColor: '#FFF5E0',
                          opacity: isActive ? 0.8 : 1,
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginVertical: 5,
                          borderRadius: 8,
                          padding: 8,
                        }}
                      >
                        <Pressable
                          onPress={() => toggleSubgoal(0, index)}
                          onLongPress={drag}
                          delayLongPress={150}
                          style={{ marginRight: 8 }}
                        >
                          <Checkbox
                            status={item.isCompleted === true ? 'checked' : 'unchecked'}
                            color="#4CAF50"
                            uncheckedColor="#ccc"
                          />
                        </Pressable>
                        <View style={{ flex: 1 }}>
                          <TextInput
                            value={item.text}
                            placeholder="Enter subgoal..."
                            placeholderTextColor="#999"
                            onChangeText={(newText) => {
                              validateAndUpdateSubgoal(0, index, newText);
                            }}
                            style={[
                              styles.subgoalText,
                              item.isCompleted && styles.completedSubgoalText,
                              getValidationError && getValidationError(0, index) && styles.inputError
                            ]}
                          />
                          <Text style={styles.charCount}>
                            {item.text.length}/{MAX_SUBGOAL_LENGTH}
                          </Text>
                        </View>
                        <IconButton
                          icon="delete"
                          size={20}
                          onPress={() => deleteSubgoal(0, index)}
                          style={styles.deleteSubgoalButton}
                        />
                      </View>
                    );
                  }}
                  onDragEnd={({ data }) => onReorderSubgoals(0, data)}
                  scrollEnabled={false}
                />
                {/* Show subgoal validation errors */}
                {(goals[0]?.subgoals || []).filter(Boolean).map((sub, subIdx) => 
                  getValidationError && getValidationError(0, subIdx) && (
                    <Text key={`error-${sub?.id ?? subIdx}`} style={styles.errorText}>
                      {getValidationError(0, subIdx)}
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

export default SwipableGoalCards; 