// Enhanced Data Generator for Marketing Analytics Platform
// Generates realistic dummy data for campaigns, influencers, posts, tracking, and payouts

export interface DataGenerationConfig {
  influencerCount: number;
  campaignCount: number;
  postsPerInfluencer: number;
  ordersPerPost: number;
  timeRangeMonths: number;
}

export class MarketingDataGenerator {
  private static brands = ['MuscleBlaze', 'HKVitals', 'Gritzo', 'HealthKart'];
  private static platforms = ['Instagram', 'YouTube', 'Twitter'];
  private static categories = ['Fitness', 'Nutrition', 'Wellness', 'Bodybuilding'];
  private static genders = ['Male', 'Female', 'Other'];
  private static postTypes = ['Reel', 'Static Post', 'Story', 'YouTube Video', 'Tweet'];
  private static payoutBasis = ['fixed_per_post', 'cpo', 'hybrid', 'barter'];
  private static locations = ['IN-DL', 'IN-MH', 'IN-KA', 'IN-TN', 'IN-UP', 'IN-GJ', 'IN-RJ', 'IN-WB'];
  
  private static productFocus = [
    'Whey Protein', 'Mass Gainer', 'Multivitamins', 'Omega-3', 'BCAA', 
    'Pre-workout', 'Creatine', 'Vitamin D', 'Kids Nutrition', 'Collagen'
  ];

  private static influencerNames = [
    'Fitness Guru Raj', 'Health Maven Priya', 'Muscle Builder Mike', 'Wellness Queen Sara',
    'Protein Expert Dev', 'Yoga Instructor Maya', 'Strength Coach Arjun', 'Nutrition Expert Kavya',
    'Bodybuilder Rohit', 'Wellness Coach Anita', 'Fitness Trainer Vikram', 'Health Blogger Sneha',
    'Gym Enthusiast Ravi', 'Nutrition Guru Pooja', 'Fitness Model Karan', 'Health Coach Meera'
  ];

  private static campaignNames = [
    'Summer Shred Challenge', 'Protein Power Launch', 'Winter Wellness Drive', 'New Year Fitness Goals',
    'Immunity Boost Campaign', 'Muscle Building Marathon', 'Weight Loss Warriors', 'Strength & Stamina',
    'Healthy Living Initiative', 'Fitness Revolution', 'Nutrition Education Series', 'Body Transformation',
    'Energy Boost Campaign', 'Wellness Wednesday', 'Fit & Strong Challenge', 'Health First Movement'
  ];

  private static couponCodes = [
    'FIT20', 'HEALTH25', 'MUSCLE30', 'STRONG15', 'POWER10', 'ENERGY35', 'BOOST40', 'VITAL50',
    'GAIN25', 'LEAN20', 'BULK30', 'CUT15', 'MASS40', 'TONE25', 'FLEX20', 'PUMP30'
  ];

  static generateInfluencers(count: number) {
    return Array.from({ length: count }, (_, index) => {
      const platform = this.randomChoice(this.platforms);
      const category = this.randomChoice(this.categories);
      const gender = this.randomChoice(this.genders);
      
      // Follower count varies by platform
      const followerCount = platform === 'YouTube' 
        ? this.randomBetween(20000, 500000)
        : this.randomBetween(50000, 1000000);

      // Engagement rate varies by platform and follower count
      const baseEngagement = platform === 'TikTok' ? 8 : platform === 'Instagram' ? 4 : 3;
      const engagementRate = Math.max(1, baseEngagement - (followerCount / 200000) + this.randomBetween(-1, 2));

      return {
        influencer_id: `inf_${String(index + 1).padStart(3, '0')}`,
        name: this.randomChoice(this.influencerNames) + ` ${index + 1}`,
        handle: `@${this.randomChoice(['fit', 'health', 'strong', 'power', 'muscle'])}${this.randomChoice(['guru', 'expert', 'coach', 'trainer', 'pro'])}${index + 1}`,
        platform,
        primary_category: category,
        follower_count: followerCount,
        gender,
        audience_demographics: {
          age_range: this.randomChoice(['18-24', '25-34', '28-40', '22-35', '30-45']),
          gender_split: {
            male: gender === 'Male' ? this.randomBetween(60, 80) : this.randomBetween(20, 50),
            female: gender === 'Female' ? this.randomBetween(60, 80) : this.randomBetween(20, 50)
          },
          top_locations: this.randomChoices(this.locations, 3)
        },
        avg_engagement_rate: Math.round(engagementRate * 100) / 100,
        created_at: this.randomDateInPast(365),
        updated_at: this.randomDateInPast(30)
      };
    });
  }

  static generateCampaigns(count: number) {
    return Array.from({ length: count }, (_, index) => {
      const startDate = this.randomDateInPast(180);
      const endDate = this.addDays(startDate, this.randomBetween(14, 90));
      const budget = this.randomBetween(50000, 1000000);

      return {
        campaign_id: `camp_${String(index + 1).padStart(3, '0')}`,
        campaign_name: this.randomChoice(this.campaignNames) + ` Q${Math.ceil(Math.random() * 4)}`,
        brand: this.randomChoice(this.brands),
        product_focus: this.randomChoice(this.productFocus),
        start_date: startDate,
        end_date: endDate,
        budget,
        status: this.randomChoice(['active', 'completed', 'paused', 'planned']),
        created_at: this.randomDateInPast(200),
        updated_at: this.randomDateInPast(10)
      };
    });
  }

  static generatePosts(influencers: any[], campaigns: any[], postsPerInfluencer: number) {
    const posts: any[] = [];
    let postCounter = 1;

    influencers.forEach(influencer => {
      const numPosts = this.randomBetween(Math.max(1, postsPerInfluencer - 2), postsPerInfluencer + 3);
      
      for (let i = 0; i < numPosts; i++) {
        const campaign = this.randomChoice(campaigns);
        const postDate = this.randomDateBetween(campaign.start_date, campaign.end_date);
        const postType = this.getPostTypeForPlatform(influencer.platform);
        
        // Engagement varies by platform and influencer quality
        const baseReach = Math.round(influencer.follower_count * this.randomBetween(0.1, 0.3));
        const impressions = Math.round(baseReach * this.randomBetween(1.2, 1.8));
        const engagementRate = influencer.avg_engagement_rate / 100;
        const totalEngagement = Math.round(impressions * engagementRate);
        
        // Distribute engagement across likes, comments, shares
        const likes = Math.round(totalEngagement * this.randomBetween(0.7, 0.85));
        const comments = Math.round(totalEngagement * this.randomBetween(0.1, 0.2));
        const shares = Math.round(totalEngagement * this.randomBetween(0.05, 0.15));
        const saves = postType === 'Reel' || postType === 'Static Post' 
          ? Math.round(totalEngagement * this.randomBetween(0.05, 0.1)) : 0;

        posts.push({
          post_id: `post_${String(postCounter).padStart(3, '0')}`,
          influencer_id: influencer.influencer_id,
          campaign_id: campaign.campaign_id,
          post_url: `https://${influencer.platform.toLowerCase()}.com/p/${this.generateRandomId()}`,
          platform_post_id: this.generateRandomId(),
          post_date: postDate,
          caption_text: this.generateCaption(campaign.brand, campaign.product_focus, influencer.primary_category),
          post_type: postType,
          reach: baseReach,
          impressions,
          likes,
          comments,
          shares,
          saves,
          video_views: postType.includes('Video') || postType === 'Reel' 
            ? Math.round(impressions * this.randomBetween(0.8, 0.95)) : null,
          created_at: postDate,
          updated_at: this.randomDateInPast(5)
        });
        
        postCounter++;
      }
    });

    return posts;
  }

  static generateTrackingData(posts: any[], campaigns: any[], influencers: any[], ordersPerPost: number) {
    const trackingData: any[] = [];
    let eventCounter = 1;

    posts.forEach(post => {
      const campaign = campaigns.find(c => c.campaign_id === post.campaign_id);
      const influencer = influencers.find(i => i.influencer_id === post.influencer_id);
      if (!campaign) return;

      // Not all posts generate orders
      const shouldGenerateOrders = Math.random() > 0.3; // 70% of posts generate orders
      if (!shouldGenerateOrders) return;

      const numOrders = this.randomBetween(0, ordersPerPost * 2);
      
      for (let i = 0; i < numOrders; i++) {
        const orderDate = this.addDays(post.post_date, this.randomBetween(0, 14));
        const isNewCustomer = Math.random() > 0.4; // 60% new customers
        const hasAttribution = Math.random() > 0.2; // 80% have clear attribution
        
        // Revenue varies by product and customer type
        const baseRevenue = this.getBaseRevenueForProduct(campaign.product_focus);
        const revenue = Math.round(baseRevenue * this.randomBetween(0.8, 1.5));
        
        trackingData.push({
          event_id: `evt_${String(eventCounter).padStart(3, '0')}`,
          user_id: `user_${this.randomBetween(10000, 99999)}`,
          order_id: `ord_${this.generateRandomId()}`,
          order_date: orderDate,
          revenue,
          items_in_cart: this.generateCartItems(campaign.product_focus),
          attribution_source: hasAttribution ? 'influencer' : this.randomChoice(['organic', 'paid_search', 'direct']),
          attribution_details: hasAttribution ? {
            influencer_id: post.influencer_id,
            campaign_id: campaign.campaign_id,
            coupon_code: Math.random() > 0.3 ? this.randomChoice(this.couponCodes) : undefined,
            post_id: post.post_id,
            utm_parameters: {
              utm_source: influencer?.platform?.toLowerCase() || 'unknown',
              utm_medium: 'influencer',
              utm_campaign: (campaign.campaign_name?.toLowerCase() ?? '').replace(/\s+/g, '_')
            }
          } : {},
          is_new_customer: isNewCustomer,
          created_at: orderDate,
          updated_at: orderDate
        });
        
        eventCounter++;
      }
    });

    // Add some organic sales for baseline comparison
    const organicSales = Math.round(trackingData.length * 0.4); // 40% organic sales
    for (let i = 0; i < organicSales; i++) {
      trackingData.push({
        event_id: `evt_${String(eventCounter).padStart(3, '0')}`,
        user_id: `user_${this.randomBetween(10000, 99999)}`,
        order_id: `ord_${this.generateRandomId()}`,
        order_date: this.randomDateInPast(90),
        revenue: Math.round(this.randomBetween(500, 2000)),
        items_in_cart: this.generateCartItems(this.randomChoice(this.productFocus)),
        attribution_source: 'organic',
        attribution_details: {},
        is_new_customer: Math.random() > 0.5,
        created_at: this.randomDateInPast(90),
        updated_at: this.randomDateInPast(5)
      });
      eventCounter++;
    }

    return trackingData;
  }

  static generatePayouts(influencers: any[], campaigns: any[], trackingData: any[]) {
    const payouts: any[] = [];
    let payoutCounter = 1;

    influencers.forEach(influencer => {
      // Each influencer might have multiple payouts across different campaigns
      const influencerCampaigns = campaigns.filter(() => Math.random() > 0.4); // 60% chance per campaign
      
      influencerCampaigns.forEach(campaign => {
        const basis = this.randomChoice(this.payoutBasis);
        const influencerOrders = trackingData.filter(t => 
          t.attribution_details.influencer_id === influencer.influencer_id &&
          t.attribution_details.campaign_id === campaign.campaign_id
        );

        if (influencerOrders.length === 0 && basis === 'cpo') return; // Skip if no orders for CPO

        let rate = 0;
        let fixedFee = 0;
        let commissionEarned = 0;

        switch (basis) {
          case 'fixed_per_post':
            fixedFee = this.getFixedFeeForInfluencer(influencer);
            rate = fixedFee;
            break;
          case 'cpo':
            rate = this.randomBetween(200, 800); // Per order
            commissionEarned = influencerOrders.length * rate;
            break;
          case 'hybrid':
            fixedFee = this.getFixedFeeForInfluencer(influencer) * 0.6;
            rate = 0.03; // 3% commission
            commissionEarned = influencerOrders.reduce((sum, order) => sum + (order.revenue * rate), 0);
            break;
          case 'barter':
            fixedFee = 0;
            rate = 0;
            commissionEarned = 0;
            break;
        }

        const totalPayout = fixedFee + commissionEarned;

        payouts.push({
          payout_id: `pay_${String(payoutCounter).padStart(3, '0')}`,
          influencer_id: influencer.influencer_id,
          campaign_id: campaign.campaign_id,
          payout_basis: basis,
          rate,
          fixed_fee: fixedFee,
          commission_earned: Math.round(commissionEarned),
          total_payout: Math.round(totalPayout),
          payout_status: this.randomChoice(['pending', 'approved', 'paid', 'cancelled']),
          created_at: this.addDays(campaign.end_date, this.randomBetween(1, 30)),
          updated_at: this.randomDateInPast(10)
        });

        payoutCounter++;
      });
    });

    return payouts;
  }

  // Helper methods
  private static randomChoice<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private static randomChoices<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  private static randomBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private static randomDateInPast(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * days));
    return date.toISOString().split('T')[0];
  }

  private static randomDateBetween(startDate: string, endDate: string): string {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
    return new Date(randomTime).toISOString().split('T')[0];
  }

  private static addDays(dateString: string, days: number): string {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }

  private static generateRandomId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private static getPostTypeForPlatform(platform: string): string {
    switch (platform) {
      case 'Instagram':
        return this.randomChoice(['Reel', 'Static Post', 'Story']);
      case 'YouTube':
        return 'YouTube Video';
      case 'Twitter':
        return 'Tweet';
      default:
        return 'Static Post';
    }
  }

  private static generateCaption(brand: string, product: string, category: string): string {
    const templates = [
      `Just tried the new ${brand} ${product}! Amazing results! 💪 #${brand} #${category}`,
      `Loving my daily dose of @${brand} ${product} 🔥 Use code SAVE20 for discount! #${category}`,
      `${product} from ${brand} has been a game-changer for my ${category.toLowerCase()} journey! ✨`,
      `Review: ${brand} ${product} - everything you need to know! Link in bio 📖 #${category}`,
      `Fueling my workouts with @${brand} ${product} 💯 Results speak for themselves! #${category}`
    ];
    return this.randomChoice(templates);
  }

  private static getBaseRevenueForProduct(product: string): number {
    const productPrices: { [key: string]: number } = {
      'Whey Protein': 1500,
      'Mass Gainer': 1800,
      'Multivitamins': 600,
      'Omega-3': 800,
      'BCAA': 1200,
      'Pre-workout': 1000,
      'Creatine': 900,
      'Vitamin D': 400,
      'Kids Nutrition': 700,
      'Collagen': 1100
    };
    return productPrices[product] || 1000;
  }

  private static generateCartItems(productFocus: string): string[] {
    const items = [productFocus];
    
    // 30% chance of additional items
    if (Math.random() > 0.7) {
      const additionalItems = this.randomChoices(this.productFocus.filter(p => p !== productFocus), 
        this.randomBetween(1, 2));
      items.push(...additionalItems);
    }
    
    return items;
  }

  private static getFixedFeeForInfluencer(influencer: any): number {
    const baseFee = influencer.follower_count * 0.01; // ₹0.01 per follower
    const platformMultiplier = influencer.platform === 'YouTube' ? 1.5 : 
                              influencer.platform === 'Instagram' ? 1.2 : 1.0;
    const engagementMultiplier = Math.max(0.5, influencer.avg_engagement_rate / 4);
    
    return Math.round(baseFee * platformMultiplier * engagementMultiplier);
  }

  // Main generation function
  static generateCompleteDataset(config: DataGenerationConfig) {
    console.log('Generating enhanced marketing analytics dataset...');
    
    const influencers = this.generateInfluencers(config.influencerCount);
    console.log(`Generated ${influencers.length} influencers`);
    
    const campaigns = this.generateCampaigns(config.campaignCount);
    console.log(`Generated ${campaigns.length} campaigns`);
    
    const posts = this.generatePosts(influencers, campaigns, config.postsPerInfluencer);
    console.log(`Generated ${posts.length} posts`);
    
    const trackingData = this.generateTrackingData(posts, campaigns, influencers, config.ordersPerPost);
    console.log(`Generated ${trackingData.length} tracking events`);
    
    const payouts = this.generatePayouts(influencers, campaigns, trackingData);
    console.log(`Generated ${payouts.length} payouts`);

    return {
      influencers,
      campaigns,
      posts,
      trackingData,
      payouts,
      summary: {
        totalInfluencers: influencers.length,
        totalCampaigns: campaigns.length,
        totalPosts: posts.length,
        totalOrders: trackingData.length,
        totalPayouts: payouts.length,
        totalRevenue: trackingData.reduce((sum, t) => sum + t.revenue, 0),
        totalSpend: payouts.reduce((sum, p) => sum + p.total_payout, 0)
      }
    };
  }
}

// Export default configuration
export const defaultConfig: DataGenerationConfig = {
  influencerCount: 25,
  campaignCount: 15,
  postsPerInfluencer: 8,
  ordersPerPost: 3,
  timeRangeMonths: 6
};