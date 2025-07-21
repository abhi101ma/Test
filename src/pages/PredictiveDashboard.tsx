import React, { useState, useEffect } from 'react';
import { Brain, Zap, Target, TrendingUp, AlertTriangle, Sparkles } from 'lucide-react';
import EnhancedMetricCard from '../components/EnhancedMetricCard';
import PredictiveInsightsPanel from '../components/PredictiveInsightsPanel';
import GoalTrackingPanel from '../components/GoalTrackingPanel';
import { 
  enhancedInfluencers, 
  enhancedPosts, 
  enhancedTrackingData, 
  enhancedPayouts,
  enhancedCampaigns 
} from '../data/enhancedMockData';
import { PredictiveAnalyzer } from '../utils/predictiveAnalytics';
import { GoalTracker } from '../utils/goalTracking';
import { 
  PredictiveMetrics, 
  InfluencerDiscoveryScore, 
  CampaignOptimization,
  GoalTracking,
  AnomalyDetection 
} from '../types/predictive';

const PredictiveDashboard: React.FC = () => {
  const [predictions, setPredictions] = useState<PredictiveMetrics[]>([]);
  const [discoveryScores, setDiscoveryScores] = useState<InfluencerDiscoveryScore[]>([]);
  const [optimizations, setOptimizations] = useState<CampaignOptimization[]>([]);
  const [goals, setGoals] = useState<GoalTracking[]>([]);
  const [alerts, setAlerts] = useState<AnomalyDetection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate AI processing time
    const loadPredictiveData = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate predictions for all influencers
      const newPredictions = enhancedInfluencers.map(influencer => 
        PredictiveAnalyzer.predictInfluencerPerformance(
          influencer,
          enhancedPosts,
          enhancedTrackingData
        )
      );

      // Generate discovery scores for all influencers
      const newDiscoveryScores = enhancedInfluencers.map(influencer =>
        PredictiveAnalyzer.calculateDiscoveryScore(
          influencer,
          {
            posts: enhancedPosts,
            tracking: enhancedTrackingData,
            payouts: enhancedPayouts
          },
          'MuscleBlaze'
        )
      ).sort((a, b) => b.overall_score - a.overall_score);

      // Generate campaign optimizations
      const newOptimizations = enhancedCampaigns.map(campaign =>
        PredictiveAnalyzer.optimizeCampaign(
          campaign.campaign_id,
          enhancedInfluencers,
          enhancedPosts,
          enhancedTrackingData,
          enhancedPayouts
        )
      );

      // Create sample goals
      const sampleGoals = [
        GoalTracker.createGoal('revenue', 500000, '2024-04-30', 'camp_001'),
        GoalTracker.createGoal('roas', 3.5, '2024-04-15', 'camp_002'),
        GoalTracker.createGoal('orders', 200, '2024-04-20', undefined, 'inf_001'),
        GoalTracker.createGoal('engagement', 50000, '2024-04-25', 'camp_003'),
      ];

      // Update goals with current progress
      const updatedGoals = sampleGoals.map(goal =>
        GoalTracker.updateGoalProgress(goal, enhancedTrackingData, enhancedPayouts, enhancedPosts)
      );

      // Detect anomalies
      const detectedAnomalies = PredictiveAnalyzer.detectAnomalies(
        enhancedInfluencers,
        enhancedPosts,
        enhancedTrackingData,
        enhancedPayouts
      );

      // Generate goal alerts
      const goalAlerts = GoalTracker.generateGoalAlerts(updatedGoals);

      // Generate advanced cross-channel anomalies
      const crossChannelAnomalies = PredictiveAnalyzer.detectCrossChannelAnomalies(
        enhancedInfluencers,
        enhancedPosts,
        enhancedTrackingData,
        enhancedPayouts
      );
      setPredictions(newPredictions);
      setDiscoveryScores(newDiscoveryScores);
      setOptimizations(newOptimizations);
      setGoals(updatedGoals);
      setAlerts([...detectedAnomalies, ...goalAlerts, ...crossChannelAnomalies]);
      setIsLoading(false);
    };

    loadPredictiveData();
  }, []);

  const handleCreateGoal = (goalData: any) => {
    const newGoal = GoalTracker.createGoal(
      goalData.goal_type,
      goalData.target_value,
      goalData.deadline,
      goalData.campaign_id || undefined,
      goalData.influencer_id || undefined
    );
    
    const updatedGoal = GoalTracker.updateGoalProgress(
      newGoal,
      enhancedTrackingData,
      enhancedPayouts,
      enhancedPosts
    );
    
    setGoals(prev => [...prev, updatedGoal]);
  };

  // Calculate summary metrics
  const avgPredictedROI = predictions.length > 0 ? 
    predictions.reduce((sum, p) => sum + (p.predicted_revenue / 50000), 0) / predictions.length : 0; // Assuming avg spend of 50k

  const highPotentialInfluencers = discoveryScores.filter(s => s.overall_score >= 80).length;
  const totalOptimizationValue = optimizations.reduce((sum, o) => sum + o.predicted_improvements.revenue_lift, 0);
  const criticalAlerts = alerts.filter(a => a.severity === 'critical' || a.severity === 'high').length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">AI Processing Your Data</h2>
          <p className="text-gray-600">Generating predictive insights and recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 rounded-xl p-8 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="w-8 h-8" />
          <div>
            <h1 className="text-3xl font-bold">Predictive Analytics & Campaign Optimization</h1>
            <p className="text-purple-100">AI-powered forecasting, influencer discovery, and automated optimization</p>
          </div>
        </div>
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4" />
            <span>Machine Learning Predictions</span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>Real-time Optimization</span>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Goal Tracking & Alerts</span>
          </div>
        </div>
      </div>

      {/* Predictive KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <EnhancedMetricCard
          title="Avg Predicted ROI"
          value={avgPredictedROI}
          format="number"
          change={15.3}
          icon={<TrendingUp className="w-6 h-6" />}
          color="green"
          subtitle="Next 30 days forecast"
          confidence={87}
          tooltip="Average predicted return on investment across all active influencers"
        />
        <EnhancedMetricCard
          title="High-Potential Influencers"
          value={highPotentialInfluencers}
          change={22.7}
          icon={<Target className="w-6 h-6" />}
          color="blue"
          subtitle="Score 80+ discovered"
          confidence={92}
          tooltip="Influencers with discovery scores above 80 points"
        />
        <EnhancedMetricCard
          title="Optimization Value"
          value={totalOptimizationValue}
          format="currency"
          change={31.4}
          icon={<Zap className="w-6 h-6" />}
          color="purple"
          subtitle="Potential revenue lift"
          confidence={78}
          tooltip="Total potential revenue increase from optimization recommendations"
        />
        <EnhancedMetricCard
          title="Critical Alerts"
          value={criticalAlerts}
          change={-12.5}
          icon={<AlertTriangle className="w-6 h-6" />}
          color="red"
          subtitle="Requiring attention"
          confidence={95}
          tooltip="High and critical severity alerts requiring immediate action"
        />
      </div>

      {/* Main Predictive Insights */}
      <PredictiveInsightsPanel
        predictions={predictions}
        discoveryScores={discoveryScores}
        optimizations={optimizations}
      />

      {/* Goal Tracking & Alerts */}
      <GoalTrackingPanel
        goals={goals}
        alerts={alerts}
        onCreateGoal={handleCreateGoal}
      />

      {/* AI Insights Summary */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-6">
        <h3 className="text-lg font-semibold text-indigo-900 mb-4">AI-Generated Strategic Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-indigo-800 mb-3">Performance Predictions</h4>
            <ul className="text-sm text-indigo-700 space-y-2">
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Top 3 influencers predicted to generate ₹{predictions.slice(0, 3).reduce((sum, p) => sum + p.predicted_revenue, 0).toLocaleString()} in next 30 days</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Instagram Reels show 67% higher predicted engagement than static posts</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Fitness category influencers have 23% higher growth potential this quarter</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-indigo-800 mb-3">Optimization Opportunities</h4>
            <ul className="text-sm text-indigo-700 space-y-2">
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Budget reallocation could increase revenue by ₹{totalOptimizationValue.toLocaleString()}</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>{discoveryScores.filter(s => s.risk_assessment === 'low').length} low-risk, high-reward partnerships identified</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Content timing optimization could improve engagement by 25%</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Action Items */}
        <div className="mt-6 p-4 bg-white rounded-lg border border-indigo-200">
          <h4 className="font-medium text-indigo-900 mb-2">Recommended Actions</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-gray-700">Address {criticalAlerts} critical alerts immediately</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-700">Implement top 3 budget reallocation recommendations</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">Onboard {highPotentialInfluencers} high-potential influencers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictiveDashboard;