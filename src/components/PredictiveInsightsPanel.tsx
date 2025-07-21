import React, { useState } from 'react';
import { Brain, TrendingUp, Target, AlertTriangle, Zap, Calendar } from 'lucide-react';
import { PredictiveMetrics, InfluencerDiscoveryScore, CampaignOptimization } from '../types/predictive';
import { formatCurrency } from '../utils/enhancedCalculations';
import { useSettings } from '../contexts/SettingsContext';

interface PredictiveInsightsPanelProps {
  predictions: PredictiveMetrics[];
  discoveryScores: InfluencerDiscoveryScore[];
  optimizations: CampaignOptimization[];
}


const PredictiveInsightsPanel: React.FC<PredictiveInsightsPanelProps> = ({
  predictions,
  discoveryScores,
  optimizations
}) => {
  const [activeTab, setActiveTab] = useState<'predictions' | 'discovery' | 'optimization'>('predictions');

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    if (score >= 40) return 'text-orange-600 bg-orange-100 border-orange-200';
    return 'text-red-600 bg-red-100 border-red-200';
  };

  const { settings } = useSettings();
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Brain className="w-5 h-5 text-purple-500" />
        <h3 className="text-lg font-semibold text-gray-900">Predictive Analytics & AI Insights</h3>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('predictions')}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md font-medium transition-all ${
            activeTab === 'predictions'
              ? 'bg-white text-purple-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Performance Predictions</span>
        </button>
        <button
          onClick={() => setActiveTab('discovery')}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md font-medium transition-all ${
            activeTab === 'discovery'
              ? 'bg-white text-purple-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Influencer Discovery</span>
        </button>
        <button
          onClick={() => setActiveTab('optimization')}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md font-medium transition-all ${
            activeTab === 'optimization'
              ? 'bg-white text-purple-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Campaign Optimization</span>
        </button>
      </div>

      {/* Performance Predictions Tab */}
      {activeTab === 'predictions' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {predictions.slice(0, 6).map((prediction, index) => (
              <div key={prediction.influencer_id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Influencer {prediction.influencer_id.slice(-3)}</h4>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    prediction.growth_potential >= 70 ? 'bg-green-100 text-green-800' :
                    prediction.growth_potential >= 50 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {prediction.growth_potential}% Growth Potential
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Predicted Revenue</p>
                    <p className="font-semibold text-green-600">
                      {formatCurrency(prediction.predicted_revenue, settings.defaultCurrency)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Predicted Reach</p>
                    <p className="font-semibold text-blue-600">
                      {prediction.predicted_reach.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Conversions</p>
                    <p className="font-semibold text-purple-600">
                      {prediction.predicted_conversions}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Engagement</p>
                    <p className="font-semibold text-orange-600">
                      {prediction.predicted_engagement.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Confidence Interval */}
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-1">Revenue Confidence Range</p>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="text-gray-600">
                      {formatCurrency(prediction.confidence_interval.lower, settings.defaultCurrency)}
                    </span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2 relative">
                      <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full w-full"></div>
                    </div>
                    <span className="text-gray-600">
                      {formatCurrency(prediction.confidence_interval.upper, settings.defaultCurrency)}
                    </span>
                  </div>
                </div>

                {/* Risk Factors */}
                {prediction.risk_factors.length > 0 && (
                  <div className="bg-yellow-50 rounded-lg p-2">
                    <p className="text-xs font-medium text-yellow-800 mb-1">Risk Factors:</p>
                    <ul className="text-xs text-yellow-700 space-y-1">
                      {prediction.risk_factors.slice(0, 2).map((risk, riskIndex) => (
                        <li key={riskIndex}>• {risk}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Optimal Schedule */}
                <div className="mt-3 bg-blue-50 rounded-lg p-2">
                  <p className="text-xs font-medium text-blue-800 mb-1">Optimal Posting:</p>
                  <div className="flex flex-wrap gap-1">
                    {prediction.optimal_posting_schedule.slice(0, 2).map((time, timeIndex) => (
                      <span key={timeIndex} className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                        {time}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Influencer Discovery Tab */}
      {activeTab === 'discovery' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {discoveryScores.slice(0, 9).map((score, index) => (
              <div key={score.influencer_id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="flex items-center justify-center w-6 h-6 bg-purple-100 text-purple-600 rounded-full text-xs font-medium">
                      {index + 1}
                    </span>
                    <h4 className="font-medium text-gray-900">Influencer {score.influencer_id.slice(-3)}</h4>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getScoreColor(score.overall_score)}`}>
                    {score.overall_score}/100
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                  <div>
                    <span className="text-gray-500">ROAS Potential:</span>
                    <span className="font-medium text-blue-600 ml-1">{score.roas_potential}/25</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Engagement:</span>
                    <span className="font-medium text-green-600 ml-1">{score.engagement_quality}/20</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Audience Fit:</span>
                    <span className="font-medium text-purple-600 ml-1">{score.audience_alignment}/20</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Growth:</span>
                    <span className="font-medium text-orange-600 ml-1">{score.growth_trajectory}/20</span>
                  </div>
                </div>

                {/* Risk Assessment */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-500">Risk Level:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskColor(score.risk_assessment)}`}>
                    {score.risk_assessment.toUpperCase()}
                  </span>
                </div>

                {/* Budget & ROI */}
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">Recommended Budget:</span>
                    <span className="font-medium text-gray-900">{formatCurrency(score.recommended_budget, settings.defaultCurrency)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Expected ROI:</span>
                    <span className="font-medium text-green-600">{score.expected_roi.toFixed(1)}x</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Discovery Summary */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
            <h4 className="font-medium text-purple-900 mb-2">Discovery Insights</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium text-purple-700">High-Potential Influencers</p>
                <p className="text-purple-600">
                  {discoveryScores.filter(s => s.overall_score >= 80).length} influencers with 80+ scores
                </p>
              </div>
              <div>
                <p className="font-medium text-blue-700">Low-Risk Opportunities</p>
                <p className="text-blue-600">
                  {discoveryScores.filter(s => s.risk_assessment === 'low').length} low-risk partnerships available
                </p>
              </div>
              <div>
                <p className="font-medium text-green-700">Budget Efficiency</p>
                <p className="text-green-600">
                  Avg {(discoveryScores.reduce((sum, s) => sum + s.expected_roi, 0) / discoveryScores.length).toFixed(1)}x expected ROI
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Campaign Optimization Tab */}
      {activeTab === 'optimization' && (
        <div className="space-y-6">
          {optimizations.slice(0, 3).map((optimization, index) => (
            <div key={optimization.campaign_id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">Campaign {optimization.campaign_id.slice(-3)}</h4>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-gray-600">
                    Current ROAS: <span className="font-medium">{optimization.current_performance.roas.toFixed(2)}x</span>
                  </span>
                  <span className="text-green-600">
                    Potential Lift: <span className="font-medium">+{formatCurrencyINR(optimization.predicted_improvements.revenue_lift)}</span>
                  </span>
                </div>
              </div>

              {/* Current Performance */}
              <div className="grid grid-cols-4 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Spend</p>
                  <p className="font-semibold text-gray-900">{formatCurrency(optimization.current_performance.spend, settings.defaultCurrency)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Revenue</p>
                  <p className="font-semibold text-green-600">{formatCurrency(optimization.current_performance.revenue, settings.defaultCurrency)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Orders</p>
                  <p className="font-semibold text-blue-600">{optimization.current_performance.orders}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">ROAS</p>
                  <p className="font-semibold text-purple-600">{optimization.current_performance.roas.toFixed(2)}x</p>
                </div>
              </div>

              {/* Optimization Opportunities */}
              <div className="space-y-4">
                {/* Budget Reallocation */}
                {optimization.optimization_opportunities.budget_reallocation.length > 0 && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Budget Reallocation Opportunities</h5>
                    <div className="space-y-2"> {/* Use formatCurrency for reallocation amount and expected lift */}
                      {optimization.optimization_opportunities.budget_reallocation.slice(0, 2).map((reallocation, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-blue-50 rounded-lg text-sm">
                          <span className="text-blue-700">
                            Move {formatCurrencyINR(reallocation.amount)} from Influencer {reallocation.from_influencer.slice(-3)} to {reallocation.to_influencer.slice(-3)}
                          </span>
                          <span className="font-medium text-green-600">
                            +{formatCurrencyINR(reallocation.expected_lift)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Content Recommendations */}
                {optimization.optimization_opportunities.content_recommendations.length > 0 && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Content Optimization</h5>
                    <div className="space-y-2">
                      {optimization.optimization_opportunities.content_recommendations.slice(0, 2).map((content, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-green-50 rounded-lg text-sm">
                          <span className="text-green-700">
                            Influencer {content.influencer_id.slice(-3)}: Use {content.recommended_post_type} at {content.optimal_timing}
                          </span>
                          <span className="font-medium text-green-600">
                            +{content.expected_improvement}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Predicted Improvements */}
              <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                <h5 className="font-medium text-green-900 mb-2">Predicted Improvements</h5>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-green-700">Revenue Lift</p>
                    <p className="font-semibold text-green-900">{formatCurrency(optimization.predicted_improvements.revenue_lift, settings.defaultCurrency)}</p>
                  </div>
                  <div>
                    <p className="text-blue-700">ROAS Improvement</p>
                    <p className="font-semibold text-blue-900">+{(optimization.predicted_improvements.roas_improvement * 100).toFixed(0)}%</p>
                  </div>
                  <div>
                    <p className="text-purple-700">Cost Savings</p>
                    <p className="font-semibold text-purple-900">{formatCurrency(optimization.predicted_improvements.cost_savings, settings.defaultCurrency)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PredictiveInsightsPanel;