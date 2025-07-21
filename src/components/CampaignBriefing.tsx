import React, { useState } from 'react';
import { FileText, Target, Users, Calendar, DollarSign, Save, X } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { formatCurrency } from '../utils/enhancedCalculations';

interface CampaignBrief {
  campaign_id: string;
  campaign_name: string;
  brand: string;
  product_focus: string;
  campaign_objectives: string[];
  target_audience: {
    age_range: string;
    gender: string;
    interests: string[];
    locations: string[];
  };
  key_messages: string[];
  content_requirements: {
    post_types: string[];
    content_themes: string[];
    mandatory_elements: string[];
    prohibited_elements: string[];
  };
  budget_allocation: {
    total_budget: number;
    influencer_fees: number;
    content_creation: number;
    promotion_budget: number;
  };
  timeline: {
    brief_deadline: string;
    content_submission: string;
    approval_deadline: string;
    go_live_date: string;
  };
  success_metrics: string[];
  additional_notes: string;
}

interface CampaignBriefingProps {
  campaignId?: string;
  existingBrief?: CampaignBrief;
  onSave: (brief: CampaignBrief) => void;
  onCancel: () => void;
  isOpen: boolean;
}

const CampaignBriefing: React.FC<CampaignBriefingProps> = ({
  campaignId,
  existingBrief,
  onSave,
  onCancel,
  isOpen
}) => {
  const [brief, setBrief] = useState<CampaignBrief>(existingBrief || {
    campaign_id: campaignId || '',
    campaign_name: '',
    brand: 'MuscleBlaze',
    product_focus: '',
    campaign_objectives: [],
    target_audience: {
      age_range: '25-34',
      gender: 'All',
      interests: [],
      locations: []
    },
    key_messages: [],
    content_requirements: {
      post_types: [],
      content_themes: [],
      mandatory_elements: [],
      prohibited_elements: []
    },
    budget_allocation: {
      total_budget: 0,
      influencer_fees: 0,
      content_creation: 0,
      promotion_budget: 0
    },
    timeline: {
      brief_deadline: '',
      content_submission: '',
      approval_deadline: '',
      go_live_date: ''
    },
    success_metrics: [],
    additional_notes: ''
  });

  const { settings } = useSettings();
  const [activeSection, setActiveSection] = useState<'basic' | 'audience' | 'content' | 'budget' | 'timeline'>('basic');

  const brands = ['MuscleBlaze', 'HKVitals', 'Gritzo', 'HealthKart'];
  const objectiveOptions = [
    'Brand Awareness', 'Product Launch', 'Sales Drive', 'Engagement Boost',
    'Community Building', 'Educational Content', 'Seasonal Campaign'
  ];
  const postTypeOptions = ['Reel', 'Static Post', 'Story', 'YouTube Video', 'IGTV', 'Carousel'];
  const contentThemeOptions = [
    'Product Demo', 'Lifestyle Integration', 'Before/After', 'Educational',
    'Behind the Scenes', 'User Generated Content', 'Testimonial', 'Tutorial'
  ];
  const successMetricOptions = [
    'Reach', 'Engagement Rate', 'Click-through Rate', 'Conversions',
    'Brand Mention Sentiment', 'Video Completion Rate', 'Save Rate'
  ];

  const handleArrayFieldChange = (field: string, value: string, checked: boolean) => {
    setBrief(prev => {
      const fieldPath = field.split('.');
      const newBrief = { ...prev };
      
      if (fieldPath.length === 1) {
        const currentArray = newBrief[fieldPath[0] as keyof CampaignBrief] as string[];
        if (checked) {
          newBrief[fieldPath[0] as keyof CampaignBrief] = [...currentArray, value] as any;
        } else {
          newBrief[fieldPath[0] as keyof CampaignBrief] = currentArray.filter(item => item !== value) as any;
        }
      } else {
        // Handle nested fields like target_audience.interests
        const parentField = newBrief[fieldPath[0] as keyof CampaignBrief] as any;
        const currentArray = parentField[fieldPath[1]] as string[];
        if (checked) {
          parentField[fieldPath[1]] = [...currentArray, value];
        } else {
          parentField[fieldPath[1]] = currentArray.filter((item: string) => item !== value);
        }
      }
      
      return newBrief;
    });
  };

  const handleSave = () => {
    // Validate required fields
    if (!brief.campaign_name || !brief.product_focus) {
      alert('Please fill in all required fields');
      return;
    }
    
    onSave(brief);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-900">Campaign Brief</h2>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Navigation */}
        <div className="flex flex-wrap border-b border-gray-200 px-4 sm:px-6 overflow-x-auto">
          {[
            { id: 'basic', label: 'Basic Info', icon: Target },
            { id: 'audience', label: 'Target Audience', icon: Users },
            { id: 'content', label: 'Content Requirements', icon: FileText },
            { id: 'budget', label: 'Budget Allocation', icon: DollarSign },
            { id: 'timeline', label: 'Timeline', icon: Calendar }
          ].map(section => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as any)}
                className={`flex items-center space-x-2 px-2 sm:px-4 py-3 font-medium transition-colors whitespace-nowrap ${
                  activeSection === section.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{section.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh]">
          {/* Basic Info Section */}
          {activeSection === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign Name *
                  </label>
                  <input
                    type="text"
                    value={brief.campaign_name}
                    onChange={(e) => setBrief(prev => ({ ...prev, campaign_name: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter campaign name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand
                  </label>
                  <select
                    value={brief.brand}
                    onChange={(e) => setBrief(prev => ({ ...prev, brand: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {brands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Focus *
                </label>
                <input
                  type="text"
                  value={brief.product_focus}
                  onChange={(e) => setBrief(prev => ({ ...prev, product_focus: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Whey Protein, Multivitamins, Kids Nutrition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Objectives
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {objectiveOptions.map(objective => (
                    <label key={objective} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={brief.campaign_objectives.includes(objective)}
                        onChange={(e) => handleArrayFieldChange('campaign_objectives', objective, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{objective}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Target Audience Section */}
          {activeSection === 'audience' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age Range
                  </label>
                  <select
                    value={brief.target_audience.age_range}
                    onChange={(e) => setBrief(prev => ({
                      ...prev,
                      target_audience: { ...prev.target_audience, age_range: e.target.value }
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="18-24">18-24</option>
                    <option value="25-34">25-34</option>
                    <option value="35-44">35-44</option>
                    <option value="45+">45+</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender Focus
                  </label>
                  <select
                    value={brief.target_audience.gender}
                    onChange={(e) => setBrief(prev => ({
                      ...prev,
                      target_audience: { ...prev.target_audience, gender: e.target.value }
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="All">All Genders</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Interests
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['Fitness', 'Nutrition', 'Wellness', 'Bodybuilding', 'Weight Loss', 'Muscle Gain', 'Health', 'Sports'].map(interest => (
                    <label key={interest} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={brief.target_audience.interests.includes(interest)}
                        onChange={(e) => handleArrayFieldChange('target_audience.interests', interest, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{interest}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Locations
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad'].map(location => (
                    <label key={location} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={brief.target_audience.locations.includes(location)}
                        onChange={(e) => handleArrayFieldChange('target_audience.locations', location, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{location}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Content Requirements Section */}
          {activeSection === 'content' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Post Types
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {postTypeOptions.map(postType => (
                    <label key={postType} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={brief.content_requirements.post_types.includes(postType)}
                        onChange={(e) => handleArrayFieldChange('content_requirements.post_types', postType, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{postType}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Themes
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {contentThemeOptions.map(theme => (
                    <label key={theme} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={brief.content_requirements.content_themes.includes(theme)}
                        onChange={(e) => handleArrayFieldChange('content_requirements.content_themes', theme, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{theme}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Key Messages
                  </label>
                  <textarea
                    value={brief.key_messages.join('\n')}
                    onChange={(e) => setBrief(prev => ({
                      ...prev,
                      key_messages: e.target.value.split('\n').filter(msg => msg.trim())
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="Enter key messages (one per line)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mandatory Elements
                  </label>
                  <textarea
                    value={brief.content_requirements.mandatory_elements.join('\n')}
                    onChange={(e) => setBrief(prev => ({
                      ...prev,
                      content_requirements: {
                        ...prev.content_requirements,
                        mandatory_elements: e.target.value.split('\n').filter(elem => elem.trim())
                      }
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="Enter mandatory elements (one per line)"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Budget Allocation Section */}
          {activeSection === 'budget' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Budget (₹)
                  </label>
                  <input
                    type="number"
                    value={brief.budget_allocation.total_budget}
                    onChange={(e) => setBrief(prev => ({
                      ...prev,
                      budget_allocation: { ...prev.budget_allocation, total_budget: Number(e.target.value) }
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter total budget"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Influencer Fees (₹)
                  </label>
                  <input
                    type="number"
                    value={brief.budget_allocation.influencer_fees}
                    onChange={(e) => setBrief(prev => ({
                      ...prev,
                      budget_allocation: { ...prev.budget_allocation, influencer_fees: Number(e.target.value) }
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter influencer fees"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Creation (₹)
                  </label>
                  <input
                    type="number"
                    value={brief.budget_allocation.content_creation}
                    onChange={(e) => setBrief(prev => ({
                      ...prev,
                      budget_allocation: { ...prev.budget_allocation, content_creation: Number(e.target.value) }
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter content creation budget"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Promotion Budget (₹)
                  </label>
                  <input
                    type="number"
                    value={brief.budget_allocation.promotion_budget}
                    onChange={(e) => setBrief(prev => ({
                      ...prev,
                      budget_allocation: { ...prev.budget_allocation, promotion_budget: Number(e.target.value) }
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter promotion budget"
                  />
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Budget Breakdown</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-blue-700">Total Allocated</p>
                    <p className="font-semibold text-blue-900">
                      {formatCurrency((brief.budget_allocation.influencer_fees + brief.budget_allocation.content_creation + brief.budget_allocation.promotion_budget), settings.defaultCurrency)}
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-700">Remaining</p>
                    <p className="font-semibold text-blue-900">
                      {formatCurrency((brief.budget_allocation.total_budget - brief.budget_allocation.influencer_fees - brief.budget_allocation.content_creation - brief.budget_allocation.promotion_budget), settings.defaultCurrency)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Timeline Section */}
          {activeSection === 'timeline' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brief Deadline
                  </label>
                  <input
                    type="date"
                    value={brief.timeline.brief_deadline}
                    onChange={(e) => setBrief(prev => ({
                      ...prev,
                      timeline: { ...prev.timeline, brief_deadline: e.target.value }
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Submission
                  </label>
                  <input
                    type="date"
                    value={brief.timeline.content_submission}
                    onChange={(e) => setBrief(prev => ({
                      ...prev,
                      timeline: { ...prev.timeline, content_submission: e.target.value }
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Approval Deadline
                  </label>
                  <input
                    type="date"
                    value={brief.timeline.approval_deadline}
                    onChange={(e) => setBrief(prev => ({
                      ...prev,
                      timeline: { ...prev.timeline, approval_deadline: e.target.value }
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Go Live Date
                  </label>
                  <input
                    type="date"
                    value={brief.timeline.go_live_date}
                    onChange={(e) => setBrief(prev => ({
                      ...prev,
                      timeline: { ...prev.timeline, go_live_date: e.target.value }
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Success Metrics
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {successMetricOptions.map(metric => (
                    <label key={metric} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={brief.success_metrics.includes(metric)}
                        onChange={(e) => handleArrayFieldChange('success_metrics', metric, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{metric}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={brief.additional_notes}
                  onChange={(e) => setBrief(prev => ({ ...prev, additional_notes: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Enter any additional notes or special requirements"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Section {['basic', 'audience', 'content', 'budget', 'timeline'].indexOf(activeSection) + 1} of 5
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Brief</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignBriefing;