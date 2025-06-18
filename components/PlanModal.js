import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

function PlanModal({ visible, onClose }) {
  const navigation = useNavigation();

  const planningOptions = [
    {
      title: "Rise and Shine",
      description: "Morning routine and daily planning",
      onPress: () => {
        console.log('Navigating to DeepScreen1');
        onClose();
        navigation.navigate('HomeTabs', {
          screen: 'Plan',
          params: {
            screen: 'DeepScreen1'
          }
        });
      }
    },
    {
      title: "Shutdown",
      description: "Evening routine and reflection",
      onPress: () => {
        console.log('Shutdown pressed');
        onClose();
        // TODO: Navigate to Shutdown screen when implemented
      }
    },
    {
      title: "Weekly Review",
      description: "Coming Soon",
      onPress: () => {
        console.log('Weekly Review pressed');
        onClose();
        // TODO: Navigate to Weekly Review when implemented
      }
    },
    {
      title: "Monthly Review",
      description: "Coming Soon",
      onPress: () => {
        console.log('Monthly Review pressed');
        onClose();
        // TODO: Navigate to Monthly Review when implemented
      }
    }
  ];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        console.log('Modal requested close');
        onClose();
      }}
    >
      <Pressable 
        style={styles.overlay} 
        onPress={() => {
          console.log('Overlay pressed');
          onClose();
        }}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Choose Your Plan</Text>
          <View style={styles.optionsGrid}>
            {planningOptions.map((option, index) => (
              <Pressable
                key={index}
                style={styles.optionCard}
                onPress={option.onPress}
              >
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: SCREEN_WIDTH * 0.9,
    maxHeight: SCREEN_HEIGHT * 0.8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionCard: {
    width: '48%',
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default PlanModal; 