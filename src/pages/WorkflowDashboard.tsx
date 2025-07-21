import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  FileText, 
  CreditCard, 
  BarChart3, 
  CheckCircle, 
  Clock,
  AlertTriangle,
  Settings,
  Play,
  Users
} from 'lucide-react';
import EnhancedMetricCard from '../components/EnhancedMetricCard';
import WorkflowAutomationPanel from '../components/WorkflowAutomationPanel';
import CampaignWorkflowManager from '../components/CampaignWorkflowManager';
import PaymentWorkflowTracker from '../components/PaymentWorkflowTracker';
import { WorkflowEngine, CampaignWorkflowOrchestrator } from '../utils/workflowAutomation';
import { 
  WorkflowAutomation, 
  CampaignBrief, 
  WorkflowStage, 
  PaymentWorkflow,
  PaymentStep
} from '../types/workflow';
import { useSettings } from '../contexts/SettingsContext';

const WorkflowDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'automations' | 'campaigns' | 'payments'>('overview');
  const [automations, setAutomations] = useState<WorkflowAutomation[]>([]);
  const [automationMetrics, setAutomationMetrics] = useState<any>({});
  const [paymentWorkflows, setPaymentWorkflows] = useState<PaymentWorkflow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { settings } = useSettings();

  // Mock campaign brief and workflow data
  const mockCampaignBrief: CampaignBrief = {
    campaign_id: 'camp_001',
    campaign_name: 'MuscleBlaze Protein Launch Q2',
    brand: 'MuscleBlaze',
    product_focus: 'Whey Protein Gold',
    campaign_objectives: ['Product Launch', 'Brand Awareness', 'Sales Drive'],
    target_audience: {
      age_range: '25-34',
      gender: 'All',
      interests: ['Fitness', 'Bodybuilding', 'Nutrition'],
      locations: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai']
    },
    key_messages: ['Premium quality protein', 'Scientifically proven results', 'Trusted by athletes'],
    content_requirements: {
      post_types: ['Reel', 'Static Post', 'YouTube Video'],
      content_themes: ['Product Demo', 'Transformation Stories', 'Expert Reviews'],
      mandatory_elements: ['Product visibility', 'Brand logo', 'Discount code'],
      prohibited_elements: ['Competitor mentions', 'Medical claims', 'Inappropriate content']
    },
    budget_allocation: {
      total_budget: 500000,
      influencer_fees: 300000,
      content_creation: 100000,
      promotion_budget: 100000
    },
    timeline: {
      brief_deadline: '2024-02-15',
      content_submission: '2024-02-28',
      approval_deadline: '2024-03-05',
      go_live_date: '2024-03-10'
    },
    success_metrics: ['Reach', 'Engagement Rate', 'Conversions', 'Brand Mention Sentiment'],
    additional_notes: 'Focus on authentic testimonials and transformation stories',
    status: 'active',
    created_by: 'campaign_manager',
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z'
  };

  const mockWorkflowStages: WorkflowStage[] = [
    {
      stage_id: 'stage_briefing',
      stage_name: 'Campaign Briefing',
      stage_type: 'briefing',
      dependencies: [],
      estimated_duration: '2 days',
      required_approvals: ['brand_manager'],
      automation_triggers: ['brief_creation_notification']
    },
    {
      stage_id: 'stage_content_creation',
      stage_name: 'Content Creation',
      stage_type: 'content_creation',
      dependencies: ['stage_briefing'],
      estimated_duration: '7 days',
      required_approvals: [],
      automation_triggers: ['content_deadline_reminder', 'submission_notification']
    },
    {
      stage_id: 'stage_approval',
      stage_name: 'Content Approval',
      stage_type: 'approval',
      dependencies: ['stage_content_creation'],
      estimated_duration: '3 days',
      required_approvals: ['content_manager', 'legal_team'],
      automation_triggers: ['approval_escalation', 'approval_notification']
    },
    {
      stage_id: 'stage_scheduling',
      stage_name: 'Content Scheduling',
      stage_type: 'scheduling',
      dependencies: ['stage_approval'],
      estimated_duration: '1 day',
      required_approvals: [],
      automation_triggers: ['scheduling_optimization', 'publish_reminder']
    },
    {
      stage_id: 'stage_publishing',
      stage_name: 'Content Publishing',
      stage_type: 'publishing',
      dependencies: ['stage_scheduling'],
      estimated_duration: '5 days',
      required_approvals: [],
      automation_triggers: ['automated_publishing', 'performance_monitoring']
    },
    {
      stage_id: 'stage_analysis',
      stage_name: 'Performance Analysis',
      stage_type: 'analysis',
      dependencies: ['stage_publishing'],
      estimated_duration: '3 days',
      required_approvals: [],
      automation_triggers: ['report_generation', 'payout_calculation']
    }
  ];

  useEffect(() => {
    const loadWorkflowData = async () => {
      setIsLoading(true);
      
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Load workflow automations
      const activeAutomations = WorkflowEngine.getActiveAutomations();
      const metrics = WorkflowEngine.getAutomationMetrics();
      
      // Generate mock payment workflows
      const mockPaymentWorkflows: PaymentWorkflow[] = [
        {
          workflow_id: 'pay_workflow_001',
          payout_id: 'pay_001',
          influencer_id: 'inf_001',
          amount: 25000,
          currency: 'INR',
          status: 'processing',
          workflow_steps: [
            {
              step_id: 'step_validation',
              step_name: 'Bank Details Validation',
              step_type: 'validation',
              status: 'completed',
              completed_at: '2024-02-01T10:00:00Z'
            },
            {
              step_id: 'step_approval',
              step_name: 'Finance Team Approval',
              step_type: 'approval',
              status: 'in_progress',
              assigned_to: 'finance_manager'
            },
            {
              step_id: 'step_processing',
              step_name: 'Payment Processing',
              step_type: 'processing',
              status: 'pending'
            },
            {
              step_id: 'step_confirmation',
              step_name: 'Payment Confirmation',
              step_type: 'confirmation',
              status: 'pending'
            }
          ],
          current_step: 2,
          estimated_completion: '2024-02-03T15:00:00Z',
          retry_count: 0
        },
        {
          workflow_id: 'pay_workflow_002',
          payout_id: 'pay_002',
          influencer_id: 'inf_002',
          amount: 15000,
          currency: 'INR',
          status: 'completed',
          workflow_steps: [
            {
              step_id: 'step_validation',
              step_name: 'Bank Details Validation',
              step_type: 'validation',
              status: 'completed',
              completed_at: '2024-01-30T09:00:00Z'
            },
            {
              step_id: 'step_approval',
              step_name: 'Finance Team Approval',
              step_type: 'approval',
              status: 'completed',
              completed_at: '2024-01-30T14:00:00Z'
            },
            {
              step_id: 'step_processing',
              step_name: 'Payment Processing',
              step_type: 'processing',
              status: 'completed',
              completed_at: '2024-01-31T10:00:00Z'
            },
            {
              step_id: 'step_confirmation',
              step_name: 'Payment Confirmation',
              step_type: 'confirmation',
              status: 'completed',
              completed_at: '2024-01-31T10:30:00Z'
            }
          ],
          current_step: 4,
          estimated_completion: '2024-01-31T10:30:00Z',
          retry_count: 0
        }
      ];
      
      setAutomations(activeAutomations);
      setAutomationMetrics(metrics);
      setPaymentWorkflows(mockPaymentWorkflows);
      setIsLoading(false);
    };

    loadWorkflowData();
  }, []);

  const handleToggleAutomation = (automationId: string, isActive: boolean) => {
    WorkflowEngine.updateAutomationStatus(automationId, isActive);
    setAutomations(WorkflowEngine.getActiveAutomations());
    setAutomationMetrics(WorkflowEngine.getAutomationMetrics());
  };

  const handleCreateAutomation = (automationData: any) => {
    const newAutomation = WorkflowEngine.createAutomation({
      ...automationData,
      actions: [
        {
          action_id: 'default_action',
          action_type: 'send_notification',
          action_config: { message: 'Automation triggered' },
          execution_order: 1,
          retry_config: { max_retries: 3, retry_delay: 60 }
        }
      ],
      is_active: true
    });
    
    setAutomations(WorkflowEngine.getActiveAutomations());
    setAutomationMetrics(WorkflowEngine.getAutomationMetrics());
  };

  const handleStageProgress = async (stageId: string) => {
    const currentIndex = mockWorkflowStages.findIndex(s => s.stage_id === stageId);
    const nextStage = mockWorkflowStages[currentIndex + 1];
    
    if (nextStage) {
      const result = await CampaignWorkflowOrchestrator.progressCampaignStage(
        mockCampaignBrief.campaign_id,
        stageId,
        nextStage.stage_id
      );
      
      console.log('Stage progression result:', result);
      // In a real app, this would update the campaign state
    }
  };

  const handleRetryPayment = (workflowId: string) => {
    setPaymentWorkflows(prev => prev.map(workflow => 
      workflow.workflow_id === workflowId 
        ? { ...workflow, status: 'processing', retry_count: workflow.retry_count + 1 }
        : workflow
    ));
  };

  const handleCancelPayment = (workflowId: string) => {
    setPaymentWorkflows(prev => prev.map(workflow => 
      workflow.workflow_id === workflowId 
        ? { ...workflow, status: 'cancelled' }
        : workflow
    ));
  };

  const handleApproveStep = (workflowId: string, stepId: string) => {
    setPaymentWorkflows(prev => prev.map(workflow => {
      if (workflow.workflow_id === workflowId) {
        const updatedSteps = workflow.workflow_steps.map(step => 
          step.step_id === stepId 
            ? { ...step, status: 'completed' as const, completed_at: new Date().toISOString() }
            : step
        );
        
        const nextStep = updatedSteps.find(step => step.status === 'pending');
        if (nextStep) {
          nextStep.status = 'in_progress';
        }
        
        return {
          ...workflow,
          workflow_steps: updatedSteps,
          current_step: workflow.current_step + 1
        };
      }
      return workflow;
    }));
  };

  // Calculate workflow metrics
  const workflowMetrics = CampaignWorkflowOrchestrator.getWorkflowStatus(mockCampaignBrief.campaign_id);
  
  const totalWorkflows = 1; // Number of active campaign workflows
  const automatedTasks = automationMetrics.total_executions || 0;
  const avgProcessingTime = 2.3; // hours
  const workflowEfficiency = 94.2; // percentage

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Workflow Data</h2>
          <p className="text-gray-600">Initializing campaign management workflows...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 rounded-xl p-8 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Zap className="w-8 h-8" />
          <div>
            <h1 className="text-3xl font-bold">Enterprise Workflow Management</h1>
            <p className="text-purple-100">Automated campaign workflows, content approval, and payment processing</p>
          </div>
        </div>
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Campaign Workflow Automation</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>Content Approval System</span>
          </div>
          <div className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4" />
            <span>Payment Processing Workflows</span>
          </div>
        </div>
      </div>

      {/* Workflow KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <EnhancedMetricCard
          title="Active Workflows"
          value={totalWorkflows}
          change={25.0}
          icon={<Play className="w-6 h-6" />}
          color="blue"
          subtitle="Campaign workflows"
          confidence={98}
          tooltip="Number of active campaign workflows being managed"
        />
        <EnhancedMetricCard
          title="Automated Tasks"
          value={automatedTasks}
          change={45.3}
          icon={<Zap className="w-6 h-6" />}
          color="purple"
          subtitle="Tasks completed automatically"
          confidence={95}
          tooltip="Total number of tasks completed through automation"
        />
        <EnhancedMetricCard
          title="Avg Processing Time"
          value={avgProcessingTime}
          format="number"
          change={-18.2}
          icon={<Clock className="w-6 h-6" />}
          color="green"
          subtitle="Hours per workflow"
          confidence={92}
          tooltip="Average time to complete workflow from start to finish"
        />
        <EnhancedMetricCard
          title="Workflow Efficiency"
          value={workflowEfficiency}
          format="percentage"
          change={12.8}
          icon={<BarChart3 className="w-6 h-6" />}
          color="orange"
          subtitle="Success rate"
          confidence={97}
          tooltip="Percentage of workflows completed without manual intervention"
        />
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-1 bg-gray-100 rounded-lg p-1 overflow-x-auto">
        {[
          { id: 'overview', label: 'Workflow Overview', icon: BarChart3 },
          { id: 'automations', label: 'Automation Engine', icon: Zap },
          { id: 'campaigns', label: 'Campaign Workflows', icon: FileText },
          { id: 'payments', label: 'Payment Workflows', icon: CreditCard }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 px-2 sm:px-4 py-3 rounded-md font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Workflow Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Workflow Status Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold text-gray-900">Campaign Workflows</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Campaigns</span>
                  <span className="font-medium text-blue-600">1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Progress</span>
                  <span className="font-medium text-green-600">{workflowMetrics.progress_percentage}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending Tasks</span>
                  <span className="font-medium text-orange-600">{workflowMetrics.pending_tasks}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="w-5 h-5 text-purple-500" />
                <h3 className="font-semibold text-gray-900">Automation Status</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Automations</span>
                  <span className="font-medium text-purple-600">{automationMetrics.active_automations}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Success Rate</span>
                  <span className="font-medium text-green-600">{automationMetrics.avg_success_rate?.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last 24h Runs</span>
                  <span className="font-medium text-blue-600">{automationMetrics.executions_last_24h}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <CreditCard className="w-5 h-5 text-green-500" />
                <h3 className="font-semibold text-gray-900">Payment Workflows</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Payments</span>
                  <span className="font-medium text-green-600">{paymentWorkflows.filter(w => w.status === 'processing').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed Today</span>
                  <span className="font-medium text-blue-600">{paymentWorkflows.filter(w => w.status === 'completed').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Success Rate</span>
                  <span className="font-medium text-green-600">
                    {paymentWorkflows.length > 0 ? 
                      ((paymentWorkflows.filter(w => w.status === 'completed').length / paymentWorkflows.length) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Workflow Activity</h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <p className="font-medium text-blue-900">Content approval completed</p>
                  <p className="text-sm text-blue-700">MuscleBlaze campaign - 3 posts approved</p>
                </div>
                <span className="text-xs text-blue-600">2 hours ago</span>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <Zap className="w-5 h-5 text-green-600" />
                <div className="flex-1">
                  <p className="font-medium text-green-900">Automation executed successfully</p>
                  <p className="text-sm text-green-700">Content deadline reminder sent to 5 influencers</p>
                </div>
                <span className="text-xs text-green-600">4 hours ago</span>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <CreditCard className="w-5 h-5 text-purple-600" />
                <div className="flex-1">
                  <p className="font-medium text-purple-900">Payment workflow initiated</p>
                  <p className="text-sm text-purple-700">₹25,000 payment to Influencer 001</p>
                </div>
                <span className="text-xs text-purple-600">6 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Automation Engine Tab */}
      {activeTab === 'automations' && (
        <WorkflowAutomationPanel
          automations={automations}
          onToggleAutomation={handleToggleAutomation}
          onCreateAutomation={handleCreateAutomation}
          metrics={automationMetrics}
        />
      )}

      {/* Campaign Workflows Tab */}
      {activeTab === 'campaigns' && (
        <CampaignWorkflowManager
          campaignBrief={mockCampaignBrief}
          workflowStages={mockWorkflowStages}
          currentStage="stage_content_creation"
          onStageProgress={handleStageProgress}
          workflowMetrics={workflowMetrics}
        />
      )}

      {/* Payment Workflows Tab */}
      {activeTab === 'payments' && (
        <PaymentWorkflowTracker
          paymentWorkflows={paymentWorkflows}
          onRetryPayment={handleRetryPayment}
          onCancelPayment={handleCancelPayment}
          onApproveStep={handleApproveStep}
        />
      )}

      {/* Workflow Efficiency Summary */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-6">
        <h3 className="text-lg font-semibold text-indigo-900 mb-4">Workflow Efficiency Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium text-indigo-800 mb-3">Time Savings</h4>
            <ul className="text-sm text-indigo-700 space-y-2">
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Automated reminders save 15 hours/week</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Approval workflows reduce delays by 60%</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Payment automation eliminates manual errors</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-indigo-800 mb-3">Quality Improvements</h4>
            <ul className="text-sm text-indigo-700 space-y-2">
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Consistent approval process across all campaigns</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Automated compliance checks reduce risks</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Standardized workflows improve consistency</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-indigo-800 mb-3">Operational Benefits</h4>
            <ul className="text-sm text-indigo-700 space-y-2">
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Real-time visibility into all workflows</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Automated escalation prevents bottlenecks</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Integrated payment processing streamlines payouts</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowDashboard;