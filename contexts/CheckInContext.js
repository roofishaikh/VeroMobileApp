import React, { createContext, useContext, useState } from 'react';

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