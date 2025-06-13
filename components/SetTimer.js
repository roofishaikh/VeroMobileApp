import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const DURATION_OPTIONS = Array.from({ length: 12 }, (_, i) => (i + 1) * 5); // [5, 10, ..., 60]

const SetTime = ({ onSet }) => {
  const [selectedTime, setSelectedTime] = useState(25); // default selection

  return (
    <View style={styles.card}>
      <Text style={styles.title}>How long do you want to work?</Text>

      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedTime}
          onValueChange={(itemValue) => setSelectedTime(itemValue)}
          style={styles.picker}
          itemStyle={styles.pickerItem}
        >
          {DURATION_OPTIONS.map((min) => (
            <Picker.Item key={min} label={`${min} min`} value={min} />
          ))}
        </Picker>
      </View>

      <Pressable style={styles.confirmButton} onPress={() => onSet(selectedTime)}>
        <Text style={styles.confirmText}>Set Time</Text>
      </Pressable>
    </View>
  );
};

export default SetTime;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF5E0',
    padding: 20,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  pickerWrapper: {
    width: '100%',
    height: Platform.OS === 'ios' ? 180 : 100,
    justifyContent: 'center',
    marginBottom: 20,
  },
  picker: {
    width: '100%',
  },
  pickerItem: {
    fontSize: 20,
    color: '#333',
    height: 180,
  },
  confirmButton: {
    backgroundColor: '#F67F69',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
