import React from 'react';
import { BarChart3, Users, TrendingUp, DollarSign, FileText, Settings, Brain, Shield, Zap } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSettingsClick: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, onSettingsClick }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'predictive', label: 'Predictive AI', icon: Brain },
    { id: 'enterprise', label: 'Enterprise', icon: Shield },
    { id: 'mmm', label: 'Marketing Mix', icon: TrendingUp },
    { id: 'competitive', label: 'Competitive Intel', icon: Shield },
    { id: 'workflow', label: 'Workflow Management', icon: Zap },
    { id: 'influencers', label: 'Influencers', icon: Users },
    { id: 'campaigns', label: 'Campaigns', icon: TrendingUp },
    { id: 'payouts', label: 'Payouts', icon: DollarSign },
    { id: 'insights', label: 'Basic Insights', icon: FileText },
    { id: 'advanced-insights', label: 'Advanced Analytics', icon: Brain },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">HealthKart Analytics</span>
          </div>
          
          <div className="flex flex-wrap gap-1 sm:space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
        
        <button
          onClick={onSettingsClick}
          className="self-end lg:self-auto p-2 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
};

export default Navigation;