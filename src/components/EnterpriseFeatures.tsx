import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Settings, 
  Shield, 
  Zap, 
  Globe, 
  MessageSquare, 
  Bell,
  Eye,
  Brain,
  Cpu,
  Activity,
  Database
} from 'lucide-react';
import { 
  RoleBasedView, 
  CollaborationFeature, 
  AutomatedAlert, 
  APIIntegration,
  DeepLearningModel,
  RealTimeAnalytics
} from '../types/enterprise';
import { EnterpriseIntegrationManager } from '../utils/enterpriseIntegrations';
import { DeepLearningAnalyzer } from '../utils/deepLearningModels';

interface EnterpriseFeaturesProps {
  currentUserRole: string;
  onRoleChange: (role: string) => void;
}

const EnterpriseFeatures: React.FC<EnterpriseFeaturesProps> = ({ 
  currentUserRole, 
  onRoleChange 
}) => {
  const [activeTab, setActiveTab] = useState<'roles' | 'collaboration' | 'alerts' | 'integrations' | 'ai_models' | 'real_time'>('roles');
  const [integrations, setIntegrations] = useState<APIIntegration[]>([]);
  const [aiModels, setAiModels] = useState<DeepLearningModel[]>([]);
  const [realTimeData, setRealTimeData] = useState<RealTimeAnalytics[]>([]);
  const [alerts, setAlerts] = useState<AutomatedAlert[]>([]);

  useEffect(() => {
    // Load enterprise data
    setIntegrations(EnterpriseIntegrationManager.getIntegrations());
    setAiModels(DeepLearningAnalyzer.getAvailableModels());
    
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setRealTimeData(EnterpriseIntegrationManager.generateRealTimeAnalytics());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const roleBasedViews: RoleBasedView[] = [
    {
      role_id: 'cmo',
      role_name: 'cmo',
      display_name: 'Chief Marketing Officer',
      permissions: {
        view_financial_data: true,
        edit_campaigns: true,
        approve_payouts: true,
        access_predictive_models: true,
        export_data: true,
        manage_users: true
      },
      dashboard_config: {
        visible_metrics: ['revenue', 'roas', 'incremental_lift', 'customer_acquisition'],
        default_filters: { time_range: 'quarter' },
        chart_preferences: { focus: 'strategic' }
      }
    },
    {
      role_id: 'campaign_manager',
      role_name: 'campaign_manager',
      display_name: 'Campaign Manager',
      permissions: {
        view_financial_data: true,
        edit_campaigns: true,
        approve_payouts: false,
        access_predictive_models: true,
        export_data: true,
        manage_users: false
      },
      dashboard_config: {
        visible_metrics: ['engagement', 'reach', 'conversions', 'cost_per_order'],
        default_filters: { time_range: 'month' },
        chart_preferences: { focus: 'operational' }
      }
    },
    {
      role_id: 'analyst',
      role_name: 'analyst',
      display_name: 'Data Analyst',
      permissions: {
        view_financial_data: true,
        edit_campaigns: false,
        approve_payouts: false,
        access_predictive_models: true,
        export_data: true,
        manage_users: false
      },
      dashboard_config: {
        visible_metrics: ['all_metrics'],
        default_filters: { time_range: 'custom' },
        chart_preferences: { focus: 'analytical' }
      }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-100 border-green-200';
      case 'syncing': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'error': return 'text-red-600 bg-red-100 border-red-200';
      case 'disconnected': return 'text-gray-600 bg-gray-100 border-gray-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getModelStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100 border-green-200';
      case 'training': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'deprecated': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const handleSyncIntegration = async (platform: string) => {
    try {
      const result = await EnterpriseIntegrationManager.syncPlatformData(platform);
      console.log('Sync result:', result);
      // Update integrations state
      setIntegrations(prev => prev.map(integration => 
        integration.platform === platform 
          ? { ...integration, last_sync: new Date().toISOString(), status: 'connected' }
          : integration
      ));
    } catch (error) {
      console.error('Sync failed:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Shield className="w-5 h-5 text-purple-500" />
        <h3 className="text-lg font-semibold text-gray-900">Enterprise Features</h3>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
        {[
          { id: 'roles', label: 'Role Management', icon: Users },
          { id: 'collaboration', label: 'Collaboration', icon: MessageSquare },
          { id: 'alerts', label: 'Automated Alerts', icon: Bell },
          { id: 'integrations', label: 'API Integrations', icon: Globe },
          { id: 'ai_models', label: 'AI Models', icon: Brain },
          { id: 'real_time', label: 'Real-time Analytics', icon: Activity }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md font-medium transition-all text-sm ${
                activeTab === tab.id
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden md:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Role Management Tab */}
      {activeTab === 'roles' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {roleBasedViews.map(role => (
              <div 
                key={role.role_id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  currentUserRole === role.role_name
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => onRoleChange(role.role_name)}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <Users className="w-6 h-6 text-purple-600" />
                  <h4 className="font-medium text-gray-900">{role.display_name}</h4>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Financial Data</span>
                    <span className={role.permissions.view_financial_data ? 'text-green-600' : 'text-red-600'}>
                      {role.permissions.view_financial_data ? '✓' : '✗'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Edit Campaigns</span>
                    <span className={role.permissions.edit_campaigns ? 'text-green-600' : 'text-red-600'}>
                      {role.permissions.edit_campaigns ? '✓' : '✗'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Approve Payouts</span>
                    <span className={role.permissions.approve_payouts ? 'text-green-600' : 'text-red-600'}>
                      {role.permissions.approve_payouts ? '✓' : '✗'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">AI Models</span>
                    <span className={role.permissions.access_predictive_models ? 'text-green-600' : 'text-red-600'}>
                      {role.permissions.access_predictive_models ? '✓' : '✗'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* API Integrations Tab */}
      {activeTab === 'integrations' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map(integration => (
              <div key={integration.integration_id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Globe className="w-6 h-6 text-blue-500" />
                    <h4 className="font-medium text-gray-900 capitalize">{integration.platform}</h4>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(integration.status)}`}>
                    {integration.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Sync:</span>
                    <span className="text-gray-900">
                      {new Date(integration.last_sync).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frequency:</span>
                    <span className="text-gray-900 capitalize">{integration.sync_frequency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Data Types:</span>
                    <span className="text-gray-900">{integration.data_types.length}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSyncIntegration(integration.platform)}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Sync Now
                  </button>
                  <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                    Configure
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Models Tab */}
      {activeTab === 'ai_models' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiModels.map(model => (
              <div key={model.model_id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Brain className="w-6 h-6 text-purple-500" />
                    <div>
                      <h4 className="font-medium text-gray-900">{model.model_name}</h4>
                      <p className="text-xs text-gray-500">v{model.version}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getModelStatusColor(model.status)}`}>
                    {model.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Accuracy:</span>
                    <span className="font-medium text-green-600">{model.accuracy}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Model Type:</span>
                    <span className="text-gray-900 uppercase">{model.model_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Training Data:</span>
                    <span className="text-gray-900">{(model.training_data_size / 1000).toFixed(0)}K samples</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Trained:</span>
                    <span className="text-gray-900">{new Date(model.last_trained).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-xs text-gray-600 mb-1">Use Cases:</p>
                  <div className="flex flex-wrap gap-1">
                    {model.use_cases.slice(0, 3).map(useCase => (
                      <span key={useCase} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {useCase.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                    View Details
                  </button>
                  <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                    Retrain
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Real-time Analytics Tab */}
      {activeTab === 'real_time' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {realTimeData.map((metric, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="w-5 h-5 text-blue-500" />
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    metric.anomaly_detected ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {metric.anomaly_detected ? 'ANOMALY' : 'NORMAL'}
                  </span>
                </div>
                
                <h4 className="font-medium text-gray-900 capitalize mb-2">
                  {metric.metric_type.replace('_', ' ')}
                </h4>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current:</span>
                    <span className="font-medium text-gray-900">
                      {metric.current_value.toFixed(0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Predicted:</span>
                    <span className="font-medium text-blue-600">
                      {metric.predicted_value.toFixed(0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Variance:</span>
                    <span className={`font-medium ${
                      metric.variance > 0.2 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {(metric.variance * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Confidence:</span>
                    <span className="font-medium text-gray-900">
                      {(metric.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className={`text-xs font-medium ${
                    metric.trend === 'increasing' ? 'text-green-600' : 
                    metric.trend === 'decreasing' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    Trend: {metric.trend.toUpperCase()}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <Cpu className="w-5 h-5 text-blue-600" />
              <h4 className="font-medium text-blue-900">Real-time Processing Status</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-blue-700">Data Points Processed</p>
                <p className="font-semibold text-blue-900">2,847,392</p>
              </div>
              <div>
                <p className="text-blue-700">Processing Latency</p>
                <p className="font-semibold text-blue-900">0.15 seconds</p>
              </div>
              <div>
                <p className="text-blue-700">Anomalies Detected</p>
                <p className="font-semibold text-blue-900">
                  {realTimeData.filter(m => m.anomaly_detected).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collaboration Tab */}
      {activeTab === 'collaboration' && (
        <div className="space-y-6">
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center space-x-2 mb-2">
              <MessageSquare className="w-5 h-5 text-yellow-600" />
              <h4 className="font-medium text-yellow-900">Collaboration Features</h4>
            </div>
            <p className="text-sm text-yellow-700">
              Advanced collaboration features including comments, annotations, and team workflows are available in the full enterprise version.
            </p>
          </div>
        </div>
      )}

      {/* Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="space-y-6">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <Bell className="w-5 h-5 text-green-600" />
              <h4 className="font-medium text-green-900">Automated Alert System</h4>
            </div>
            <p className="text-sm text-green-700">
              Intelligent alert system with email, Slack, and webhook integrations is active and monitoring your campaigns 24/7.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnterpriseFeatures;