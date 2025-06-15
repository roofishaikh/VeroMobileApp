import React, { useState } from 'react';
import { Text, View, TextInput, StyleSheet } from 'react-native';

/**
 * This component displays a question followed by a text input field.
 * You can pass `children` as the question text from the parent.
 */
export default function QuestionComponent({ children }) {
  const [answer, setAnswer] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>{children}</Text>

      {/* TextInput for user to type answer */}
      <TextInput
        style={styles.input}
        placeholder="Type your answer here..."
        value={answer}
        onChangeText={setAnswer}
        multiline
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  questionText: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: '500',
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    textAlignVertical: 'top', // for Android to start from top-left corner
    backgroundColor: '#fff',
  },
});
