import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, Text, Animated, PanResponder } from 'react-native';
import QuestionComponent from './QuestionComponent';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

export default function SwipableQuestionCards({ title, questions, onCardChange, currentIndex = 0 }) {
  const position = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          forceSwipe('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          forceSwipe('left');
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  const forceSwipe = (direction) => {
    const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: false,
    }).start(() => onSwipeComplete(direction));
  };

  const onSwipeComplete = (direction) => {
    // Animate card back to center and show next/previous card
    position.setValue({ x: 0, y: 0 });
    
    let newIndex;
    if (direction === 'right') {
      // Swipe right - go to next card
      newIndex = currentIndex + 1;
    } else {
      // Swipe left - go to previous card
      newIndex = currentIndex - 1;
    }
    
    // Notify parent component about the card change
    if (onCardChange) {
      onCardChange(newIndex);
    }
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };

  const getCardStyle = () => {
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ['-120deg', '0deg', '120deg'],
    });
    return {
      ...position.getLayout(),
      transform: [{ rotate }],
    };
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.card, getCardStyle()]} {...panResponder.panHandlers}>
        <Text style={styles.titleText}>{title}</Text>
        <View style={styles.cardContent}>
          {questions.map((question, index) => (
            <View key={index} style={styles.questionContainer}>
              <QuestionComponent>
                {question}
              </QuestionComponent>
            </View>
          ))}
        </View>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Card {currentIndex + 1}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.85,
    height: SCREEN_HEIGHT < 900 ? (SCREEN_HEIGHT * 0.45) : (SCREEN_HEIGHT * 0.50),
    backgroundColor: 'transparent',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 60,
    padding: 0,
    pointerEvents: 'box-none',
  },
  card: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFF5E0',
    borderRadius: 16,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  titleText: {
    fontWeight: "bold",
    fontSize: 24,
    color: "#ed9aed",
    marginBottom: 20,
    textAlign: 'center',
  },
  cardContent: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionContainer: {
    width: '100%',
    marginBottom: 15,
  },
  progressContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
}); 