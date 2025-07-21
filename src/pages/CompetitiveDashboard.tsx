import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  TrendingUp, 
  Users, 
  Target, 
  AlertTriangle, 
  Eye,
  Zap,
  Brain,
  Search,
  BarChart3,
  Globe,
  Lightbulb,
  DollarSign
} from 'lucide-react';
import EnhancedMetricCard from '../components/EnhancedMetricCard';
import { CompetitiveIntelligenceAPI } from '../lib/competitiveApi';
import { MarketTrendAnalyzer } from '../utils/marketTrendAnalyzer';
import { NLPAnalyzer } from '../utils/nlpAnalysis';
import { 
  CompetitorProfile, 
  CompetitorCampaign, 
  CompetitorPerformance,
  MarketTrend,
  CompetitiveGap,
  ContentStrategyRecommendation
} from '../types/competitive';
import { formatCurrency } from '../utils/enhancedCalculations';
import { useSettings } from '../contexts/SettingsContext';

const CompetitiveDashboard: React.FC = () => {
  const [competitors, setCompetitors] = useState<CompetitorProfile[]>([]);
  const [competitorCampaigns, setCompetitorCampaigns] = useState<CompetitorCampaign[]>([]);
  const [competitorPerformance, setCompetitorPerformance] = useState<CompetitorPerformance[]>([]);
  const [marketTrends, setMarketTrends] = useState<MarketTrend[]>([]);
  const [competitiveGaps, setCompetitiveGaps] = useState<CompetitiveGap[]>([]);
  const [contentRecommendations, setContentRecommendations] = useState<ContentStrategyRecommendation[]>([]);
  const [landscapeAnalysis, setLandscapeAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCompetitor, setSelectedCompetitor] = useState<string | null>(null);
  const { settings } = useSettings();
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'gaps' | 'content'>('overview');

  useEffect(() => {
    const loadCompetitiveData = async () => {
      setIsLoading(true);
      
      try {
        // Load all competitive intelligence data
        const [
          competitorProfiles,
          campaigns,
          performance,
          trends,
          gaps,
          landscape
        ] = await Promise.all([
          CompetitiveIntelligenceAPI.fetchCompetitorProfiles(),
          CompetitiveIntelligenceAPI.fetchCompetitorCampaigns(),
          CompetitiveIntelligenceAPI.fetchCompetitorPerformance(),
          MarketTrendAnalyzer.identifyEmergingTrends(),
          MarketTrendAnalyzer.identifyCompetitiveGaps(),
          CompetitiveIntelligenceAPI.analyzeCompetitiveLandscape()
        ]);

        // Generate AI-powered content strategy recommendations
        const aiContentRecommendations = generateContentStrategyRecommendations(
          competitorProfiles,
          campaigns,
          trends
        );

        setCompetitors(competitorProfiles);
        setCompetitorCampaigns(campaigns);
        setCompetitorPerformance(performance);
        setMarketTrends(trends);
        setCompetitiveGaps(gaps);
        setContentRecommendations(aiContentRecommendations);
        setLandscapeAnalysis(landscape);
      } catch (error) {
        console.error('Error loading competitive data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCompetitiveData();
  }, []);

  const generateContentStrategyRecommendations = (
    competitors: CompetitorProfile[],
    campaigns: CompetitorCampaign[],
    trends: MarketTrend[]
  ): ContentStrategyRecommendation[] => {
    // Simulate AI-powered content strategy analysis
    return [
      {
        recommendation_id: 'rec_plant_protein_content',
        recommendation_type: 'content_format',
        title: 'Plant-Based Protein Educational Series',
        description: 'Create comprehensive educational content about plant-based proteins to capitalize on emerging trend',
        rationale: 'Competitors are not adequately addressing the growing plant-based nutrition market',
        competitive_insight: 'Optimum Nutrition and Dymatize focus primarily on whey proteins, leaving plant-based segment underserved',
        expected_impact: {
          engagement_lift: 35,
          reach_increase: 28,
          conversion_improvement: 22
        },
        implementation_difficulty: 'medium',
        resource_requirements: ['Nutrition expert partnerships', 'Educational content creation', 'Plant-based product development'],
        success_metrics: ['Plant-based content engagement', 'Vegan audience growth', 'Plant protein product sales'],
        timeline: '3-4 months',
        priority_score: 88
      },
      {
        recommendation_id: 'rec_micro_workout_integration',
        recommendation_type: 'messaging',
        title: 'Quick Energy for Micro-Workouts',
        description: 'Position products as perfect fuel for the growing micro-workout trend',
        rationale: 'Rising trend of 5-15 minute high-intensity workouts needs targeted nutrition messaging',
        competitive_insight: 'Myprotein focuses on longer workout sessions, missing the quick-fitness opportunity',
        expected_impact: {
          engagement_lift: 42,
          reach_increase: 38,
          conversion_improvement: 31
        },
        implementation_difficulty: 'easy',
        resource_requirements: ['Content creation', 'Micro-workout influencer partnerships', 'Product positioning'],
        success_metrics: ['Micro-workout content performance', 'Quick-energy product sales', 'Time-pressed demographic engagement'],
        timeline: '1-2 months',
        priority_score: 92
      },
      {
        recommendation_id: 'rec_women_specific_approach',
        recommendation_type: 'audience',
        title: 'Women-Centric Fitness Nutrition Approach',
        description: 'Develop content and products specifically addressing women\'s unique fitness and nutrition needs',
        rationale: 'Significant gap in women-focused nutrition content and products in the market',
        competitive_insight: 'Most competitors use generic messaging, not addressing women-specific nutritional requirements',
        expected_impact: {
          engagement_lift: 45,
          reach_increase: 52,
          conversion_improvement: 38
        },
        implementation_difficulty: 'medium',
        resource_requirements: ['Women\'s health expertise', 'Female influencer network', 'Product formulation research'],
        success_metrics: ['Female customer acquisition', 'Women-focused content engagement', 'Gender-specific product performance'],
        timeline: '4-6 months',
        priority_score: 85
      },
      {
        recommendation_id: 'rec_sustainability_messaging',
        recommendation_type: 'platform',
        title: 'Sustainability-First Social Strategy',
        description: 'Lead with environmental responsibility messaging across all platforms',
        rationale: 'Growing consumer consciousness about environmental impact of nutrition products',
        competitive_insight: 'Competitors mention sustainability but don\'t make it a core brand pillar',
        expected_impact: {
          engagement_lift: 28,
          reach_increase: 33,
          conversion_improvement: 25
        },
        implementation_difficulty: 'easy',
        resource_requirements: ['Sustainable packaging transition', 'Environmental impact content', 'Eco-conscious influencer partnerships'],
        success_metrics: ['Sustainability content engagement', 'Eco-conscious audience growth', 'Brand perception scores'],
        timeline: '2-3 months',
        priority_score: 79
      }
    ];
  };

  const getCompetitorColor = (index: number) => {
    const colors = ['blue', 'green', 'purple', 'orange', 'red'];
    return colors[index % colors.length];
  };

  const getTrendStageColor = (stage: string) => {
    switch (stage) {
      case 'emerging': return 'text-green-600 bg-green-100 border-green-200';
      case 'growing': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'mature': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'declining': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getGapDifficultyColor = (difficulty: number) => {
    if (difficulty <= 40) return 'text-green-600 bg-green-100';
    if (difficulty <= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Analyzing Competitive Landscape</h2>
          <p className="text-gray-600">Gathering intelligence on competitors and market trends...</p>
        </div>
      </div>
    );
  }

  // Calculate summary metrics
  const totalCompetitorSpend = competitorPerformance.reduce((sum, perf) => sum + (perf.estimated_revenue * 0.3), 0); // Assume 30% of revenue is marketing spend
  const avgMarketShareGrowth = competitorPerformance.reduce((sum, perf) => sum + perf.market_share_change, 0) / competitorPerformance.length;
  const highOpportunityTrends = marketTrends.filter(trend => trend.opportunity_score >= 80).length;
  const criticalGaps = competitiveGaps.filter(gap => gap.opportunity_size >= 10000000).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700 rounded-xl p-8 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="w-8 h-8" />
          <div>
            <h1 className="text-3xl font-bold">Competitive Intelligence & Market Analysis</h1>
            <p className="text-purple-100">AI-powered competitive monitoring, trend analysis, and strategic recommendations</p>
          </div>
        </div>
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4" />
            <span>Real-time Competitor Monitoring</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Market Trend Detection</span>
          </div>
          <div className="flex items-center space-x-2">
            <Brain className="w-4 h-4" />
            <span>AI Strategy Recommendations</span>
          </div>
        </div>
      </div>

      {/* Competitive Intelligence KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <EnhancedMetricCard
          title="Competitor Marketing Spend"
          value={totalCompetitorSpend}
          format="currency"
          change={12.3}
          icon={<DollarSign className="w-6 h-6" />}
          color="red"
          subtitle="Estimated monthly total"
          confidence={78}
          tooltip="Estimated total marketing spend across all major competitors"
        />
        <EnhancedMetricCard
          title="Market Share Growth"
          value={avgMarketShareGrowth}
          format="percentage"
          change={8.7}
          icon={<TrendingUp className="w-6 h-6" />}
          color="blue"
          subtitle="Average competitor growth"
          confidence={82}
          tooltip="Average market share change across competitors"
        />
        <EnhancedMetricCard
          title="High-Opportunity Trends"
          value={highOpportunityTrends}
          change={25.4}
          icon={<Lightbulb className="w-6 h-6" />}
          color="green"
          subtitle="Score 80+ identified"
          confidence={91}
          tooltip="Market trends with opportunity scores above 80 points"
        />
        <EnhancedMetricCard
          title="Critical Market Gaps"
          value={criticalGaps}
          change={15.8}
          icon={<Target className="w-6 h-6" />}
          color="purple"
          subtitle="₹1Cr+ opportunities"
          confidence={85}
          tooltip="Market gaps with opportunity size above ₹1 Crore"
        />
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-1 bg-gray-100 rounded-lg p-1 overflow-x-auto">
        {[
          { id: 'overview', label: 'Competitive Overview', icon: Shield },
          { id: 'trends', label: 'Market Trends', icon: TrendingUp },
          { id: 'gaps', label: 'Market Gaps', icon: Target },
          { id: 'content', label: 'Content Strategy', icon: Brain }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 px-2 sm:px-4 py-3 rounded-md font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Competitive Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Competitor Profiles */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {competitors.map((competitor, index) => (
              <div 
                key={competitor.competitor_id}
                className={`bg-white rounded-xl border-2 p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedCompetitor === competitor.competitor_id 
                    ? 'border-purple-500 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedCompetitor(competitor.competitor_id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{competitor.brand_name}</h3>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium bg-${getCompetitorColor(index)}-100 text-${getCompetitorColor(index)}-800`}>
                    #{index + 1} Market Position
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Market Share</p>
                    <p className="font-semibold text-gray-900">{competitor.market_share}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Followers</p>
                    <p className="font-semibold text-blue-600">{(competitor.total_followers / 1000000).toFixed(1)}M</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Engagement Rate</p>
                    <p className="font-semibold text-green-600">{competitor.avg_engagement_rate}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Monthly Spend</p>
                    <p className="font-semibold text-purple-600">{formatCurrency(competitor.estimated_monthly_spend, settings.defaultCurrency)}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Brand Positioning</p>
                  <p className="text-sm text-gray-700">{competitor.brand_positioning}</p>
                </div>

                <div className="flex flex-wrap gap-1">
                  {competitor.primary_platforms.map(platform => (
                    <span key={platform} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Competitive Landscape Analysis */}
          {landscapeAnalysis && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Competitive Landscape Analysis</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Market Leaders</h4>
                  <div className="space-y-3">
                    {landscapeAnalysis.market_leaders.map((leader: CompetitorProfile) => (
                      <div key={leader.competitor_id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                        <span className="font-medium text-red-900">{leader.brand_name}</span>
                        <span className="text-sm text-red-700">{leader.market_share}% share</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Our Position</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex justify-between mb-2">
                        <span className="text-blue-700">Estimated Rank</span>
                        <span className="font-medium text-blue-900">#{landscapeAnalysis.our_position.estimated_rank}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Market Share</span>
                        <span className="font-medium text-blue-900">{landscapeAnalysis.our_position.market_share_estimate}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Market Gaps</h4>
                  <div className="space-y-2">
                    {landscapeAnalysis.market_gaps.slice(0, 4).map((gap: string, index: number) => (
                      <div key={index} className="p-2 bg-green-50 rounded-lg border border-green-200">
                        <span className="text-sm text-green-700">{gap}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recent Competitor Campaigns */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Competitor Campaigns</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {competitorCampaigns.slice(0, 4).map(campaign => {
                const competitor = competitors.find(c => c.competitor_id === campaign.competitor_id);
                return (
                  <div key={campaign.campaign_id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{campaign.campaign_name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        campaign.campaign_effectiveness === 'high' ? 'bg-green-100 text-green-800' :
                        campaign.campaign_effectiveness === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {campaign.campaign_effectiveness.toUpperCase()}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{competitor?.brand_name}</p>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">Budget:</span>
                        <span className="font-medium text-gray-900 ml-1">{formatCurrency(campaign.estimated_budget, settings.defaultCurrency)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Reach:</span>
                        <span className="font-medium text-blue-600 ml-1">{(campaign.estimated_reach / 1000000).toFixed(1)}M</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Influencers:</span>
                        <span className="font-medium text-purple-600 ml-1">{campaign.influencer_count}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Engagement:</span>
                        <span className="font-medium text-green-600 ml-1">{campaign.engagement_performance}%</span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-xs text-gray-500 mb-1">Key Messages:</p>
                      <div className="flex flex-wrap gap-1">
                        {campaign.key_messages.slice(0, 2).map(message => (
                          <span key={message} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            {message}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Market Trends Tab */}
      {activeTab === 'trends' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketTrends.map(trend => (
              <div key={trend.trend_id} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{trend.trend_name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTrendStageColor(trend.trend_stage)}`}>
                    {trend.trend_stage.toUpperCase()}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4">{trend.description}</p>

                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div>
                    <span className="text-gray-500">Growth Rate:</span>
                    <span className="font-medium text-green-600 ml-1">+{trend.growth_rate}%</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Opportunity:</span>
                    <span className="font-medium text-purple-600 ml-1">{trend.opportunity_score}/100</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Relevance:</span>
                    <span className="font-medium text-blue-600 ml-1">{trend.relevance_score}/100</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Competition:</span>
                    <span className={`font-medium ml-1 ${
                      trend.competitive_intensity === 'low' ? 'text-green-600' :
                      trend.competitive_intensity === 'medium' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {trend.competitive_intensity.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-1">Trending Platforms:</p>
                  <div className="flex flex-wrap gap-1">
                    {trend.platforms_trending.map(platform => (
                      <span key={platform} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs font-medium text-gray-700 mb-1">Recommended Action:</p>
                  <p className="text-xs text-gray-600">{trend.recommended_action}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Seasonal Analysis */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Seasonal Trend Analysis</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Object.entries(MarketTrendAnalyzer.analyzeSeasonalPatterns().seasonal_trends).map(([quarter, data]: [string, any]) => (
                <div key={quarter} className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">{quarter}</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-blue-700">Engagement Boost:</span>
                      <span className="font-medium text-blue-900 ml-1">{((data.engagement_multiplier - 1) * 100).toFixed(0)}%</span>
                    </div>
                    <div>
                      <span className="text-blue-700">Conversion Lift:</span>
                      <span className="font-medium text-blue-900 ml-1">{data.conversion_rate_boost > 0 ? '+' : ''}{data.conversion_rate_boost}%</span>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs text-blue-600 font-medium">Themes:</p>
                      <ul className="text-xs text-blue-700 space-y-1">
                        {data.dominant_themes.map((theme: string, index: number) => (
                          <li key={index}>• {theme}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Market Gaps Tab */}
      {activeTab === 'gaps' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {competitiveGaps.map(gap => (
              <div key={gap.gap_id} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{gap.gap_type.replace('_', ' ').toUpperCase()} Gap</h3>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getGapDifficultyColor(gap.difficulty_score)}`}>
                    {gap.difficulty_score <= 40 ? 'EASY' : gap.difficulty_score <= 70 ? 'MEDIUM' : 'HARD'}
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">{gap.description}</p>

                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div>
                    <span className="text-gray-500">Opportunity:</span>
                    <span className="font-medium text-green-600 ml-1">{formatCurrency(gap.opportunity_size, settings.defaultCurrency)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Success Rate:</span>
                    <span className="font-medium text-blue-600 ml-1">{gap.success_probability}%</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Time to Market:</span>
                    <span className="font-medium text-purple-600 ml-1">{gap.time_to_market}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Investment:</span>
                    <span className="font-medium text-orange-600 ml-1">{formatCurrency(gap.required_investment, settings.defaultCurrency)}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-700 mb-2">Key Actions:</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {gap.key_actions.slice(0, 3).map((action, index) => (
                      <li key={index}>• {action}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs font-medium text-blue-700 mb-1">Recommended Strategy:</p>
                  <p className="text-xs text-blue-600">{gap.recommended_strategy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content Strategy Tab */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contentRecommendations.map(rec => (
              <div key={rec.recommendation_id} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    rec.priority_score >= 85 ? 'bg-red-100 text-red-800' :
                    rec.priority_score >= 70 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    Priority: {rec.priority_score}
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3">{rec.description}</p>

                <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-xs font-medium text-purple-700 mb-1">Competitive Insight:</p>
                  <p className="text-xs text-purple-600">{rec.competitive_insight}</p>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
                  <div className="text-center">
                    <span className="text-gray-500">Engagement</span>
                    <p className="font-medium text-green-600">+{rec.expected_impact.engagement_lift}%</p>
                  </div>
                  <div className="text-center">
                    <span className="text-gray-500">Reach</span>
                    <p className="font-medium text-blue-600">+{rec.expected_impact.reach_increase}%</p>
                  </div>
                  <div className="text-center">
                    <span className="text-gray-500">Conversion</span>
                    <p className="font-medium text-purple-600">+{rec.expected_impact.conversion_improvement}%</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-700 mb-2">Resource Requirements:</p>
                  <div className="flex flex-wrap gap-1">
                    {rec.resource_requirements.slice(0, 3).map(resource => (
                      <span key={resource} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {resource}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Timeline: <span className="font-medium text-gray-900">{rec.timeline}</span></span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    rec.implementation_difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                    rec.implementation_difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {rec.implementation_difficulty.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* AI Content Analysis Summary */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-6">
            <h3 className="text-lg font-semibold text-indigo-900 mb-4">AI-Powered Content Strategy Insights</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-indigo-800 mb-3">Content Gaps Identified</h4>
                <ul className="text-sm text-indigo-700 space-y-2">
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Plant-based nutrition education severely underrepresented</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Women-specific fitness content lacking depth</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Micro-workout trend not being capitalized</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-indigo-800 mb-3">Competitive Advantages</h4>
                <ul className="text-sm text-indigo-700 space-y-2">
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Advanced analytics give strategic edge</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Local market understanding superior</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Influencer relationship management stronger</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-indigo-800 mb-3">Immediate Opportunities</h4>
                <ul className="text-sm text-indigo-700 space-y-2">
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Launch sustainability-focused messaging</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Develop quick-energy product positioning</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Create women-centric content series</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompetitiveDashboard;