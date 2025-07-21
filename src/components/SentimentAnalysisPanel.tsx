import React from 'react';
import { MessageCircle, TrendingUp, Hash, Brain } from 'lucide-react';
import { ContentInsights } from '../types/analytics';

interface SentimentAnalysisPanelProps {
  insights: ContentInsights;
}

const SentimentAnalysisPanel: React.FC<SentimentAnalysisPanelProps> = ({ insights }) => {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-50 border-green-200';
      case 'neutral': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'negative': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Brain className="w-5 h-5 text-purple-500" />
        <h3 className="text-lg font-semibold text-gray-900">Content & Sentiment Analysis</h3>
      </div>

      <div className="space-y-6">
        {/* Sentiment Performance */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Sentiment Impact on ROAS</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg border ${getSentimentColor('positive')}`}>
              <div className="text-center">
                <p className="text-sm font-medium">Positive Posts</p>
                <p className="text-xl font-bold">
                  ₹{insights.sentiment_performance.positive_posts_roas.toLocaleString()}
                </p>
                <p className="text-xs">Avg Revenue</p>
              </div>
            </div>
            <div className={`p-4 rounded-lg border ${getSentimentColor('neutral')}`}>
              <div className="text-center">
                <p className="text-sm font-medium">Neutral Posts</p>
                <p className="text-xl font-bold">
                  ₹{insights.sentiment_performance.neutral_posts_roas.toLocaleString()}
                </p>
                <p className="text-xs">Avg Revenue</p>
              </div>
            </div>
            <div className={`p-4 rounded-lg border ${getSentimentColor('negative')}`}>
              <div className="text-center">
                <p className="text-sm font-medium">Negative Posts</p>
                <p className="text-xl font-bold">
                  ₹{insights.sentiment_performance.negative_posts_roas.toLocaleString()}
                </p>
                <p className="text-xs">Avg Revenue</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Keywords */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Top Performing Keywords</h4>
          <div className="space-y-2">
            {insights.top_performing_keywords.slice(0, 8).map((keyword, index) => (
              <div key={keyword.keyword} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center justify-center w-6 h-6 bg-purple-100 text-purple-600 rounded-full text-xs font-medium">
                    {index + 1}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Hash className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900">{keyword.keyword}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-green-600">
                    ₹{keyword.revenue_correlation.toFixed(0)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {keyword.frequency} uses • {keyword.avg_engagement.toFixed(1)}% eng
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Mix Recommendations */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Optimal Content Mix</h4>
          <div className="space-y-3">
            {insights.optimal_content_mix.map((content, index) => (
              <div key={content.post_type} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <p className="font-medium text-blue-900">{content.post_type}</p>
                  <p className="text-sm text-blue-700">
                    Recommended: {content.recommended_percentage.toFixed(1)}% of posts
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-blue-600">
                    ₹{content.avg_performance.toFixed(0)}
                  </p>
                  <p className="text-xs text-blue-500">Avg Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Patterns */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Engagement Patterns</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
              <div className="text-center">
                <MessageCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-green-700 font-medium">Best Posting Times</p>
                <p className="text-xs text-green-600">
                  {insights.engagement_patterns.best_posting_times.join(', ')}
                </p>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <div className="text-center">
                <TrendingUp className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-blue-700 font-medium">Optimal Caption Length</p>
                <p className="text-xs text-blue-600">
                  {insights.engagement_patterns.optimal_caption_length} characters
                </p>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
              <div className="text-center">
                <Hash className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-purple-700 font-medium">Hashtag Effectiveness</p>
                <p className="text-xs text-purple-600">
                  {(insights.engagement_patterns.hashtag_effectiveness * 100).toFixed(0)}% impact
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentimentAnalysisPanel;