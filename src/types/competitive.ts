// Competitive intelligence and market analysis types
export interface CompetitorProfile {
  competitor_id: string;
  brand_name: string;
  industry_category: string;
  market_share: number; // 0-100 percentage
  total_followers: number;
  avg_engagement_rate: number;
  estimated_monthly_spend: number;
  primary_platforms: string[];
  target_demographics: {
    age_range: string;
    gender_split: { male: number; female: number };
    top_locations: string[];
  };
  brand_positioning: string;
  key_products: string[];
  competitive_advantages: string[];
  weaknesses: string[];
  last_updated: string;
}

export interface CompetitorCampaign {
  campaign_id: string;
  competitor_id: string;
  campaign_name: string;
  start_date: string;
  estimated_end_date: string;
  estimated_budget: number;
  campaign_type: 'product_launch' | 'brand_awareness' | 'seasonal' | 'competitive_response';
  target_products: string[];
  influencer_count: number;
  estimated_reach: number;
  engagement_performance: number;
  sentiment_score: number;
  campaign_effectiveness: 'high' | 'medium' | 'low';
  key_messages: string[];
  content_themes: string[];
  platforms_used: string[];
  detected_at: string;
}

export interface CompetitorPerformance {
  competitor_id: string;
  period: string; // e.g., "2024-01"
  estimated_revenue: number;
  estimated_roas: number;
  market_share_change: number;
  engagement_trend: 'increasing' | 'decreasing' | 'stable';
  content_volume: number;
  influencer_partnerships: number;
  viral_content_count: number;
  brand_mention_sentiment: number;
  competitive_pressure_score: number; // How much pressure they're putting on the market
  innovation_score: number; // How innovative their campaigns are
}

export interface MarketTrend {
  trend_id: string;
  trend_name: string;
  category: string;
  description: string;
  growth_rate: number; // Percentage growth
  current_volume: number; // Search volume, mentions, etc.
  trend_stage: 'emerging' | 'growing' | 'mature' | 'declining';
  relevance_score: number; // 0-100 how relevant to health/fitness industry
  opportunity_score: number; // 0-100 business opportunity potential
  competitive_intensity: 'low' | 'medium' | 'high';
  key_influencers: string[];
  related_keywords: string[];
  platforms_trending: string[];
  demographic_appeal: {
    primary_age_group: string;
    gender_skew: string;
    geographic_concentration: string[];
  };
  predicted_peak: string; // When trend is expected to peak
  recommended_action: string;
  detected_at: string;
}

export interface CompetitiveGap {
  gap_id: string;
  gap_type: 'content' | 'audience' | 'platform' | 'product' | 'messaging';
  description: string;
  opportunity_size: number; // Estimated revenue opportunity
  difficulty_score: number; // 0-100 how difficult to exploit
  time_to_market: string; // Estimated time to capitalize
  required_investment: number;
  success_probability: number; // 0-100
  competitive_response_risk: 'low' | 'medium' | 'high';
  recommended_strategy: string;
  key_actions: string[];
  metrics_to_track: string[];
}

export interface ContentStrategyRecommendation {
  recommendation_id: string;
  recommendation_type: 'content_format' | 'messaging' | 'timing' | 'platform' | 'influencer_type';
  title: string;
  description: string;
  rationale: string;
  competitive_insight: string; // What competitors are/aren't doing
  expected_impact: {
    engagement_lift: number;
    reach_increase: number;
    conversion_improvement: number;
  };
  implementation_difficulty: 'easy' | 'medium' | 'hard';
  resource_requirements: string[];
  success_metrics: string[];
  timeline: string;
  priority_score: number; // 0-100
}

export interface CrossChannelAnomaly {
  anomaly_id: string;
  anomaly_type: 'competitive_response' | 'market_shift' | 'platform_algorithm' | 'seasonal_unusual' | 'external_event';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  affected_channels: string[];
  affected_metrics: string[];
  correlation_strength: number; // 0-1 how strong the cross-channel correlation is
  potential_causes: string[];
  competitive_context: string; // What competitors might be doing
  recommended_response: string[];
  monitoring_actions: string[];
  estimated_impact: {
    revenue_risk: number;
    market_share_risk: number;
    brand_reputation_risk: number;
  };
  detected_at: string;
  requires_immediate_action: boolean;
}