// NLP Analysis utilities for sentiment and keyword extraction
import { SentimentAnalysis, ContentInsights } from '../types/analytics';

// Simple sentiment analysis using keyword-based approach
// In production, this would connect to a Python backend with proper NLP libraries
export class NLPAnalyzer {
  private static positiveWords = [
    'amazing', 'awesome', 'excellent', 'fantastic', 'great', 'love', 'perfect',
    'incredible', 'outstanding', 'wonderful', 'best', 'brilliant', 'superb',
    'effective', 'results', 'recommend', 'quality', 'satisfied', 'happy',
    'energy', 'strength', 'gains', 'transformation', 'healthy', 'fit'
  ];

  private static negativeWords = [
    'bad', 'terrible', 'awful', 'horrible', 'hate', 'worst', 'disappointing',
    'useless', 'waste', 'poor', 'failed', 'problem', 'issue', 'difficult',
    'expensive', 'overpriced', 'fake', 'scam', 'side effects', 'allergic'
  ];

  private static healthKeywords = [
    'protein', 'fitness', 'workout', 'gym', 'muscle', 'strength', 'energy',
    'nutrition', 'vitamins', 'supplements', 'health', 'wellness', 'diet',
    'weight', 'gain', 'loss', 'transformation', 'recovery', 'performance'
  ];

  static analyzeSentiment(text: string): SentimentAnalysis {
    const words = text.toLowerCase().split(/\s+/);
    let positiveCount = 0;
    let negativeCount = 0;
    let healthKeywordCount = 0;

    const foundKeywords: string[] = [];

    words.forEach(word => {
      const cleanWord = word.replace(/[^\w]/g, '');
      
      if (this.positiveWords.includes(cleanWord)) {
        positiveCount++;
      }
      if (this.negativeWords.includes(cleanWord)) {
        negativeCount++;
      }
      if (this.healthKeywords.includes(cleanWord)) {
        healthKeywordCount++;
        if (!foundKeywords.includes(cleanWord)) {
          foundKeywords.push(cleanWord);
        }
      }
    });

    // Calculate sentiment score (-1 to 1)
    const totalSentimentWords = positiveCount + negativeCount;
    let sentimentScore = 0;
    
    if (totalSentimentWords > 0) {
      sentimentScore = (positiveCount - negativeCount) / totalSentimentWords;
    }

    // Adjust for health keywords (health content tends to be more positive)
    if (healthKeywordCount > 0) {
      sentimentScore += 0.1 * Math.min(healthKeywordCount / words.length, 0.3);
    }

    // Determine sentiment label
    let sentimentLabel: 'positive' | 'neutral' | 'negative';
    if (sentimentScore > 0.1) {
      sentimentLabel = 'positive';
    } else if (sentimentScore < -0.1) {
      sentimentLabel = 'negative';
    } else {
      sentimentLabel = 'neutral';
    }

    // Calculate confidence based on number of sentiment words found
    const confidence = Math.min(totalSentimentWords / 10, 1);

    return {
      post_id: '', // Will be set by caller
      sentiment_score: Math.max(-1, Math.min(1, sentimentScore)),
      sentiment_label: sentimentLabel,
      confidence,
      keywords: foundKeywords,
      emotion_scores: {
        joy: sentimentScore > 0 ? sentimentScore * 0.8 : 0,
        trust: healthKeywordCount > 0 ? 0.6 : 0.3,
        fear: sentimentScore < 0 ? Math.abs(sentimentScore) * 0.5 : 0,
        surprise: 0.2,
        sadness: sentimentScore < -0.5 ? 0.4 : 0,
        disgust: sentimentScore < -0.3 ? 0.3 : 0,
        anger: sentimentScore < -0.7 ? 0.6 : 0,
        anticipation: foundKeywords.includes('new') || foundKeywords.includes('launch') ? 0.7 : 0.3
      }
    };
  }

  static extractKeywords(text: string): string[] {
    const words = text.toLowerCase().split(/\s+/);
    const keywords: string[] = [];

    words.forEach(word => {
      const cleanWord = word.replace(/[^\w]/g, '');
      if (this.healthKeywords.includes(cleanWord) && !keywords.includes(cleanWord)) {
        keywords.push(cleanWord);
      }
    });

    return keywords;
  }

  static analyzeContentInsights(posts: any[], trackingData: any[]): ContentInsights {
    const keywordFrequency: { [key: string]: { count: number; engagement: number; revenue: number } } = {};
    let totalPositiveROAS = 0;
    let totalNeutralROAS = 0;
    let totalNegativeROAS = 0;
    let positiveCount = 0;
    let neutralCount = 0;
    let negativeCount = 0;

    const postTypePerformance: { [key: string]: { count: number; engagement: number; revenue: number } } = {};

    posts.forEach(post => {
      const sentiment = this.analyzeSentiment(post.caption_text);
      const postTracking = trackingData.filter(t => t.attribution_details?.post_id === post.post_id);
      const postRevenue = postTracking.reduce((sum, t) => sum + t.revenue, 0);
      const engagementRate = post.impressions > 0 ? 
        ((post.likes + post.comments + post.shares) / post.impressions) * 100 : 0;

      // Analyze keywords
      sentiment.keywords.forEach(keyword => {
        if (!keywordFrequency[keyword]) {
          keywordFrequency[keyword] = { count: 0, engagement: 0, revenue: 0 };
        }
        keywordFrequency[keyword].count++;
        keywordFrequency[keyword].engagement += engagementRate;
        keywordFrequency[keyword].revenue += postRevenue;
      });

      // Analyze sentiment performance
      if (sentiment.sentiment_label === 'positive') {
        totalPositiveROAS += postRevenue;
        positiveCount++;
      } else if (sentiment.sentiment_label === 'neutral') {
        totalNeutralROAS += postRevenue;
        neutralCount++;
      } else {
        totalNegativeROAS += postRevenue;
        negativeCount++;
      }

      // Analyze post type performance
      if (!postTypePerformance[post.post_type]) {
        postTypePerformance[post.post_type] = { count: 0, engagement: 0, revenue: 0 };
      }
      postTypePerformance[post.post_type].count++;
      postTypePerformance[post.post_type].engagement += engagementRate;
      postTypePerformance[post.post_type].revenue += postRevenue;
    });

    // Calculate top performing keywords
    const topKeywords = Object.entries(keywordFrequency)
      .map(([keyword, data]) => ({
        keyword,
        frequency: data.count,
        avg_engagement: data.engagement / data.count,
        revenue_correlation: data.revenue / data.count
      }))
      .sort((a, b) => b.revenue_correlation - a.revenue_correlation)
      .slice(0, 10);

    // Calculate optimal content mix
    const totalPosts = posts.length;
    const optimalContentMix = Object.entries(postTypePerformance)
      .map(([postType, data]) => ({
        post_type: postType,
        recommended_percentage: (data.count / totalPosts) * 100,
        avg_performance: data.revenue / data.count
      }))
      .sort((a, b) => b.avg_performance - a.avg_performance);

    return {
      top_performing_keywords: topKeywords,
      sentiment_performance: {
        positive_posts_roas: positiveCount > 0 ? totalPositiveROAS / positiveCount : 0,
        neutral_posts_roas: neutralCount > 0 ? totalNeutralROAS / neutralCount : 0,
        negative_posts_roas: negativeCount > 0 ? totalNegativeROAS / negativeCount : 0
      },
      optimal_content_mix: optimalContentMix,
      engagement_patterns: {
        best_posting_times: ['10:00 AM', '2:00 PM', '7:00 PM'], // Simulated
        optimal_caption_length: 150, // Simulated based on analysis
        hashtag_effectiveness: 0.75 // Simulated
      }
    };
  }

  /**
   * Analyze competitor content strategies (Simulated)
   */
  static analyzeCompetitorContent(competitorPosts: any[]): {
    dominant_themes: string[];
    successful_keywords: string[];
    content_gaps: string[];
    sentiment_strategy: string;
    engagement_patterns: any;
  } {
    // Simulate competitor content analysis
    return {
      dominant_themes: [
        'Product demonstrations',
        'Transformation stories',
        'Workout motivation',
        'Nutrition education',
        'Athlete partnerships'
      ],
      successful_keywords: [
        'transformation', 'results', 'science', 'proven', 'quality',
        'performance', 'strength', 'energy', 'recovery', 'goals'
      ],
      content_gaps: [
        'Plant-based nutrition education',
        'Women-specific fitness content',
        'Sustainability messaging',
        'Mental wellness integration',
        'Personalized nutrition guidance'
      ],
      sentiment_strategy: 'Predominantly positive with motivational tone, limited educational depth',
      engagement_patterns: {
        peak_engagement_content: 'Before/after transformations',
        optimal_post_length: '150-200 characters',
        hashtag_strategy: '8-12 hashtags with mix of branded and trending',
        call_to_action_frequency: '60% of posts include direct CTA'
      }
    };
  }

  /**
   * Generate content strategy recommendations based on competitive analysis
   */
  static generateCompetitiveContentStrategy(
    ourContent: any[],
    competitorAnalysis: any
  ): {
    content_opportunities: string[];
    messaging_improvements: string[];
    format_recommendations: string[];
    timing_optimizations: string[];
  } {
    return {
      content_opportunities: [
        'Create comprehensive plant-based nutrition series',
        'Develop women-centric fitness content',
        'Launch sustainability-focused campaigns',
        'Integrate mental wellness messaging',
        'Produce micro-workout content'
      ],
      messaging_improvements: [
        'Increase educational content depth',
        'Add more scientific backing to claims',
        'Incorporate sustainability messaging',
        'Emphasize local market understanding',
        'Strengthen community-building language'
      ],
      format_recommendations: [
        'Increase Reels production for higher engagement',
        'Create educational carousel posts',
        'Develop interactive story content',
        'Launch YouTube educational series',
        'Experiment with live workout sessions'
      ],
      timing_optimizations: [
        'Post educational content during weekday mornings',
        'Share motivation content on Monday mornings',
        'Release product content on Tuesday-Thursday',
        'Schedule transformation stories on weekends',
        'Time seasonal content 2-3 weeks before peak'
      ]
    };
  }
}