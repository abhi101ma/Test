import { 
  EnhancedInfluencer, 
  EnhancedCampaign, 
  EnhancedPost, 
  EnhancedTrackingData, 
  EnhancedPayout 
} from '../types/enhanced';
import { MarketingDataGenerator, defaultConfig } from './dataGenerator';

// Generate enhanced dataset with more comprehensive data
const generatedData = MarketingDataGenerator.generateCompleteDataset({
  influencerCount: 30,
  campaignCount: 20,
  postsPerInfluencer: 12,
  ordersPerPost: 4,
  timeRangeMonths: 8
});

// Use generated data as the primary dataset
export const enhancedInfluencers = generatedData.influencers;
export const enhancedCampaigns = generatedData.campaigns;
export const enhancedPosts = generatedData.posts;
export const enhancedTrackingData = generatedData.trackingData;
export const enhancedPayouts = generatedData.payouts;

// Keep original smaller dataset as backup
export const originalEnhancedInfluencers = [
  {
    influencer_id: 'inf_001',
    name: 'Fitness Guru Raj',
    handle: '@fitnessgururaj',
    platform: 'Instagram',
    primary_category: 'Fitness',
    follower_count: 125000,
    gender: 'Male',
    audience_demographics: {
      age_range: '25-34',
      gender_split: { male: 65, female: 35 },
      top_locations: ['IN-DL', 'IN-MH', 'IN-KA']
    },
    avg_engagement_rate: 4.2
  },
  {
    influencer_id: 'inf_002',
    name: 'Health Maven Priya',
    handle: '@healthmavenpriya',
    platform: 'YouTube',
    primary_category: 'Nutrition',
    follower_count: 89000,
    gender: 'Female',
    audience_demographics: {
      age_range: '28-40',
      gender_split: { male: 30, female: 70 },
      top_locations: ['IN-MH', 'IN-DL', 'IN-TN']
    },
    avg_engagement_rate: 6.8
  },
  {
    influencer_id: 'inf_003',
    name: 'Muscle Builder Mike',
    handle: '@musclebuildermike',
    platform: 'Instagram',
    primary_category: 'Bodybuilding',
    follower_count: 198000,
    gender: 'Male',
    audience_demographics: {
      age_range: '22-35',
      gender_split: { male: 80, female: 20 },
      top_locations: ['IN-DL', 'IN-UP', 'IN-PB']
    },
    avg_engagement_rate: 3.9
  },
  {
    influencer_id: 'inf_004',
    name: 'Wellness Queen Sara',
    handle: '@wellnessqueensara',
    platform: 'Instagram',
    primary_category: 'Wellness',
    follower_count: 156000,
    gender: 'Female',
    audience_demographics: {
      age_range: '25-45',
      gender_split: { male: 25, female: 75 },
      top_locations: ['IN-MH', 'IN-KA', 'IN-DL']
    },
    avg_engagement_rate: 5.1
  },
  {
    influencer_id: 'inf_005',
    name: 'Protein Expert Dev',
    handle: '@proteinexpertdev',
    platform: 'YouTube',
    primary_category: 'Nutrition',
    follower_count: 73000,
    gender: 'Male',
    audience_demographics: {
      age_range: '20-30',
      gender_split: { male: 70, female: 30 },
      top_locations: ['IN-KA', 'IN-TN', 'IN-AP']
    },
    avg_engagement_rate: 7.2
  },
  {
    influencer_id: 'inf_006',
    name: 'Yoga Instructor Maya',
    handle: '@yogainstructormaya',
    platform: 'Instagram',
    primary_category: 'Wellness',
    follower_count: 112000,
    gender: 'Female',
    audience_demographics: {
      age_range: '30-50',
      gender_split: { male: 20, female: 80 },
      top_locations: ['IN-DL', 'IN-MH', 'IN-RJ']
    },
    avg_engagement_rate: 4.8
  }
];

export const originalEnhancedCampaigns = [
  {
    campaign_id: 'camp_001',
    campaign_name: 'MB Whey Gold Launch Q1',
    brand: 'MuscleBlaze',
    product_focus: 'Whey Protein',
    start_date: '2024-01-15',
    end_date: '2024-02-15',
    budget: 250000,
    status: 'completed'
  },
  {
    campaign_id: 'camp_002',
    campaign_name: 'HKVitals Immunity Boost Campaign',
    brand: 'HKVitals',
    product_focus: 'Multivitamins',
    start_date: '2024-02-01',
    end_date: '2024-03-01',
    budget: 180000,
    status: 'active'
  },
  {
    campaign_id: 'camp_003',
    campaign_name: 'Gritzo Kids Nutrition Drive',
    brand: 'Gritzo',
    product_focus: 'Kids Nutrition',
    start_date: '2024-02-20',
    end_date: '2024-03-20',
    budget: 120000,
    status: 'active'
  },
  {
    campaign_id: 'camp_004',
    campaign_name: 'MuscleBlaze Mass Gainer Push',
    brand: 'MuscleBlaze',
    product_focus: 'Mass Gainer',
    start_date: '2024-03-01',
    end_date: '2024-03-31',
    budget: 200000,
    status: 'planned'
  }
];

export const originalEnhancedPosts = [
  {
    post_id: 'post_001',
    influencer_id: 'inf_001',
    campaign_id: 'camp_001',
    post_url: 'https://instagram.com/p/C2abc123',
    platform_post_id: 'C2abc123',
    post_date: '2024-01-20',
    caption_text: 'Just tried the new MuscleBlaze Whey Gold! 💪 Amazing results after just 2 weeks! Use code RAJFIT20 for 20% off. #MuscleBlaze #Fitness #Gains',
    post_type: 'Reel',
    reach: 52000,
    impressions: 68000,
    likes: 2800,
    comments: 156,
    shares: 89,
    saves: 234
  },
  {
    post_id: 'post_002',
    influencer_id: 'inf_002',
    campaign_id: 'camp_002',
    post_url: 'https://youtube.com/watch?v=xyz789',
    platform_post_id: 'xyz789',
    post_date: '2024-02-05',
    caption_text: 'Complete review of HKVitals immunity supplements - everything you need to know! These have been a game-changer for my health routine.',
    post_type: 'YouTube Video',
    reach: 38000,
    impressions: 45000,
    likes: 1950,
    comments: 245,
    shares: 167,
    video_views: 42000
  },
  {
    post_id: 'post_003',
    influencer_id: 'inf_003',
    campaign_id: 'camp_001',
    post_url: 'https://instagram.com/p/C2def456',
    platform_post_id: 'C2def456',
    post_date: '2024-01-25',
    caption_text: 'Fueling my workouts with @MuscleBlaze Whey Gold 🔥 The taste is incredible and results speak for themselves! Code MIKE25 saves you 25%',
    post_type: 'Static Post',
    reach: 89000,
    impressions: 112000,
    likes: 4200,
    comments: 298,
    shares: 178,
    saves: 567
  },
  {
    post_id: 'post_004',
    influencer_id: 'inf_004',
    campaign_id: 'camp_002',
    post_url: 'https://instagram.com/p/C2ghi789',
    platform_post_id: 'C2ghi789',
    post_date: '2024-02-08',
    caption_text: 'Immunity is everything! 🌟 Love these @HKVitals supplements - they keep me energized and healthy. Use SARA15 for discount! #WellnessJourney',
    post_type: 'Reel',
    reach: 71000,
    impressions: 85000,
    likes: 3600,
    comments: 189,
    shares: 145,
    saves: 423
  },
  {
    post_id: 'post_005',
    influencer_id: 'inf_005',
    campaign_id: 'camp_003',
    post_url: 'https://youtube.com/watch?v=abc456',
    platform_post_id: 'abc456',
    post_date: '2024-02-25',
    caption_text: 'Gritzo Kids Nutrition: Why I recommend it to all parents | Detailed Review and Analysis',
    post_type: 'YouTube Video',
    reach: 31000,
    impressions: 38000,
    likes: 1680,
    comments: 167,
    shares: 98,
    video_views: 35000
  },
  {
    post_id: 'post_006',
    influencer_id: 'inf_006',
    campaign_id: 'camp_002',
    post_url: 'https://instagram.com/p/C2jkl012',
    platform_post_id: 'C2jkl012',
    post_date: '2024-02-12',
    caption_text: 'Morning yoga with my daily dose of @HKVitals 🧘‍♀️ Feeling energized and ready for the day! Code MAYA10 for savings',
    post_type: 'Static Post',
    reach: 54000,
    impressions: 67000,
    likes: 2890,
    comments: 178,
    shares: 156,
    saves: 345
  }
];

