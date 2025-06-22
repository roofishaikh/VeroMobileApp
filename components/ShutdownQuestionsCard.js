import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView, Text } from 'react-native';
import QuestionComponent from './QuestionComponent';

export default function ShutdownQuestionsCard() {
  const questions = [
    '1. What am I grateful for today?',
    '2. How can I improve?',
    '3. What did I learn today?',
    '4. Did I give my best today?',
    '5. From your day… (appears based on mood/energy trends)'
  ];

  return (
    <View style={styles.outterContainer}>
      <Text style={styles.titleText}>Shutdown Reflection</Text>
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
    height: SCREEN_HEIGHT < 900 ? (SCREEN_HEIGHT * 0.45) : (SCREEN_HEIGHT * 0.50) ,
    backgroundColor: '#E3E6F3', // Different color for shutdown
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
  },
  scrollContent: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    flex: 1,
    marginTop: 2,
  },
  questionBlock: {
    marginBottom: 10,
  },
  titleText: {
    fontWeight: "bold",
    fontSize: 24,
    color: "#6C7AE0",
    marginBottom: 20,
    textAlign: 'center',
    marginBottom: 15,
  }
}); 