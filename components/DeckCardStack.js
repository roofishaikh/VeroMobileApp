import React from 'react';
import { View, StyleSheet, Dimensions, Text, Pressable, ScrollView, TextInput } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import { IconButton, Checkbox } from 'react-native-paper';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const DeckCardStack = ({
  goals,
  currentCardIndex,
  animatedCardStyle,
  gestureHandler,
  handleAdd,
  handleDelete,
  onGoalTitleChange,
  toggleSubgoal,
  deleteSubgoal,
  addSubgoalWithText,
  newSubgoalText,
  setNewSubgoalText,
  MAX_GOAL_TITLE_LENGTH,
  MAX_SUBGOAL_LENGTH,
}) => {
  if (!goals || !Array.isArray(goals) || goals.length === 0) {
    return (
      <View style={styles.swipeZone}>
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>No goals available</Text>
          <Pressable onPress={handleAdd} style={styles.addFirstCardButton}>
            <MaterialIcons name="add" size={24} color="#4CAF50" />
            <Text style={styles.addFirstCardText}>Add Your First Goal</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // Calculate which cards to show (current + next 2 cards)
  const getVisibleCards = () => {
    const cards = [];
    for (let i = 0; i < Math.min(3, goals.length); i++) {
      const cardIndex = (currentCardIndex + i) % goals.length;
      cards.push({
        goal: goals[cardIndex],
        index: cardIndex,
        stackIndex: i,
      });
    }
    return cards;
  };

  const visibleCards = getVisibleCards();

  const renderCard = (cardData, isTopCard = false) => {
    const { goal, index, stackIndex } = cardData;
    
    // Calculate stack positioning
    const stackStyle = useAnimatedStyle(() => {
      const baseScale = 1 - stackIndex * 0.05; // Each card slightly smaller
      const baseTranslateY = stackIndex * 8; // Each card slightly lower
      const baseOpacity = 1 - stackIndex * 0.2; // Each card slightly more transparent
      
      return {
        transform: [
          { scale: withSpring(baseScale, { damping: 15 }) },
          { translateY: withSpring(baseTranslateY, { damping: 15 }) },
        ],
        opacity: withSpring(baseOpacity, { damping: 15 }),
        zIndex: 100 - stackIndex, // Higher cards have higher z-index
      };
    });

    const cardContent = (
      <ScrollView
        style={{ flexGrow: 1 }}
        contentContainerStyle={{ justifyContent: 'flex-start', paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TextInput
          style={styles.cardText}
          placeholder="Enter goal title..."
          value={goal?.text || ''}
          onChangeText={(newText) => {
            if (onGoalTitleChange) {
              onGoalTitleChange(newText);
            }
          }}
        />
        {goal?.subgoals?.map((sub, subIndex) => (
          <View key={sub.id} style={styles.subgoalContainer}>
            <Pressable
              onPress={() => toggleSubgoal(index, subIndex)}
              style={styles.subgoalButton}
            >
              <Checkbox
                status={sub.isCompleted === true ? 'checked' : 'unchecked'}
                checkedColor="#4CAF50"
                uncheckedColor="#ccc"
              />
            </Pressable>
            <View style={styles.subgoalTextContainer}>
              <TextInput
                value={sub.text}
                placeholder="Enter subgoal..."
                placeholderTextColor="#999"
                editable={true}
                selectTextOnFocus={true}
                autoFocus={false}
                onChangeText={(newText) => {
                  sub.text = newText;
                }}
              />
            </View>
            <IconButton
              icon="delete"
              size={20}
              onPress={() => deleteSubgoal(index, subIndex)}
              style={styles.deleteSubgoalButton}
            />
          </View>
        ))}
        <View style={styles.addSubgoalSection}>
          <TextInput
            style={styles.newSubgoalInput}
            placeholder="Enter new subgoal text..."
            placeholderTextColor="#999"
            value={newSubgoalText}
            editable={true}
            selectTextOnFocus={true}
            autoFocus={false}
            onChangeText={setNewSubgoalText}
            onEndEditing={(e) => {
              const text = e.nativeEvent.text.trim();
              if (text) {
                addSubgoalWithText(index, text);
                setNewSubgoalText("");
              }
            }}
            multiline={true}
          />
        </View>
      </ScrollView>
    );

    const actionButtons = (
      <View style={styles.iconRow}>
        <Pressable onPress={handleDelete} style={styles.iconButton}>
          <MaterialIcons name="delete" size={24} color="#F45B47" />
        </Pressable>
        <Pressable onPress={handleAdd} style={styles.iconButton}>
          <MaterialIcons name="add" size={24} color="#4CAF50" />
        </Pressable>
      </View>
    );

    const cardCounter = (
      <View style={{ position: 'absolute', bottom: 8, left: 0, right: 0, alignItems: 'center' }}>
        <Text style={{ fontSize: 16, color: '#888', fontWeight: 'bold' }}>
          {`${currentCardIndex + 1}/${goals.length}`}
        </Text>
      </View>
    );

    if (isTopCard) {
      return (
        <PanGestureHandler
          key={goal?.id || 'default'}
          enabled={true}
          onGestureEvent={gestureHandler}
        >
          <Animated.View style={[styles.card, animatedCardStyle, stackStyle]}>
            {cardContent}
            {actionButtons}
            {cardCounter}
          </Animated.View>
        </PanGestureHandler>
      );
    } else {
      return (
        <Animated.View key={goal?.id || `stack-${stackIndex}`} style={[styles.card, stackStyle]}>
          {cardContent}
          {actionButtons}
          {cardCounter}
        </Animated.View>
      );
    }
  };

  return (
    <View style={styles.swipeZone}>
      {/* Render cards from bottom to top (background to foreground) */}
      {visibleCards.slice().reverse().map((cardData, renderIndex) => {
        const isTopCard = renderIndex === visibleCards.length - 1;
        return renderCard(cardData, isTopCard);
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  swipeZone: {
    width: Math.min(SCREEN_WIDTH * 0.85, 420),
    height: SCREEN_HEIGHT < 700 ? SCREEN_HEIGHT * 0.45 : SCREEN_HEIGHT * 0.50,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#f60000',
    borderWidth: 1,
    alignSelf: "center",
    marginTop: 60,
    position: 'relative',
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
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  subgoalButton: {
    marginRight: 10,
  },
  subgoalTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  deleteSubgoalButton: {
    margin: 0,
  },
  addSubgoalSection: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  newSubgoalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    minHeight: 40,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  iconButton: {
    padding: 8,
  },
});

export default DeckCardStack; 