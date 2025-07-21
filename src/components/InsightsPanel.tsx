import React from 'react';
import { TrendingUp, Users, Award, AlertTriangle } from 'lucide-react';
import { Influencer, TrackingData, Payout } from '../types';
import { calculateROAS, getInfluencerPerformanceScore, formatCurrency } from '../utils/calculations';

interface InsightsPanelProps {
  influencers: Influencer[];
  trackingData: TrackingData[];
  payouts: Payout[];
}

const InsightsPanel: React.FC<InsightsPanelProps> = ({
  influencers,
  trackingData,
  payouts
}) => {
  // Top performer analysis
  const influencerPerformance = influencers.map(influencer => {
    const influencerTracking = trackingData.filter(t => t.influencerId === influencer.id);
    const influencerPayouts = payouts.filter(p => p.influencerId === influencer.id);
    const metrics = calculateROAS(influencerTracking, influencerPayouts);
    const score = getInfluencerPerformanceScore(influencer, trackingData, payouts);
    
    return {
      influencer,
      metrics,
      score,
      revenue: metrics.totalRevenue
    };
  }).sort((a, b) => b.score - a.score);

  const topPerformer = influencerPerformance[0];
  const underPerformers = influencerPerformance.filter(p => p.score < 50);

  // Platform analysis
  const platformMetrics = influencers.reduce((acc, influencer) => {
    const platform = influencer.platform;
    const influencerTracking = trackingData.filter(t => t.influencerId === influencer.id);
    const revenue = influencerTracking.reduce((sum, t) => sum + t.revenue, 0);
    
    if (!acc[platform]) {
      acc[platform] = { revenue: 0, count: 0 };
    }
    acc[platform].revenue += revenue;
    acc[platform].count += 1;
    
    return acc;
  }, {} as Record<string, { revenue: number; count: number }>);

  const bestPlatform = Object.entries(platformMetrics)
    .sort(([,a], [,b]) => (b.revenue / b.count) - (a.revenue / a.count))[0];

  // Category insights
  const categoryMetrics = influencers.reduce((acc, influencer) => {
    const category = influencer.category;
    const influencerTracking = trackingData.filter(t => t.influencerId === influencer.id);
    const orders = influencerTracking.reduce((sum, t) => sum + t.orders, 0);
    
    if (!acc[category]) {
      acc[category] = { orders: 0, count: 0 };
    }
    acc[category].orders += orders;
    acc[category].count += 1;
    
    return acc;
  }, {} as Record<string, { orders: number; count: number }>);

  const bestCategory = Object.entries(categoryMetrics)
    .sort(([,a], [,b]) => (b.orders / b.count) - (a.orders / a.count))[0];

  const insights = [
    {
      icon: <Award className="w-5 h-5 text-yellow-500" />,
      title: "Top Performer",
      description: `${topPerformer?.influencer.name} leads with ${topPerformer?.score}/100 performance score`,
      value: formatCurrency(topPerformer?.revenue || 0),
      color: "border-yellow-200 bg-yellow-50"
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-green-500" />,
      title: "Best Platform",
      description: `${bestPlatform?.[0]} shows highest average revenue per influencer`,
      value: formatCurrency((bestPlatform?.[1].revenue || 0) / (bestPlatform?.[1].count || 1)),
      color: "border-green-200 bg-green-50"
    },
    {
      icon: <Users className="w-5 h-5 text-blue-500" />,
      title: "Top Category",
      description: `${bestCategory?.[0]} influencers generate most orders on average`,
      value: `${Math.round((bestCategory?.[1].orders || 0) / (bestCategory?.[1].count || 1))} orders`,
      color: "border-blue-200 bg-blue-50"
    },
    {
      icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
      title: "Improvement Needed",
      description: `${underPerformers.length} influencer${underPerformers.length !== 1 ? 's' : ''} scoring below 50`,
      value: underPerformers.length > 0 ? `${underPerformers[0].influencer.name}` : "None",
      color: "border-red-200 bg-red-50"
    }
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Key Insights</h3>
      
      <div className="grid grid-cols-1 gap-4">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`p-3 sm:p-4 rounded-lg border-2 ${insight.color} transition-all duration-200 hover:shadow-md`}
          >
            <div className="flex items-start space-x-2 sm:space-x-3">
              <div className="flex-shrink-0">
                {insight.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">{insight.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                <p className="font-semibold text-gray-900 text-sm sm:text-base">{insight.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Recommendations */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Recommendations</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Focus budget on {bestPlatform?.[0]} platform for maximum ROI</li>
          <li>• Consider expanding partnerships with {bestCategory?.[0]} influencers</li>
          {underPerformers.length > 0 && (
            <li>• Review strategy for underperforming influencers to optimize spend</li>
          )}
          <li>• Implement performance bonuses for top-scoring influencers</li>
        </ul>
      </div>
    </div>
  );
};

export default InsightsPanel;