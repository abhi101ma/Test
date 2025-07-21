import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import EnhancedDashboard from './pages/EnhancedDashboard';
import Influencers from './pages/Influencers';
import Campaigns from './pages/Campaigns';
import Payouts from './pages/Payouts';
import Insights from './pages/Insights';
import AdvancedInsights from './pages/AdvancedInsights';
import PredictiveDashboard from './pages/PredictiveDashboard';
import EnterpriseDashboard from './pages/EnterpriseDashboard';
import MarketingMixModeling from './pages/MarketingMixModeling';
import CompetitiveDashboard from './pages/CompetitiveDashboard'; // Keep this import
import WorkflowDashboard from './pages/WorkflowDashboard';
import { useSettings } from './contexts/SettingsContext';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const { settings, updateSetting, saveSettings, clearCache, exportAllData } = useSettings();

  // Auto-refresh data logic
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (settings.autoRefresh) {
      intervalId = setInterval(() => {
        console.log('Auto-refreshing data...');
        // In a real app, you would trigger data refetching here
        // For now, it's just a console log
      }, 5 * 60 * 1000); // Every 5 minutes
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [settings.autoRefresh]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <EnhancedDashboard />;
      case 'predictive':
        return <PredictiveDashboard />;
      case 'enterprise':
        return <EnterpriseDashboard />;
      case 'mmm':
        return <MarketingMixModeling />;
      case 'competitive':
        return <CompetitiveDashboard />;
      case 'workflow':
        return <WorkflowDashboard />;
      case 'influencers':
        return <Influencers />;
      case 'campaigns':
        return <Campaigns />;
      case 'payouts':
        return <Payouts />;
      case 'insights':
        return <Insights />;
      case 'advanced-insights':
        return <AdvancedInsights />;
      default:
        return <EnhancedDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        onSettingsClick={() => setShowSettingsModal(true)}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 dark:text-gray-100">
        {renderContent()}
      </main>
      
      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Application Settings</h2>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-6">
              {/* General Settings */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">General Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Dark Mode</label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Switch to dark theme</p>
                    </div>
                    <button
                      onClick={() => updateSetting('darkMode', !settings.darkMode)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        settings.darkMode ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Auto-refresh Data</label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Automatically refresh dashboard data</p>
                    </div>
                    <button
                      onClick={() => updateSetting('autoRefresh', !settings.autoRefresh)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        settings.autoRefresh ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.autoRefresh ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Default Currency</label>
                    <select
                      value={settings.defaultCurrency}
                      onChange={(e) => updateSetting('defaultCurrency', e.target.value as 'INR' | 'USD' | 'EUR')}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="INR">Indian Rupee (₹)</option>
                      <option value="USD">US Dollar ($)</option>
                      <option value="EUR">Euro (€)</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Notification Settings */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Notifications</label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Receive campaign updates via email</p>
                    </div>
                    <button
                      onClick={() => updateSetting('emailNotifications', !settings.emailNotifications)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Performance Alerts</label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Get notified when campaigns underperform</p>
                    </div>
                    <button
                      onClick={() => updateSetting('performanceAlerts', !settings.performanceAlerts)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        settings.performanceAlerts ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.performanceAlerts ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Data & Privacy */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Data & Privacy</h3>
                <div className="space-y-4">
                  <button
                    onClick={exportAllData}
                    className="w-full text-left p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors bg-white dark:bg-gray-800"
                  >
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Export All Data</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Download all your campaign data</div>
                  </button>
                  
                  <button
                    onClick={clearCache}
                    className="w-full text-left p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors bg-white dark:bg-gray-800"
                  >
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Clear Cache</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Clear stored data and refresh</div>
                  </button>
                </div>
              </div>
              
              {/* Account Settings */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Account</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Organization Name</label>
                    <input
                      type="text"
                      value={settings.organizationName}
                      onChange={(e) => updateSetting('organizationName', e.target.value)}
                      onBlur={saveSettings} // Auto-save on blur
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time Zone</label>
                    <select
                      value={settings.timeZone}
                      onChange={(e) => updateSetting('timeZone', e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="Asia/Kolkata">India Standard Time (IST)</option>
                      <option value="UTC">Coordinated Universal Time (UTC)</option>
                      <option value="America/New_York">Eastern Time (ET)</option>
                      {/* Add more time zones as needed */}
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="Europe/London">London (GMT)</option>
                      <option value="Europe/Berlin">Berlin (CET)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveSettings}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;