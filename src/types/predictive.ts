// Predictive analytics and forecasting types
export interface PredictiveMetrics {
  influencer_id: string;
  predicted_reach: number;
  predicted_engagement: number;
  predicted_conversions: number;
  predicted_revenue: number;
  confidence_interval: {
    lower: number;
    upper: number;
  };
  risk_factors: string[];
  growth_potential: number; // 0-100 score
  optimal_posting_schedule: string[];
}

export interface InfluencerDiscoveryScore {
  influencer_id: string;
  overall_score: number; // 0-100
  roas_potential: number;
  engagement_quality: number;
  audience_alignment: number;
  content_consistency: number;
  growth_trajectory: number;
  risk_assessment: 'low' | 'medium' | 'high';
  recommended_budget: number;
  expected_roi: number;
}

export interface CampaignOptimization {
  campaign_id: string;
  current_performance: {
    spend: number;
    revenue: number;
    roas: number;
    orders: number;
  };
  optimization_opportunities: {
    budget_reallocation: {
      from_influencer: string;
      to_influencer: string;
      amount: number;
      expected_lift: number;
    }[];
    content_recommendations: {
      influencer_id: string;
      recommended_post_type: string;
      optimal_timing: string;
      expected_improvement: number;
    }[];
    audience_targeting: {
      influencer_id: string;
      target_demographics: any;
      expected_reach_increase: number;
    }[];
  };
  predicted_improvements: {
    revenue_lift: number;
    roas_improvement: number;
    cost_savings: number;
  };
}

export interface AnomalyDetection {
  type: 'underperformance' | 'overperformance' | 'budget_alert' | 'engagement_drop';
  severity: 'low' | 'medium' | 'high' | 'critical';
  entity_type: 'influencer' | 'campaign' | 'post';
  entity_id: string;
  description: string;
  current_value: number;
  expected_value: number;
  deviation_percentage: number;
  recommendations: string[];
  detected_at: string;
}

export interface GoalTracking {
  goal_id: string;
  campaign_id?: string;
  influencer_id?: string;
  goal_type: 'revenue' | 'roas' | 'orders' | 'engagement' | 'reach';
  target_value: number;
  current_value: number;
  progress_percentage: number;
  status: 'on_track' | 'at_risk' | 'behind' | 'exceeded';
  deadline: string;
  created_at: string;
}

export interface MarketTrends {
  trend_id: string;
  category: string;
  platform: string;
  trend_name: string;
  growth_rate: number;
  engagement_multiplier: number;
  seasonality_factor: number;
  relevance_score: number;
  keywords: string[];
  recommended_action: string;
}