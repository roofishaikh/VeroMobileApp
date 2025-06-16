import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView, Text } from 'react-native';
import QuestionComponent from './QuestionComponent';

/**
 * This component displays multiple questions,
 * each followed by a TextInput field for user input.
 */
export default function Screen1QuesionsCard() {
  // Define your list of questions here
  const questions = [
    '1. What am I grateful for today?',
    '2. What am I avoiding?',
    '3. What am I excieted about today?',
    '4. What is one thing i must accomplish today?',
  ];

  return (
    <View style={styles.outterContainer}>
      <Text style={styles.titleText}>plan to rise and shine</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {questions.map((question, index) => (
          <View key={index} style={styles.questionBlock}>
            <QuestionComponent>
              {question}
            </QuestionComponent>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const styles = StyleSheet.create({
  outterContainer: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.85,
    height: SCREEN_HEIGHT < 900 ? (SCREEN_HEIGHT * 0.50) : (SCREEN_HEIGHT * 0.55) ,
    backgroundColor: '#FFF5E0',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 60,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    pointerEvents: 'box-none',
    //  borderColor: '#000000',
    // borderWidth: 3,
  },
  scrollContent: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    // borderWidth: 3,
    // borderColor: '#000000',
    flex: 1,
    marginTop: 2,
    
  },
  questionBlock: {
    marginBottom: 10,
    
  },
  titleText: {
    fontWeight: "bold",
    fontSize: 24,
    color: "#ed9aed",
    marginBottom: 20,
    textAlign: 'center',
    marginBottom: 15,
  }
});
