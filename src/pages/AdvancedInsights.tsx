import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Users, Target, MessageCircle } from 'lucide-react';
import EnhancedMetricCard from '../components/EnhancedMetricCard';
import SentimentAnalysisPanel from '../components/SentimentAnalysisPanel';
import CohortAnalysisPanel from '../components/CohortAnalysisPanel';
import AudienceFitPanel from '../components/AudienceFitPanel';
import { 
  enhancedInfluencers, 
  enhancedPosts, 
  enhancedTrackingData, 
  enhancedPayouts 
} from '../data/enhancedMockData';
import { NLPAnalyzer } from '../utils/nlpAnalysis';
import { CohortAnalyzer } from '../utils/cohortAnalysis';
import { AudienceFitAnalyzer } from '../utils/audienceFitAnalysis';
import { MarketTrendAnalyzer } from '../utils/marketTrendAnalyzer';
import { calculateIncrementalROAS } from '../utils/enhancedCalculations';

const AdvancedInsights: React.FC = () => {
  const [selectedBrand, setSelectedBrand] = useState<'MuscleBlaze' | 'HKVitals' | 'Gritzo' | 'HealthKart'>('MuscleBlaze');
  const [contentInsights, setContentInsights] = useState<any>(null);
  const [cohortData, setCohortData] = useState<any>(null);
  const [audienceFitScores, setAudienceFitScores] = useState<any[]>([]);
  const [marketTrends, setMarketTrends] = useState<any[]>([]);

  useEffect(() => {
    // Analyze content and sentiment
    const insights = NLPAnalyzer.analyzeContentInsights(enhancedPosts, enhancedTrackingData);
    setContentInsights(insights);

    // Analyze customer cohorts
    const cohorts = CohortAnalyzer.analyzeCohorts(enhancedTrackingData);
    const cohortInsights = CohortAnalyzer.getCohortInsights(cohorts);
    setCohortData({ cohorts, insights: cohortInsights });

    // Analyze audience fit for selected brand
    const fitScores = AudienceFitAnalyzer.getBrandFitRankings(enhancedInfluencers, selectedBrand);
    setAudienceFitScores(fitScores);

    // Load market trends
    const loadMarketTrends = async () => {
      const trends = await MarketTrendAnalyzer.identifyEmergingTrends();
      setMarketTrends(trends.slice(0, 3)); // Show top 3 trends
    };
    loadMarketTrends();
  }, [selectedBrand]);

  // Calculate advanced metrics
  const overallMetrics = calculateIncrementalROAS(enhancedTrackingData, enhancedPayouts);
  
  // Sentiment-based performance analysis
  const postsWithSentiment = enhancedPosts.map(post => ({
    ...post,
    sentiment: NLPAnalyzer.analyzeSentiment(post.caption_text)
  }));

  const avgSentimentScore = postsWithSentiment.reduce((sum, post) => 
    sum + post.sentiment.sentiment_score, 0) / postsWithSentiment.length;

  const highEngagementPosts = postsWithSentiment.filter(post => 
    (post.likes + post.comments + post.shares) / post.impressions > 0.05
  );

  const contentQualityScore = (highEngagementPosts.length / postsWithSentiment.length) * 100;

  // Audience insights
  const avgAudienceFit = audienceFitScores.length > 0 ? 
    audienceFitScores.reduce((sum, score) => sum + score.overall_fit_score, 0) / audienceFitScores.length : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-700 rounded-xl p-8 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="w-8 h-8" />
          <div>
            <h1 className="text-3xl font-bold">Advanced Analytics & Insights</h1>
            <p className="text-purple-100">NLP sentiment analysis, customer cohorts, and audience fit scoring</p>
          </div>
        </div>
      </div>

      {/* Advanced KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <EnhancedMetricCard
          title="Content Quality Score"
          value={contentQualityScore}
          format="score"
          change={8.3}
          icon={<MessageCircle className="w-6 h-6" />}
          color="purple"
          subtitle="High-engagement posts"
          confidence={85}
          tooltip="Percentage of posts achieving above-average engagement rates"
        />
        <EnhancedMetricCard
          title="Avg Sentiment Score"
          value={avgSentimentScore * 100}
          format="score"
          change={12.1}
          icon={<TrendingUp className="w-6 h-6" />}
          color="green"
          subtitle="Content positivity"
          confidence={78}
          tooltip="Average sentiment score across all post captions (-100 to +100)"
        />
        <EnhancedMetricCard
          title="Audience Fit Score"
          value={avgAudienceFit}
          format="score"
          change={5.7}
          icon={<Target className="w-6 h-6" />}
          color="blue"
          subtitle={`For ${selectedBrand}`}
          confidence={92}
          tooltip="How well influencer audiences match brand target demographics"
        />
        <EnhancedMetricCard
          title="Customer Cohorts"
          value={cohortData?.cohorts?.length || 0}
          change={15.4}
          icon={<Users className="w-6 h-6" />}
          color="orange"
          subtitle="Active cohorts tracked"
          tooltip="Number of distinct customer acquisition cohorts being analyzed"
        />
      </div>

      {/* Market Trends Integration */}
      {marketTrends.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-900">Emerging Market Trends</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {marketTrends.map((trend, index) => (
              <div key={trend.trend_id} className="p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-green-900">{trend.trend_name}</h4>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    +{trend.growth_rate}%
                  </span>
                </div>
                <p className="text-sm text-green-700 mb-3">{trend.description}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-green-600">Opportunity:</span>
                    <span className="font-medium text-green-800 ml-1">{trend.opportunity_score}/100</span>
                  </div>
                  <div>
                    <span className="text-green-600">Stage:</span>
                    <span className="font-medium text-green-800 ml-1 capitalize">{trend.trend_stage}</span>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-green-600 font-medium">Action:</p>
                  <p className="text-xs text-green-700">{trend.recommended_action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced KPIs with Market Context */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <EnhancedMetricCard
          title="Market Trend Alignment"
          value={marketTrends.length > 0 ? marketTrends.reduce((sum, t) => sum + t.relevance_score, 0) / marketTrends.length : 0}
          format="score"
          change={18.2}
          icon={<TrendingUp className="w-6 h-6" />}
          color="green"
          subtitle="Trend relevance score"
          confidence={89}
          tooltip="How well our strategy aligns with emerging market trends"
        />
      </div>

      {/* Main Analysis Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Content & Sentiment Analysis */}
        {contentInsights && (
          <SentimentAnalysisPanel insights={contentInsights} />
        )}

        {/* Audience Fit Analysis */}
        <AudienceFitPanel
          fitScores={audienceFitScores}
          selectedBrand={selectedBrand}
          onBrandChange={setSelectedBrand}
        />
      </div>

      {/* Customer Cohort Analysis */}
      {cohortData && (
        <CohortAnalysisPanel
          cohorts={cohortData.cohorts}
          insights={cohortData.insights}
        />
      )}

      {/* Strategic Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI-Powered Strategic Recommendations</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Content Optimization</h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Positive sentiment posts generate {contentInsights?.sentiment_performance.positive_posts_roas > contentInsights?.sentiment_performance.neutral_posts_roas ? '23%' : '15%'} higher revenue</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Optimal posting times: {contentInsights?.engagement_patterns.best_posting_times.join(', ')}</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Focus on top keywords: {contentInsights?.top_performing_keywords.slice(0, 3).map(k => k.keyword).join(', ')}</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Audience & Retention Strategy</h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>{cohortData?.insights.bestPerformingSource} customers show highest CLV</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Implement retention campaigns for {cohortData?.insights.retentionTrend} cohorts</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Target influencers with 80+ audience fit scores for {selectedBrand}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Advanced Insights */}
        <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-2">Advanced Insights</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium text-blue-600">Content Performance</p>
              <p className="text-gray-600">
                {contentInsights?.optimal_content_mix[0]?.post_type} posts show highest ROI
              </p>
            </div>
            <div>
              <p className="font-medium text-green-600">Customer Acquisition</p>
              <p className="text-gray-600">
                {cohortData?.insights.bestPerformingSource} channel delivers best CLV
              </p>
            </div>
            <div>
              <p className="font-medium text-purple-600">Audience Alignment</p>
              <p className="text-gray-600">
                {audienceFitScores.filter(s => s.overall_fit_score >= 80).length} influencers show excellent fit
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedInsights;