// Competitive Intelligence API Service - Simulated data for competitor analysis
import { CompetitorProfile, CompetitorCampaign, CompetitorPerformance } from '../types/competitive';

export class CompetitiveIntelligenceAPI {
  /**
   * Fetch competitor profiles in the health/fitness industry (Simulated)
   */
  static async fetchCompetitorProfiles(): Promise<CompetitorProfile[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return [
      {
        competitor_id: 'comp_optimum_nutrition',
        brand_name: 'Optimum Nutrition',
        industry_category: 'Sports Nutrition',
        market_share: 18.5,
        total_followers: 2500000,
        avg_engagement_rate: 3.2,
        estimated_monthly_spend: 8500000,
        primary_platforms: ['Instagram', 'YouTube', 'Facebook'],
        target_demographics: {
          age_range: '22-35',
          gender_split: { male: 70, female: 30 },
          top_locations: ['US', 'IN', 'UK', 'CA', 'AU']
        },
        brand_positioning: 'Premium quality, scientifically-backed nutrition',
        key_products: ['Gold Standard Whey', 'Creatine', 'BCAA', 'Pre-workout'],
        competitive_advantages: ['Global brand recognition', 'Scientific credibility', 'Wide distribution'],
        weaknesses: ['Higher price point', 'Limited local market adaptation'],
        last_updated: new Date().toISOString()
      },
      {
        competitor_id: 'comp_myprotein',
        brand_name: 'Myprotein',
        industry_category: 'Sports Nutrition',
        market_share: 12.3,
        total_followers: 1800000,
        avg_engagement_rate: 4.1,
        estimated_monthly_spend: 6200000,
        primary_platforms: ['Instagram', 'TikTok', 'YouTube'],
        target_demographics: {
          age_range: '20-32',
          gender_split: { male: 60, female: 40 },
          top_locations: ['UK', 'IN', 'DE', 'FR', 'US']
        },
        brand_positioning: 'Affordable quality for everyday athletes',
        key_products: ['Impact Whey', 'Clear Whey', 'Vitamins', 'Clothing'],
        competitive_advantages: ['Competitive pricing', 'Strong social media presence', 'Product variety'],
        weaknesses: ['Quality perception vs premium brands', 'Limited offline presence'],
        last_updated: new Date().toISOString()
      },
      {
        competitor_id: 'comp_dymatize',
        brand_name: 'Dymatize',
        industry_category: 'Sports Nutrition',
        market_share: 8.7,
        total_followers: 950000,
        avg_engagement_rate: 3.8,
        estimated_monthly_spend: 3800000,
        primary_platforms: ['Instagram', 'YouTube', 'Twitter'],
        target_demographics: {
          age_range: '25-40',
          gender_split: { male: 75, female: 25 },
          top_locations: ['US', 'IN', 'BR', 'MX', 'CA']
        },
        brand_positioning: 'Performance-focused nutrition for serious athletes',
        key_products: ['ISO100 Whey', 'Elite Casein', 'Pre-workout', 'Creatine'],
        competitive_advantages: ['High-quality protein', 'Athlete endorsements', 'Innovation focus'],
        weaknesses: ['Limited market presence', 'Higher price point', 'Narrow target audience'],
        last_updated: new Date().toISOString()
      },
      {
        competitor_id: 'comp_nutrabay',
        brand_name: 'Nutrabay',
        industry_category: 'Sports Nutrition',
        market_share: 6.2,
        total_followers: 420000,
        avg_engagement_rate: 5.3,
        estimated_monthly_spend: 2100000,
        primary_platforms: ['Instagram', 'YouTube', 'Facebook'],
        target_demographics: {
          age_range: '22-35',
          gender_split: { male: 65, female: 35 },
          top_locations: ['IN-DL', 'IN-MH', 'IN-KA', 'IN-UP', 'IN-TN']
        },
        brand_positioning: 'Trusted Indian nutrition brand for fitness enthusiasts',
        key_products: ['Whey Protein', 'Mass Gainer', 'Multivitamins', 'Fat Burners'],
        competitive_advantages: ['Local market understanding', 'Competitive pricing', 'Strong online presence'],
        weaknesses: ['Limited international presence', 'Brand recognition vs global players'],
        last_updated: new Date().toISOString()
      }
    ];
  }

  /**
   * Fetch competitor campaigns and activities (Simulated)
   */
  static async fetchCompetitorCampaigns(competitorId?: string): Promise<CompetitorCampaign[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const allCampaigns = [
      {
        campaign_id: 'camp_on_newyear2024',
        competitor_id: 'comp_optimum_nutrition',
        campaign_name: 'New Year, New Goals',
        start_date: '2024-01-01',
        estimated_end_date: '2024-02-29',
        estimated_budget: 2500000,
        campaign_type: 'seasonal' as const,
        target_products: ['Gold Standard Whey', 'Pre-workout'],
        influencer_count: 45,
        estimated_reach: 8500000,
        engagement_performance: 4.2,
        sentiment_score: 0.78,
        campaign_effectiveness: 'high' as const,
        key_messages: ['Transform your fitness journey', 'Science-backed nutrition', 'Trusted by athletes'],
        content_themes: ['Transformation stories', 'Workout motivation', 'Product education'],
        platforms_used: ['Instagram', 'YouTube', 'TikTok'],
        detected_at: new Date().toISOString()
      },
      {
        campaign_id: 'camp_mp_summer2024',
        competitor_id: 'comp_myprotein',
        campaign_name: 'Summer Shred Challenge',
        start_date: '2024-03-01',
        estimated_end_date: '2024-05-31',
        estimated_budget: 1800000,
        campaign_type: 'seasonal' as const,
        target_products: ['Clear Whey', 'Fat Burners', 'Vitamins'],
        influencer_count: 62,
        estimated_reach: 12000000,
        engagement_performance: 5.1,
        sentiment_score: 0.82,
        campaign_effectiveness: 'high' as const,
        key_messages: ['Get summer ready', 'Affordable quality', 'Community challenge'],
        content_themes: ['Before/after transformations', 'Workout challenges', 'Nutrition tips'],
        platforms_used: ['TikTok', 'Instagram', 'YouTube'],
        detected_at: new Date().toISOString()
      },
      {
        campaign_id: 'camp_dym_athlete2024',
        competitor_id: 'comp_dymatize',
        campaign_name: 'Elite Athlete Partnership',
        start_date: '2024-02-15',
        estimated_end_date: '2024-06-15',
        estimated_budget: 3200000,
        campaign_type: 'brand_awareness' as const,
        target_products: ['ISO100 Whey', 'Elite Casein'],
        influencer_count: 28,
        estimated_reach: 6800000,
        engagement_performance: 3.9,
        sentiment_score: 0.85,
        campaign_effectiveness: 'medium' as const,
        key_messages: ['Train like a pro', 'Premium quality protein', 'Performance nutrition'],
        content_themes: ['Professional athlete content', 'Training insights', 'Product science'],
        platforms_used: ['Instagram', 'YouTube'],
        detected_at: new Date().toISOString()
      },
      {
        campaign_id: 'camp_nb_local2024',
        competitor_id: 'comp_nutrabay',
        campaign_name: 'Made for India Fitness',
        start_date: '2024-01-15',
        estimated_end_date: '2024-04-15',
        estimated_budget: 1200000,
        campaign_type: 'brand_awareness' as const,
        target_products: ['Whey Protein', 'Multivitamins'],
        influencer_count: 38,
        estimated_reach: 4200000,
        engagement_performance: 6.2,
        sentiment_score: 0.79,
        campaign_effectiveness: 'high' as const,
        key_messages: ['Indian brand for Indian fitness', 'Quality at affordable prices', 'Local understanding'],
        content_themes: ['Local fitness culture', 'Affordable nutrition', 'Community building'],
        platforms_used: ['Instagram', 'YouTube', 'Facebook'],
        detected_at: new Date().toISOString()
      }
    ];

    return competitorId 
      ? allCampaigns.filter(campaign => campaign.competitor_id === competitorId)
      : allCampaigns;
  }

  /**
   * Fetch competitor performance metrics (Simulated)
   */
  static async fetchCompetitorPerformance(
    competitorId?: string,
    period?: string
  ): Promise<CompetitorPerformance[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const performanceData = [
      {
        competitor_id: 'comp_optimum_nutrition',
        period: '2024-01',
        estimated_revenue: 45000000,
        estimated_roas: 3.2,
        market_share_change: 2.1,
        engagement_trend: 'increasing' as const,
        content_volume: 156,
        influencer_partnerships: 45,
        viral_content_count: 8,
        brand_mention_sentiment: 0.76,
        competitive_pressure_score: 85,
        innovation_score: 72
      },
      {
        competitor_id: 'comp_myprotein',
        period: '2024-01',
        estimated_revenue: 32000000,
        estimated_roas: 4.1,
        market_share_change: 3.8,
        engagement_trend: 'increasing' as const,
        content_volume: 203,
        influencer_partnerships: 62,
        viral_content_count: 12,
        brand_mention_sentiment: 0.81,
        competitive_pressure_score: 78,
        innovation_score: 84
      },
      {
        competitor_id: 'comp_dymatize',
        period: '2024-01',
        estimated_revenue: 18500000,
        estimated_roas: 2.8,
        market_share_change: -0.5,
        engagement_trend: 'stable' as const,
        content_volume: 89,
        influencer_partnerships: 28,
        viral_content_count: 3,
        brand_mention_sentiment: 0.83,
        competitive_pressure_score: 65,
        innovation_score: 68
      },
      {
        competitor_id: 'comp_nutrabay',
        period: '2024-01',
        estimated_revenue: 12800000,
        estimated_roas: 5.2,
        market_share_change: 1.2,
        engagement_trend: 'increasing' as const,
        content_volume: 134,
        influencer_partnerships: 38,
        viral_content_count: 6,
        brand_mention_sentiment: 0.77,
        competitive_pressure_score: 58,
        innovation_score: 71
      }
    ];

    let filteredData = performanceData;
    
    if (competitorId) {
      filteredData = performanceData.filter(perf => perf.competitor_id === competitorId);
    }
    
    if (period) {
      filteredData = filteredData.filter(perf => perf.period === period);
    }

    return filteredData;
  }

