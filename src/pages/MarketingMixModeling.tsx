import React, { useState, useEffect } from 'react';
import { TrendingUp, BarChart3, PieChart, Target, DollarSign, Activity } from 'lucide-react';
import { runMMMAnalysis, simulateBudgetAllocation } from '../utils/marketingMixModeling';
import type { ExternalChannelData, MMMResults } from '../utils/marketingMixModeling';
import { useSettings } from '../contexts/SettingsContext';
import { enhancedTrackingData, enhancedPayouts } from '../data/enhancedMockData';

export default function MarketingMixModeling() {
  const [mmmResults, setMmmResults] = useState<MMMResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { settings } = useSettings();

  useEffect(() => {
    const loadMMMData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate mock channel data from our existing data
        const mockChannelData: ExternalChannelData[] = [
          {
            channel: 'Influencer Marketing',
            spend: enhancedPayouts.reduce((sum, p) => sum + p.total_payout, 0),
            revenue: enhancedTrackingData.filter(t => t.attribution_source === 'influencer').reduce((sum, t) => sum + t.revenue, 0),
            impressions: 2500000,
            clicks: 125000,
            conversions: enhancedTrackingData.filter(t => t.attribution_source === 'influencer').length,
            seasonality: 1.2,
            competitorActivity: 0.3
          },
          {
            channel: 'Digital Advertising',
            spend: 800000,
            revenue: 2400000,
            impressions: 5000000,
            clicks: 200000,
            conversions: 1200,
            seasonality: 1.1,
            competitorActivity: 0.5
          },
          {
            channel: 'Social Media',
            spend: 300000,
            revenue: 900000,
            impressions: 3000000,
            clicks: 150000,
            conversions: 600,
            seasonality: 1.3,
            competitorActivity: 0.4
          },
          {
            channel: 'Email Marketing',
            spend: 150000,
            revenue: 600000,
            impressions: 1000000,
            clicks: 80000,
            conversions: 400,
            seasonality: 1.0,
            competitorActivity: 0.2
          },
          {
            channel: 'Content Marketing',
            spend: 200000,
            revenue: 500000,
            impressions: 800000,
            clicks: 40000,
            conversions: 250,
            seasonality: 1.1,
            competitorActivity: 0.3
          }
        ];
        
        const results = runMMMAnalysis(mockChannelData);
        setMmmResults(results);
      } catch (error) {
        console.error('Error loading MMM data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load MMM data');
      } finally {
        setLoading(false);
      }
    };

    loadMMMData();
  }, []);
  if (loading) {
    return (
      <div className="p-8 bg-white dark:bg-gray-900 min-h-screen">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400">
              <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              <span className="text-gray-700 dark:text-gray-300">Loading Marketing Mix Model...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !mmmResults) {
    return (
      <div className="p-8 bg-white dark:bg-gray-900 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Marketing Mix Modeling</h1>
        <div className="text-center py-12">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/40 rounded-full mx-auto mb-4">
              <Activity className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-medium text-red-900 dark:text-red-100 mb-2">Failed to Load MMM Data</h3>
            <p className="text-red-700 dark:text-red-300 mb-4">
              {error || 'Unable to load Marketing Mix Modeling data. Please try again.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white dark:bg-gray-900 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Marketing Mix Modeling</h1>
        <p className="text-gray-600 dark:text-gray-400">Analyze the contribution and effectiveness of all marketing channels</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Marketing Spend</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: settings.defaultCurrency,
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }).format(mmmResults.channelContributions.reduce((sum, c) => sum + (c.incrementalRevenue * 0.3), 0))}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-600" />
          </div>
          <p className="text-xs text-green-600 dark:text-green-400 mt-2">+15% from last quarter</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Overall ROAS</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{mmmResults.totalROAS.toFixed(1)}x</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-xs text-green-600 dark:text-green-400 mt-2">+8% improvement</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Best Performing Channel</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {mmmResults.channelContributions.sort((a, b) => b.efficiency - a.efficiency)[0]?.channel || 'Influencer'}
              </p>
            </div>
            <Target className="h-8 w-8 text-purple-600" />
          </div>
          <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">
            {mmmResults.channelContributions.sort((a, b) => b.efficiency - a.efficiency)[0]?.roas.toFixed(1) || '4.2'}x ROAS
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Model Confidence</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">92%</p>
            </div>
            <Activity className="h-8 w-8 text-orange-600" />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Statistical significance</p>
        </div>
      </div>

      {/* Channel Contributions */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <PieChart className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Channel Contribution</h3>
          </div>
          <div className="space-y-4">
            {mmmResults.channelContributions.map((channel, index) => (
              <div key={channel.channel} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-3"
                    style={{ backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index] }}
                  ></div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{channel.channel}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900 dark:text-gray-100">{channel.contribution.toFixed(1)}%</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{channel.roas.toFixed(1)}x ROAS</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <BarChart3 className="h-5 w-5 text-green-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Saturation Analysis</h3>
          </div>
          <div className="space-y-4">
            {mmmResults.saturationCurves.map((curve, index) => (
              <div key={curve.channel} className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900 dark:text-gray-100">{curve.channel}</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: settings.defaultCurrency,
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }).format(curve.currentSpend)}
                    <span className={`ml-2 ${curve.diminishingReturns ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                      ({curve.efficiencyScore.toFixed(1)}x)
                    </span>
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${curve.diminishingReturns ? 'bg-red-500' : 'bg-green-500'}`}
                    style={{ 
                      width: `${Math.min((curve.currentSpend / curve.optimalSpend) * 100, 100)}%`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights and Recommendations */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Key Insights & Recommendations</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {mmmResults.recommendations.slice(0, 4).map((recommendation, index) => (
            <div key={index} className={`p-4 rounded-lg ${
              index === 0 ? 'bg-blue-50 dark:bg-blue-900/20' :
              index === 1 ? 'bg-yellow-50 dark:bg-yellow-900/20' :
              index === 2 ? 'bg-green-50 dark:bg-green-900/20' :
              'bg-purple-50 dark:bg-purple-900/20'
            }`}>
            <h4 className={`font-medium mb-2 ${
              index === 0 ? 'text-blue-900 dark:text-blue-100' :
              index === 1 ? 'text-yellow-900 dark:text-yellow-100' :
              index === 2 ? 'text-green-900 dark:text-green-100' :
              'text-purple-900 dark:text-purple-100'
            }`}>
              {index === 0 ? 'Top Performer' :
               index === 1 ? 'Optimization Opportunity' :
               index === 2 ? 'Synergy Effect' :
               'Model Insight'}
            </h4>
            <p className={`text-sm ${
              index === 0 ? 'text-blue-800 dark:text-blue-200' :
              index === 1 ? 'text-yellow-800 dark:text-yellow-200' :
              index === 2 ? 'text-green-800 dark:text-green-200' :
              'text-purple-800 dark:text-purple-200'
            }`}>
              {recommendation}
            </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}