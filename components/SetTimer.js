import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from "@expo/vector-icons";

const DURATION_OPTIONS = Array.from({ length: 12 }, (_, i) => (i + 1) * 5); // [5, 10, ..., 60]
const QUICK_PRESETS = [
  { label: '25 min', value: 25, icon: 'timer' },
  { label: '45 min', value: 45, icon: 'schedule' },
  { label: '60 min', value: 60, icon: 'hourglass-full' },
];

const SetTime = ({ onSet }) => {
  const [selectedTime, setSelectedTime] = useState(25);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Set Your Focus Timer</Text>
      <Text style={styles.subtitle}>Choose how long you want to work</Text>

      {/* Quick Preset Buttons */}
      <View style={styles.presetsContainer}>
        {QUICK_PRESETS.map((preset) => (
          <Pressable
            key={preset.value}
            style={[
              styles.presetButton,
              selectedTime === preset.value && styles.presetButtonActive
            ]}
            onPress={() => setSelectedTime(preset.value)}
          >
            <MaterialIcons 
              name={preset.icon} 
              size={20} 
              color={selectedTime === preset.value ? '#fff' : '#666'} 
            />
            <Text style={[
              styles.presetText,
              selectedTime === preset.value && styles.presetTextActive
            ]}>
              {preset.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Custom Time Picker */}
      <View style={styles.pickerSection}>
        <Text style={styles.pickerLabel}>Or choose custom time:</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedTime}
            onValueChange={(itemValue) => setSelectedTime(itemValue)}
            style={styles.picker}
            itemStyle={styles.pickerItem}
          >
            {DURATION_OPTIONS.map((min) => (
              <Picker.Item key={min} label={`${min} minutes`} value={min} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Set Time Button */}
      <Pressable style={styles.confirmButton} onPress={() => onSet(selectedTime)}>
        <MaterialIcons name="play-arrow" size={24} color="#fff" />
        <Text style={styles.confirmText}>Start {selectedTime} Minute Session</Text>
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
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 20,
    color: '#666',
  },
  presetsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  presetButton: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  presetButtonActive: {
    backgroundColor: '#F67F69',
    borderColor: '#F67F69',
  },
  presetText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 5,
  },
  presetTextActive: {
    color: '#fff',
  },
  pickerSection: {
    marginBottom: 20,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
