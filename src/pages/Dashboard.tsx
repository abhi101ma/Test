import React from 'react';
import { TrendingUp, Users, DollarSign, ShoppingCart, Eye, Heart } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import CampaignChart from '../components/CampaignChart';
import { influencers, trackingData, payouts, campaigns, posts } from '../data/mockData';
import { calculateROAS, formatCurrency } from '../utils/calculations';

const Dashboard: React.FC = () => {
  // Calculate overall metrics
  const overallMetrics = calculateROAS(trackingData, payouts);
  
  // Campaign performance data for chart
  const campaignPerformance = campaigns.map(campaign => {
    const campaignTracking = trackingData.filter(t => t.campaign === campaign.name);
    const campaignPayouts = payouts.filter(p => p.campaign === campaign.name);
    const metrics = calculateROAS(campaignTracking, campaignPayouts);
    
    return {
      campaign: campaign.name,
      revenue: metrics.totalRevenue,
      spend: metrics.totalSpend,
      roas: metrics.roas,
      orders: metrics.orders
    };
  });

  // Calculate additional metrics
  const totalReach = posts.reduce((sum, post) => sum + post.reach, 0);
  const totalEngagement = posts.reduce((sum, post) => sum + post.likes + post.comments + post.shares, 0);
  const avgEngagementRate = influencers.reduce((sum, inf) => sum + inf.engagementRate, 0) / influencers.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Campaign Performance Dashboard</h1>
        <p className="text-blue-100">Track, analyze, and optimize your influencer marketing campaigns</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <MetricCard
          title="Total Revenue"
          value={overallMetrics.totalRevenue}
          format="currency"
          change={12.5}
          icon={<DollarSign className="w-6 h-6" />}
          color="green"
        />
        <MetricCard
          title="ROAS"
          value={overallMetrics.roas}
          change={8.3}
          icon={<TrendingUp className="w-6 h-6" />}
          color="blue"
        />
        <MetricCard
          title="Total Orders"
          value={overallMetrics.orders}
          change={15.7}
          icon={<ShoppingCart className="w-6 h-6" />}
          color="purple"
        />
        <MetricCard
          title="Cost per Order"
          value={overallMetrics.costPerOrder}
          format="currency"
          change={-5.2}
          icon={<Users className="w-6 h-6" />}
          color="orange"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <MetricCard
          title="Total Reach"
          value={totalReach}
          change={22.1}
          icon={<Eye className="w-6 h-6" />}
          color="blue"
        />
        <MetricCard
          title="Avg Engagement Rate"
          value={avgEngagementRate}
          format="percentage"
          change={3.8}
          icon={<Heart className="w-6 h-6" />}
          color="purple"
        />
        <MetricCard
          title="Active Influencers"
          value={influencers.length}
          change={11.1}
          icon={<Users className="w-6 h-6" />}
          color="green"
        />
      </div>

      {/* Campaign Performance Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <CampaignChart data={campaignPerformance} />
        
        {/* Quick Stats */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Stats</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Incremental Revenue</p>
                <p className="font-semibold text-gray-900">{formatCurrency(overallMetrics.incrementalRevenue)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Incremental ROAS</p>
                <p className="font-semibold text-green-600">{overallMetrics.incrementalROAS.toFixed(1)}x</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Total Spend</p>
                <p className="font-semibold text-gray-900">{formatCurrency(overallMetrics.totalSpend)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <p className="font-semibold text-blue-600">{overallMetrics.conversionRate.toFixed(2)}%</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Total Engagement</p>
                <p className="font-semibold text-gray-900">{totalEngagement.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Active Campaigns</p>
                <p className="font-semibold text-purple-600">{campaigns.filter(c => c.status === 'active').length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;