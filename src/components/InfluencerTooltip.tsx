import React from 'react';
import { Users, Heart, TrendingUp, Star } from 'lucide-react';

interface InfluencerTooltipProps {
  influencer: {
    name: string;
    platform: string;
    follower_count: number;
    avg_engagement_rate: number;
    avg_campaign_performance: number;
    profileImage?: string;
    primary_category: string;
  };
  isVisible: boolean;
  position: { x: number; y: number };
}

const InfluencerTooltip: React.FC<InfluencerTooltipProps> = ({
  influencer,
  isVisible,
  position
}) => {
  if (!isVisible) return null;

  const formatNumber = (num: number) => {
    if (num === undefined || num === null || typeof num !== 'number') {
      return '-';
    }
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getPerformanceColor = (score: number) => {
    if (score === undefined || score === null || typeof score !== 'number') {
      return 'text-gray-500';
    }
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div
      className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-72 pointer-events-none"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -100%)'
      }}
    >
      {/* Header */}
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
          {influencer.name.charAt(0)}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{influencer.name}</h3>
          <p className="text-sm text-gray-500">{influencer.platform} • {influencer.primary_category}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="text-center p-2 bg-blue-50 rounded-lg">
          <Users className="w-4 h-4 text-blue-500 mx-auto mb-1" />
          <p className="text-xs text-blue-700">Followers</p>
          <p className="font-semibold text-blue-900">{formatNumber(influencer.follower_count)}</p>
        </div>
        
        <div className="text-center p-2 bg-green-50 rounded-lg">
          <Heart className="w-4 h-4 text-green-500 mx-auto mb-1" />
          <p className="text-xs text-green-700">Engagement</p>
          <p className="font-semibold text-green-900">{(influencer.avg_engagement_rate || 0).toFixed(1)}%</p>
        </div>
      </div>

      {/* Performance Score */}
      <div className="bg-gray-50 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Campaign Performance</span>
          <Star className="w-4 h-4 text-yellow-500" />
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                (influencer.avg_campaign_performance || 0) >= 80 ? 'bg-green-500' :
                (influencer.avg_campaign_performance || 0) >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${influencer.avg_campaign_performance || 0}%` }}
            />
          </div>
          <span className={`text-sm font-semibold ${getPerformanceColor(influencer.avg_campaign_performance)}`}>
            {influencer.avg_campaign_performance || 0}/100
          </span>
        </div>
      </div>

      {/* Arrow */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
        <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white"></div>
      </div>
    </div>
  );
};

export default InfluencerTooltip;