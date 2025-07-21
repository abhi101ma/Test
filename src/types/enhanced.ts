// Enhanced data models for Phase 1
export interface EnhancedInfluencer {
  influencer_id: string;
  name: string;
  handle: string;
  platform: 'Instagram' | 'YouTube' | 'Twitter';
  primary_category: 'Fitness' | 'Nutrition' | 'Wellness' | 'Bodybuilding';
  follower_count: number;
  gender: 'Male' | 'Female' | 'Other';
  audience_demographics: {
    age_range: string;
    gender_split: { male: number; female: number };
    top_locations: string[];
  };
  avg_engagement_rate: number;
  created_at?: string;
  updated_at?: string;
}

export interface EnhancedCampaign {
  campaign_id: string;
  campaign_name: string;
  brand: 'MuscleBlaze' | 'HKVitals' | 'Gritzo' | 'HealthKart';
  product_focus: string;
  start_date: string;
  end_date: string;
  budget: number;
  status: 'active' | 'completed' | 'paused' | 'planned';
  brief_details?: any; // JSON field for campaign brief information
  approval_status?: 'pending' | 'approved' | 'rejected';
  scheduled_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface EnhancedPost {
  post_id: string;
  influencer_id: string;
  campaign_id: string;
  post_url: string;
  platform_post_id: string;
  post_date: string;
  caption_text: string;
  post_type: 'Reel' | 'Static Post' | 'Story' | 'YouTube Video' | 'Tweet';
  reach: number;
  impressions: number;
  likes: number;
  comments: number;
  shares: number;
  saves?: number; // For Instagram
  video_views?: number; // For YouTube
  draft_url?: string; // URL for content draft
  approval_comments?: string; // Comments from approval process
  scheduled_date?: string; // When post is scheduled to go live
  scheduled_time?: string; // Time of day for scheduled post
  auto_publish?: boolean; // Whether post should be auto-published
  created_at?: string;
  updated_at?: string;
}

export interface EnhancedTrackingData {
  event_id: string;
  user_id: string;
  order_id: string;
  order_date: string;
  revenue: number;
  items_in_cart: string[]; // Array of product IDs
  attribution_source: 'influencer' | 'organic' | 'paid_search' | 'direct';
  attribution_details: {
    influencer_id?: string;
    campaign_id?: string;
    coupon_code?: string;
    post_id?: string;
    utm_parameters?: { [key: string]: string }; // UTM tracking parameters
  };
  is_new_customer: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface EnhancedPayout {
  payout_id: string;
  influencer_id: string;
  campaign_id: string;
  payout_basis: 'fixed_per_post' | 'cpo' | 'hybrid' | 'barter';
  rate: number; // Cost per post or % of revenue
  fixed_fee: number;
  commission_earned: number;
  total_payout: number;
  payout_status: 'pending' | 'approved' | 'paid' | 'cancelled';
  payment_gateway_id?: string; // ID from payment gateway
  accounting_entry_id?: string; // ID from accounting software
  bank_details?: {
    account_number?: string;
    ifsc_code?: string;
    account_holder_name?: string;
    bank_name?: string;
  };
  created_at?: string;
  updated_at?: string;
}

// Analytics interfaces
export interface IncrementalROASMetrics {
  total_revenue: number;
  incremental_revenue: number;
  total_spend: number;
  baseline_revenue: number;
  roas: number;
  incremental_roas: number;
  orders: number;
  incremental_orders: number;
  cost_per_order: number;
  conversion_rate: number;
  attribution_confidence: number;
}

export interface InfluencerScore {
  influencer_id: string;
  overall_score: number;
  roas_score: number;
  engagement_score: number;
  audience_fit_score: number;
  content_quality_score: number;
  consistency_score: number;
}

export interface CohortAnalysis {
  cohort_id: string;
  acquisition_source: string;
  acquisition_date: string;
  initial_customers: number;
  repeat_purchase_rate: number;
  avg_order_value: number;
  customer_lifetime_value: number;
  retention_rates: { [period: string]: number };
}

export interface PostPerformanceAnalysis {
  post_id: string;
  post_type: string;
  engagement_rate: number;
  conversion_rate: number;
  revenue_per_impression: number;
  sentiment_score: number;
  key_words: string[];
  performance_tier: 'high' | 'medium' | 'low';
}