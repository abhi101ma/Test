// Enterprise-grade features and deep learning model types
export interface DeepLearningModel {
  model_id: string;
  model_type: 'neural_network' | 'transformer' | 'cnn' | 'lstm';
  model_name: string;
  version: string;
  accuracy: number;
  training_data_size: number;
  last_trained: string;
  status: 'active' | 'training' | 'deprecated';
  use_cases: string[];
}

export interface ComputerVisionAnalysis {
  post_id: string;
  image_url: string;
  brand_logo_detected: boolean;
  product_visibility_score: number; // 0-100
  brand_safety_score: number; // 0-100
  content_quality_score: number; // 0-100
  dominant_colors: string[];
  detected_objects: string[];
  text_in_image: string;
  aesthetic_score: number; // 0-100
  engagement_prediction: number;
}

export interface AdvancedNLPAnalysis {
  post_id: string;
  language_detected: string;
  readability_score: number; // 0-100
  brand_mention_sentiment: number; // -1 to 1
  call_to_action_strength: number; // 0-100
  urgency_score: number; // 0-100
  authenticity_score: number; // 0-100
  topic_modeling: {
    primary_topic: string;
    topic_confidence: number;
    related_topics: string[];
  };
  named_entities: {
    brands: string[];
    products: string[];
    locations: string[];
    people: string[];
  };
}

export interface RealTimeAnalytics {
  timestamp: string;
  metric_type: 'engagement' | 'reach' | 'conversions' | 'revenue';
  current_value: number;
  predicted_value: number;
  variance: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  anomaly_detected: boolean;
  confidence: number;
}

export interface CollaborationFeature {
  annotation_id: string;
  user_id: string;
  user_name: string;
  target_type: 'chart' | 'metric' | 'campaign' | 'influencer';
  target_id: string;
  annotation_type: 'comment' | 'highlight' | 'question' | 'insight';
  content: string;
  position?: { x: number; y: number };
  created_at: string;
  resolved: boolean;
  replies: CollaborationReply[];
}

export interface CollaborationReply {
  reply_id: string;
  user_id: string;
  user_name: string;
  content: string;
  created_at: string;
}

export interface RoleBasedView {
  role_id: string;
  role_name: 'cmo' | 'campaign_manager' | 'analyst' | 'finance' | 'creative';
  display_name: string;
  permissions: {
    view_financial_data: boolean;
    edit_campaigns: boolean;
    approve_payouts: boolean;
    access_predictive_models: boolean;
    export_data: boolean;
    manage_users: boolean;
  };
  dashboard_config: {
    visible_metrics: string[];
    default_filters: any;
    chart_preferences: any;
  };
}

export interface AutomatedAlert {
  alert_id: string;
  alert_type: 'performance' | 'budget' | 'goal' | 'anomaly' | 'compliance';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  trigger_conditions: any;
  notification_channels: ('email' | 'in_app' | 'slack' | 'webhook')[];
  recipients: string[];
  frequency: 'real_time' | 'hourly' | 'daily' | 'weekly';
  is_active: boolean;
  created_at: string;
  last_triggered: string;
}

export interface AdvancedReporting {
  report_id: string;
  report_name: string;
  report_type: 'executive_summary' | 'campaign_deep_dive' | 'influencer_analysis' | 'roi_analysis';
  template_id: string;
  parameters: any;
  generated_at: string;
  file_url: string;
  sharing_settings: {
    is_public: boolean;
    allowed_users: string[];
    expiry_date?: string;
  };
}

export interface APIIntegration {
  integration_id: string;
  platform: 'instagram' | 'youtube' | 'tiktok' | 'twitter' | 'shopify' | 'google_analytics';
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  last_sync: string;
  sync_frequency: 'real_time' | 'hourly' | 'daily';
  data_types: string[];
  credentials_valid: boolean;
  error_message?: string;
}

export interface WhiteLabelConfig {
  tenant_id: string;
  brand_name: string;
  logo_url: string;
  primary_color: string;
  secondary_color: string;
  custom_domain?: string;
  features_enabled: string[];
  user_limits: {
    max_users: number;
    max_campaigns: number;
    max_influencers: number;
  };
}