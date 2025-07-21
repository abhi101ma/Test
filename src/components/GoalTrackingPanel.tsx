import React, { useState } from 'react';
import { Target, Plus, Calendar, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { GoalTracking, AnomalyDetection } from '../types/predictive';
import { formatCurrency } from '../utils/enhancedCalculations';
import { useSettings } from '../contexts/SettingsContext';

interface GoalTrackingPanelProps {
  goals: GoalTracking[];
  alerts: AnomalyDetection[];
  onCreateGoal: (goal: Omit<GoalTracking, 'goal_id' | 'current_value' | 'progress_percentage' | 'status' | 'created_at'>) => void;
}

const GoalTrackingPanel: React.FC<GoalTrackingPanelProps> = ({ goals, alerts, onCreateGoal }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    goal_type: 'revenue' as const,
    target_value: 0,
    deadline: '',
    campaign_id: '',
    influencer_id: ''
  });

  const { settings } = useSettings();
  const getStatusColor = (status: GoalTracking['status']) => {
    switch (status) {
      case 'exceeded': return 'text-green-600 bg-green-100 border-green-200';
      case 'on_track': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'at_risk': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'behind': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status: GoalTracking['status']) => {
    switch (status) {
      case 'exceeded': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'on_track': return <TrendingUp className="w-4 h-4 text-blue-500" />;
      case 'at_risk': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'behind': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Target className="w-4 h-4 text-gray-400" />;
    }
  };

  const getSeverityColor = (severity: AnomalyDetection['severity']) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const formatGoalValue = (value: number, type: GoalTracking['goal_type']) => {
    switch (type) {
      case 'revenue': return formatCurrency(value, settings.defaultCurrency);
      case 'roas': return `${value.toFixed(1)}x`;
      case 'orders': return value.toString();
      case 'engagement': return value.toLocaleString();
      case 'reach': return value.toLocaleString();
      default: return value.toString();
    }
  };

  const handleCreateGoal = () => {
    if (newGoal.target_value > 0 && newGoal.deadline) {
      onCreateGoal(newGoal);
      setNewGoal({
        goal_type: 'revenue',
        target_value: 0,
        deadline: '',
        campaign_id: '',
        influencer_id: ''
      });
      setShowCreateForm(false);
    }
  };

  const getDaysRemaining = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, days);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Target className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900">Goal Tracking & Alerts</h3>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Set Goal</span>
        </button>
      </div>

      {/* Create Goal Form */}
      {showCreateForm && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-3">Create New Goal</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Goal Type</label>
              <select
                value={newGoal.goal_type}
                onChange={(e) => setNewGoal({ ...newGoal, goal_type: e.target.value as any })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="revenue">Revenue</option>
                <option value="roas">ROAS</option>
                <option value="orders">Orders</option>
                <option value="engagement">Engagement</option>
                <option value="reach">Reach</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Value</label>
              <input
                type="number"
                value={newGoal.target_value}
                onChange={(e) => setNewGoal({ ...newGoal, target_value: Number(e.target.value) })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter target value"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
              <input
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Campaign ID (Optional)</label>
              <input
                type="text"
                value={newGoal.campaign_id}
                onChange={(e) => setNewGoal({ ...newGoal, campaign_id: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Leave empty for overall goal"
              />
            </div>
          </div>
          <div className="flex space-x-2 mt-4">
            <button
              onClick={handleCreateGoal}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Goal
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Goals Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {goals.slice(0, 6).map((goal) => (
          <div key={goal.goal_id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                {getStatusIcon(goal.status)}
                <span className="font-medium text-gray-900 capitalize">{goal.goal_type}</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(goal.status)}`}>
                {goal.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium">{goal.progress_percentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    goal.status === 'exceeded' ? 'bg-green-500' :
                    goal.status === 'on_track' ? 'bg-blue-500' :
                    goal.status === 'at_risk' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(goal.progress_percentage, 100)}%` }}
                />
              </div>
            </div>

            {/* Goal Values */}
            <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
              <div>
                <p className="text-gray-500">Current</p>
                <p className="font-semibold text-gray-900">
                  {formatGoalValue(goal.current_value, goal.goal_type)}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Target</p>
                <p className="font-semibold text-blue-600">
                  {formatGoalValue(goal.target_value, goal.goal_type)}
                </p>
              </div>
            </div>

            {/* Deadline */}
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />
              <span>{getDaysRemaining(goal.deadline)} days remaining</span>
            </div>
          </div>
        ))}
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Active Alerts</h4>
          <div className="space-y-3">
            {alerts.slice(0, 5).map((alert, index) => (
              <div key={index} className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span className="font-medium capitalize">{alert.type.replace('_', ' ')}</span>
                  </div>
                  <span className="text-xs font-medium uppercase">{alert.severity}</span>
                </div>
                
                <p className="text-sm mb-2">{alert.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-xs mb-2">
                  <div>
                    <span className="text-gray-600">Current: </span>
                    <span className="font-medium">{alert.current_value.toFixed(1)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Expected: </span>
                    <span className="font-medium">{alert.expected_value.toFixed(1)}</span>
                  </div>
                </div>

                {alert.recommendations.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-medium mb-1">Recommendations:</p>
                    <ul className="text-xs space-y-1">
                      {alert.recommendations.slice(0, 2).map((rec, recIndex) => (
                        <li key={recIndex}>• {rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <p className="text-sm text-gray-600">Total Goals</p>
          <p className="text-xl font-bold text-gray-900">{goals.length}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">On Track</p>
          <p className="text-xl font-bold text-blue-600">
            {goals.filter(g => g.status === 'on_track' || g.status === 'exceeded').length}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">At Risk</p>
          <p className="text-xl font-bold text-yellow-600">
            {goals.filter(g => g.status === 'at_risk').length}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Active Alerts</p>
          <p className="text-xl font-bold text-red-600">{alerts.length}</p>
        </div>
      </div>
    </div>
  );
};

export default GoalTrackingPanel;