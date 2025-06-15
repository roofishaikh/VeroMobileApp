import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
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

const styles = StyleSheet.create({
  outterContainer: {
    flexDirection: 'column',
    //borderColor: '#000000',
    width: '100%',
    //borderWidth: 3,
    height: Dimensions.get('window').height < 880 ? 320 : 410,
    position: 'absolute',
    top: 60,
    backgroundColor: 'beige',
    borderRadius: 10,
  },
  scrollContent: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  questionBlock: {
    marginBottom: 16,
  },
});
