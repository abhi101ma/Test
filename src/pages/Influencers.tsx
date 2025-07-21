import React, { useState, useMemo } from 'react';
import InfluencerCard from '../components/InfluencerCard';
import FilterPanel from '../components/FilterPanel';
import { influencers, trackingData, payouts } from '../data/mockData';
import { getInfluencerPerformanceScore } from '../utils/calculations';

const Influencers: React.FC = () => {
  const [filters, setFilters] = useState({
    brand: 'All Brands',
    platform: 'All Platforms',
    category: 'All Categories',
    gender: 'All Genders',
    searchTerm: ''
  });

  const [sortBy, setSortBy] = useState<'performance' | 'followers' | 'engagement' | 'revenue'>('performance');

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      brand: 'All Brands',
      platform: 'All Platforms',
      category: 'All Categories',
      gender: 'All Genders',
      searchTerm: ''
    });
  };

  const filteredInfluencers = useMemo(() => {
    return influencers.filter(influencer => {
      // Search filter
      if (filters.searchTerm && !influencer.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
        return false;
      }
      
      // Platform filter
      if (filters.platform !== 'All Platforms' && influencer.platform !== filters.platform) {
        return false;
      }
      
      // Category filter
      if (filters.category !== 'All Categories' && influencer.category !== filters.category) {
        return false;
      }
      
      // Gender filter
      if (filters.gender !== 'All Genders' && influencer.gender !== filters.gender) {
        return false;
      }
      
      // Brand filter (based on tracking data)
      if (filters.brand !== 'All Brands') {
        const influencerTracking = trackingData.filter(t => t.influencerId === influencer.id);
        const hasBrand = influencerTracking.some(t => t.brand === filters.brand);
        if (!hasBrand) return false;
      }
      
      return true;
    });
  }, [filters]);

  const sortedInfluencers = useMemo(() => {
    const influencersWithMetrics = filteredInfluencers.map(influencer => {
      const influencerTracking = trackingData.filter(t => t.influencerId === influencer.id);
      const totalRevenue = influencerTracking.reduce((sum, t) => sum + t.revenue, 0);
      const totalOrders = influencerTracking.reduce((sum, t) => sum + t.orders, 0);
      const performanceScore = getInfluencerPerformanceScore(influencer, trackingData, payouts);
      
      return {
        influencer,
        totalRevenue,
        totalOrders,
        performanceScore
      };
    });

    return influencersWithMetrics.sort((a, b) => {
      switch (sortBy) {
        case 'performance':
          return b.performanceScore - a.performanceScore;
        case 'followers':
          return b.influencer.followerCount - a.influencer.followerCount;
        case 'engagement':
          return b.influencer.engagementRate - a.influencer.engagementRate;
        case 'revenue':
          return b.totalRevenue - a.totalRevenue;
        default:
          return 0;
      }
    });
  }, [filteredInfluencers, sortBy]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Influencer Analytics</h1>
          <p className="text-gray-600">Manage and analyze influencer performance</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="performance">Performance Score</option>
            <option value="followers">Followers</option>
            <option value="engagement">Engagement Rate</option>
            <option value="revenue">Revenue Generated</option>
          </select>
        </div>
      </div>

      {/* Filters */}
      <FilterPanel
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Results Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <p className="text-sm text-gray-600">
          Showing <span className="font-medium">{sortedInfluencers.length}</span> of{' '}
          <span className="font-medium">{influencers.length}</span> influencers
        </p>
      </div>

      {/* Influencer Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {sortedInfluencers.map(({ influencer, totalRevenue, totalOrders, performanceScore }) => (
          <InfluencerCard
            key={influencer.id}
            influencer={influencer}
            performanceScore={performanceScore}
            totalRevenue={totalRevenue}
            totalOrders={totalOrders}
            onClick={() => {
              // Could implement detailed influencer view
              console.log('View details for', influencer.name);
            }}
          />
        ))}
      </div>

      {sortedInfluencers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No influencers found matching your filters.</p>
          <button
            onClick={handleClearFilters}
            className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Influencers;