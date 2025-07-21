import React from 'react';
import { Search, Filter, X, Calendar } from 'lucide-react';

interface EnhancedFilterPanelProps {
  filters: {
    brand: string;
    platform: string;
    category: string;
    gender: string;
    campaign: string;
    product: string;
    searchTerm: string;
    dateRange: {
      start: string;
      end: string;
    };
  };
  onFilterChange: (key: string, value: string | { start: string; end: string }) => void;
  onClearFilters: () => void;
  availableOptions?: {
    brands?: string[];
    campaigns?: string[];
    products?: string[];
  };
}

const EnhancedFilterPanel: React.FC<EnhancedFilterPanelProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  availableOptions = {}
}) => {
  const {
    brands = ['All Brands', 'MuscleBlaze', 'HKVitals', 'Gritzo', 'HealthKart'],
    campaigns = ['All Campaigns'],
    products = ['All Products', 'Whey Protein', 'Multivitamins', 'Kids Nutrition', 'Mass Gainer']
  } = availableOptions;

  const platforms = ['All Platforms', 'Instagram', 'YouTube', 'Twitter'];
  const categories = ['All Categories', 'Fitness', 'Nutrition', 'Bodybuilding', 'Wellness'];
  const genders = ['All Genders', 'Male', 'Female', 'Other'];

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'dateRange') {
      const dateRange = value as { start: string; end: string };
      return dateRange.start !== '' || dateRange.end !== '';
    }
    return value !== '' && !value.toString().startsWith('All');
  });

  const handleDateRangeChange = (type: 'start' | 'end', value: string) => {
    onFilterChange('dateRange', {
      ...filters.dateRange,
      [type]: value
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <h3 className="font-semibold text-gray-900">Advanced Filters</h3>
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Search */}
        <div className="md:col-span-2 lg:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search influencers, campaigns..."
              value={filters.searchTerm}
              onChange={(e) => onFilterChange('searchTerm', e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Brand */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brand
          </label>
          <select
            value={filters.brand}
            onChange={(e) => onFilterChange('brand', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {brands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        {/* Platform */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Platform
          </label>
          <select
            value={filters.platform}
            onChange={(e) => onFilterChange('platform', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {platforms.map(platform => (
              <option key={platform} value={platform}>{platform}</option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Campaign */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Campaign
          </label>
          <select
            value={filters.campaign}
            onChange={(e) => onFilterChange('campaign', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {campaigns.map(campaign => (
              <option key={campaign} value={campaign}>{campaign}</option>
            ))}
          </select>
        </div>

        {/* Product */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Focus
          </label>
          <select
            value={filters.product}
            onChange={(e) => onFilterChange('product', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {products.map(product => (
              <option key={product} value={product}>{product}</option>
            ))}
          </select>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          <select
            value={filters.gender}
            onChange={(e) => onFilterChange('gender', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {genders.map(gender => (
              <option key={gender} value={gender}>{gender}</option>
            ))}
          </select>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Date Range
          </label>
          <div className="space-y-1 sm:space-y-2">
            <input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => handleDateRangeChange('start', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="Start date"
            />
            <input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => handleDateRangeChange('end', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="End date"
            />
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => {
              if (key === 'dateRange') {
                const dateRange = value as { start: string; end: string };
                if (dateRange.start || dateRange.end) {
                  return (
                    <span
                      key={key}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      Date: {dateRange.start || 'Start'} - {dateRange.end || 'End'}
                    </span>
                  );
                }
                return null;
              }
              
              if (value && !value.toString().startsWith('All') && value !== '') {
                return (
                  <span
                    key={key}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {key}: {value.toString()}
                  </span>
                );
              }
              return null;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedFilterPanel;