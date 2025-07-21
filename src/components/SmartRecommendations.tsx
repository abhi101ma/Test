import React from 'react';
import { Brain, TrendingUp, Target, Zap, ArrowRight, Star } from 'lucide-react';

interface Recommendation {
  id: string;
  type: 'optimization' | 'opportunity' | 'warning' | 'insight';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'easy' | 'medium' | 'hard';
  expectedOutcome: string;
  confidence: number;
  actions: string[];
  relatedMetrics?: string[];
}

interface SmartRecommendationsProps {
  recommendations: Recommendation[];
  onActionClick?: (recommendationId: string, action: string) => void;
}

const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({
  recommendations,
  onActionClick
}) => {
  const getTypeIcon = (type: Recommendation['type']) => {
    switch (type) {
      case 'optimization':
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
      case 'opportunity':
        return <Target className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <Zap className="w-5 h-5 text-yellow-500" />;
      case 'insight':
        return <Brain className="w-5 h-5 text-purple-500" />;
      default:
        return <Star className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeColor = (type: Recommendation['type']) => {
    switch (type) {
      case 'optimization':
        return 'bg-blue-50 border-blue-200';
      case 'opportunity':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'insight':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getImpactColor = (impact: Recommendation['impact']) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEffortColor = (effort: Recommendation['effort']) => {
    switch (effort) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Brain className="w-5 h-5 text-purple-500" />
        <h3 className="text-lg font-semibold text-gray-900">AI-Powered Recommendations</h3>
        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
          {recommendations.length} insights
        </span>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className={`rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-md ${getTypeColor(rec.type)}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                {getTypeIcon(rec.type)}
                <div>
                  <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                  <p className="text-sm text-gray-600 capitalize">{rec.type}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(rec.impact)}`}>
                  {rec.impact} impact
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEffortColor(rec.effort)}`}>
                  {rec.effort}
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-700 mb-3">{rec.description}</p>

            {/* Expected Outcome */}
            <div className="bg-white bg-opacity-50 rounded-lg p-3 mb-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Expected Outcome</p>
                  <p className="font-medium text-gray-900">{rec.expectedOutcome}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600 mb-1">Confidence</p>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${rec.confidence}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{rec.confidence}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-700">Recommended Actions:</p>
              <div className="space-y-1">
                {rec.actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => onActionClick?.(rec.id, action)}
                    className="flex items-center space-x-2 w-full text-left p-2 bg-white bg-opacity-50 rounded-lg hover:bg-opacity-75 transition-all text-sm"
                  >
                    <ArrowRight className="w-3 h-3 text-gray-500" />
                    <span>{action}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Related Metrics */}
            {rec.relatedMetrics && rec.relatedMetrics.length > 0 && (
              <div className="mt-3 pt-3 border-t border-white border-opacity-50">
                <p className="text-xs text-gray-600 mb-1">Related Metrics:</p>
                <div className="flex flex-wrap gap-1">
                  {rec.relatedMetrics.map((metric, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-white bg-opacity-50 text-xs rounded-full"
                    >
                      {metric}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
        <h4 className="font-medium text-purple-900 mb-2">Recommendation Summary</h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-purple-700">High Impact</p>
            <p className="font-semibold text-purple-900">
              {recommendations.filter(r => r.impact === 'high').length} recommendations
            </p>
          </div>
          <div>
            <p className="text-purple-700">Quick Wins</p>
            <p className="font-semibold text-purple-900">
              {recommendations.filter(r => r.effort === 'easy').length} easy actions
            </p>
          </div>
          <div>
            <p className="text-purple-700">Avg Confidence</p>
            <p className="font-semibold text-purple-900">
              {(recommendations.reduce((sum, r) => sum + r.confidence, 0) / recommendations.length).toFixed(0)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartRecommendations;