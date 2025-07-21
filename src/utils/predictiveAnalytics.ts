// Predictive analytics and machine learning utilities
import { 
  PredictiveMetrics, 
  InfluencerDiscoveryScore, 
  CampaignOptimization,
  AnomalyDetection,
  MarketTrends 
} from '../types/predictive';
import { EnhancedInfluencer, EnhancedTrackingData, EnhancedPayout, EnhancedPost } from '../types/enhanced';
import { calculateIncrementalROAS } from './enhancedCalculations';

export class PredictiveAnalyzer {
  /**
   * Predict influencer performance using regression analysis
   */
  static predictInfluencerPerformance(
    influencer: EnhancedInfluencer,
    historicalPosts: EnhancedPost[],
    historicalTracking: EnhancedTrackingData[]
  ): PredictiveMetrics {
    const influencerPosts = historicalPosts.filter(p => p.influencer_id === influencer.influencer_id);
    const influencerTracking = historicalTracking.filter(t => 
      t.attribution_details.influencer_id === influencer.influencer_id
    );

    // Calculate historical averages
    const avgReach = influencerPosts.length > 0 ? 
      influencerPosts.reduce((sum, p) => sum + p.reach, 0) / influencerPosts.length : 
      influencer.follower_count * 0.15; // 15% reach rate estimate

    const avgEngagement = influencerPosts.length > 0 ?
      influencerPosts.reduce((sum, p) => sum + p.likes + p.comments + p.shares, 0) / influencerPosts.length :
      avgReach * (influencer.avg_engagement_rate / 100);

    const avgRevenue = influencerTracking.length > 0 ?
      influencerTracking.reduce((sum, t) => sum + t.revenue, 0) / influencerTracking.length :
      0;

    // Predictive modeling using linear regression concepts
    const followerGrowthFactor = this.calculateGrowthFactor(influencer);
    const platformMultiplier = this.getPlatformMultiplier(influencer.platform);
    const categoryMultiplier = this.getCategoryMultiplier(influencer.primary_category);
    const seasonalityFactor = this.getSeasonalityFactor();

    // Predictions with growth factors
    const predicted_reach = Math.round(avgReach * followerGrowthFactor * platformMultiplier * seasonalityFactor);
    const predicted_engagement = Math.round(avgEngagement * followerGrowthFactor * platformMultiplier);
    const predicted_conversions = Math.round(predicted_reach * 0.02 * categoryMultiplier); // 2% base conversion
    const predicted_revenue = Math.round(predicted_conversions * 800 * categoryMultiplier); // ₹800 avg order value

    // Calculate confidence intervals (±20% for simplicity)
    const confidence_interval = {
      lower: Math.round(predicted_revenue * 0.8),
      upper: Math.round(predicted_revenue * 1.2)
    };

    // Risk assessment
    const risk_factors = this.assessRiskFactors(influencer, influencerPosts, influencerTracking);
    
    // Growth potential scoring
    const growth_potential = this.calculateGrowthPotential(influencer, influencerPosts);

    // Optimal posting schedule based on historical performance
    const optimal_posting_schedule = this.getOptimalPostingSchedule(influencer.platform);

    return {
      influencer_id: influencer.influencer_id,
      predicted_reach,
      predicted_engagement,
      predicted_conversions,
      predicted_revenue,
      confidence_interval,
      risk_factors,
      growth_potential,
      optimal_posting_schedule
    };
  }

  /**
   * Calculate influencer discovery score for recommendation engine
   */
  static calculateDiscoveryScore(
    influencer: EnhancedInfluencer,
    historicalData: {
      posts: EnhancedPost[];
      tracking: EnhancedTrackingData[];
      payouts: EnhancedPayout[];
    },
    targetBrand: string
  ): InfluencerDiscoveryScore {
    const influencerPosts = historicalData.posts.filter(p => p.influencer_id === influencer.influencer_id);
    const influencerTracking = historicalData.tracking.filter(t => 
      t.attribution_details.influencer_id === influencer.influencer_id
    );
    const influencerPayouts = historicalData.payouts.filter(p => p.influencer_id === influencer.influencer_id);

    // Calculate ROAS potential (0-25 points)
    const metrics = calculateIncrementalROAS(influencerTracking, influencerPayouts);
    const roas_potential = Math.min((metrics.incremental_roas / 3) * 25, 25); // Target 3x ROAS

    // Engagement quality (0-20 points)
    const engagement_quality = Math.min((influencer.avg_engagement_rate / 6) * 20, 20); // Target 6% engagement

    // Audience alignment (0-20 points) - simplified brand alignment
    const audience_alignment = this.calculateBrandAlignment(influencer, targetBrand);

    // Content consistency (0-15 points)
    const content_consistency = this.calculateContentConsistency(influencerPosts);

    // Growth trajectory (0-20 points)
    const growth_trajectory = this.calculateGrowthTrajectory(influencer, influencerPosts);

    const overall_score = Math.round(
      roas_potential + engagement_quality + audience_alignment + content_consistency + growth_trajectory
    );

    // Risk assessment
    const risk_assessment = this.assessInfluencerRisk(influencer, influencerPosts, metrics);

    // Budget and ROI recommendations
    const recommended_budget = this.calculateRecommendedBudget(influencer, metrics);
    const expected_roi = metrics.incremental_roas > 0 ? metrics.incremental_roas : 2.5; // Default expectation

    return {
      influencer_id: influencer.influencer_id,
      overall_score,
      roas_potential: Math.round(roas_potential),
      engagement_quality: Math.round(engagement_quality),
      audience_alignment: Math.round(audience_alignment),
      content_consistency: Math.round(content_consistency),
      growth_trajectory: Math.round(growth_trajectory),
      risk_assessment,
      recommended_budget,
      expected_roi
    };
  }

  /**
   * Generate campaign optimization recommendations
   */
  static optimizeCampaign(
    campaignId: string,
    influencers: EnhancedInfluencer[],
    posts: EnhancedPost[],
    tracking: EnhancedTrackingData[],
    payouts: EnhancedPayout[]
  ): CampaignOptimization {
    const campaignTracking = tracking.filter(t => t.attribution_details.campaign_id === campaignId);
    const campaignPayouts = payouts.filter(p => p.campaign_id === campaignId);
    const campaignPosts = posts.filter(p => p.campaign_id === campaignId);

    // Current performance
    const current_performance = {
      spend: campaignPayouts.reduce((sum, p) => sum + p.total_payout, 0),
      revenue: campaignTracking.reduce((sum, t) => sum + t.revenue, 0),
      roas: 0,
      orders: campaignTracking.length
    };
    current_performance.roas = current_performance.spend > 0 ? 
      current_performance.revenue / current_performance.spend : 0;

    // Analyze influencer performance within campaign
    const influencerPerformance = influencers.map(influencer => {
      const influencerTracking = campaignTracking.filter(t => 
        t.attribution_details.influencer_id === influencer.influencer_id
      );
      const influencerPayouts = campaignPayouts.filter(p => p.influencer_id === influencer.influencer_id);
      const metrics = calculateIncrementalROAS(influencerTracking, influencerPayouts);
      
      return {
        influencer_id: influencer.influencer_id,
        spend: metrics.total_spend,
        revenue: metrics.total_revenue,
        roas: metrics.roas,
        orders: metrics.orders
      };
    }).filter(perf => perf.spend > 0);

    // Budget reallocation opportunities
    const budget_reallocation = this.identifyBudgetReallocation(influencerPerformance);

    // Content recommendations
    const content_recommendations = this.generateContentRecommendations(campaignPosts, campaignTracking);

    // Audience targeting improvements
    const audience_targeting = this.suggestAudienceTargeting(influencers, campaignTracking);

    // Predicted improvements
    const predicted_improvements = {
      revenue_lift: budget_reallocation.reduce((sum, rec) => sum + rec.expected_lift, 0),
      roas_improvement: 0.3, // 30% improvement estimate
      cost_savings: budget_reallocation.reduce((sum, rec) => sum + (rec.amount * 0.1), 0) // 10% efficiency gain
    };

    return {
      campaign_id: campaignId,
      current_performance,
      optimization_opportunities: {
        budget_reallocation,
        content_recommendations,
        audience_targeting
      },
      predicted_improvements
    };
  }