export const originalEnhancedTrackingData = [
  {
    event_id: 'evt_001',
    user_id: 'user_12345',
    order_id: 'ord_67890',
    order_date: '2024-01-21',
    revenue: 1575,
    items_in_cart: ['MB_WHEY_GOLD_1KG', 'MB_SHAKER'],
    attribution_source: 'influencer',
    attribution_details: {
      influencer_id: 'inf_001',
      campaign_id: 'camp_001',
      coupon_code: 'RAJFIT20',
      post_id: 'post_001'
    },
    is_new_customer: true
  },
  {
    event_id: 'evt_002',
    user_id: 'user_23456',
    order_id: 'ord_78901',
    order_date: '2024-02-06',
    revenue: 800,
    items_in_cart: ['HK_VITAMIN_C', 'HK_MULTIVIT'],
    attribution_source: 'influencer',
    attribution_details: {
      influencer_id: 'inf_002',
      campaign_id: 'camp_002',
      post_id: 'post_002'
    },
    is_new_customer: false
  },
  {
    event_id: 'evt_003',
    user_id: 'user_34567',
    order_id: 'ord_89012',
    order_date: '2024-01-26',
    revenue: 1620,
    items_in_cart: ['MB_MASS_GAINER_3KG'],
    attribution_source: 'influencer',
    attribution_details: {
      influencer_id: 'inf_003',
      campaign_id: 'camp_001',
      coupon_code: 'MIKE25',
      post_id: 'post_003'
    },
    is_new_customer: true
  },
  {
    event_id: 'evt_004',
    user_id: 'user_45678',
    order_id: 'ord_90123',
    order_date: '2024-02-09',
    revenue: 950,
    items_in_cart: ['HK_OMEGA3', 'HK_VITAMIN_D'],
    attribution_source: 'influencer',
    attribution_details: {
      influencer_id: 'inf_004',
      campaign_id: 'camp_002',
      coupon_code: 'SARA15',
      post_id: 'post_004'
    },
    is_new_customer: true
  },
  {
    event_id: 'evt_005',
    user_id: 'user_56789',
    order_id: 'ord_01234',
    order_date: '2024-02-26',
    revenue: 600,
    items_in_cart: ['GRITZO_SUPERMILK_CHOCO'],
    attribution_source: 'influencer',
    attribution_details: {
      influencer_id: 'inf_005',
      campaign_id: 'camp_003',
      post_id: 'post_005'
    },
    is_new_customer: false
  },
  {
    event_id: 'evt_006',
    user_id: 'user_67890',
    order_id: 'ord_12345',
    order_date: '2024-02-13',
    revenue: 1200,
    items_in_cart: ['HK_COLLAGEN', 'HK_BIOTIN'],
    attribution_source: 'influencer',
    attribution_details: {
      influencer_id: 'inf_006',
      campaign_id: 'camp_002',
      coupon_code: 'MAYA10',
      post_id: 'post_006'
    },
    is_new_customer: true
  },
  // Organic sales for baseline comparison
  {
    event_id: 'evt_007',
    user_id: 'user_78901',
    order_id: 'ord_23456',
    order_date: '2024-01-22',
    revenue: 1400,
    items_in_cart: ['MB_WHEY_GOLD_1KG'],
    attribution_source: 'organic',
    attribution_details: {},
    is_new_customer: false
  },
  {
    event_id: 'evt_008',
    user_id: 'user_89012',
    order_id: 'ord_34567',
    order_date: '2024-02-07',
    revenue: 750,
    items_in_cart: ['HK_VITAMIN_C'],
    attribution_source: 'organic',
    attribution_details: {},
    is_new_customer: true
  }
];

export const originalEnhancedPayouts = [
  {
    payout_id: 'pay_001',
    influencer_id: 'inf_001',
    campaign_id: 'camp_001',
    payout_basis: 'fixed_per_post',
    rate: 15000,
    fixed_fee: 15000,
    commission_earned: 0,
    total_payout: 15000,
    payout_status: 'paid'
  },
  {
    payout_id: 'pay_002',
    influencer_id: 'inf_002',
    campaign_id: 'camp_002',
    payout_basis: 'cpo',
    rate: 500, // ₹500 per order
    fixed_fee: 0,
    commission_earned: 1500, // 3 orders * ₹500
    total_payout: 1500,
    payout_status: 'approved'
  },
  {
    payout_id: 'pay_003',
    influencer_id: 'inf_003',
    campaign_id: 'camp_001',
    payout_basis: 'hybrid',
    rate: 0.05, // 5% commission
    fixed_fee: 20000,
    commission_earned: 81, // 5% of ₹1620
    total_payout: 20081,
    payout_status: 'paid'
  },
  {
    payout_id: 'pay_004',
    influencer_id: 'inf_004',
    campaign_id: 'camp_002',
    payout_basis: 'fixed_per_post',
    rate: 12000,
    fixed_fee: 12000,
    commission_earned: 0,
    total_payout: 12000,
    payout_status: 'pending'
  },
  {
    payout_id: 'pay_005',
    influencer_id: 'inf_005',
    campaign_id: 'camp_003',
    payout_basis: 'cpo',
    rate: 300,
    fixed_fee: 0,
    commission_earned: 300, // 1 order * ₹300
    total_payout: 300,
    payout_status: 'pending'
  },
  {
    payout_id: 'pay_006',
    influencer_id: 'inf_006',
    campaign_id: 'camp_002',
    payout_basis: 'fixed_per_post',
    rate: 10000,
    fixed_fee: 10000,
    commission_earned: 0,
    total_payout: 10000,
    payout_status: 'approved'
  }
];

// Export data generation utilities for manual use
export { MarketingDataGenerator, defaultConfig };

// Log generation summary
console.log('Enhanced Marketing Data Generated:', {
  influencers: enhancedInfluencers.length,
  campaigns: enhancedCampaigns.length,
  posts: enhancedPosts.length,
  trackingData: enhancedTrackingData.length,
  payouts: enhancedPayouts.length,
  totalRevenue: enhancedTrackingData.reduce((sum, t) => sum + t.revenue, 0),
  totalSpend: enhancedPayouts.reduce((sum, p) => sum + p.total_payout, 0)
});