import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, DollarSign, ShoppingCart, Eye, Heart, Upload, Target, RefreshCw, X, Bell, AlertTriangle, Brain, Zap } from 'lucide-react';
import EnhancedMetricCard from '../components/EnhancedMetricCard';
import AnimatedMetricCard from '../components/AnimatedMetricCard';
import PersonalizedHeader from '../components/PersonalizedHeader';
import AdvancedFilterBar from '../components/AdvancedFilterBar';
import DonutChart from '../components/DonutChart';
import TimelineVisualization from '../components/TimelineVisualization';
import InfluencerTooltip from '../components/InfluencerTooltip';
import HeatmapChart from '../components/HeatmapChart';
import FunnelChart from '../components/FunnelChart';
import MultiLineChart from '../components/MultiLineChart';
import ActionableAlert from '../components/ActionableAlert';
import SmartRecommendations from '../components/SmartRecommendations';
import InteractiveKPICard from '../components/InteractiveKPICard';
import CollaborationIndicator from '../components/CollaborationIndicator';
import CampaignChart from '../components/CampaignChart'; // Keep this import
import { useSettings } from '../contexts/SettingsContext';
import DataUploader from '../components/DataUploader';
import { 
  enhancedInfluencers, 
  enhancedCampaigns, 
  enhancedPosts, 
  enhancedTrackingData, 
  enhancedPayouts 
} from '../data/enhancedMockData'; // Keep this import
import { calculateIncrementalROAS, formatCurrency } from '../utils/enhancedCalculations';

const EnhancedDashboard: React.FC = () => {
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [notifications, setNotifications] = useState(3);
  const [hoveredInfluencer, setHoveredInfluencer] = useState<any>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [pinnedCards, setPinnedCards] = useState<Set<string>>(new Set(['incremental-revenue', 'incremental-roas']));
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All Platforms');
  const [showTrendlines, setShowTrendlines] = useState(false);
  const [data, setData] = useState({
    influencers: enhancedInfluencers,
    campaigns: enhancedCampaigns,
    posts: enhancedPosts,
    trackingData: enhancedTrackingData,
    payouts: enhancedPayouts
  });
  const { settings } = useSettings();

  // Calculate overall metrics using enhanced calculations
  const overallMetrics = calculateIncrementalROAS(data.trackingData, data.payouts);
  
  // Campaign performance data for chart
  const campaignPerformance = data.campaigns.map(campaign => {
    const campaignTracking = data.trackingData.filter(t => 
      t.attribution_details.campaign_id === campaign.campaign_id
    );
    const campaignPayouts = data.payouts.filter(p => p.campaign_id === campaign.campaign_id);
    const metrics = calculateIncrementalROAS(campaignTracking, campaignPayouts);
    
    return {
      campaign: campaign.campaign_name,
      revenue: metrics.total_revenue,
      spend: metrics.total_spend,
      roas: metrics.roas,
      orders: metrics.orders
    };
  });

  // Calculate additional metrics
  const totalReach = data.posts.reduce((sum, post) => sum + post.reach, 0);
  const totalEngagement = data.posts.reduce((sum, post) => 
    sum + post.likes + post.comments + post.shares, 0
  );
  const avgEngagementRate = data.influencers.reduce((sum, inf) => 
    sum + inf.avg_engagement_rate, 0
  ) / data.influencers.length;

  // New customer acquisition rate
  const newCustomerRate = data.trackingData.filter(t => 
    t.attribution_source === 'influencer' && t.is_new_customer
  ).length / data.trackingData.filter(t => t.attribution_source === 'influencer').length * 100;

  // Generate heatmap data for campaign performance by platform
  const heatmapData = data.campaigns.flatMap(campaign => 
    ['Instagram', 'YouTube', 'Twitter'].map(platform => {
      const platformPosts = data.posts.filter(p => 
        p.campaign_id === campaign.campaign_id && 
        data.influencers.find(i => i.influencer_id === p.influencer_id)?.platform === platform
      );
      const avgEngagement = platformPosts.length > 0 
        ? platformPosts.reduce((sum, p) => sum + (p.likes + p.comments + p.shares) / p.impressions, 0) / platformPosts.length * 100
        : 0;
      
      return {
        x: platform,
        y: campaign.campaign_name.substring(0, 10) + '...',
        value: avgEngagement,
        label: `${avgEngagement.toFixed(1)}% engagement`
      };
    })
  );

  // Funnel data for customer journey
  const funnelData = [
    { label: 'Impressions', value: data.posts.reduce((sum, p) => sum + p.impressions, 0), color: '#3B82F6' },
    { label: 'Clicks', value: Math.round(data.posts.reduce((sum, p) => sum + p.impressions, 0) * 0.05), color: '#10B981' },
    { label: 'Visits', value: Math.round(data.posts.reduce((sum, p) => sum + p.impressions, 0) * 0.03), color: '#F59E0B' },
    { label: 'Orders', value: data.trackingData.length, color: '#EF4444' }
  ];

  // Multi-line chart data for ROAS trends
  const generateMultiLineData = () => {
    // Filter data based on selected platform
    let filteredPosts = data.posts;
    let filteredTracking = data.trackingData;
    
    if (selectedPlatform !== 'All Platforms') {
      const platformInfluencers = data.influencers
        .filter(inf => inf.platform === selectedPlatform)
        .map(inf => inf.influencer_id);
      
      filteredPosts = data.posts.filter(post => 
        platformInfluencers.includes(post.influencer_id)
      );
      filteredTracking = data.trackingData.filter(t => 
        platformInfluencers.includes(t.attribution_details.influencer_id || '')
      );
    }

    // Calculate monthly ROAS data
    const monthlyData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(month => {
      const monthRevenue = filteredTracking
        .filter(t => t.attribution_source === 'influencer')
        .reduce((sum, t) => sum + t.revenue, 0) * (0.8 + Math.random() * 0.4);
      
      const monthSpend = data.payouts
        .reduce((sum, p) => sum + p.total_payout, 0) * (0.8 + Math.random() * 0.4);
      
      const roas = monthSpend > 0 ? monthRevenue / monthSpend : 0;
      const incrementalRoas = roas * (0.7 + Math.random() * 0.3);
      
      return { month, roas, incrementalRoas };
    });

    return [
      {
        label: 'Overall ROAS',
        data: monthlyData.map(d => ({ x: d.month, y: d.roas })),
        color: '#3B82F6',
        lineType: 'solid' as const
      },
      {
        label: 'Incremental ROAS',
        data: monthlyData.map(d => ({ x: d.month, y: d.incrementalRoas })),
        color: '#10B981',
        lineType: 'dashed' as const
      }
    ];
  };

  const multiLineData = generateMultiLineData();

  // Chart annotations for important events
  const chartAnnotations = [
    { x: 'Mar', label: 'Campaign Launch', color: '#F59E0B', type: 'event' as const },
    { x: 'May', label: 'Platform Update', color: '#8B5CF6', type: 'milestone' as const }
  ];

  const handleExportChartImage = () => {
    console.log('Exporting ROAS chart as image...');
    // The MultiLineChart component will handle the actual export
  };

  const handleExportChartData = () => {
    console.log('Exporting ROAS chart data as CSV...');
    // The MultiLineChart component will handle the actual export
  };

  // Smart recommendations
  const smartRecommendations = [
    {
      id: 'opt_1',
      type: 'optimization' as const,
      title: 'Optimize Instagram Campaign Budget',
      description: 'Instagram campaigns show 23% higher ROAS than average. Consider reallocating budget from underperforming channels.',
      impact: 'high' as const,
      effort: 'easy' as const,
      expectedOutcome: '+₹2.4L additional revenue',
      confidence: 87,
      actions: ['Increase Instagram budget by 30%', 'Reduce Twitter spend by 20%', 'Monitor for 2 weeks'],
      relatedMetrics: ['ROAS', 'Revenue', 'Cost per Order']
    },
    {
      id: 'opp_1',
      type: 'opportunity' as const,
      title: 'High-Potential Influencer Identified',
      description: 'Fitness Guru Raj shows exceptional engagement rates and audience alignment. Consider long-term partnership.',
      impact: 'medium' as const,
      effort: 'medium' as const,
      expectedOutcome: '+15% campaign performance',
      confidence: 92,
      actions: ['Schedule partnership meeting', 'Negotiate exclusive rates', 'Plan Q3 campaigns'],
      relatedMetrics: ['Engagement Rate', 'Audience Fit', 'Brand Safety']
    },
    {
      id: 'warn_1',
      type: 'warning' as const,
      title: 'Attribution Confidence Declining',
      description: 'Only 67% of orders have clear attribution. This affects ROAS accuracy and optimization decisions.',
      impact: 'high' as const,
      effort: 'medium' as const,
      expectedOutcome: '+25% attribution accuracy',
      confidence: 78,
      actions: ['Implement UTM tracking', 'Increase coupon code usage', 'Review attribution model'],
      relatedMetrics: ['Attribution Confidence', 'Tracking Accuracy']
    }
  ];

  // Actionable alerts
  const actionableAlerts = [
    {
      id: 'alert_1',
      type: 'warning' as const,
      title: 'ROAS Below Target',
      description: 'Current ROAS is below the 3.5x target. Immediate optimization needed.',
      metric: {
        current: overallMetrics.roas,
        target: 3.5,
        format: 'number' as const
      },
      actions: [
        { label: 'View Optimization', onClick: () => alert('Opening optimization panel...'), variant: 'primary' as const },
        { label: 'Analyze Campaigns', onClick: () => alert('Analyzing campaigns...'), variant: 'secondary' as const }
      ],
      trend: overallMetrics.roas > 2.5 ? 'up' as const : 'down' as const
    },
    {
      id: 'alert_2',
      type: 'info' as const,
      title: 'New Customer Acquisition Strong',
      description: 'You\'re acquiring new customers at 67% rate - excellent performance!',
      metric: {
        current: newCustomerRate,
        target: 60,
        format: 'percentage' as const
      },
      actions: [
        { label: 'Scale Successful Campaigns', onClick: () => alert('Scaling campaigns...'), variant: 'primary' as const }
      ],
      trend: 'up' as const
    }
  ].filter(alert => !dismissedAlerts.has(alert.id));

  // Online users for collaboration
  const onlineUsers = [
    { id: '1', name: 'Priya Sharma', role: 'Marketing Manager', lastSeen: '2 min ago', isActive: true },
    { id: '2', name: 'Arjun Patel', role: 'Data Analyst', lastSeen: '5 min ago', isActive: true },
    { id: '3', name: 'Sneha Kumar', role: 'Campaign Specialist', lastSeen: '1 hour ago', isActive: false }
  ];
  // Generate chart data for micro-charts
  const generateChartData = (days: number = 7) => {
    return Array.from({ length: days }, () => Math.floor(Math.random() * 100) + 50);
  };

  // Payment method breakdown for donut chart
  const paymentMethodData = [
    { label: 'Fixed per Post', value: 45, color: '#3B82F6' },
    { label: 'Cost per Order', value: 30, color: '#10B981' },
    { label: 'Hybrid', value: 20, color: '#8B5CF6' },
    { label: 'Barter', value: 5, color: '#F59E0B' }
  ];

  // Timeline events
  const timelineEvents = [
    {
      id: '1',
      title: 'Campaign Launch',
      description: 'MuscleBlaze Protein Campaign went live',
      date: '2024-01-15',
      status: 'completed' as const,
      type: 'campaign' as const
    },
    {
      id: '2',
      title: 'Content Approval',
      description: '5 posts approved for publishing',
      date: '2024-01-20',
      status: 'completed' as const,
      type: 'approval' as const
    },
    {
      id: '3',
      title: 'Payment Processing',
      description: '3 influencer payments pending approval',
      date: '2024-01-25',
      status: 'in_progress' as const,
      type: 'payment' as const
    }
  ];

  // Top performing influencers with tooltip data
  const topInfluencers = data.influencers.slice(0, 5).map(inf => ({
    ...inf,
    avgCampaignPerformance: Math.floor(Math.random() * 40) + 60 // 60-100 score
  }));

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleDataUpload = (uploadedData: any[], dataType: string) => {
    setData(prev => ({
      ...prev,
      [dataType]: uploadedData
    }));
  };

  const handlePinCard = (cardId: string) => {
    setPinnedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  const handleDismissAlert = (alertId: string) => {
    setDismissedAlerts(prev => new Set(prev).add(alertId));
  };

  const handleNotificationClick = () => {
    setShowNotificationsModal(true);
    setNotifications(0); // Clear notification count
  };

  const handleProfileClick = () => {
    setShowProfileModal(true);
  };

  const handleSettingsClick = () => {
    alert('Settings panel would open here');
  };

  return (
    <div className="space-y-6">
      {/* Personalized Header */}
      <PersonalizedHeader
        userName="Rajesh"
        userRole="Campaign Manager"
        notifications={notifications}
        onNotificationClick={handleNotificationClick}
        onProfileClick={handleProfileClick}
        onSettingsClick={handleSettingsClick}
      />

      {/* Collaboration Indicator */}
      <div className="flex justify-end">
        <CollaborationIndicator
          onlineUsers={onlineUsers}
          currentUserId="current_user"
        />
      </div>

      {/* Advanced Filter Bar */}
      <AdvancedFilterBar
        activeFilters={filters}
        onFilterChange={setFilters}
      />

      {/* Key Metrics - Enhanced with Animations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <InteractiveKPICard
          title="Incremental Revenue"
          value={overallMetrics.incremental_revenue}
          previousValue={overallMetrics.incremental_revenue * 0.87}
          format="currency"
          icon={<DollarSign className="w-6 h-6" />}
          color="green"
          subtitle="Revenue above baseline"
          chartData={generateChartData()}
          chartType="area"
          isPinned={pinnedCards.has('incremental-revenue')}
          onPin={() => handlePinCard('incremental-revenue')}
          onDrillDown={() => alert('Drilling down to revenue details...')}
          goal={{ target: overallMetrics.incremental_revenue * 1.2, label: 'Q2 Target' }}
          tooltip="Revenue generated above what would have occurred organically without influencer marketing"
        />
        <InteractiveKPICard
          title="Incremental ROAS"
          value={overallMetrics.incremental_roas}
          previousValue={overallMetrics.incremental_roas * 0.89}
          format="number"
          icon={<TrendingUp className="w-6 h-6" />}
          color="blue"
          subtitle="True marketing impact"
          chartData={generateChartData()}
          chartType="line"
          isPinned={pinnedCards.has('incremental-roas')}
          onPin={() => handlePinCard('incremental-roas')}
          onDrillDown={() => alert('Drilling down to ROAS analysis...')}
          goal={{ target: 3.5, label: 'Target ROAS' }}
          alerts={overallMetrics.incremental_roas < 2.5 ? [{ type: 'warning', message: 'Below target' }] : []}
          tooltip="Return on ad spend for incremental revenue only, excluding baseline sales"
        />
        <InteractiveKPICard
          title="Incremental Orders"
          value={overallMetrics.incremental_orders}
          previousValue={overallMetrics.incremental_orders * 0.84}
          format="number"
          icon={<ShoppingCart className="w-6 h-6" />}
          color="purple"
          subtitle="Orders above baseline"
          chartData={generateChartData()}
          chartType="bar"
          isPinned={pinnedCards.has('incremental-orders')}
          onPin={() => handlePinCard('incremental-orders')}
          onDrillDown={() => alert('Drilling down to order analysis...')}
          tooltip="Orders generated above organic baseline through influencer marketing efforts"
        />
        <InteractiveKPICard
          title="New Customer Rate"
          value={newCustomerRate}
          previousValue={newCustomerRate * 0.92}
          format="percentage"
          icon={<Users className="w-6 h-6" />}
          color="orange"
          subtitle="First-time buyers"
          chartData={generateChartData()}
          chartType="area"
          isPinned={pinnedCards.has('new-customer-rate')}
          onPin={() => handlePinCard('new-customer-rate')}
          onDrillDown={() => alert('Drilling down to customer acquisition...')}
          goal={{ target: 70, label: 'Acquisition Target' }}
          alerts={newCustomerRate > 60 ? [{ type: 'success', message: 'Excellent acquisition' }] : []}
          tooltip="Percentage of orders from first-time customers acquired through influencer campaigns"
        />
      </div>

      {/* Actionable Alerts */}
      {actionableAlerts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <span>Action Required</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {actionableAlerts.map(alert => (
              <ActionableAlert
                key={alert.id}
                {...alert}
                onDismiss={() => handleDismissAlert(alert.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <EnhancedMetricCard
          title="Attribution Confidence"
          value={overallMetrics.attribution_confidence}
          format="percentage"
          icon={<Target className="w-6 h-6" />}
          color="blue"
          subtitle="Tracking accuracy"
          tooltip="Percentage of orders with clear attribution to influencers"
        />
        <EnhancedMetricCard
          title="Total Reach"
          value={totalReach}
          change={22.1}
          icon={<Eye className="w-6 h-6" />}
          color="green"
          subtitle="Across all platforms"
        />
        <EnhancedMetricCard
          title="Avg Engagement Rate"
          value={avgEngagementRate}
          format="percentage"
          change={3.8}
          icon={<Heart className="w-6 h-6" />}
          color="purple"
          subtitle="Platform average"
        />
        <EnhancedMetricCard
          title="Active Influencers"
          value={data.influencers.length}
          change={11.1}
          icon={<Users className="w-6 h-6" />}
          color="orange"
          subtitle="In current campaigns"
        />
      </div>

      {/* Advanced Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Campaign Performance Heatmap */}
        <div className="lg:col-span-1">
          <HeatmapChart
            data={heatmapData}
            title="Campaign Performance by Platform"
            colorScheme="blue"
            cellSize={50}
          />
        </div>
        
        {/* Customer Journey Funnel */}
        <div className="lg:col-span-1">
          <FunnelChart
            stages={funnelData}
            title="Customer Journey Funnel"
            height={320}
          />
        </div>
        
        {/* ROAS Trends */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">ROAS Trends Over Time</h3>
            <div className="flex items-center space-x-3">
              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={showTrendlines}
                  onChange={(e) => setShowTrendlines(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">Show Trendlines</span>
              </label>
            </div>
          </div>
          
          <MultiLineChart
            lines={multiLineData}
            height={300}
            width={500}
            showTrendlines={showTrendlines}
            annotations={chartAnnotations}
            onExportImage={handleExportChartImage}
            onExportData={handleExportChartData}
            filterOptions={{
              platforms: ['All Platforms', 'Instagram', 'YouTube', 'Twitter'],
              selectedPlatform,
              onPlatformChange: setSelectedPlatform
            }}
          />
          
          {/* Chart Insights */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Key Insights</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-blue-700">Trend Direction</p>
                <p className="font-semibold text-blue-900">
                  {multiLineData[0]?.data[multiLineData[0].data.length - 1]?.y > multiLineData[0]?.data[0]?.y ? '📈 Upward' : '📉 Downward'}
                </p>
              </div>
              <div>
                <p className="text-blue-700">Best Month</p>
                <p className="font-semibold text-blue-900">
                  {multiLineData[0]?.data.reduce((best, current) => current.y > best.y ? current : best)?.x || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-blue-700">Platform Filter</p>
                <p className="font-semibold text-blue-900">{selectedPlatform}</p>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Campaign Performance and Payment Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <CampaignChart data={campaignPerformance} />
        
        {/* Payment Method Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment Method Distribution</h3>
          
          <div className="flex items-center justify-center mb-4">
            <DonutChart
              data={paymentMethodData}
              size={160}
              centerText="₹2.4M"
              centerSubtext="Total Payouts"
            />
          </div>
          
          <div className="space-y-2">
            {paymentMethodData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-700">{item.label}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Smart Recommendations */}
      <SmartRecommendations
        recommendations={smartRecommendations}
        onActionClick={(recId, action) => alert(`Executing: ${action} for recommendation ${recId}`)}
      />

      {/* Enhanced Insights and Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Performance Insights */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Insights</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200 hover:shadow-md transition-shadow cursor-pointer">
              <div>
                <p className="text-sm text-green-700 font-medium">Baseline Revenue</p>
                <p className="font-semibold text-green-900">{formatCurrency(overallMetrics.baseline_revenue, settings.defaultCurrency)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-green-700 font-medium">Incremental Lift</p>
                <p className="font-semibold text-green-900">
                  +{((overallMetrics.incremental_revenue / overallMetrics.baseline_revenue) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 hover:shadow-md transition-shadow cursor-pointer">
              <div>
                <p className="text-sm text-blue-700 font-medium">Total Investment</p>
                <p className="font-semibold text-blue-900">{formatCurrency(overallMetrics.total_spend, settings.defaultCurrency)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-700 font-medium">Cost Efficiency</p>
                <p className="font-semibold text-blue-900">{formatCurrency(overallMetrics.cost_per_order, settings.defaultCurrency)}/order</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200 hover:shadow-md transition-shadow cursor-pointer">
              <div>
                <p className="text-sm text-purple-700 font-medium">Platform Mix</p>
                <p className="font-semibold text-purple-900">
                  {new Set(data.influencers.map(i => i.platform)).size} platforms
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-purple-700 font-medium">Active Campaigns</p>
                <p className="font-semibold text-purple-900">
                  {data.campaigns.filter(c => c.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Visualization */}
        <TimelineVisualization
          events={timelineEvents}
          title="Recent Activity"
        />
      </div>

      {/* Top Performers with Rich Profiles */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Top Performing Influencers</h3>
          <button className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
            View all →
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4" onMouseMove={handleMouseMove}>
          {topInfluencers.map((influencer, index) => (
            <div
              key={influencer.influencer_id}
              className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-105"
              onMouseEnter={() => setHoveredInfluencer(influencer)}
              onMouseLeave={() => setHoveredInfluencer(null)}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">
                {influencer.name.charAt(0)}
              </div>
              <h4 className="font-medium text-gray-900 text-sm mb-1">{influencer.name}</h4>
              <p className="text-xs text-gray-500 mb-2">{influencer.platform}</p>
              <div className="flex items-center justify-center space-x-1">
                <span className="text-xs font-medium text-green-600">
                  {influencer.avgCampaignPerformance}/100
                </span>
                <div className="w-8 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-500"
                    style={{ width: `${influencer.avgCampaignPerformance}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Overview</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{data.influencers.length}</p>
            <p className="text-sm text-gray-600">Influencers</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{data.campaigns.length}</p>
            <p className="text-sm text-gray-600">Campaigns</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{data.posts.length}</p>
            <p className="text-sm text-gray-600">Posts</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{data.trackingData.length}</p>
            <p className="text-sm text-gray-600">Orders Tracked</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{data.payouts.length}</p>
            <p className="text-sm text-gray-600">Payouts</p>
          </div>
        </div>
      </div>

      {/* Data Uploader Modal */}
      <DataUploader
        isOpen={isUploaderOpen}
        onClose={() => setIsUploaderOpen(false)}
        onDataUploaded={handleDataUpload}
      />

      {/* Influencer Tooltip */}
      <InfluencerTooltip
        influencer={hoveredInfluencer}
        isVisible={!!hoveredInfluencer}
        position={mousePosition}
      />

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">User Profile</h2>
              <button
                onClick={() => setShowProfileModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  R
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Rajesh Kumar</h3>
                <p className="text-gray-600">Campaign Manager</p>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="text-gray-900">rajesh@healthkart.com</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Department:</span>
                    <span className="text-gray-900">Marketing</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Login:</span>
                    <span className="text-gray-900">Today, 9:30 AM</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Edit Profile
                </button>
                <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Modal */}
      {showNotificationsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
              <button
                onClick={() => setShowNotificationsModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <span className="font-medium text-yellow-900">3 payments need approval</span>
                </div>
                <p className="text-sm text-yellow-700 mt-1">Review pending influencer payouts</p>
              </div>
              
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-900">Campaign performance update</span>
                </div>
                <p className="text-sm text-blue-700 mt-1">MuscleBlaze campaign exceeded targets</p>
              </div>
              
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-900">ROAS improvement detected</span>
                </div>
                <p className="text-sm text-green-700 mt-1">Overall ROAS increased by 12% this week</p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                View All Notifications
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedDashboard;