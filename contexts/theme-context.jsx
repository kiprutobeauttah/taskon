import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const themes = {
  default: {
    name: 'Ocean Breeze',
    primary: '#00D084',
    background: '#F8F9FA',
    card: '#FFFFFF',
    text: '#1A1A1A',
    textSecondary: '#9CA3AF',
    gradient: ['#00D084', '#00B8A9'],
    image: null,
  },
  sunset: {
    name: 'Sunset Glow',
    primary: '#FF6B6B',
    background: '#FFF5F5',
    card: '#FFFFFF',
    text: '#1A1A1A',
    textSecondary: '#9CA3AF',
    gradient: ['#FF6B6B', '#FFD93D'],
    image: null,
  },
  midnight: {
    name: 'Midnight Sky',
    primary: '#8B5CF6',
    background: '#1A1A2E',
    card: '#16213E',
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    gradient: ['#8B5CF6', '#3B82F6'],
    image: null,
  },
};

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState('default');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('@theme');
      if (savedTheme && themes[savedTheme]) {
        setCurrentTheme(savedTheme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const changeTheme = async (themeName) => {
    try {
      await AsyncStorage.setItem('@theme', themeName);
      setCurrentTheme(themeName);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      theme: themes[currentTheme], 
      currentTheme,
      changeTheme,
      themes 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within ThemeProvider');
  }
  return context;
}
