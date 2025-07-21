import React, { useState } from 'react';
import { 
  FileText, 
  Users, 
  CheckCircle, 
  Calendar, 
  BarChart3, 
  ArrowRight, 
  Clock,
  AlertTriangle,
  Play,
  Pause
} from 'lucide-react';
import { CampaignBrief, WorkflowStage } from '../types/workflow';

interface CampaignWorkflowManagerProps {
  campaignBrief: CampaignBrief;
  workflowStages: WorkflowStage[];
  currentStage: string;
  onStageProgress: (stageId: string) => void;
  workflowMetrics: {
    progress_percentage: number;
    pending_tasks: number;
    overdue_items: number;
    estimated_completion: string;
  };
}

const CampaignWorkflowManager: React.FC<CampaignWorkflowManagerProps> = ({
  campaignBrief,
  workflowStages,
  currentStage,
  onStageProgress,
  workflowMetrics
}) => {
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  const getStageIcon = (stageType: string) => {
    switch (stageType) {
      case 'briefing': return <FileText className="w-5 h-5" />;
      case 'content_creation': return <Users className="w-5 h-5" />;
      case 'approval': return <CheckCircle className="w-5 h-5" />;
      case 'scheduling': return <Calendar className="w-5 h-5" />;
      case 'publishing': return <Play className="w-5 h-5" />;
      case 'analysis': return <BarChart3 className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const getStageStatus = (stageId: string) => {
    const currentIndex = workflowStages.findIndex(s => s.stage_id === currentStage);
    const stageIndex = workflowStages.findIndex(s => s.stage_id === stageId);
    
    if (stageIndex < currentIndex) return 'completed';
    if (stageIndex === currentIndex) return 'active';
    return 'pending';
  };

  const getStageColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100 border-green-200';
      case 'active': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'pending': return 'text-gray-600 bg-gray-100 border-gray-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const canProgressStage = (stageId: string) => {
    const status = getStageStatus(stageId);
    return status === 'active';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900">Campaign Workflow</h3>
        </div>
        
        <div className="flex items-center space-x-4 text-sm">
          <span className="text-gray-600">Progress: <span className="font-medium">{workflowMetrics.progress_percentage}%</span></span>
          <span className="text-gray-600">Pending: <span className="font-medium text-orange-600">{workflowMetrics.pending_tasks}</span></span>
          {workflowMetrics.overdue_items > 0 && (
            <span className="text-red-600">Overdue: <span className="font-medium">{workflowMetrics.overdue_items}</span></span>
          )}
        </div>
      </div>

      {/* Campaign Brief Summary */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2">{campaignBrief.campaign_name}</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-blue-700">Brand:</span>
            <span className="font-medium text-blue-900 ml-1">{campaignBrief.brand}</span>
          </div>
          <div>
            <span className="text-blue-700">Budget:</span>
            <span className="font-medium text-blue-900 ml-1">₹{campaignBrief.budget_allocation.total_budget.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-blue-700">Go Live:</span>
            <span className="font-medium text-blue-900 ml-1">{new Date(campaignBrief.timeline.go_live_date).toLocaleDateString()}</span>
          </div>
          <div>
            <span className="text-blue-700">Status:</span>
            <span className={`font-medium ml-1 ${
              campaignBrief.status === 'active' ? 'text-green-600' :
              campaignBrief.status === 'approved' ? 'text-blue-600' :
              'text-gray-600'
            }`}>
              {campaignBrief.status.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Overall Progress</span>
          <span>{workflowMetrics.progress_percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${workflowMetrics.progress_percentage}%` }}
          />
        </div>
      </div>

      {/* Workflow Stages */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Workflow Stages</h4>
        
        <div className="space-y-3">
          {workflowStages.map((stage, index) => {
            const status = getStageStatus(stage.stage_id);
            const isSelected = selectedStage === stage.stage_id;
            
            return (
              <div key={stage.stage_id} className="relative">
                <div
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedStage(isSelected ? null : stage.stage_id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg border ${getStageColor(status)}`}>
                        {getStageIcon(stage.stage_type)}
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900">{stage.stage_name}</h5>
                        <p className="text-sm text-gray-500">
                          {stage.stage_type.replace('_', ' ')} • {stage.estimated_duration}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStageColor(status)}`}>
                        {status.toUpperCase()}
                      </span>
                      
                      {canProgressStage(stage.stage_id) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onStageProgress(stage.stage_id);
                          }}
                          className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          <ArrowRight className="w-4 h-4" />
                          <span>Progress</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Stage Details (Expanded) */}
                  {isSelected && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h6 className="font-medium text-gray-900 mb-2">Dependencies</h6>
                          {stage.dependencies.length > 0 ? (
                            <ul className="text-sm text-gray-600 space-y-1">
                              {stage.dependencies.map(dep => (
                                <li key={dep}>• {dep}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-gray-500">No dependencies</p>
                          )}
                        </div>
                        
                        <div>
                          <h6 className="font-medium text-gray-900 mb-2">Required Approvals</h6>
                          {stage.required_approvals.length > 0 ? (
                            <ul className="text-sm text-gray-600 space-y-1">
                              {stage.required_approvals.map(approval => (
                                <li key={approval}>• {approval}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-gray-500">No approvals required</p>
                          )}
                        </div>
                      </div>

                      {stage.automation_triggers.length > 0 && (
                        <div className="mt-4">
                          <h6 className="font-medium text-gray-900 mb-2">Automation Triggers</h6>
                          <div className="flex flex-wrap gap-2">
                            {stage.automation_triggers.map(trigger => (
                              <span key={trigger} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                                {trigger}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Connection Line */}
                {index < workflowStages.length - 1 && (
                  <div className="flex justify-center py-2">
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Workflow Insights */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">Workflow Insights</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-blue-500" />
            <div>
              <p className="text-gray-600">Estimated Completion</p>
              <p className="font-medium text-gray-900">
                {new Date(workflowMetrics.estimated_completion).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <div>
              <p className="text-gray-600">Stages Completed</p>
              <p className="font-medium text-gray-900">
                {workflowStages.filter(s => getStageStatus(s.stage_id) === 'completed').length} / {workflowStages.length}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            <div>
              <p className="text-gray-600">Risk Level</p>
              <p className={`font-medium ${
                workflowMetrics.overdue_items > 2 ? 'text-red-600' :
                workflowMetrics.overdue_items > 0 ? 'text-yellow-600' :
                'text-green-600'
              }`}>
                {workflowMetrics.overdue_items > 2 ? 'High' :
                 workflowMetrics.overdue_items > 0 ? 'Medium' : 'Low'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignWorkflowManager;