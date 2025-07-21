import React from 'react';
import { Users, Eye, MessageCircle } from 'lucide-react';

interface OnlineUser {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  lastSeen: string;
  isActive: boolean;
}

interface CollaborationIndicatorProps {
  onlineUsers: OnlineUser[];
  currentUserId: string;
  showDetails?: boolean;
}

const CollaborationIndicator: React.FC<CollaborationIndicatorProps> = ({
  onlineUsers,
  currentUserId,
  showDetails = false
}) => {
  const activeUsers = onlineUsers.filter(user => user.isActive && user.id !== currentUserId);
  const recentUsers = onlineUsers.filter(user => !user.isActive && user.id !== currentUserId);
  
  // Simulate real-time updates for demo
  const [lastUpdate, setLastUpdate] = React.useState(Date.now());
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(Date.now());
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 
      'bg-red-500', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (activeUsers.length === 0 && !showDetails) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
      <div className="flex items-center space-x-2 mb-2">
        <Users className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">
          {activeUsers.length > 0 ? 'Currently Online' : 'Team Activity'}
        </span>
      </div>

      {/* Active users */}
      {activeUsers.length > 0 && (
        <div className="space-y-2 mb-3">
          {activeUsers.slice(0, 3).map((user) => (
            <div key={user.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="relative">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className={`w-8 h-8 rounded-full ${getAvatarColor(user.name)} flex items-center justify-center text-white text-sm font-medium`}>
                    {getInitials(user.name)}
                  </div>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-600">{user.role}</p>
              </div>
              <div className="flex items-center space-x-1">
                <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 rounded-full">
                  <Eye className="w-3 h-3 text-green-600" />
                  <span className="text-xs font-medium text-green-700">viewing</span>
                </div>
              </div>
            </div>
          ))}
          
          {activeUsers.length > 3 && (
            <div className="text-xs text-gray-500 text-center">
              +{activeUsers.length - 3} more online
            </div>
          )}
        </div>
      )}

      {/* Recent activity */}
      {showDetails && recentUsers.length > 0 && (
        <div className="border-t border-gray-100 pt-2">
          <p className="text-xs text-gray-500 mb-2">Recent Activity</p>
          <div className="space-y-1">
            {recentUsers.slice(0, 2).map((user) => (
              <div key={user.id} className="flex items-center space-x-3 p-1 rounded hover:bg-gray-50 transition-colors">
                <div className={`w-6 h-6 rounded-full ${getAvatarColor(user.name)} flex items-center justify-center text-white text-xs font-medium`}>
                  {getInitials(user.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-700 truncate">{user.name}</p>
                </div>
                <p className="text-xs text-gray-500">{user.lastSeen}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick actions */}
      {activeUsers.length > 0 && (
        <div className="border-t border-gray-100 pt-2 mt-2">
          <button 
            onClick={() => alert('Starting collaboration session...')}
            className="flex items-center space-x-2 w-full text-left p-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Start collaboration</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default CollaborationIndicator;