// components/GradientScreenWrapper.js
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

export default function GradientScreenWrapper({ children }) {
  return (
    <LinearGradient
      colors={['#55355F', '#C97C76', '#FECE7D']}
      style={styles.background}
    >
      <View style={styles.content}>{children}</View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
