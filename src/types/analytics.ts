// Advanced analytics types for Phase 2
export interface SentimentAnalysis {
  post_id: string;
  sentiment_score: number; // -1 to 1 (negative to positive)
  sentiment_label: 'positive' | 'neutral' | 'negative';
  confidence: number; // 0 to 1
  keywords: string[];
  emotion_scores: {
    joy: number;
    trust: number;
    fear: number;
    surprise: number;
    sadness: number;
    disgust: number;
    anger: number;
    anticipation: number;
  };
}

export interface CustomerCohort {
  cohort_id: string;
  acquisition_source: string;
  acquisition_date: string;
  initial_customers: number;
  retention_rates: {
    month_1: number;
    month_3: number;
    month_6: number;
    month_12: number;
  };
  avg_order_value: number;
  repeat_purchase_rate: number;
  customer_lifetime_value: number;
  total_revenue: number;
}

export interface AudienceFitScore {
  influencer_id: string;
  brand: string;
  overall_fit_score: number; // 0-100
  demographic_fit: number;
  geographic_fit: number;
  interest_alignment: number;
  engagement_quality: number;
  brand_safety_score: number;
  recommendations: string[];
}

export interface PostPerformanceAnalysis {
  post_id: string;
  post_type: string;
  platform: string;
  engagement_rate: number;
  conversion_rate: number;
  revenue_per_impression: number;
  sentiment_impact: number;
  viral_potential: number;
  optimal_posting_time: string;
  content_themes: string[];
  performance_tier: 'high' | 'medium' | 'low';
}

export interface ContentInsights {
  top_performing_keywords: Array<{
    keyword: string;
    frequency: number;
    avg_engagement: number;
    revenue_correlation: number;
  }>;
  sentiment_performance: {
    positive_posts_roas: number;
    neutral_posts_roas: number;
    negative_posts_roas: number;
  };
  optimal_content_mix: {
    post_type: string;
    recommended_percentage: number;
    avg_performance: number;
  }[];
  engagement_patterns: {
    best_posting_times: string[];
    optimal_caption_length: number;
    hashtag_effectiveness: number;
  };
}

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
  growth_potential: number;
}