  /**
   * Analyze competitive landscape and identify threats/opportunities (Simulated)
   */
  static async analyzeCompetitiveLandscape(): Promise<{
    market_leaders: CompetitorProfile[];
    emerging_threats: CompetitorProfile[];
    market_gaps: string[];
    competitive_intensity: number;
    our_position: {
      estimated_rank: number;
      market_share_estimate: number;
      competitive_advantages: string[];
      areas_for_improvement: string[];
    };
  }> {
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const competitors = await this.fetchCompetitorProfiles();
    const sortedByMarketShare = competitors.sort((a, b) => b.market_share - a.market_share);
    
    return {
      market_leaders: sortedByMarketShare.slice(0, 2),
      emerging_threats: competitors.filter(comp => comp.avg_engagement_rate > 4.5),
      market_gaps: [
        'Women-focused fitness nutrition products',
        'Plant-based protein alternatives',
        'Personalized nutrition recommendations',
        'Sustainable packaging solutions',
        'Regional flavor preferences'
      ],
      competitive_intensity: 78, // 0-100 scale
      our_position: {
        estimated_rank: 5,
        market_share_estimate: 4.8,
        competitive_advantages: [
          'Strong local market presence',
          'Comprehensive product portfolio',
          'Advanced analytics capabilities',
          'Influencer relationship management'
        ],
        areas_for_improvement: [
          'International market expansion',
          'Premium product positioning',
          'Social media engagement rates',
          'Brand recognition vs global players'
        ]
      }
    };
  }

  /**
   * Get competitor social media insights (Simulated)
   */
  static async getCompetitorSocialInsights(competitorId: string): Promise<{
    platform_performance: { [platform: string]: any };
    top_content_themes: string[];
    influencer_strategy: any;
    engagement_patterns: any;
  }> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      platform_performance: {
        Instagram: {
          followers: Math.floor(Math.random() * 1000000) + 500000,
          avg_engagement_rate: Math.random() * 3 + 2,
          post_frequency: Math.floor(Math.random() * 10) + 5,
          story_usage: Math.random() * 100
        },
        YouTube: {
          subscribers: Math.floor(Math.random() * 500000) + 100000,
          avg_views: Math.floor(Math.random() * 100000) + 50000,
          upload_frequency: Math.floor(Math.random() * 5) + 2,
          avg_watch_time: Math.random() * 300 + 120
        },
        TikTok: {
          followers: Math.floor(Math.random() * 800000) + 200000,
          avg_engagement_rate: Math.random() * 8 + 5,
          viral_content_rate: Math.random() * 20 + 5
        }
      },
      top_content_themes: [
        'Workout motivation',
        'Product demonstrations',
        'Transformation stories',
        'Nutrition education',
        'Athlete partnerships'
      ],
      influencer_strategy: {
        micro_influencer_focus: Math.random() > 0.5,
        celebrity_partnerships: Math.random() > 0.7,
        avg_partnership_duration: Math.floor(Math.random() * 6) + 3,
        content_collaboration_rate: Math.random() * 40 + 30
      },
      engagement_patterns: {
        peak_posting_times: ['10:00 AM', '2:00 PM', '7:00 PM'],
        best_performing_days: ['Tuesday', 'Thursday', 'Sunday'],
        seasonal_trends: {
          'Q1': 'New Year fitness resolutions',
          'Q2': 'Summer body preparation',
          'Q3': 'Back to school/routine',
          'Q4': 'Holiday season maintenance'
        }
      }
    };
  }

  /**
   * Monitor competitor pricing and promotions (Simulated)
   */
  static async monitorCompetitorPricing(): Promise<{
    competitor_id: string;
    product_pricing: any[];
    active_promotions: any[];
    pricing_strategy: string;
    price_competitiveness: number;
  }[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const competitors = await this.fetchCompetitorProfiles();
    
    return competitors.map(competitor => ({
      competitor_id: competitor.competitor_id,
      product_pricing: [
        {
          product: 'Whey Protein 1kg',
          price: Math.floor(Math.random() * 500) + 1200,
          currency: 'INR',
          discount_percentage: Math.floor(Math.random() * 30),
          last_updated: new Date().toISOString()
        },
        {
          product: 'Mass Gainer 3kg',
          price: Math.floor(Math.random() * 800) + 1500,
          currency: 'INR',
          discount_percentage: Math.floor(Math.random() * 25),
          last_updated: new Date().toISOString()
        }
      ],
      active_promotions: [
        {
          promotion_type: 'percentage_discount',
          discount_value: Math.floor(Math.random() * 30) + 10,
          valid_until: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          applicable_products: ['Whey Protein', 'Pre-workout']
        }
      ],
      pricing_strategy: Math.random() > 0.5 ? 'premium' : 'competitive',
      price_competitiveness: Math.floor(Math.random() * 40) + 60 // 60-100 scale
    }));
  }
}