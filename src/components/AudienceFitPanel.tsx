import React, { useState } from 'react';
import { Target, Users, MapPin, Heart, Shield } from 'lucide-react';
import { AudienceFitScore } from '../types/analytics';

interface AudienceFitPanelProps {
  fitScores: AudienceFitScore[];
  selectedBrand: string;
  onBrandChange: (brand: string) => void;
}

const AudienceFitPanel: React.FC<AudienceFitPanelProps> = ({ 
  fitScores, 
  selectedBrand, 
  onBrandChange 
}) => {
  const brands = ['MuscleBlaze', 'HKVitals', 'Gritzo', 'HealthKart'];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    if (score >= 40) return 'text-orange-600 bg-orange-100 border-orange-200';
    return 'text-red-600 bg-red-100 border-red-200';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent Fit';
    if (score >= 60) return 'Good Fit';
    if (score >= 40) return 'Fair Fit';
    return 'Poor Fit';
  };

  const avgFitScore = fitScores.length > 0 ? 
    fitScores.reduce((sum, score) => sum + score.overall_fit_score, 0) / fitScores.length : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Target className="w-5 h-5 text-purple-500" />
          <h3 className="text-lg font-semibold text-gray-900">Audience Fit Analysis</h3>
        </div>
        
        <select
          value={selectedBrand}
          onChange={(e) => onBrandChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          {brands.map(brand => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="text-center">
            <Target className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <p className="text-sm text-purple-700 font-medium">Avg Fit Score</p>
            <p className="font-semibold text-purple-900">{avgFitScore.toFixed(1)}/100</p>
          </div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="text-center">
            <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-green-700 font-medium">High Fit (80+)</p>
            <p className="font-semibold text-green-900">
              {fitScores.filter(s => s.overall_fit_score >= 80).length}
            </p>
          </div>
        </div>
        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="text-center">
            <Heart className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
            <p className="text-sm text-yellow-700 font-medium">Good Fit (60+)</p>
            <p className="font-semibold text-yellow-900">
              {fitScores.filter(s => s.overall_fit_score >= 60 && s.overall_fit_score < 80).length}
            </p>
          </div>
        </div>
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <div className="text-center">
            <Shield className="w-6 h-6 text-red-600 mx-auto mb-2" />
            <p className="text-sm text-red-700 font-medium">{'Poor Fit (<60)'}</p>
            <p className="font-semibold text-red-900">
              {fitScores.filter(s => s.overall_fit_score < 60).length}
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Fit Scores */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Influencer Fit Rankings</h4>
        {fitScores.slice(0, 8).map((score, index) => (
          <div key={score.influencer_id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-sm font-medium text-gray-600">
                  {index + 1}
                </span>
                <div>
                  <p className="font-medium text-gray-900">Influencer {score.influencer_id}</p>
                  <p className="text-sm text-gray-500">{getScoreLabel(score.overall_fit_score)}</p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full border ${getScoreColor(score.overall_fit_score)}`}>
                <span className="font-semibold">{score.overall_fit_score}/100</span>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3">
              <div className="text-center">
                <p className="text-xs text-gray-500">Demographics</p>
                <p className="font-medium text-blue-600">{score.demographic_fit}/30</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Geography</p>
                <p className="font-medium text-green-600">{score.geographic_fit}/25</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Interests</p>
                <p className="font-medium text-purple-600">{score.interest_alignment}/25</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Engagement</p>
                <p className="font-medium text-orange-600">{score.engagement_quality}/15</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Safety</p>
                <p className="font-medium text-red-600">{score.brand_safety_score}/5</p>
              </div>
            </div>

            {/* Recommendations */}
            {score.recommendations.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs font-medium text-gray-700 mb-1">Recommendations:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  {score.recommendations.slice(0, 2).map((rec, recIndex) => (
                    <li key={recIndex}>• {rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Brand Strategy Insights */}
      <div className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
        <h4 className="font-medium text-purple-900 mb-2">Brand Strategy Insights for {selectedBrand}</h4>
        <div className="text-sm text-purple-700 space-y-1">
          {avgFitScore >= 70 ? (
            <>
              <p>• Strong influencer-brand alignment detected</p>
              <p>• Consider increasing budget allocation for top-fit influencers</p>
              <p>• Implement long-term partnership agreements</p>
            </>
          ) : avgFitScore >= 50 ? (
            <>
              <p>• Moderate alignment - focus on content optimization</p>
              <p>• Provide brand guidelines to improve message consistency</p>
              <p>• Consider audience education campaigns</p>
            </>
          ) : (
            <>
              <p>• Low alignment detected - review influencer selection criteria</p>
              <p>• Consider expanding to new influencer categories</p>
              <p>• Implement stricter vetting process</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudienceFitPanel;