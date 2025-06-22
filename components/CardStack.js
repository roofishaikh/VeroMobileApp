import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import PrimaryButton from './primaryButton';

const initialGoals = [
  {
    id: '1',
    title: 'Launch New Website',
    subGoals: [
      { text: 'Finalize pitch deck', done: false },
      { text: 'Create homepage', done: false },
      { text: 'Plan launch event', done: false },
    ],
  },
  {
    id: '2',
    title: 'Prepare Talk',
    subGoals: [
      { text: 'Draft outline', done: false },
      { text: 'Design slides', done: false },
      { text: 'Rehearse', done: false },
    ],
  },
];

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH * 0.85;

function CardStack() {
  const [goals, setGoals] = useState(initialGoals);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  const toggleSubGoal = (goalIndex, subIndex) => {
    const updated = [...goals];
    updated[goalIndex].subGoals[subIndex].done =
      !updated[goalIndex].subGoals[subIndex].done;
    setGoals(updated);
  };

  const openEditModal = (index) => {
    setEditingGoal({ ...goals[index], index });
    setModalVisible(true);
  };

  const saveGoalChanges = () => {
    const updated = [...goals];
    updated[editingGoal.index] = {
      id: editingGoal.id,
      title: editingGoal.title,
      subGoals: editingGoal.subGoals,
    };
    setGoals(updated);
    setModalVisible(false);
  };

  const addNewGoal = () => {
    const newGoal = {
      id: Date.now().toString(),
      title: 'New Goal',
      subGoals: [
        { text: 'Subtask 1', done: false },
        { text: 'Subtask 2', done: false },
      ],
    };
    setGoals([newGoal, ...goals]);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH * 0.9}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: 20 }}
      >
        {goals.map((item, index) => (
          <View
            key={item.id}
            style={[
              styles.card,
              index !== 0 && { marginLeft: -CARD_WIDTH * 0.3 }, // overlap previous card
            ]}
          >
            <Pressable onPress={() => openEditModal(index)}>
              <Text style={styles.goalTitle}>{item.title}</Text>
            </Pressable>
            {item.subGoals.slice(0, 5).map((sub, subIndex) => (
              <Pressable
                key={subIndex}
                onPress={() => toggleSubGoal(index, subIndex)}
              >
                <Text style={[styles.subGoal, sub.done && styles.done]}>
                  {sub.done ? '✓' : '◻'} {sub.text}
                </Text>
              </Pressable>
            ))}
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={addNewGoal}>
        <Image
          source={require('../assets/icons/plus.png')}
          style={{ width: 32, height: 32 }}
        />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContent}>
          <TextInput
            value={editingGoal?.title}
            onChangeText={(text) =>
              setEditingGoal({ ...editingGoal, title: text })
            }
            style={styles.input}
          />
          <ScrollView>
            {editingGoal?.subGoals.map((sub, i) => (
              <TextInput
                key={i}
                value={sub.text}
                onChangeText={(text) => {
                  const updated = [...editingGoal.subGoals];
                  updated[i].text = text;
                  setEditingGoal({ ...editingGoal, subGoals: updated });
                }}
                style={styles.input}
              />
            ))}
          </ScrollView>
          <PrimaryButton onPress={saveGoalChanges}>Save</PrimaryButton>
        </View>
      </Modal>
    </View>
  );
}

export default CardStack;

const styles = StyleSheet.create({
  container: {
    
    paddingTop: 60,
    height: 380  
  },
  card: {
    width: CARD_WIDTH,
    height: 315,
    backgroundColor: '#FCEEDC',
    borderRadius: 20,
    padding: 20,
    marginRight: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  goalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 13,
  },
  subGoal: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  done: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  addButton: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: '#FFF',
   // padding: 12,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  modalContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 12,
    borderRadius: 8,
  },
});
