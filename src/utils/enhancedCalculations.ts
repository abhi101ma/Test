import { 
  SettingsState,
  EnhancedTrackingData, 
  EnhancedPayout, 
  IncrementalROASMetrics,
  InfluencerScore 
} from '../types/enhanced';

/**
 * Calculate Incremental ROAS using coupon code attribution and baseline comparison
 */
export const calculateIncrementalROAS = (
  trackingData: EnhancedTrackingData[],
  payouts: EnhancedPayout[],
  influencerId?: string,
  campaignId?: string
): IncrementalROASMetrics => {
  let filteredTracking = trackingData;
  let filteredPayouts = payouts;

  // Apply filters
  if (influencerId) {
    filteredTracking = trackingData.filter(t => 
      t.attribution_details.influencer_id === influencerId
    );
    filteredPayouts = payouts.filter(p => p.influencer_id === influencerId);
  }

  if (campaignId) {
    filteredTracking = filteredTracking.filter(t => 
      t.attribution_details.campaign_id === campaignId
    );
    filteredPayouts = filteredPayouts.filter(p => p.campaign_id === campaignId);
  }

  // Separate influencer-attributed vs organic sales
  const influencerSales = filteredTracking.filter(t => 
    t.attribution_source === 'influencer' && t.attribution_details.coupon_code
  );
  
  const organicSales = trackingData.filter(t => 
    t.attribution_source === 'organic'
  );

  // Calculate metrics
  const total_revenue = influencerSales.reduce((sum, sale) => sum + sale.revenue, 0);
  const total_orders = influencerSales.length;
  const new_customers = influencerSales.filter(sale => sale.is_new_customer).length;
  
  // Baseline calculation: Use organic sales as baseline
  const organic_revenue = organicSales.reduce((sum, sale) => sum + sale.revenue, 0);
  const organic_orders = organicSales.length;
  const organic_avg_order_value = organic_orders > 0 ? organic_revenue / organic_orders : 0;
  
  // Estimate baseline revenue for the same period/volume
  const baseline_revenue = total_orders * organic_avg_order_value * 0.7; // 70% of organic AOV
  const incremental_revenue = Math.max(0, total_revenue - baseline_revenue);
  const incremental_orders = Math.max(0, total_orders - (total_orders * 0.3)); // 30% would be organic

  const total_spend = filteredPayouts.reduce((sum, payout) => sum + payout.total_payout, 0);
  
  const roas = total_spend > 0 ? total_revenue / total_spend : 0;
  const incremental_roas = total_spend > 0 ? incremental_revenue / total_spend : 0;
  const cost_per_order = total_orders > 0 ? total_spend / total_orders : 0;
  
  // Attribution confidence based on coupon usage
  const coupon_attributed = influencerSales.filter(sale => 
    sale.attribution_details.coupon_code
  ).length;
  const attribution_confidence = total_orders > 0 ? (coupon_attributed / total_orders) * 100 : 0;
  
  // Estimate conversion rate (simplified)
  const estimated_reach = influencerSales.length * 50000; // Rough estimate
  const conversion_rate = estimated_reach > 0 ? (total_orders / estimated_reach) * 100 : 0;

  return {
    total_revenue,
    incremental_revenue,
    total_spend,
    baseline_revenue,
    roas,
    incremental_roas,
    orders: total_orders,
    incremental_orders,
    cost_per_order,
    conversion_rate,
    attribution_confidence
  };
};

/**
 * Calculate comprehensive influencer score
 */
