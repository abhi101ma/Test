import React, { useState } from 'react';
import { Zap, Play, Pause, Settings, CheckCircle, AlertTriangle, Clock, BarChart3 } from 'lucide-react';
import { WorkflowAutomation, WorkflowAction } from '../types/workflow';

interface WorkflowAutomationPanelProps {
  automations: WorkflowAutomation[];
  onToggleAutomation: (automationId: string, isActive: boolean) => void;
  onCreateAutomation: (automation: any) => void;
  metrics: {
    total_automations: number;
    active_automations: number;
    total_executions: number;
    avg_success_rate: number;
    executions_last_24h: number;
  };
}

const WorkflowAutomationPanel: React.FC<WorkflowAutomationPanelProps> = ({
  automations,
  onToggleAutomation,
  onCreateAutomation,
  metrics
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAutomation, setNewAutomation] = useState({
    automation_name: '',
    trigger_type: 'time_based' as const,
    trigger_conditions: {},
    actions: [] as WorkflowAction[]
  });

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'text-green-600 bg-green-100 border-green-200' : 'text-gray-600 bg-gray-100 border-gray-200';
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 95) return 'text-green-600';
    if (rate >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTriggerTypeIcon = (type: string) => {
    switch (type) {
      case 'time_based': return <Clock className="w-4 h-4" />;
      case 'event_based': return <Zap className="w-4 h-4" />;
      case 'condition_based': return <AlertTriangle className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-purple-500" />
          <h3 className="text-lg font-semibold text-gray-900">Workflow Automation</h3>
        </div>
        
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Zap className="w-4 h-4" />
          <span>Create Automation</span>
        </button>
      </div>

      {/* Automation Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
          <BarChart3 className="w-6 h-6 text-blue-600 mx-auto mb-1" />
          <p className="text-sm text-blue-700">Total</p>
          <p className="font-semibold text-blue-900">{metrics.total_automations}</p>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
          <Play className="w-6 h-6 text-green-600 mx-auto mb-1" />
          <p className="text-sm text-green-700">Active</p>
          <p className="font-semibold text-green-900">{metrics.active_automations}</p>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
          <CheckCircle className="w-6 h-6 text-purple-600 mx-auto mb-1" />
          <p className="text-sm text-purple-700">Executions</p>
          <p className="font-semibold text-purple-900">{metrics.total_executions}</p>
        </div>
        <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <AlertTriangle className="w-6 h-6 text-yellow-600 mx-auto mb-1" />
          <p className="text-sm text-yellow-700">Success Rate</p>
          <p className="font-semibold text-yellow-900">{metrics.avg_success_rate.toFixed(1)}%</p>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
          <Clock className="w-6 h-6 text-orange-600 mx-auto mb-1" />
          <p className="text-sm text-orange-700">Last 24h</p>
          <p className="font-semibold text-orange-900">{metrics.executions_last_24h}</p>
        </div>
      </div>

      {/* Automation List */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Active Automations</h4>
        {automations.map(automation => (
          <div key={automation.automation_id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                {getTriggerTypeIcon(automation.trigger_type)}
                <div>
                  <h5 className="font-medium text-gray-900">{automation.automation_name}</h5>
                  <p className="text-sm text-gray-500 capitalize">{automation.trigger_type.replace('_', ' ')} trigger</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(automation.is_active)}`}>
                  {automation.is_active ? 'ACTIVE' : 'INACTIVE'}
                </span>
                <button
                  onClick={() => onToggleAutomation(automation.automation_id, !automation.is_active)}
                  className={`p-2 rounded-lg transition-colors ${
                    automation.is_active 
                      ? 'text-red-600 hover:bg-red-50' 
                      : 'text-green-600 hover:bg-green-50'
                  }`}
                >
                  {automation.is_active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Executions:</span>
                <span className="font-medium text-gray-900 ml-1">{automation.execution_count}</span>
              </div>
              <div>
                <span className="text-gray-500">Success Rate:</span>
                <span className={`font-medium ml-1 ${getSuccessRateColor(automation.success_rate)}`}>
                  {automation.success_rate.toFixed(1)}%
                </span>
              </div>
              <div>
                <span className="text-gray-500">Actions:</span>
                <span className="font-medium text-blue-600 ml-1">{automation.actions.length}</span>
              </div>
              <div>
                <span className="text-gray-500">Last Run:</span>
                <span className="font-medium text-gray-900 ml-1">
                  {new Date(automation.last_executed).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Action Summary */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">Actions:</p>
              <div className="flex flex-wrap gap-2">
                {automation.actions.map(action => (
                  <span key={action.action_id} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    {action.action_type.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Automation Form */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Create New Automation</h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Automation Name
                </label>
                <input
                  type="text"
                  value={newAutomation.automation_name}
                  onChange={(e) => setNewAutomation(prev => ({ ...prev, automation_name: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter automation name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trigger Type
                </label>
                <select
                  value={newAutomation.trigger_type}
                  onChange={(e) => setNewAutomation(prev => ({ ...prev, trigger_type: e.target.value as any }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="time_based">Time Based</option>
                  <option value="event_based">Event Based</option>
                  <option value="condition_based">Condition Based</option>
                </select>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    onCreateAutomation(newAutomation);
                    setShowCreateForm(false);
                    setNewAutomation({
                      automation_name: '',
                      trigger_type: 'time_based',
                      trigger_conditions: {},
                      actions: []
                    });
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Create Automation
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Automation Insights */}
      <div className="mt-6 bg-purple-50 rounded-lg p-4 border border-purple-200">
        <h4 className="font-medium text-purple-900 mb-2">Automation Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-purple-700">Most Effective Automation:</p>
            <p className="font-medium text-purple-900">
              {automations.reduce((best, current) => 
                current.success_rate > best.success_rate ? current : best
              ).automation_name}
            </p>
          </div>
          <div>
            <p className="text-purple-700">Time Saved This Month:</p>
            <p className="font-medium text-purple-900">~{metrics.total_executions * 15} minutes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowAutomationPanel;