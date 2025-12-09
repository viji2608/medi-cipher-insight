import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface AppSettings {
  darkMode: boolean;
  compactMode: boolean;
  notifications: boolean;
  soundEffects: boolean;
  showEncryptionBadge: boolean;
  autoScroll: boolean;
  responseStyle: 'concise' | 'detailed' | 'comprehensive';
  encryptionLevel: 'aes-128' | 'aes-256' | 'aes-512';
}

interface SettingsContextType {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  playSound: (type: 'send' | 'receive' | 'notification') => void;
  requestNotificationPermission: () => Promise<boolean>;
  showNotification: (title: string, body: string) => void;
}

const defaultSettings: AppSettings = {
  darkMode: true,
  compactMode: false,
  notifications: true,
  soundEffects: false,
  showEncryptionBadge: true,
  autoScroll: true,
  responseStyle: 'detailed',
  encryptionLevel: 'aes-256',
};

const STORAGE_KEY = 'medivault-settings';

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...defaultSettings, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.error('Failed to load settings:', e);
    }
    return defaultSettings;
  });

  // Apply dark mode to document
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  // Apply compact mode
  useEffect(() => {
    if (settings.compactMode) {
      document.documentElement.classList.add('compact');
    } else {
      document.documentElement.classList.remove('compact');
    }
  }, [settings.compactMode]);

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  }, [settings]);

  const updateSetting = useCallback(<K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const playSound = useCallback((type: 'send' | 'receive' | 'notification') => {
    if (!settings.soundEffects) return;
    
    // Create simple audio feedback using Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Different tones for different actions
      const frequencies = {
        send: 880,
        receive: 660,
        notification: 440,
      };
      
      oscillator.frequency.value = frequencies[type];
      oscillator.type = 'sine';
      gainNode.gain.value = 0.1;
      
      oscillator.start();
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
      console.error('Failed to play sound:', e);
    }
  }, [settings.soundEffects]);

  const requestNotificationPermission = useCallback(async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.log('Notifications not supported');
      return false;
    }
    
    if (Notification.permission === 'granted') {
      return true;
    }
    
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }, []);

  const showNotification = useCallback((title: string, body: string) => {
    if (!settings.notifications) return;
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;
    
    new Notification(title, {
      body,
      icon: '/favicon.ico',
      tag: 'medivault',
    });
  }, [settings.notifications]);

  return (
    <SettingsContext.Provider value={{
      settings,
      updateSetting,
      playSound,
      requestNotificationPermission,
      showNotification,
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
}