export const calculateInfluencerScore = (
  influencerId: string,
  trackingData: EnhancedTrackingData[],
  payouts: EnhancedPayout[],
  influencerData: any
): InfluencerScore => {
  const metrics = calculateIncrementalROAS(trackingData, payouts, influencerId);
  
  // ROAS Score (0-30 points) - Target: 3x ROAS
  const roas_score = Math.min((metrics.incremental_roas / 3) * 30, 30);
  
  // Engagement Score (0-25 points) - Target: 6% engagement
  const engagement_score = Math.min((influencerData.avg_engagement_rate / 6) * 25, 25);
  
  // Audience Fit Score (0-20 points) - Based on demographics alignment
  const audience_fit_score = calculateAudienceFitScore(influencerData.audience_demographics);
  
  // Content Quality Score (0-15 points) - Based on engagement vs reach ratio
  const influencer_posts = trackingData.filter(t => 
    t.attribution_details.influencer_id === influencerId
  );
  const avg_engagement_ratio = influencer_posts.length > 0 ? 
    influencer_posts.reduce((sum, post) => sum + (post.revenue / 1000), 0) / influencer_posts.length : 0;
  const content_quality_score = Math.min(avg_engagement_ratio * 15, 15);
  
  // Consistency Score (0-10 points) - Based on regular posting
  const consistency_score = influencer_posts.length >= 3 ? 10 : (influencer_posts.length / 3) * 10;
  
  const overall_score = Math.round(
    roas_score + engagement_score + audience_fit_score + content_quality_score + consistency_score
  );

  return {
    influencer_id: influencerId,
    overall_score,
    roas_score: Math.round(roas_score),
    engagement_score: Math.round(engagement_score),
    audience_fit_score: Math.round(audience_fit_score),
    content_quality_score: Math.round(content_quality_score),
    consistency_score: Math.round(consistency_score)
  };
};

/**
 * Calculate audience fit score based on demographics
 */
const calculateAudienceFitScore = (demographics: any): number => {
  // Simplified scoring based on target demographics for health/fitness brands
  let score = 0;
  
  // Age range scoring
  if (demographics.age_range === '25-34' || demographics.age_range === '28-40') {
    score += 8; // Prime target age
  } else if (demographics.age_range === '22-35' || demographics.age_range === '20-30') {
    score += 6;
  } else {
    score += 4;
  }
  
  // Gender balance scoring (balanced is better for most health products)
  const gender_balance = Math.abs(demographics.gender_split.male - demographics.gender_split.female);
  if (gender_balance <= 20) {
    score += 6; // Well balanced
  } else if (gender_balance <= 40) {
    score += 4;
  } else {
    score += 2;
  }
  
  // Location scoring (tier 1 cities are premium)
  const tier1_cities = ['IN-DL', 'IN-MH', 'IN-KA'];
  const tier1_presence = demographics.top_locations.filter(loc => 
    tier1_cities.includes(loc)
  ).length;
  score += tier1_presence * 2;
  
  return Math.min(score, 20);
};

/**
 * Format currency based on global settings
 */
export const formatCurrency = (amount: number, currencyCode: SettingsState['defaultCurrency'] = 'INR'): string => {
  let locale = 'en-IN';
  let currencySymbol = 'INR';

  if (currencyCode === 'USD') {
    locale = 'en-US';
    currencySymbol = 'USD';
  } else if (currencyCode === 'EUR') {
    locale = 'en-EU';
    currencySymbol = 'EUR';
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencySymbol,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Format large numbers with K/M suffixes
 */
export const formatLargeNumber = (num: number): string => {
  if (num >= 10000000) {
    return (num / 10000000).toFixed(1) + 'Cr';
  }
  if (num >= 100000) {
    return (num / 100000).toFixed(1) + 'L';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

/**
 * Format date and time based on global settings
 */
export const formatDateTime = (dateString: string | Date, timeZone: SettingsState['timeZone'] = 'Asia/Kolkata'): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    timeZone: timeZone,
  });
};

/**
 * Calculate post-level performance metrics
 */
export const calculatePostPerformance = (
  postData: any,
  trackingData: EnhancedTrackingData[]
): any => {
  const postTracking = trackingData.filter(t => 
    t.attribution_details.post_id === postData.post_id
  );
  
  const total_revenue = postTracking.reduce((sum, t) => sum + t.revenue, 0);
  const total_orders = postTracking.length;
  
  const engagement_rate = postData.impressions > 0 ? 
    ((postData.likes + postData.comments + postData.shares) / postData.impressions) * 100 : 0;
  
  const conversion_rate = postData.reach > 0 ? (total_orders / postData.reach) * 100 : 0;
  const revenue_per_impression = postData.impressions > 0 ? total_revenue / postData.impressions : 0;
  
  return {
    post_id: postData.post_id,
    engagement_rate,
    conversion_rate,
    revenue_per_impression,
    total_revenue,
    total_orders
  };
};