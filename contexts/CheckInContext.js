import React, { createContext, useContext, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

const CheckInContext = createContext();

export const useCheckIn = () => {
  const context = useContext(CheckInContext);
  if (!context) {
    throw new Error('useCheckIn must be used within a CheckInProvider');
  }
  return context;
};

export const CheckInProvider = ({ children }) => {
  const [checkInData, setCheckInData] = useState({
    primaryEmotion: null,
    tertiaryEmotion: null,
    energyLevel: null,
    mentalClarity: null,
    currentActivity: null,
  });

  const updateCheckInData = (key, value) => {
    setCheckInData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetCheckInData = () => {
    setCheckInData({
      primaryEmotion: null,
      tertiaryEmotion: null,
      energyLevel: null,
      mentalClarity: null,
      currentActivity: null,
    });
  };

  const value = {
    checkInData,
    updateCheckInData,
    resetCheckInData,
  };

  return (
    <CheckInContext.Provider value={value}>
      {children}
    </CheckInContext.Provider>
  );
};

const HABIT_STORAGE_KEY = 'vero_habit_data';
export async function markCheckInComplete() {
  const today = new Date().toISOString().slice(0, 10);
  let habitJson = await SecureStore.getItemAsync(HABIT_STORAGE_KEY);
  let habitObj = habitJson ? JSON.parse(habitJson) : {};
  if (!habitObj[today]) habitObj[today] = {};
  habitObj[today].checkin = true;
  await SecureStore.setItemAsync(HABIT_STORAGE_KEY, JSON.stringify(habitObj));
} 