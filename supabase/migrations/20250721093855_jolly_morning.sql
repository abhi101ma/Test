/*
  # Enhanced HealthKart Influencer Analytics Schema

  1. New Tables
    - `enhanced_influencers` - Influencer profiles with demographics
    - `enhanced_campaigns` - Campaign information with product focus
    - `enhanced_posts` - Post data with detailed engagement metrics
    - `enhanced_tracking_data` - Order tracking with attribution details
    - `enhanced_payouts` - Payout information with multiple basis types

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users

  3. Features
    - JSON columns for complex data (demographics, attribution)
    - Proper foreign key relationships
    - Comprehensive indexing for performance
*/

-- Enhanced Influencers Table
CREATE TABLE IF NOT EXISTS enhanced_influencers (
  influencer_id text PRIMARY KEY,
  name text NOT NULL,
  handle text NOT NULL,
  platform text NOT NULL CHECK (platform IN ('Instagram', 'YouTube', 'Twitter')),
  primary_category text NOT NULL CHECK (primary_category IN ('Fitness', 'Nutrition', 'Wellness', 'Bodybuilding')),
  follower_count integer NOT NULL DEFAULT 0,
  gender text NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
  audience_demographics jsonb NOT NULL DEFAULT '{}',
  avg_engagement_rate decimal(5,2) NOT NULL DEFAULT 0.0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enhanced Campaigns Table
CREATE TABLE IF NOT EXISTS enhanced_campaigns (
  campaign_id text PRIMARY KEY,
  campaign_name text NOT NULL,
  brand text NOT NULL CHECK (brand IN ('MuscleBlaze', 'HKVitals', 'Gritzo', 'HealthKart')),
  product_focus text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  budget integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'planned' CHECK (status IN ('active', 'completed', 'paused', 'planned')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enhanced Posts Table
CREATE TABLE IF NOT EXISTS enhanced_posts (
  post_id text PRIMARY KEY,
  influencer_id text NOT NULL REFERENCES enhanced_influencers(influencer_id) ON DELETE CASCADE,
  campaign_id text NOT NULL REFERENCES enhanced_campaigns(campaign_id) ON DELETE CASCADE,
  post_url text NOT NULL,
  platform_post_id text NOT NULL,
  post_date date NOT NULL,
  caption_text text NOT NULL,
  post_type text NOT NULL CHECK (post_type IN ('Reel', 'Static Post', 'Story', 'YouTube Video', 'Tweet')),
  reach integer NOT NULL DEFAULT 0,
  impressions integer NOT NULL DEFAULT 0,
  likes integer NOT NULL DEFAULT 0,
  comments integer NOT NULL DEFAULT 0,
  shares integer NOT NULL DEFAULT 0,
  saves integer DEFAULT 0,
  video_views integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enhanced Tracking Data Table
CREATE TABLE IF NOT EXISTS enhanced_tracking_data (
  event_id text PRIMARY KEY,
  user_id text NOT NULL,
  order_id text NOT NULL,
  order_date date NOT NULL,
  revenue decimal(10,2) NOT NULL DEFAULT 0.0,
  items_in_cart jsonb NOT NULL DEFAULT '[]',
  attribution_source text NOT NULL CHECK (attribution_source IN ('influencer', 'organic', 'paid_search', 'direct')),
  attribution_details jsonb NOT NULL DEFAULT '{}',
  is_new_customer boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enhanced Payouts Table
CREATE TABLE IF NOT EXISTS enhanced_payouts (
  payout_id text PRIMARY KEY,
  influencer_id text NOT NULL REFERENCES enhanced_influencers(influencer_id) ON DELETE CASCADE,
  campaign_id text NOT NULL REFERENCES enhanced_campaigns(campaign_id) ON DELETE CASCADE,
  payout_basis text NOT NULL CHECK (payout_basis IN ('fixed_per_post', 'cpo', 'hybrid', 'barter')),
  rate decimal(10,2) NOT NULL DEFAULT 0.0,
  fixed_fee decimal(10,2) NOT NULL DEFAULT 0.0,
  commission_earned decimal(10,2) NOT NULL DEFAULT 0.0,
  total_payout decimal(10,2) NOT NULL DEFAULT 0.0,
  payout_status text NOT NULL DEFAULT 'pending' CHECK (payout_status IN ('pending', 'approved', 'paid', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_enhanced_posts_influencer_id ON enhanced_posts(influencer_id);
CREATE INDEX IF NOT EXISTS idx_enhanced_posts_campaign_id ON enhanced_posts(campaign_id);
CREATE INDEX IF NOT EXISTS idx_enhanced_posts_post_date ON enhanced_posts(post_date);
CREATE INDEX IF NOT EXISTS idx_enhanced_tracking_data_order_date ON enhanced_tracking_data(order_date);
CREATE INDEX IF NOT EXISTS idx_enhanced_tracking_data_attribution_source ON enhanced_tracking_data(attribution_source);
CREATE INDEX IF NOT EXISTS idx_enhanced_payouts_influencer_id ON enhanced_payouts(influencer_id);
CREATE INDEX IF NOT EXISTS idx_enhanced_payouts_campaign_id ON enhanced_payouts(campaign_id);
CREATE INDEX IF NOT EXISTS idx_enhanced_payouts_status ON enhanced_payouts(payout_status);

-- Enable Row Level Security
ALTER TABLE enhanced_influencers ENABLE ROW LEVEL SECURITY;
ALTER TABLE enhanced_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE enhanced_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE enhanced_tracking_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE enhanced_payouts ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can read enhanced_influencers"
  ON enhanced_influencers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert enhanced_influencers"
  ON enhanced_influencers
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update enhanced_influencers"
  ON enhanced_influencers
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can read enhanced_campaigns"
  ON enhanced_campaigns
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert enhanced_campaigns"
  ON enhanced_campaigns
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update enhanced_campaigns"
  ON enhanced_campaigns
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can read enhanced_posts"
  ON enhanced_posts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert enhanced_posts"
  ON enhanced_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update enhanced_posts"
  ON enhanced_posts
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can read enhanced_tracking_data"
  ON enhanced_tracking_data
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert enhanced_tracking_data"
  ON enhanced_tracking_data
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update enhanced_tracking_data"
  ON enhanced_tracking_data
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can read enhanced_payouts"
  ON enhanced_payouts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert enhanced_payouts"
  ON enhanced_payouts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update enhanced_payouts"
  ON enhanced_payouts
  FOR UPDATE
  TO authenticated
  USING (true);