  /**
   * Detect performance anomalies
   */
  static detectAnomalies(
    influencers: EnhancedInfluencer[],
    posts: EnhancedPost[],
    tracking: EnhancedTrackingData[],
    payouts: EnhancedPayout[]
  ): AnomalyDetection[] {
    const anomalies: AnomalyDetection[] = [];

    // Check each influencer for anomalies
    influencers.forEach(influencer => {
      const influencerPosts = posts.filter(p => p.influencer_id === influencer.influencer_id);
      const influencerTracking = tracking.filter(t => 
        t.attribution_details.influencer_id === influencer.influencer_id
      );
      const influencerPayouts = payouts.filter(p => p.influencer_id === influencer.influencer_id);

      if (influencerPosts.length === 0) return;

      // Calculate recent performance vs historical average
      const recentPosts = influencerPosts.slice(-3); // Last 3 posts
      const historicalPosts = influencerPosts.slice(0, -3);

      if (historicalPosts.length === 0) return;

      const recentEngagement = recentPosts.reduce((sum, p) => 
        sum + (p.likes + p.comments + p.shares) / p.impressions, 0) / recentPosts.length;
      const historicalEngagement = historicalPosts.reduce((sum, p) => 
        sum + (p.likes + p.comments + p.shares) / p.impressions, 0) / historicalPosts.length;

      const engagementChange = ((recentEngagement - historicalEngagement) / historicalEngagement) * 100;

      // Detect significant engagement drops
      if (engagementChange < -25) {
        anomalies.push({
          type: 'engagement_drop',
          severity: engagementChange < -50 ? 'critical' : 'high',
          entity_type: 'influencer',
          entity_id: influencer.influencer_id,
          description: `Engagement rate dropped by ${Math.abs(engagementChange).toFixed(1)}%`,
          current_value: recentEngagement * 100,
          expected_value: historicalEngagement * 100,
          deviation_percentage: Math.abs(engagementChange),
          recommendations: [
            'Review recent content quality and relevance',
            'Analyze audience feedback and comments',
            'Consider content strategy adjustment',
            'Check for algorithm changes on platform'
          ],
          detected_at: new Date().toISOString()
        });
      }

      // Check ROAS performance
      const metrics = calculateIncrementalROAS(influencerTracking, influencerPayouts);
      if (metrics.roas < 1.5 && metrics.total_spend > 10000) { // Low ROAS with significant spend
        anomalies.push({
          type: 'underperformance',
          severity: metrics.roas < 1 ? 'critical' : 'high',
          entity_type: 'influencer',
          entity_id: influencer.influencer_id,
          description: `ROAS of ${metrics.roas.toFixed(2)}x is below target of 2.5x`,
          current_value: metrics.roas,
          expected_value: 2.5,
          deviation_percentage: ((2.5 - metrics.roas) / 2.5) * 100,
          recommendations: [
            'Review audience alignment with brand',
            'Optimize content messaging and CTAs',
            'Consider reducing budget allocation',
            'Implement A/B testing for content formats'
          ],
          detected_at: new Date().toISOString()
        });
      }
    });

    return anomalies.sort((a, b) => {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
  }

  /**
   * Advanced cross-channel anomaly detection
   */
  static detectCrossChannelAnomalies(
    influencers: EnhancedInfluencer[],
    posts: EnhancedPost[],
    tracking: EnhancedTrackingData[],
    payouts: EnhancedPayout[],
    competitorData?: any[]
  ): AnomalyDetection[] {
    const anomalies: AnomalyDetection[] = [];

    // Cross-platform performance correlation analysis
    const platformPerformance = this.analyzePlatformCorrelations(posts, tracking);
    
    // Detect unusual cross-platform patterns
    Object.entries(platformPerformance).forEach(([platform, metrics]: [string, any]) => {
      if (metrics.performance_deviation > 30) {
        anomalies.push({
          type: 'platform_algorithm',
          severity: metrics.performance_deviation > 50 ? 'critical' : 'high',
          entity_type: 'campaign',
          entity_id: platform,
          description: `${platform} showing ${metrics.performance_deviation.toFixed(1)}% performance deviation from expected`,
          current_value: metrics.current_performance,
          expected_value: metrics.expected_performance,
          deviation_percentage: metrics.performance_deviation,
          recommendations: [
            `Review ${platform} algorithm changes and content guidelines`,
            'Analyze top-performing content formats on platform',
            'Adjust content strategy for platform-specific optimization',
            'Consider increasing budget allocation to better-performing platforms'
          ],
          detected_at: new Date().toISOString()
        });
      }
    });

    // Competitive response detection
    if (competitorData && competitorData.length > 0) {
      const competitiveAnomalies = this.detectCompetitiveResponseAnomalies(tracking, competitorData);
      anomalies.push(...competitiveAnomalies);
    }

    // Market shift detection
    const marketShiftAnomalies = this.detectMarketShiftAnomalies(influencers, posts, tracking);
    anomalies.push(...marketShiftAnomalies);

    // External event correlation
    const externalEventAnomalies = this.detectExternalEventCorrelations(tracking);
    anomalies.push(...externalEventAnomalies);

    return anomalies.sort((a, b) => {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
  }

  // Helper methods
  private static calculateGrowthFactor(influencer: EnhancedInfluencer): number {
    // Simulate growth based on follower count and platform
    const baseGrowth = 1.05; // 5% base growth
    const platformBonus = influencer.platform === 'Instagram' ? 0.02 : 
                         influencer.platform === 'YouTube' ? 0.03 : 0.01;
    const categoryBonus = influencer.primary_category === 'Fitness' ? 0.02 : 0.01;
    
    return baseGrowth + platformBonus + categoryBonus;
  }

  private static getPlatformMultiplier(platform: string): number {
    switch (platform) {
      case 'Instagram': return 1.1;
      case 'YouTube': return 1.2;
      case 'Twitter': return 0.9;
      default: return 1.0;
    }
  }

  private static getCategoryMultiplier(category: string): number {
    switch (category) {
      case 'Fitness': return 1.15;
      case 'Nutrition': return 1.1;
      case 'Wellness': return 1.05;
      case 'Bodybuilding': return 1.2;
      default: return 1.0;
    }
  }

  private static getSeasonalityFactor(): number {
    const month = new Date().getMonth();
    // Health/fitness peaks in January (New Year) and summer months
    const seasonalFactors = [1.3, 1.1, 1.0, 1.0, 1.1, 1.2, 1.2, 1.1, 1.0, 1.0, 1.0, 1.1];
    return seasonalFactors[month];
  }

  private static assessRiskFactors(
    influencer: EnhancedInfluencer,
    posts: EnhancedPost[],
    tracking: EnhancedTrackingData[]
  ): string[] {
    const risks: string[] = [];

    if (influencer.avg_engagement_rate < 2) {
      risks.push('Low engagement rate may indicate inactive audience');
    }

    if (posts.length < 3) {
      risks.push('Limited historical data for accurate predictions');
    }

    if (tracking.length === 0) {
      risks.push('No conversion data available');
    }

    const recentPosts = posts.slice(-5);
    const avgReach = recentPosts.reduce((sum, p) => sum + p.reach, 0) / recentPosts.length;
    if (avgReach < influencer.follower_count * 0.1) {
      risks.push('Declining reach may indicate algorithm penalties');
    }

    return risks;
  }

  private static calculateGrowthPotential(influencer: EnhancedInfluencer, posts: EnhancedPost[]): number {
    let score = 50; // Base score

    // Engagement rate factor
    if (influencer.avg_engagement_rate > 5) score += 20;
    else if (influencer.avg_engagement_rate > 3) score += 10;

    // Follower count factor (micro-influencers often have higher growth potential)
    if (influencer.follower_count < 100000) score += 15;
    else if (influencer.follower_count < 500000) score += 10;

    // Platform factor
    if (influencer.platform === 'Instagram' || influencer.platform === 'YouTube') score += 10;

    // Content consistency
    if (posts.length > 10) score += 5;

    return Math.min(score, 100);
  }

  private static getOptimalPostingSchedule(platform: string): string[] {
    switch (platform) {
      case 'Instagram':
        return ['Tuesday 11:00 AM', 'Thursday 2:00 PM', 'Sunday 7:00 PM'];
      case 'YouTube':
        return ['Wednesday 3:00 PM', 'Saturday 10:00 AM', 'Sunday 8:00 PM'];
      case 'Twitter':
        return ['Monday 9:00 AM', 'Wednesday 12:00 PM', 'Friday 5:00 PM'];
      default:
        return ['Tuesday 10:00 AM', 'Thursday 2:00 PM', 'Saturday 6:00 PM'];
    }
  }

  private static calculateBrandAlignment(influencer: EnhancedInfluencer, brand: string): number {
    // Simplified brand alignment scoring
    const categoryAlignment = {
      'MuscleBlaze': { 'Fitness': 20, 'Bodybuilding': 20, 'Nutrition': 15, 'Wellness': 10 },
      'HKVitals': { 'Wellness': 20, 'Nutrition': 20, 'Fitness': 10, 'Bodybuilding': 5 },
      'Gritzo': { 'Nutrition': 20, 'Wellness': 15, 'Fitness': 10, 'Bodybuilding': 5 },
      'HealthKart': { 'Fitness': 15, 'Nutrition': 15, 'Wellness': 15, 'Bodybuilding': 15 }
    };

    return categoryAlignment[brand as keyof typeof categoryAlignment]?.[influencer.primary_category] || 10;
  }

  private static calculateContentConsistency(posts: EnhancedPost[]): number {
    if (posts.length < 3) return 5;

    // Calculate posting frequency consistency
    const dates = posts.map(p => new Date(p.post_date)).sort();
    const intervals = [];
    for (let i = 1; i < dates.length; i++) {
      intervals.push(dates[i].getTime() - dates[i-1].getTime());
    }

    const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
    const variance = intervals.reduce((sum, interval) => sum + Math.pow(interval - avgInterval, 2), 0) / intervals.length;
    const consistency = Math.max(0, 15 - (variance / avgInterval) * 10);

    return Math.min(consistency, 15);
  }

  private static calculateGrowthTrajectory(influencer: EnhancedInfluencer, posts: EnhancedPost[]): number {
    if (posts.length < 5) return 10;

    // Analyze engagement trend over time
    const sortedPosts = posts.sort((a, b) => new Date(a.post_date).getTime() - new Date(b.post_date).getTime());
    const recentPosts = sortedPosts.slice(-3);
    const olderPosts = sortedPosts.slice(0, 3);

    const recentEngagement = recentPosts.reduce((sum, p) => 
      sum + (p.likes + p.comments + p.shares) / p.impressions, 0) / recentPosts.length;
    const olderEngagement = olderPosts.reduce((sum, p) => 
      sum + (p.likes + p.comments + p.shares) / p.impressions, 0) / olderPosts.length;

    const growthRate = ((recentEngagement - olderEngagement) / olderEngagement) * 100;
    
    if (growthRate > 10) return 20;
    if (growthRate > 0) return 15;
    if (growthRate > -10) return 10;
    return 5;
  }

  private static assessInfluencerRisk(
    influencer: EnhancedInfluencer,
    posts: EnhancedPost[],
    metrics: any
  ): 'low' | 'medium' | 'high' {
    let riskScore = 0;

    if (influencer.avg_engagement_rate < 2) riskScore += 2;
    if (posts.length < 5) riskScore += 1;
    if (metrics.roas < 1.5) riskScore += 2;
    if (influencer.follower_count > 1000000) riskScore += 1; // Mega-influencers can be riskier

    if (riskScore >= 4) return 'high';
    if (riskScore >= 2) return 'medium';
    return 'low';
  }

  private static calculateRecommendedBudget(influencer: EnhancedInfluencer, metrics: any): number {
    const baseRate = influencer.follower_count * 0.01; // ₹0.01 per follower base rate
    const engagementMultiplier = Math.max(0.5, influencer.avg_engagement_rate / 4);
    const roasMultiplier = metrics.roas > 0 ? Math.min(2, metrics.roas / 2) : 1;

    return Math.round(baseRate * engagementMultiplier * roasMultiplier);
  }

  private static identifyBudgetReallocation(influencerPerformance: any[]): any[] {
    const sorted = influencerPerformance.sort((a, b) => b.roas - a.roas);
    const topPerformers = sorted.slice(0, Math.ceil(sorted.length / 3));
    const underPerformers = sorted.slice(-Math.ceil(sorted.length / 3));

    const reallocations = [];
    for (let i = 0; i < Math.min(topPerformers.length, underPerformers.length); i++) {
      const reallocationAmount = underPerformers[i].spend * 0.2; // Reallocate 20%
      reallocations.push({
        from_influencer: underPerformers[i].influencer_id,
        to_influencer: topPerformers[i].influencer_id,
        amount: reallocationAmount,
        expected_lift: reallocationAmount * (topPerformers[i].roas - underPerformers[i].roas)
      });
    }

    return reallocations;
  }

  private static generateContentRecommendations(posts: EnhancedPost[], tracking: EnhancedTrackingData[]): any[] {
    const postPerformance = posts.map(post => {
      const postTracking = tracking.filter(t => t.attribution_details.post_id === post.post_id);
      const revenue = postTracking.reduce((sum, t) => sum + t.revenue, 0);
      const engagementRate = (post.likes + post.comments + post.shares) / post.impressions;
      
      return {
        ...post,
        revenue,
        engagementRate,
        performance: revenue + (engagementRate * 1000) // Combined score
      };
    });

    const bestPostTypes = postPerformance.reduce((acc, post) => {
      if (!acc[post.post_type]) acc[post.post_type] = [];
      acc[post.post_type].push(post.performance);
      return acc;
    }, {} as any);

    const avgPerformanceByType = Object.entries(bestPostTypes).map(([type, performances]: [string, any]) => ({
      type,
      avgPerformance: (performances as number[]).reduce((sum, p) => sum + p, 0) / performances.length
    })).sort((a, b) => b.avgPerformance - a.avgPerformance);

    return posts.slice(0, 3).map(post => ({
      influencer_id: post.influencer_id,
      recommended_post_type: avgPerformanceByType[0]?.type || 'Reel',
      optimal_timing: 'Tuesday 2:00 PM', // Simplified
      expected_improvement: 25 // 25% improvement estimate
    }));
  }

  private static suggestAudienceTargeting(influencers: EnhancedInfluencer[], tracking: EnhancedTrackingData[]): any[] {
    return influencers.slice(0, 3).map(influencer => ({
      influencer_id: influencer.influencer_id,
      target_demographics: {
        age_range: '25-34',
        interests: ['fitness', 'health', 'nutrition'],
        locations: ['IN-DL', 'IN-MH', 'IN-KA']
      },
      expected_reach_increase: 15 // 15% increase estimate
    }));
  }

  private static analyzePlatformCorrelations(posts: EnhancedPost[], tracking: EnhancedTrackingData[]): any {
    const platforms = ['Instagram', 'YouTube', 'TikTok'];
    const platformMetrics: any = {};

    platforms.forEach(platform => {
      const platformPosts = posts.filter(p => p.platform_post_id.includes(platform.toLowerCase()));
      const platformTracking = tracking.filter(t => 
        platformPosts.some(p => p.post_id === t.attribution_details.post_id)
      );

      if (platformPosts.length > 0) {
        const avgEngagement = platformPosts.reduce((sum, p) => 
          sum + (p.likes + p.comments + p.shares) / p.impressions, 0) / platformPosts.length;
        const avgRevenue = platformTracking.reduce((sum, t) => sum + t.revenue, 0) / Math.max(platformTracking.length, 1);
        
        // Expected performance based on historical data (simulated)
        const expectedEngagement = platform === 'TikTok' ? 0.08 : platform === 'Instagram' ? 0.05 : 0.04;
        const expectedRevenue = 1500; // Expected average revenue per attributed order
        
        const engagementDeviation = Math.abs((avgEngagement - expectedEngagement) / expectedEngagement) * 100;
        const revenueDeviation = Math.abs((avgRevenue - expectedRevenue) / expectedRevenue) * 100;
        
        platformMetrics[platform] = {
          current_performance: avgEngagement * 100,
          expected_performance: expectedEngagement * 100,
          performance_deviation: Math.max(engagementDeviation, revenueDeviation),
          posts_analyzed: platformPosts.length,
          revenue_performance: avgRevenue
        };
      }
    });

    return platformMetrics;
  }

  private static detectCompetitiveResponseAnomalies(
    tracking: EnhancedTrackingData[],
    competitorData: any[]
  ): AnomalyDetection[] {
    const anomalies: AnomalyDetection[] = [];

    // Simulate competitive response detection
    const recentRevenue = tracking.filter(t => 
      new Date(t.order_date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).reduce((sum, t) => sum + t.revenue, 0);

    const previousWeekRevenue = tracking.filter(t => {
      const orderDate = new Date(t.order_date);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
      return orderDate <= weekAgo && orderDate > twoWeeksAgo;
    }).reduce((sum, t) => sum + t.revenue, 0);

    const revenueChange = previousWeekRevenue > 0 ? 
      ((recentRevenue - previousWeekRevenue) / previousWeekRevenue) * 100 : 0;

    // If significant revenue drop coincides with competitor activity
    if (revenueChange < -20 && competitorData.some((comp: any) => comp.recent_activity_increase)) {
      anomalies.push({
        type: 'competitive_response',
        severity: revenueChange < -40 ? 'critical' : 'high',
        entity_type: 'campaign',
        entity_id: 'overall_performance',
        description: `Revenue dropped ${Math.abs(revenueChange).toFixed(1)}% coinciding with increased competitor activity`,
        current_value: recentRevenue,
        expected_value: previousWeekRevenue,
        deviation_percentage: Math.abs(revenueChange),
        recommendations: [
          'Analyze competitor campaign launches and messaging',
          'Review and adjust pricing strategy',
          'Increase promotional activity to counter competition',
          'Accelerate planned campaign launches'
        ],
        detected_at: new Date().toISOString()
      });
    }

    return anomalies;
  }

  private static detectMarketShiftAnomalies(
    influencers: EnhancedInfluencer[],
    posts: EnhancedPost[],
    tracking: EnhancedTrackingData[]
  ): AnomalyDetection[] {
    const anomalies: AnomalyDetection[] = [];

    // Analyze engagement patterns across all influencers
    const recentPosts = posts.filter(p => 
      new Date(p.post_date) > new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
    );
    
    const olderPosts = posts.filter(p => {
      const postDate = new Date(p.post_date);
      const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      return postDate <= twoWeeksAgo && postDate > monthAgo;
    });

    if (recentPosts.length > 0 && olderPosts.length > 0) {
      const recentEngagement = recentPosts.reduce((sum, p) => 
        sum + (p.likes + p.comments + p.shares) / p.impressions, 0) / recentPosts.length;
      const olderEngagement = olderPosts.reduce((sum, p) => 
        sum + (p.likes + p.comments + p.shares) / p.impressions, 0) / olderPosts.length;
      
      const engagementChange = ((recentEngagement - olderEngagement) / olderEngagement) * 100;
      
      if (Math.abs(engagementChange) > 25) {
        anomalies.push({
          type: 'market_shift',
          severity: Math.abs(engagementChange) > 40 ? 'critical' : 'high',
          entity_type: 'campaign',
          entity_id: 'market_engagement',
          description: `Market-wide engagement ${engagementChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(engagementChange).toFixed(1)}%`,
          current_value: recentEngagement * 100,
          expected_value: olderEngagement * 100,
          deviation_percentage: Math.abs(engagementChange),
          recommendations: [
            'Investigate platform algorithm changes',
            'Analyze market sentiment and external factors',
            'Adjust content strategy to market conditions',
            'Monitor competitor response to market changes'
          ],
          detected_at: new Date().toISOString()
        });
      }
    }

    return anomalies;
  }

  private static detectExternalEventCorrelations(tracking: EnhancedTrackingData[]): AnomalyDetection[] {
    const anomalies: AnomalyDetection[] = [];

    // Simulate external event detection (holidays, economic events, etc.)
    const recentOrders = tracking.filter(t => 
      new Date(t.order_date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );

    // Check for unusual order patterns that might correlate with external events
    const dailyOrders = recentOrders.reduce((acc, order) => {
      const date = order.order_date;
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as { [date: string]: number });

    const orderCounts = Object.values(dailyOrders);
    const avgDailyOrders = orderCounts.reduce((sum, count) => sum + count, 0) / orderCounts.length;
    
    // Check for days with unusual order volumes
    Object.entries(dailyOrders).forEach(([date, count]) => {
      const deviation = Math.abs((count - avgDailyOrders) / avgDailyOrders) * 100;
      
      if (deviation > 50) {
        anomalies.push({
          type: 'external_event',
          severity: deviation > 80 ? 'high' : 'medium',
          entity_type: 'campaign',
          entity_id: `daily_orders_${date}`,
          description: `Unusual order volume on ${date}: ${count} orders vs ${avgDailyOrders.toFixed(0)} average`,
          current_value: count,
          expected_value: avgDailyOrders,
          deviation_percentage: deviation,
          recommendations: [
            'Investigate external events on this date',
            'Check for viral content or media mentions',
            'Analyze traffic sources for unusual patterns',
            'Review inventory levels and fulfillment capacity'
          ],
          detected_at: new Date().toISOString()
        });
      }
    });

    return anomalies;
  }
}