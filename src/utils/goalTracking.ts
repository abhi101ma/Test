// Goal tracking and automated alerts system
import { GoalTracking, AnomalyDetection } from '../types/predictive';
import { EnhancedTrackingData, EnhancedPayout } from '../types/enhanced';
import { calculateIncrementalROAS } from './enhancedCalculations';

export class GoalTracker {
  /**
   * Create and track campaign/influencer goals
   */
  static createGoal(
    goalType: 'revenue' | 'roas' | 'orders' | 'engagement' | 'reach',
    targetValue: number,
    deadline: string,
    campaignId?: string,
    influencerId?: string
  ): GoalTracking {
    return {
      goal_id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      campaign_id: campaignId,
      influencer_id: influencerId,
      goal_type: goalType,
      target_value: targetValue,
      current_value: 0,
      progress_percentage: 0,
      status: 'on_track',
      deadline,
      created_at: new Date().toISOString()
    };
  }

  /**
   * Update goal progress based on current performance
   */
  static updateGoalProgress(
    goal: GoalTracking,
    trackingData: EnhancedTrackingData[],
    payouts: EnhancedPayout[],
    posts?: any[]
  ): GoalTracking {
    let currentValue = 0;

    // Filter data based on goal scope
    let filteredTracking = trackingData;
    let filteredPayouts = payouts;
    let filteredPosts = posts || [];

    if (goal.campaign_id) {
      filteredTracking = trackingData.filter(t => t.attribution_details.campaign_id === goal.campaign_id);
      filteredPayouts = payouts.filter(p => p.campaign_id === goal.campaign_id);
      filteredPosts = posts?.filter(p => p.campaign_id === goal.campaign_id) || [];
    }

    if (goal.influencer_id) {
      filteredTracking = filteredTracking.filter(t => t.attribution_details.influencer_id === goal.influencer_id);
      filteredPayouts = filteredPayouts.filter(p => p.influencer_id === goal.influencer_id);
      filteredPosts = filteredPosts.filter(p => p.influencer_id === goal.influencer_id);
    }

    // Calculate current value based on goal type
    switch (goal.goal_type) {
      case 'revenue':
        currentValue = filteredTracking.reduce((sum, t) => sum + t.revenue, 0);
        break;
      case 'roas':
        const metrics = calculateIncrementalROAS(filteredTracking, filteredPayouts);
        currentValue = metrics.incremental_roas;
        break;
      case 'orders':
        currentValue = filteredTracking.length;
        break;
      case 'engagement':
        currentValue = filteredPosts.reduce((sum, p) => sum + p.likes + p.comments + p.shares, 0);
        break;
      case 'reach':
        currentValue = filteredPosts.reduce((sum, p) => sum + p.reach, 0);
        break;
    }

    const progressPercentage = Math.min((currentValue / goal.target_value) * 100, 100);
    
    // Determine status based on progress and time remaining
    const now = new Date();
    const deadline = new Date(goal.deadline);
    const totalTime = deadline.getTime() - new Date(goal.created_at).getTime();
    const timeElapsed = now.getTime() - new Date(goal.created_at).getTime();
    const timeProgress = (timeElapsed / totalTime) * 100;

    let status: GoalTracking['status'];
    if (progressPercentage >= 100) {
      status = 'exceeded';
    } else if (progressPercentage >= timeProgress * 0.9) {
      status = 'on_track';
    } else if (progressPercentage >= timeProgress * 0.7) {
      status = 'at_risk';
    } else {
      status = 'behind';
    }

    return {
      ...goal,
      current_value: currentValue,
      progress_percentage: progressPercentage,
      status
    };
  }

  /**
   * Generate automated alerts based on goal progress
   */
  static generateGoalAlerts(goals: GoalTracking[]): AnomalyDetection[] {
    const alerts: AnomalyDetection[] = [];

    goals.forEach(goal => {
      const daysToDeadline = Math.ceil(
        (new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );

      // Alert for goals behind schedule
      if (goal.status === 'behind' && daysToDeadline > 0) {
        alerts.push({
          type: 'underperformance',
          severity: daysToDeadline < 7 ? 'critical' : 'high',
          entity_type: goal.campaign_id ? 'campaign' : 'influencer',
          entity_id: goal.campaign_id || goal.influencer_id || 'unknown',
          description: `${goal.goal_type} goal is ${goal.progress_percentage.toFixed(1)}% complete with ${daysToDeadline} days remaining`,
          current_value: goal.current_value,
          expected_value: goal.target_value,
          deviation_percentage: 100 - goal.progress_percentage,
          recommendations: this.getGoalRecommendations(goal),
          detected_at: new Date().toISOString()
        });
      }

      // Alert for goals at risk
      if (goal.status === 'at_risk' && daysToDeadline < 14) {
        alerts.push({
          type: 'budget_alert',
          severity: 'medium',
          entity_type: goal.campaign_id ? 'campaign' : 'influencer',
          entity_id: goal.campaign_id || goal.influencer_id || 'unknown',
          description: `${goal.goal_type} goal may not be achieved - currently ${goal.progress_percentage.toFixed(1)}% complete`,
          current_value: goal.current_value,
          expected_value: goal.target_value,
          deviation_percentage: 100 - goal.progress_percentage,
          recommendations: this.getGoalRecommendations(goal),
          detected_at: new Date().toISOString()
        });
      }

      // Alert for exceeded goals (positive alert)
      if (goal.status === 'exceeded') {
        alerts.push({
          type: 'overperformance',
          severity: 'low',
          entity_type: goal.campaign_id ? 'campaign' : 'influencer',
          entity_id: goal.campaign_id || goal.influencer_id || 'unknown',
          description: `${goal.goal_type} goal exceeded! Achieved ${goal.progress_percentage.toFixed(1)}% of target`,
          current_value: goal.current_value,
          expected_value: goal.target_value,
          deviation_percentage: goal.progress_percentage - 100,
          recommendations: [
            'Consider increasing targets for future campaigns',
            'Analyze success factors for replication',
            'Reallocate budget to capitalize on momentum'
          ],
          detected_at: new Date().toISOString()
        });
      }
    });

    return alerts;
  }

  /**
   * Get recommendations based on goal type and status
   */
  private static getGoalRecommendations(goal: GoalTracking): string[] {
    const baseRecommendations = {
      revenue: [
        'Increase promotional content frequency',
        'Optimize call-to-action messaging',
        'Consider limited-time offers or discounts',
        'Expand to higher-converting content formats'
      ],
      roas: [
        'Review and optimize targeting parameters',
        'Reduce spend on underperforming content',
        'Focus budget on top-performing influencers',
        'Improve conversion funnel optimization'
      ],
      orders: [
        'Strengthen call-to-action in content',
        'Implement urgency-driven messaging',
        'Optimize product positioning and benefits',
        'Consider bundle offers or incentives'
      ],
      engagement: [
        'Post during optimal engagement hours',
        'Increase interactive content (polls, Q&A)',
        'Collaborate with other influencers',
        'Use trending hashtags and topics'
      ],
      reach: [
        'Increase posting frequency',
        'Use platform-specific optimization techniques',
        'Collaborate with micro-influencers for broader reach',
        'Leverage trending content formats'
      ]
    };

    return baseRecommendations[goal.goal_type] || [
      'Review current strategy and tactics',
      'Consider increasing budget allocation',
      'Analyze competitor approaches',
      'Consult with performance marketing experts'
    ];
  }

  /**
   * Calculate goal achievement probability
   */
  static calculateAchievementProbability(goal: GoalTracking): number {
    const now = new Date();
    const deadline = new Date(goal.deadline);
    const created = new Date(goal.created_at);
    
    const totalTime = deadline.getTime() - created.getTime();
    const timeElapsed = now.getTime() - created.getTime();
    const timeRemaining = deadline.getTime() - now.getTime();
    
    if (timeRemaining <= 0) return goal.progress_percentage >= 100 ? 100 : 0;
    
    const timeProgress = (timeElapsed / totalTime) * 100;
    const performanceRatio = goal.progress_percentage / timeProgress;
    
    // Calculate probability based on current trajectory
    let probability = Math.min(performanceRatio * 100, 100);
    
    // Adjust based on goal status
    switch (goal.status) {
      case 'exceeded':
        probability = 100;
        break;
      case 'on_track':
        probability = Math.max(probability, 75);
        break;
      case 'at_risk':
        probability = Math.min(probability, 60);
        break;
      case 'behind':
        probability = Math.min(probability, 30);
        break;
    }
    
    return Math.max(0, Math.min(100, probability));
  }
}