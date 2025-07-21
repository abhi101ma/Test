import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Zap, 
  Globe, 
  Brain, 
  Users, 
  Activity,
  Cpu,
  Database,
  Eye,
  TrendingUp
} from 'lucide-react';
import EnhancedMetricCard from '../components/EnhancedMetricCard';
import EnterpriseFeatures from '../components/EnterpriseFeatures';
import { DeepLearningAnalyzer } from '../utils/deepLearningModels';
import { EnterpriseIntegrationManager } from '../utils/enterpriseIntegrations';
import { 
  enhancedInfluencers, 
  enhancedPosts, 
  enhancedTrackingData, 
  enhancedPayouts 
} from '../data/enhancedMockData';

const EnterpriseDashboard: React.FC = () => {
  const [currentUserRole, setCurrentUserRole] = useState<string>('cmo');
  const [isProcessing, setIsProcessing] = useState(true);
  const [deepLearningResults, setDeepLearningResults] = useState<any[]>([]);
  const [integrationStatus, setIntegrationStatus] = useState<any[]>([]);

  useEffect(() => {
    // Simulate enterprise-level processing
    const processEnterpriseData = async () => {
      setIsProcessing(true);
      
      // Simulate deep learning analysis
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Process posts with computer vision and NLP
      const analysisResults = enhancedPosts.slice(0, 5).map(post => ({
        post_id: post.post_id,
        computer_vision: DeepLearningAnalyzer.analyzePostVisuals(post),
        nlp_analysis: DeepLearningAnalyzer.analyzePostText(post)
      }));
      
      setDeepLearningResults(analysisResults);
      setIntegrationStatus(EnterpriseIntegrationManager.getIntegrations());
      setIsProcessing(false);
    };

    processEnterpriseData();
  }, []);

  // Calculate enterprise-level metrics
  const totalDataPoints = enhancedPosts.length * 15 + enhancedTrackingData.length * 8; // Simulate data complexity
  const aiModelsActive = DeepLearningAnalyzer.getAvailableModels().filter(m => m.status === 'active').length;
  const integrationsConnected = integrationStatus.filter(i => i.status === 'connected').length;
  const avgModelAccuracy = DeepLearningAnalyzer.getAvailableModels()
    .reduce((sum, model) => sum + model.accuracy, 0) / DeepLearningAnalyzer.getAvailableModels().length;

  // Computer vision insights
  const avgBrandVisibility = deepLearningResults.length > 0 ? 
    deepLearningResults.reduce((sum, result) => sum + result.computer_vision.product_visibility_score, 0) / deepLearningResults.length : 0;
  
  const avgContentQuality = deepLearningResults.length > 0 ?
    deepLearningResults.reduce((sum, result) => sum + result.computer_vision.content_quality_score, 0) / deepLearningResults.length : 0;

  // NLP insights
  const avgAuthenticityScore = deepLearningResults.length > 0 ?
    deepLearningResults.reduce((sum, result) => sum + result.nlp_analysis.authenticity_score, 0) / deepLearningResults.length : 0;

  const avgCallToActionStrength = deepLearningResults.length > 0 ?
    deepLearningResults.reduce((sum, result) => sum + result.nlp_analysis.call_to_action_strength, 0) / deepLearningResults.length : 0;

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <Brain className="w-8 h-8 text-purple-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Enterprise AI Processing</h2>
          <p className="text-gray-600">Deep learning models analyzing your campaign data...</p>
          <div className="mt-4 space-y-2 text-sm text-gray-500">
            <p>• Computer vision analysis in progress</p>
            <p>• Advanced NLP processing active</p>
            <p>• Real-time integrations syncing</p>
            <p>• Predictive models training</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enterprise Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 rounded-xl p-8 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="w-8 h-8" />
          <div>
            <h1 className="text-3xl font-bold">Enterprise Analytics Platform</h1>
            <p className="text-purple-100">Advanced AI, deep learning models, and enterprise integrations</p>
          </div>
        </div>
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <Brain className="w-4 h-4" />
            <span>Deep Learning Models</span>
          </div>
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4" />
            <span>Real-time Integrations</span>
          </div>
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4" />
            <span>Computer Vision Analysis</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Role-based Access</span>
          </div>
        </div>
      </div>

      {/* Enterprise KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <EnhancedMetricCard
          title="AI Model Accuracy"
          value={avgModelAccuracy}
          format="percentage"
          change={2.3}
          icon={<Brain className="w-6 h-6" />}
          color="purple"
          subtitle="Across all models"
          confidence={96}
          tooltip="Average accuracy across all active deep learning models"
        />
        <EnhancedMetricCard
          title="Data Points Processed"
          value={totalDataPoints}
          change={18.7}
          icon={<Database className="w-6 h-6" />}
          color="blue"
          subtitle="Real-time processing"
          confidence={99}
          tooltip="Total data points processed by enterprise analytics engine"
        />
        <EnhancedMetricCard
          title="Active Integrations"
          value={integrationsConnected}
          change={12.5}
          icon={<Globe className="w-6 h-6" />}
          color="green"
          subtitle="Connected platforms"
          confidence={94}
          tooltip="Number of active API integrations syncing data"
        />
        <EnhancedMetricCard
          title="Processing Latency"
          value={0.15}
          format="number"
          change={-8.2}
          icon={<Cpu className="w-6 h-6" />}
          color="orange"
          subtitle="Seconds average"
          confidence={98}
          tooltip="Average processing time for real-time analytics"
        />
      </div>

      {/* Deep Learning Insights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <EnhancedMetricCard
          title="Brand Visibility Score"
          value={avgBrandVisibility}
          format="score"
          change={15.3}
          icon={<Eye className="w-6 h-6" />}
          color="blue"
          subtitle="Computer vision analysis"
          confidence={92}
          tooltip="AI-calculated brand visibility in visual content"
        />
        <EnhancedMetricCard
          title="Content Quality Score"
          value={avgContentQuality}
          format="score"
          change={8.7}
          icon={<TrendingUp className="w-6 h-6" />}
          color="green"
          subtitle="Aesthetic analysis"
          confidence={89}
          tooltip="Deep learning assessment of visual content quality"
        />
        <EnhancedMetricCard
          title="Authenticity Score"
          value={avgAuthenticityScore}
          format="score"
          change={12.1}
          icon={<Shield className="w-6 h-6" />}
          color="purple"
          subtitle="NLP authenticity analysis"
          confidence={87}
          tooltip="AI-powered authenticity scoring of content"
        />
        <EnhancedMetricCard
          title="CTA Strength"
          value={avgCallToActionStrength}
          format="score"
          change={22.4}
          icon={<Zap className="w-6 h-6" />}
          color="orange"
          subtitle="Call-to-action effectiveness"
          confidence={91}
          tooltip="NLP analysis of call-to-action effectiveness"
        />
      </div>

      {/* Deep Learning Analysis Results */}
      {deepLearningResults.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Brain className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-semibold text-gray-900">Deep Learning Analysis Results</h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {deepLearningResults.slice(0, 4).map((result, index) => (
              <div key={result.post_id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Post Analysis #{index + 1}</h4>
                  <span className="text-xs text-gray-500">AI Processed</span>
                </div>
                
                {/* Computer Vision Results */}
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Computer Vision Analysis</h5>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Brand Logo:</span>
                      <span className={result.computer_vision.brand_logo_detected ? 'text-green-600' : 'text-red-600'}>
                        {result.computer_vision.brand_logo_detected ? 'Detected' : 'Not Found'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Product Visibility:</span>
                      <span className="text-blue-600">{result.computer_vision.product_visibility_score}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Brand Safety:</span>
                      <span className="text-green-600">{result.computer_vision.brand_safety_score}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Aesthetic Score:</span>
                      <span className="text-purple-600">{result.computer_vision.aesthetic_score}/100</span>
                    </div>
                  </div>
                  
                  {result.computer_vision.detected_objects.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-600 mb-1">Detected Objects:</p>
                      <div className="flex flex-wrap gap-1">
                        {result.computer_vision.detected_objects.slice(0, 3).map(obj => (
                          <span key={obj} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                            {obj}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* NLP Results */}
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">NLP Analysis</h5>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Readability:</span>
                      <span className="text-green-600">{result.nlp_analysis.readability_score}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Authenticity:</span>
                      <span className="text-blue-600">{result.nlp_analysis.authenticity_score}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">CTA Strength:</span>
                      <span className="text-orange-600">{result.nlp_analysis.call_to_action_strength}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Urgency:</span>
                      <span className="text-red-600">{result.nlp_analysis.urgency_score}/100</span>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-xs text-gray-600 mb-1">Primary Topic:</p>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                      {result.nlp_analysis.topic_modeling.primary_topic}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enterprise Features Panel */}
      <EnterpriseFeatures
        currentUserRole={currentUserRole}
        onRoleChange={setCurrentUserRole}
      />

      {/* Enterprise Insights Summary */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-6">
        <h3 className="text-lg font-semibold text-indigo-900 mb-4">Enterprise Intelligence Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-indigo-800 mb-3">AI & Machine Learning</h4>
            <ul className="text-sm text-indigo-700 space-y-2">
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>{aiModelsActive} deep learning models active with {avgModelAccuracy.toFixed(1)}% average accuracy</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Computer vision detecting brand logos with 94.2% accuracy</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Advanced NLP analyzing content authenticity and sentiment</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-indigo-800 mb-3">Enterprise Operations</h4>
            <ul className="text-sm text-indigo-700 space-y-2">
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>{integrationsConnected} platform integrations syncing real-time data</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Role-based access control with {currentUserRole.toUpperCase()} permissions</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Enterprise-grade security and compliance monitoring</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Advanced Capabilities */}
        <div className="mt-6 p-4 bg-white rounded-lg border border-indigo-200">
          <h4 className="font-medium text-indigo-900 mb-2">Advanced Enterprise Capabilities</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">Real-time anomaly detection</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700">Automated alert system</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-gray-700">White-label deployment</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-gray-700">API-first architecture</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseDashboard;