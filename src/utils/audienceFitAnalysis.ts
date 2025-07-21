// Audience fit analysis utilities
import { AudienceFitScore } from '../types/analytics';
import { EnhancedInfluencer } from '../types/enhanced';

export class AudienceFitAnalyzer {
  // Define target customer profiles for each brand
  private static brandProfiles = {
    'MuscleBlaze': {
      target_age_range: '22-35',
      target_gender_split: { male: 70, female: 30 },
      target_locations: ['IN-DL', 'IN-MH', 'IN-KA', 'IN-UP', 'IN-PB'],
      target_interests: ['fitness', 'bodybuilding', 'protein', 'muscle', 'gym'],
      brand_values: ['performance', 'strength', 'results', 'quality']
    },
    'HKVitals': {
      target_age_range: '25-45',
      target_gender_split: { male: 40, female: 60 },
      target_locations: ['IN-MH', 'IN-DL', 'IN-KA', 'IN-TN', 'IN-GJ'],
      target_interests: ['health', 'wellness', 'vitamins', 'immunity', 'nutrition'],
      brand_values: ['health', 'family', 'trust', 'science']
    },
    'Gritzo': {
      target_age_range: '28-40',
      target_gender_split: { male: 30, female: 70 },
      target_locations: ['IN-MH', 'IN-DL', 'IN-KA', 'IN-TN'],
      target_interests: ['kids', 'nutrition', 'growth', 'health', 'family'],
      brand_values: ['care', 'growth', 'natural', 'safe']
    },
    'HealthKart': {
      target_age_range: '20-50',
      target_gender_split: { male: 50, female: 50 },
      target_locations: ['IN-DL', 'IN-MH', 'IN-KA', 'IN-UP', 'IN-TN'],
      target_interests: ['health', 'fitness', 'wellness', 'supplements', 'nutrition'],
      brand_values: ['variety', 'convenience', 'trust', 'value']
    }
  };

  static calculateAudienceFit(
    influencer: EnhancedInfluencer, 
    brand: keyof typeof AudienceFitAnalyzer.brandProfiles
  ): AudienceFitScore {
    const brandProfile = this.brandProfiles[brand];
    const audienceDemographics = influencer.audience_demographics;

    // Calculate demographic fit (0-30 points)
    const demographicFit = this.calculateDemographicFit(audienceDemographics, brandProfile);

    // Calculate geographic fit (0-25 points)
    const geographicFit = this.calculateGeographicFit(audienceDemographics, brandProfile);

    // Calculate interest alignment (0-25 points)
    const interestAlignment = this.calculateInterestAlignment(influencer, brandProfile);

    // Calculate engagement quality (0-15 points)
    const engagementQuality = this.calculateEngagementQuality(influencer);

    // Calculate brand safety score (0-5 points)
    const brandSafetyScore = this.calculateBrandSafetyScore(influencer);

    const overallFitScore = demographicFit + geographicFit + interestAlignment + 
                           engagementQuality + brandSafetyScore;

    const recommendations = this.generateRecommendations(
      overallFitScore, demographicFit, geographicFit, interestAlignment, 
      engagementQuality, brandSafetyScore, brand
    );

    return {
      influencer_id: influencer.influencer_id,
      brand,
      overall_fit_score: Math.round(overallFitScore),
      demographic_fit: Math.round(demographicFit),
      geographic_fit: Math.round(geographicFit),
      interest_alignment: Math.round(interestAlignment),
      engagement_quality: Math.round(engagementQuality),
      brand_safety_score: Math.round(brandSafetyScore),
      recommendations
    };
  }

  private static calculateDemographicFit(audienceDemographics: any, brandProfile: any): number {
    let score = 0;

    // Age range alignment (0-15 points)
    if (audienceDemographics.age_range === brandProfile.target_age_range) {
      score += 15;
    } else {
      // Partial credit for overlapping ranges
      score += 8;
    }

    // Gender split alignment (0-15 points)
    const genderDiff = Math.abs(
      audienceDemographics.gender_split.male - brandProfile.target_gender_split.male
    );
    
    if (genderDiff <= 10) {
      score += 15;
    } else if (genderDiff <= 20) {
      score += 10;
    } else if (genderDiff <= 30) {
      score += 5;
    }

    return score;
  }

  private static calculateGeographicFit(audienceDemographics: any, brandProfile: any): number {
    const influencerLocations = audienceDemographics.top_locations || [];
    const targetLocations = brandProfile.target_locations;

    const overlap = influencerLocations.filter(loc => targetLocations.includes(loc)).length;
    const maxPossibleOverlap = Math.min(influencerLocations.length, targetLocations.length);

    if (maxPossibleOverlap === 0) return 10; // Default score if no location data

    return (overlap / maxPossibleOverlap) * 25;
  }

  private static calculateInterestAlignment(influencer: EnhancedInfluencer, brandProfile: any): number {
    let score = 0;

    // Category alignment (0-15 points)
    const categoryMap: { [key: string]: string[] } = {
      'Fitness': ['fitness', 'gym', 'workout', 'muscle'],
      'Nutrition': ['nutrition', 'vitamins', 'health', 'supplements'],
      'Wellness': ['wellness', 'health', 'immunity', 'lifestyle'],
      'Bodybuilding': ['bodybuilding', 'muscle', 'protein', 'strength']
    };

    const influencerInterests = categoryMap[influencer.primary_category] || [];
    const targetInterests = brandProfile.target_interests;

    const interestOverlap = influencerInterests.filter(interest => 
      targetInterests.includes(interest)
    ).length;

    score += (interestOverlap / targetInterests.length) * 15;

    // Platform suitability (0-10 points)
    if (influencer.platform === 'Instagram' || influencer.platform === 'YouTube') {
      score += 10; // These platforms are ideal for health/fitness content
    } else {
      score += 5;
    }

    return score;
  }

  private static calculateEngagementQuality(influencer: EnhancedInfluencer): number {
    const engagementRate = influencer.avg_engagement_rate;
    
    // Engagement rate scoring (0-15 points)
    if (engagementRate >= 6) {
      return 15; // Excellent engagement
    } else if (engagementRate >= 4) {
      return 12; // Good engagement
    } else if (engagementRate >= 2) {
      return 8; // Average engagement
    } else {
      return 4; // Below average engagement
    }
  }

  private static calculateBrandSafetyScore(influencer: EnhancedInfluencer): number {
    // Simplified brand safety scoring
    // In production, this would analyze content history, controversies, etc.
    
    let score = 5; // Default safe score

    // Platform-based adjustments
    if (influencer.platform === 'YouTube') {
      score -= 1; // Slightly higher risk due to longer content
    }

    // Category-based adjustments
    if (influencer.primary_category === 'Wellness' || influencer.primary_category === 'Nutrition') {
      score += 0; // Health content is generally brand-safe
    }

    return Math.max(0, score);
  }

  private static generateRecommendations(
    overallScore: number,
    demographicFit: number,
    geographicFit: number,
    interestAlignment: number,
    engagementQuality: number,
    brandSafetyScore: number,
    brand: string
  ): string[] {
    const recommendations: string[] = [];

    if (overallScore >= 80) {
      recommendations.push(`Excellent fit for ${brand} - prioritize for major campaigns`);
    } else if (overallScore >= 60) {
      recommendations.push(`Good fit for ${brand} - suitable for regular campaigns`);
    } else {
      recommendations.push(`Limited fit for ${brand} - consider for niche campaigns only`);
    }

    if (demographicFit < 20) {
      recommendations.push('Audience demographics don\'t align well with target customers');
    }

    if (geographicFit < 15) {
      recommendations.push('Consider geo-targeted campaigns to improve location alignment');
    }

    if (interestAlignment < 15) {
      recommendations.push('Content themes should focus more on brand-relevant topics');
    }

    if (engagementQuality < 10) {
      recommendations.push('Monitor engagement rates - may need content strategy improvement');
    }

    if (brandSafetyScore < 4) {
      recommendations.push('Conduct additional brand safety review before partnership');
    }

    return recommendations;
  }

  static getBrandFitRankings(
    influencers: EnhancedInfluencer[], 
    brand: keyof typeof AudienceFitAnalyzer.brandProfiles
  ): AudienceFitScore[] {
    return influencers
      .map(influencer => this.calculateAudienceFit(influencer, brand))
      .sort((a, b) => b.overall_fit_score - a.overall_fit_score);
  }

  static getOptimalInfluencerMix(
    influencers: EnhancedInfluencer[],
    brand: keyof typeof AudienceFitAnalyzer.brandProfiles,
    budget: number
  ): {
    recommended_influencers: AudienceFitScore[];
    total_reach: number;
    estimated_cost: number;
    risk_assessment: string;
  } {
    const fitScores = this.getBrandFitRankings(influencers, brand);
    const topInfluencers = fitScores.filter(score => score.overall_fit_score >= 60);

    // Simple budget allocation (in production, this would be more sophisticated)
    const avgCostPerInfluencer = budget / Math.min(topInfluencers.length, 5);
    const selectedInfluencers = topInfluencers.slice(0, Math.floor(budget / avgCostPerInfluencer));

    const totalReach = selectedInfluencers.reduce((sum, score) => {
      const influencer = influencers.find(inf => inf.influencer_id === score.influencer_id);
      return sum + (influencer?.follower_count || 0);
    }, 0);

    const estimatedCost = selectedInfluencers.length * avgCostPerInfluencer;
    
    const avgFitScore = selectedInfluencers.reduce((sum, score) => 
      sum + score.overall_fit_score, 0) / selectedInfluencers.length;

    let riskAssessment = 'Low Risk';
    if (avgFitScore < 70) {
      riskAssessment = 'Medium Risk';
    }
    if (avgFitScore < 50) {
      riskAssessment = 'High Risk';
    }

    return {
      recommended_influencers: selectedInfluencers,
      total_reach: totalReach,
      estimated_cost: estimatedCost,
      risk_assessment: riskAssessment
    };
  }
}