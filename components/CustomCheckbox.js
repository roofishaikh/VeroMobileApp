import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const CustomCheckbox = ({ status, disabled = false, onPress, size = 24 }) => {
  const isChecked = status === 'checked';
  
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.checkbox,
        isChecked ? styles.checked : styles.unchecked,
        { width: size, height: size }
      ]}
    >
      {isChecked && (
        <MaterialIcons 
          name="check" 
          size={size * 0.6} 
          color="white" 
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  checked: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  unchecked: {
    backgroundColor: 'transparent',
    borderColor: '#ccc',
  },
});

export default CustomCheckbox; 