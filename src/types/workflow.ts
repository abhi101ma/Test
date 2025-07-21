// Enterprise workflow and campaign management types
export interface CampaignBrief {
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
  status: 'draft' | 'approved' | 'active' | 'completed';
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ContentDraft {
  draft_id: string;
  influencer_id: string;
  influencer_name: string;
  campaign_id: string;
  post_type: string;
  content_url: string;
  thumbnail_url?: string;
  caption: string;
  hashtags: string[];
  submission_date: string;
  status: 'pending' | 'approved' | 'rejected' | 'revision_requested';
  approval_comments: ApprovalComment[];
  estimated_reach: number;
  compliance_check: {
    has_disclosure: boolean;
    brand_guidelines_met: boolean;
    content_appropriate: boolean;
  };
  approval_workflow: {
    current_stage: 'content_review' | 'legal_review' | 'final_approval';
    assigned_reviewer: string;
    deadline: string;
  };
}

export interface ApprovalComment {
  comment_id: string;
  user_name: string;
  comment: string;
  timestamp: string;
  comment_type: 'approval' | 'revision' | 'rejection' | 'general';
}

export interface ScheduledPost {
  post_id: string;
  influencer_id: string;
  influencer_name: string;
  campaign_id: string;
  post_type: string;
  content_title: string;
  scheduled_date: string;
  scheduled_time: string;
  platform: string;
  status: 'scheduled' | 'published' | 'failed' | 'cancelled';
  estimated_reach: number;
  priority: 'high' | 'medium' | 'low';
  approval_status: 'approved' | 'pending' | 'rejected';
  auto_publish: boolean;
  reminder_sent: boolean;
  published_url?: string;
  failure_reason?: string;
  publishing_workflow: {
    pre_publish_checks: string[];
    post_publish_actions: string[];
    rollback_plan: string;
  };
}

export interface WorkflowAutomation {
  automation_id: string;
  automation_name: string;
  trigger_type: 'time_based' | 'event_based' | 'condition_based';
  trigger_conditions: any;
  actions: WorkflowAction[];
  is_active: boolean;
  execution_count: number;
  last_executed: string;
  success_rate: number;
}

export interface WorkflowAction {
  action_id: string;
  action_type: 'send_notification' | 'update_status' | 'create_task' | 'send_email' | 'api_call';
  action_config: any;
  execution_order: number;
  retry_config: {
    max_retries: number;
    retry_delay: number;
  };
}

export interface PaymentWorkflow {
  workflow_id: string;
  payout_id: string;
  influencer_id: string;
  amount: number;
  currency: string;
  status: 'initiated' | 'processing' | 'completed' | 'failed' | 'cancelled';
  workflow_steps: PaymentStep[];
  current_step: number;
  estimated_completion: string;
  failure_reason?: string;
  retry_count: number;
}

export interface PaymentStep {
  step_id: string;
  step_name: string;
  step_type: 'validation' | 'approval' | 'processing' | 'confirmation';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  assigned_to?: string;
  completed_at?: string;
  notes?: string;
}

export interface CampaignWorkflowTemplate {
  template_id: string;
  template_name: string;
  description: string;
  workflow_stages: WorkflowStage[];
  estimated_duration: string;
  required_roles: string[];
  automation_rules: WorkflowAutomation[];
}

export interface WorkflowStage {
  stage_id: string;
  stage_name: string;
  stage_type: 'briefing' | 'content_creation' | 'approval' | 'scheduling' | 'publishing' | 'analysis';
  dependencies: string[];
  estimated_duration: string;
  required_approvals: string[];
  automation_triggers: string[];
}