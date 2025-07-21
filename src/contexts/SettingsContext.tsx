import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import {
  enhancedInfluencers,
  enhancedCampaigns,
  enhancedPosts,
  enhancedTrackingData,
  enhancedPayouts
} from '../data/enhancedMockData';

// 1. Define the shape of your settings state
interface SettingsState {
  darkMode: boolean;
  autoRefresh: boolean;
  defaultCurrency: 'INR' | 'USD' | 'EUR';
  emailNotifications: boolean;
  performanceAlerts: boolean;
  organizationName: string;
  timeZone: string;
}

// 2. Define the shape of the context value (state + functions)
interface SettingsContextType {
  settings: SettingsState;
  updateSetting: <K extends keyof SettingsState>(
    key: K,
    value: SettingsState[K]
  ) => void;
  saveSettings: () => void;
  clearCache: () => void;
  exportAllData: () => void;
}

// 3. Create the context
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// 4. Props interface for SettingsProvider (fix here - wrong curly brackets in your version)
interface SettingsProviderProps {
  children: ReactNode;
}

// 5. Implement the provider
export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<SettingsState>(() => {
    const savedSettings = localStorage.getItem('healthkart_settings');
    return savedSettings
      ? JSON.parse(savedSettings)
      : {
          darkMode: false,
          autoRefresh: false,
          defaultCurrency: 'INR',
          emailNotifications: true,
          performanceAlerts: true,
          organizationName: 'HealthKart',
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
        };
  });

  // Apply dark mode to HTML root class
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  // Save to localStorage on settings change
  useEffect(() => {
    localStorage.setItem('healthkart_settings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = useCallback(<K extends keyof SettingsState>(
    key: K,
    value: SettingsState[K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const saveSettings = useCallback(() => {
    console.log('Saving settings to backend:', settings);
    alert('Settings Saved!');
  }, [settings]);

  const clearCache = useCallback(() => {
    if (
      window.confirm(
        'Are you sure you want to clear all application data (except dark mode)? This will reload the page.'
      )
    ) {
      const darkModeSetting = settings.darkMode;
      localStorage.clear();
      localStorage.setItem(
        'healthkart_settings',
        JSON.stringify({ darkMode: darkModeSetting })
      );
      alert('Cache Cleared! Reloading page...');
      window.location.reload();
    }
  }, [settings.darkMode]);

  const exportAllData = useCallback(() => {
    const dataToExport = {
      influencers: enhancedInfluencers,
      campaigns: enhancedCampaigns,
      posts: enhancedPosts,
      trackingData: enhancedTrackingData,
      payouts: enhancedPayouts,
      settings: settings,
    };

    const jsonString = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const date = new Date().toISOString().split('T')[0];
    const a = document.createElement('a');
    a.href = url;
    a.download = `healthkart_analytics_export_${date}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('Data Exported Successfully!');
  }, [settings]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSetting,
        saveSettings,
        clearCache,
        exportAllData,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

// 6. Custom hook to consume settings context
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};