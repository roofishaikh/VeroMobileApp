import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import PlanModal from './DeepWorkScreens/PlanScreens/PlanModal' 
import GradientScreenWrapper from '../components/GradientScreenWrapper';
import { useFocusEffect } from '@react-navigation/native';

function PlanScreen() {
  const [showModal, setShowModal] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setShowModal(true);
    }, [])
  );

  return (
    <GradientScreenWrapper>
      <View style={styles.container}>
        {showModal && (
          <PlanModal onClose={() => setShowModal(false)} />
        )}
      </View>
    </GradientScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default PlanScreen; 