import { useState, useEffect, useCallback } from 'react';

const SETTINGS_KEY = 'book-collection-settings';

interface Settings {
  apiKey: string;
  enableHaptics: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  apiKey: '',
  enableHaptics: true,
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      try {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
      } catch {
        // ignore
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }
  }, [settings, isLoaded]);

  const updateSettings = useCallback((updates: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  return { settings, updateSettings, isLoaded };
}
