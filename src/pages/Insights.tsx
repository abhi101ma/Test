import React from 'react';
import InsightsPanel from '../components/InsightsPanel';
import ExportPanel from '../components/ExportPanel';
import MetricCard from '../components/MetricCard';
import { Brain, TrendingUp, Users, Target } from 'lucide-react';
import { influencers, trackingData, payouts, campaigns } from '../data/mockData';
import { calculateROAS } from '../utils/calculations';

const Insights: React.FC = () => {
  const overallMetrics = calculateROAS(trackingData, payouts);

  // Platform performance analysis
  const platformPerformance = influencers.reduce((acc, influencer) => {
    const platform = influencer.platform;
    const influencerTracking = trackingData.filter(t => t.influencerId === influencer.id);
    const influencerPayouts = payouts.filter(p => p.influencerId === influencer.id);
    const metrics = calculateROAS(influencerTracking, influencerPayouts);
    
    if (!acc[platform]) {
      acc[platform] = { revenue: 0, spend: 0, count: 0, roas: 0 };
    }
    acc[platform].revenue += metrics.totalRevenue;
    acc[platform].spend += metrics.totalSpend;
    acc[platform].count += 1;
    acc[platform].roas = acc[platform].spend > 0 ? acc[platform].revenue / acc[platform].spend : 0;
    
    return acc;
  }, {} as Record<string, { revenue: number; spend: number; count: number; roas: number }>);

  // Category insights
  const categoryInsights = influencers.reduce((acc, influencer) => {
    const category = influencer.category;
    const influencerTracking = trackingData.filter(t => t.influencerId === influencer.id);
    const orders = influencerTracking.reduce((sum, t) => sum + t.orders, 0);
    const avgEngagement = influencer.engagementRate;
    
    if (!acc[category]) {
      acc[category] = { orders: 0, engagement: 0, count: 0 };
    }
    acc[category].orders += orders;
    acc[category].engagement += avgEngagement;
    acc[category].count += 1;
    
    return acc;
  }, {} as Record<string, { orders: number; engagement: number; count: number }>);

  const handleExportCSV = () => {
    // Create CSV data
    const csvData = [
      ['Influencer', 'Platform', 'Category', 'Followers', 'Engagement Rate', 'Revenue', 'Orders', 'ROAS'],
      ...influencers.map(influencer => {
        const influencerTracking = trackingData.filter(t => t.influencerId === influencer.id);
        const influencerPayouts = payouts.filter(p => p.influencerId === influencer.id);
        const metrics = calculateROAS(influencerTracking, influencerPayouts);
        
        return [
          influencer.name,
          influencer.platform,
          influencer.category,
          influencer.followerCount.toString(),
          influencer.engagementRate.toString(),
          metrics.totalRevenue.toString(),
          metrics.orders.toString(),
          metrics.roas.toFixed(2)
        ];
      })
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'influencer_campaign_data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    // Create a simple text-based report
    const reportContent = `
HealthKart Influencer Campaign Report
=====================================

Overall Performance:
- Total Revenue: ₹${overallMetrics.totalRevenue.toLocaleString()}
- Total Spend: ₹${overallMetrics.totalSpend.toLocaleString()}
- ROAS: ${overallMetrics.roas.toFixed(2)}x
- Incremental ROAS: ${overallMetrics.incrementalROAS.toFixed(2)}x
- Total Orders: ${overallMetrics.orders}
- Cost per Order: ₹${overallMetrics.costPerOrder.toFixed(2)}

Platform Performance:
${Object.entries(platformPerformance).map(([platform, data]) => 
  `- ${platform}: ₹${data.revenue.toLocaleString()} revenue, ${data.roas.toFixed(2)}x ROAS`
).join('\n')}

Top Recommendations:
1. Focus budget on highest-performing platforms
2. Optimize underperforming influencer partnerships
3. Increase investment in top-performing categories
4. Implement performance-based payout structures

Generated on: ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'influencer_insights_report.txt';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Brain className="w-8 h-8 text-purple-500" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI-Powered Insights</h1>
          <p className="text-gray-600">Data-driven recommendations for campaign optimization</p>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <MetricCard
          title="Incremental ROAS"
          value={overallMetrics.incrementalROAS}
          change={12.3}
          icon={<TrendingUp className="w-6 h-6" />}
          color="green"
        />
        <MetricCard
          title="Conversion Rate"
          value={overallMetrics.conversionRate}
          format="percentage"
          change={8.7}
          icon={<Target className="w-6 h-6" />}
          color="blue"
        />
        <MetricCard
          title="Active Influencers"
          value={new Set(trackingData.map(t => t.influencerId)).size}
          change={15.2}
          icon={<Users className="w-6 h-6" />}
          color="purple"
        />
        <MetricCard
          title="Campaigns Running"
          value={campaigns.filter(c => c.status === 'active').length}
          change={-5.1}
          icon={<Brain className="w-6 h-6" />}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Insights */}
        <div className="lg:col-span-2">
          <InsightsPanel
            influencers={influencers}
            trackingData={trackingData}
            payouts={payouts}
          />
        </div>

        {/* Export and Additional Analytics */}
        <div className="space-y-6">
          <ExportPanel
            onExportCSV={handleExportCSV}
            onExportPDF={handleExportPDF}
          />

          {/* Platform Analysis */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Analysis</h3>
            
            <div className="space-y-3">
              {Object.entries(platformPerformance)
                .sort(([,a], [,b]) => b.roas - a.roas)
                .map(([platform, data]) => (
                  <div key={platform} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{platform}</p>
                      <p className="text-sm text-gray-600">{data.count} influencers</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">
                        ₹{(data.revenue / 1000).toFixed(0)}K
                      </p>
                      <p className="text-sm text-blue-600">{data.roas.toFixed(1)}x ROAS</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Category Performance */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Performance</h3>
            
            <div className="space-y-3">
              {Object.entries(categoryInsights)
                .sort(([,a], [,b]) => (b.orders / b.count) - (a.orders / a.count))
                .map(([category, data]) => (
                  <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{category}</p>
                      <p className="text-sm text-gray-600">
                        Avg {(data.engagement / data.count).toFixed(1)}% engagement
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-purple-600">
                        {Math.round(data.orders / data.count)} orders
                      </p>
                      <p className="text-sm text-gray-600">per influencer</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Strategic Recommendations</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Optimization Opportunities</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Reallocate budget to top-performing platforms</li>
              <li>• Increase engagement with high-converting categories</li>
              <li>• Implement tier-based influencer rewards</li>
              <li>• A/B test different content formats</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Growth Strategies</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Expand partnerships with micro-influencers</li>
              <li>• Develop long-term brand ambassador programs</li>
              <li>• Leverage seasonal trends for campaign timing</li>
              <li>• Cross-platform content syndication</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;