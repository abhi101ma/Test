import React from 'react';
import { Bell, User, Settings, Search } from 'lucide-react';

interface PersonalizedHeaderProps {
  userName?: string;
  userRole?: string;
  notifications?: number;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
}

const PersonalizedHeader: React.FC<PersonalizedHeaderProps> = ({
  userName = "Rajesh",
  userRole = "Campaign Manager",
  notifications = 3,
  onNotificationClick,
  onProfileClick,
  onSettingsClick
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl p-6 text-white mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {getGreeting()}, {userName} 👋
            </h1>
            <p className="text-blue-100 opacity-90">{userRole} • HealthKart Analytics</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-white opacity-60" />
            <input
              type="text"
              placeholder="Search campaigns, influencers..."
              className="pl-10 pr-4 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-white placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            />
          </div>
          
          {/* Notifications */}
          <button
            onClick={onNotificationClick}
            className="relative p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all duration-200"
          >
            <Bell className="w-5 h-5" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                {notifications}
              </span>
            )}
          </button>
          
          {/* Settings */}
          <button
            onClick={onSettingsClick}
            className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all duration-200"
          >
            <Settings className="w-5 h-5" />
          </button>
          
          {/* Profile */}
          <button
            onClick={onProfileClick}
            className="flex items-center space-x-2 bg-white bg-opacity-20 rounded-lg px-3 py-2 hover:bg-opacity-30 transition-all duration-200"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold">
              {userName.charAt(0)}
            </div>
            <span className="hidden md:inline font-medium">{userName}</span>
          </button>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
          🎯 3 campaigns active
        </span>
        <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
          💰 {notifications} payments pending
        </span>
        <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
          📈 ROAS trending up 12%
        </span>
      </div>
    </div>
  );
};

export default PersonalizedHeader;