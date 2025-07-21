import React, { useState } from 'react';
import { Filter, Calendar, DollarSign, Users, TrendingUp, X } from 'lucide-react';

interface FilterOption {
  id: string;
  label: string;
  value: string;
  count?: number;
}

interface AdvancedFilterBarProps {
  onFilterChange: (filters: { [key: string]: string }) => void;
  activeFilters: { [key: string]: string };
  className?: string;
}

const AdvancedFilterBar: React.FC<AdvancedFilterBarProps> = ({
  onFilterChange,
  activeFilters,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const timeRanges: FilterOption[] = [
    { id: 'last_7_days', label: 'Last 7 days', value: '7d' },
    { id: 'last_30_days', label: 'Last 30 days', value: '30d' },
    { id: 'last_90_days', label: 'Last 90 days', value: '90d' },
    { id: 'this_quarter', label: 'This quarter', value: 'q' },
    { id: 'this_year', label: 'This year', value: 'y' }
  ];

  const currencies: FilterOption[] = [
    { id: 'inr', label: 'INR (₹)', value: 'INR' },
    { id: 'usd', label: 'USD ($)', value: 'USD' },
    { id: 'eur', label: 'EUR (€)', value: 'EUR' }
  ];

  const campaigns: FilterOption[] = [
    { id: 'all', label: 'All Campaigns', value: 'all', count: 15 },
    { id: 'active', label: 'Active', value: 'active', count: 8 },
    { id: 'completed', label: 'Completed', value: 'completed', count: 5 },
    { id: 'paused', label: 'Paused', value: 'paused', count: 2 }
  ];

  const platforms: FilterOption[] = [
    { id: 'all', label: 'All Platforms', value: 'all' },
    { id: 'instagram', label: 'Instagram', value: 'instagram' },
    { id: 'youtube', label: 'YouTube', value: 'youtube' },
    { id: 'twitter', label: 'Twitter', value: 'twitter' }
  ];

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...activeFilters, [key]: value };
    onFilterChange(newFilters);
  };

  const clearFilter = (key: string) => {
    const newFilters = { ...activeFilters };
    delete newFilters[key];
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    onFilterChange({});
  };

  const activeFilterCount = Object.keys(activeFilters).length;

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <h3 className="font-medium text-gray-900">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {activeFilterCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-red-600 hover:text-red-700 transition-colors"
            >
              Clear all
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            {isExpanded ? 'Less' : 'More'} filters
          </button>
        </div>
      </div>

      {/* Quick filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {/* Time Range */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            <Calendar className="w-3 h-3 inline mr-1" />
            Time Range
          </label>
          <select
            value={activeFilters.timeRange || '30d'}
            onChange={(e) => handleFilterChange('timeRange', e.target.value)}
            className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {timeRanges.map(option => (
              <option key={option.id} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        {/* Currency */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            <DollarSign className="w-3 h-3 inline mr-1" />
            Currency
          </label>
          <select
            value={activeFilters.currency || 'INR'}
            onChange={(e) => handleFilterChange('currency', e.target.value)}
            className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {currencies.map(option => (
              <option key={option.id} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        {/* Campaign Status */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            <TrendingUp className="w-3 h-3 inline mr-1" />
            Campaigns
          </label>
          <select
            value={activeFilters.campaign || 'all'}
            onChange={(e) => handleFilterChange('campaign', e.target.value)}
            className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {campaigns.map(option => (
              <option key={option.id} value={option.value}>
                {option.label} {option.count && `(${option.count})`}
              </option>
            ))}
          </select>
        </div>

        {/* Platform */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            <Users className="w-3 h-3 inline mr-1" />
            Platform
          </label>
          <select
            value={activeFilters.platform || 'all'}
            onChange={(e) => handleFilterChange('platform', e.target.value)}
            className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {platforms.map(option => (
              <option key={option.id} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Expanded filters */}
      {isExpanded && (
        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Minimum ROAS</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={activeFilters.minROAS || ''}
                onChange={(e) => handleFilterChange('minROAS', e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 2.5"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Minimum Revenue</label>
              <input
                type="number"
                min="0"
                value={activeFilters.minRevenue || ''}
                onChange={(e) => handleFilterChange('minRevenue', e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 10000"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Influencer Category</label>
              <select
                value={activeFilters.category || 'all'}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="fitness">Fitness</option>
                <option value="nutrition">Nutrition</option>
                <option value="wellness">Wellness</option>
                <option value="bodybuilding">Bodybuilding</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Active filter tags */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
          {Object.entries(activeFilters).map(([key, value]) => (
            <span
              key={key}
              className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              {key}: {value}
              <button
                onClick={() => clearFilter(key)}
                className="ml-2 hover:text-blue-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdvancedFilterBar;