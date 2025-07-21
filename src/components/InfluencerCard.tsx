import React from 'react';
import { Instagram, Youtube, Users, Heart, MessageCircle, ExternalLink } from 'lucide-react';
import { Influencer } from '../types';
import { formatNumber } from '../utils/calculations';

interface InfluencerCardProps {
  influencer: Influencer;
  performanceScore?: number;
  totalRevenue?: number;
  totalOrders?: number;
  onClick?: () => void;
}

const InfluencerCard: React.FC<InfluencerCardProps> = ({
  influencer,
  performanceScore,
  totalRevenue,
  totalOrders,
  onClick
}) => {
  const getPlatformIcon = () => {
    switch (influencer.platform.toLowerCase()) {
      case 'instagram':
        return <Instagram className="w-5 h-5 text-pink-500" />;
      case 'youtube':
        return <Youtube className="w-5 h-5 text-red-500" />;
      default:
        return <Users className="w-5 h-5 text-blue-500" />;
    }
  };

  const getScoreColor = (score?: number) => {
    if (!score) return 'bg-gray-100 text-gray-600';
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <img
            src={influencer.profileImage}
            alt={influencer.name}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{influencer.name}</h3>
            <p className="text-sm text-gray-500">{influencer.category}</p>
          </div>
        </div>
        
        {performanceScore && (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(performanceScore)}`}>
            {performanceScore}/100
          </span>
        )}
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4 mb-4 flex-wrap">
        <div className="flex items-center space-x-1">
          {getPlatformIcon()}
          <span className="text-xs sm:text-sm text-gray-600">{influencer.platform}</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-xs sm:text-sm text-gray-600">{formatNumber(influencer.followerCount)}</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <Heart className="w-4 h-4 text-gray-400" />
          <span className="text-xs sm:text-sm text-gray-600">{influencer.engagementRate}%</span>
        </div>
      </div>

      {(totalRevenue || totalOrders) && (
        <div className="pt-4 border-t border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
            {totalRevenue && (
              <div>
                <p className="text-xs text-gray-500">Revenue</p>
                <p className="font-semibold text-green-600 text-sm">
                  ₹{formatNumber(totalRevenue)}
                </p>
              </div>
            )}
            {totalOrders && (
              <div>
                <p className="text-xs text-gray-500">Orders</p>
                <p className="font-semibold text-blue-600 text-sm">{totalOrders}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InfluencerCard;