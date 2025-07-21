// Workflow automation engine for campaign management
import { WorkflowAutomation, WorkflowAction, CampaignBrief, ContentDraft, ScheduledPost } from '../types/workflow';

export class WorkflowEngine {
  private static automations: WorkflowAutomation[] = [
    {
      automation_id: 'auto_content_reminder',
      automation_name: 'Content Submission Reminder',
      trigger_type: 'time_based',
      trigger_conditions: {
        schedule: 'daily',
        time: '09:00',
        condition: 'content_deadline_approaching'
      },
      actions: [
        {
          action_id: 'send_reminder_email',
          action_type: 'send_email',
          action_config: {
            template: 'content_deadline_reminder',
            recipients: 'influencers_with_pending_content'
          },
          execution_order: 1,
          retry_config: { max_retries: 3, retry_delay: 300 }
        },
        {
          action_id: 'send_slack_notification',
          action_type: 'send_notification',
          action_config: {
            channel: '#campaign-management',
            message: 'Content deadline approaching for {campaign_name}'
          },
          execution_order: 2,
          retry_config: { max_retries: 2, retry_delay: 60 }
        }
      ],
      is_active: true,
      execution_count: 45,
      last_executed: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      success_rate: 96.7
    },
    {
      automation_id: 'auto_approval_escalation',
      automation_name: 'Approval Escalation',
      trigger_type: 'condition_based',
      trigger_conditions: {
        condition: 'content_pending_approval_24h',
        threshold: 24
      },
      actions: [
        {
          action_id: 'escalate_to_manager',
          action_type: 'create_task',
          action_config: {
            assignee: 'campaign_manager',
            priority: 'high',
            description: 'Content approval overdue - requires immediate attention'
          },
          execution_order: 1,
          retry_config: { max_retries: 1, retry_delay: 0 }
        },
        {
          action_id: 'notify_stakeholders',
          action_type: 'send_notification',
          action_config: {
            recipients: ['campaign_manager', 'brand_manager'],
            urgency: 'high'
          },
          execution_order: 2,
          retry_config: { max_retries: 3, retry_delay: 120 }
        }
      ],
      is_active: true,
      execution_count: 12,
      last_executed: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      success_rate: 100
    },
    {
      automation_id: 'auto_post_publishing',
      automation_name: 'Automated Post Publishing',
      trigger_type: 'time_based',
      trigger_conditions: {
        schedule: 'scheduled_posts',
        check_interval: 300 // 5 minutes
      },
      actions: [
        {
          action_id: 'publish_approved_posts',
          action_type: 'api_call',
          action_config: {
            endpoint: 'social_media_api',
            method: 'POST',
            action: 'publish_post'
          },
          execution_order: 1,
          retry_config: { max_retries: 3, retry_delay: 600 }
        },
        {
          action_id: 'update_post_status',
          action_type: 'update_status',
          action_config: {
            entity: 'scheduled_post',
            status: 'published'
          },
          execution_order: 2,
          retry_config: { max_retries: 5, retry_delay: 30 }
        }
      ],
      is_active: true,
      execution_count: 234,
      last_executed: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      success_rate: 94.2
    },
    {
      automation_id: 'auto_payment_processing',
      automation_name: 'Automated Payment Processing',
      trigger_type: 'event_based',
      trigger_conditions: {
        event: 'campaign_completed',
        condition: 'all_deliverables_approved'
      },
      actions: [
        {
          action_id: 'calculate_payout',
          action_type: 'api_call',
          action_config: {
            endpoint: 'payment_calculation',
            method: 'POST'
          },
          execution_order: 1,
          retry_config: { max_retries: 2, retry_delay: 300 }
        },
        {
          action_id: 'initiate_payment',
          action_type: 'api_call',
          action_config: {
            endpoint: 'payment_gateway',
            method: 'POST',
            requires_approval: true
          },
          execution_order: 2,
          retry_config: { max_retries: 1, retry_delay: 0 }
        }
      ],
      is_active: true,
      execution_count: 67,
      last_executed: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      success_rate: 98.5
    }
  ];

  /**
   * Execute workflow automations based on triggers
   */
  static async executeAutomations(triggerType: string, context: any): Promise<{
    executed_automations: number;
    successful_executions: number;
    failed_executions: number;
    execution_results: any[];
  }> {
    const applicableAutomations = this.automations.filter(automation => 
      automation.is_active && automation.trigger_type === triggerType
    );

    const results = [];
    let successful = 0;
    let failed = 0;

    for (const automation of applicableAutomations) {
      try {
        const shouldExecute = await this.evaluateTriggerConditions(automation, context);
        
        if (shouldExecute) {
          const result = await this.executeWorkflowActions(automation, context);
          results.push(result);
          
          if (result.success) {
            successful++;
            automation.execution_count++;
            automation.last_executed = new Date().toISOString();
          } else {
            failed++;
          }
        }
      } catch (error) {
        failed++;
        results.push({
          automation_id: automation.automation_id,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return {
      executed_automations: applicableAutomations.length,
      successful_executions: successful,
      failed_executions: failed,
      execution_results: results
    };
  }

  /**
   * Create custom workflow automation
   */
  static createAutomation(automation: Omit<WorkflowAutomation, 'automation_id' | 'execution_count' | 'last_executed' | 'success_rate'>): WorkflowAutomation {
    const newAutomation: WorkflowAutomation = {
      ...automation,
      automation_id: `auto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      execution_count: 0,
      last_executed: new Date().toISOString(),
      success_rate: 0
    };

    this.automations.push(newAutomation);
    return newAutomation;
  }

  /**
   * Get all active automations
   */
  static getActiveAutomations(): WorkflowAutomation[] {
    return this.automations.filter(automation => automation.is_active);
  }

  /**
   * Update automation status
   */
  static updateAutomationStatus(automationId: string, isActive: boolean): boolean {
    const automation = this.automations.find(a => a.automation_id === automationId);
    if (automation) {
      automation.is_active = isActive;
      return true;
    }
    return false;
  }

  /**
   * Get automation performance metrics
   */
  static getAutomationMetrics(): {
    total_automations: number;
    active_automations: number;
    total_executions: number;
    avg_success_rate: number;
    executions_last_24h: number;
  } {
    const activeAutomations = this.automations.filter(a => a.is_active);
    const totalExecutions = this.automations.reduce((sum, a) => sum + a.execution_count, 0);
    const avgSuccessRate = this.automations.reduce((sum, a) => sum + a.success_rate, 0) / this.automations.length;
    
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const executionsLast24h = this.automations.filter(a => 
      new Date(a.last_executed) > last24h
    ).length;

    return {
      total_automations: this.automations.length,
      active_automations: activeAutomations.length,
      total_executions: totalExecutions,
      avg_success_rate: avgSuccessRate,
      executions_last_24h: executionsLast24h
    };
  }

  // Private helper methods
  private static async evaluateTriggerConditions(automation: WorkflowAutomation, context: any): Promise<boolean> {
    // Simulate condition evaluation
    switch (automation.trigger_type) {
      case 'time_based':
        return this.evaluateTimeBasedTrigger(automation.trigger_conditions, context);
      case 'event_based':
        return this.evaluateEventBasedTrigger(automation.trigger_conditions, context);
      case 'condition_based':
        return this.evaluateConditionBasedTrigger(automation.trigger_conditions, context);
      default:
        return false;
    }
  }

  private static evaluateTimeBasedTrigger(conditions: any, context: any): boolean {
    // Simulate time-based trigger evaluation
    const now = new Date();
    const currentTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    
    if (conditions.schedule === 'daily' && conditions.time) {
      return Math.abs(new Date(`1970-01-01T${currentTime}:00`).getTime() - new Date(`1970-01-01T${conditions.time}:00`).getTime()) < 5 * 60 * 1000; // Within 5 minutes
    }
    
    return Math.random() > 0.7; // 30% chance for simulation
  }

  private static evaluateEventBasedTrigger(conditions: any, context: any): boolean {
    // Simulate event-based trigger evaluation
    return context.event === conditions.event && Math.random() > 0.5;
  }

  private static evaluateConditionBasedTrigger(conditions: any, context: any): boolean {
    // Simulate condition-based trigger evaluation
    if (conditions.condition === 'content_pending_approval_24h') {
      return context.pending_content_hours >= conditions.threshold;
    }
    
    return Math.random() > 0.6; // 40% chance for simulation
  }

  private static async executeWorkflowActions(automation: WorkflowAutomation, context: any): Promise<any> {
    const actionResults = [];
    
    // Sort actions by execution order
    const sortedActions = automation.actions.sort((a, b) => a.execution_order - b.execution_order);
    
    for (const action of sortedActions) {
      try {
        const result = await this.executeAction(action, context);
        actionResults.push(result);
        
        if (!result.success && action.retry_config.max_retries > 0) {
          // Implement retry logic
          for (let retry = 0; retry < action.retry_config.max_retries; retry++) {
            await new Promise(resolve => setTimeout(resolve, action.retry_config.retry_delay * 1000));
            const retryResult = await this.executeAction(action, context);
            if (retryResult.success) {
              actionResults[actionResults.length - 1] = retryResult;
              break;
            }
          }
        }
      } catch (error) {
        actionResults.push({
          action_id: action.action_id,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    const allSuccessful = actionResults.every(result => result.success);
    
    return {
      automation_id: automation.automation_id,
      success: allSuccessful,
      action_results: actionResults,
      executed_at: new Date().toISOString()
    };
  }

  private static async executeAction(action: WorkflowAction, context: any): Promise<any> {
    // Simulate action execution with delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    switch (action.action_type) {
      case 'send_email':
        return this.simulateEmailSend(action.action_config);
      case 'send_notification':
        return this.simulateNotificationSend(action.action_config);
      case 'create_task':
        return this.simulateTaskCreation(action.action_config);
      case 'update_status':
        return this.simulateStatusUpdate(action.action_config);
      case 'api_call':
        return this.simulateApiCall(action.action_config);
      default:
        return { success: false, error: 'Unknown action type' };
    }
  }

  private static simulateEmailSend(config: any): any {
    return {
      action_type: 'send_email',
      success: Math.random() > 0.05, // 95% success rate
      recipients_count: Math.floor(Math.random() * 10) + 1,
      template_used: config.template
    };
  }

  private static simulateNotificationSend(config: any): any {
    return {
      action_type: 'send_notification',
      success: Math.random() > 0.02, // 98% success rate
      channel: config.channel,
      message_sent: true
    };
  }

  private static simulateTaskCreation(config: any): any {
    return {
      action_type: 'create_task',
      success: Math.random() > 0.01, // 99% success rate
      task_id: `task_${Date.now()}`,
      assignee: config.assignee
    };
  }

  private static simulateStatusUpdate(config: any): any {
    return {
      action_type: 'update_status',
      success: Math.random() > 0.03, // 97% success rate
      entity_updated: config.entity,
      new_status: config.status
    };
  }

  private static simulateApiCall(config: any): any {
    return {
      action_type: 'api_call',
      success: Math.random() > 0.1, // 90% success rate
      endpoint: config.endpoint,
      response_code: Math.random() > 0.1 ? 200 : 500
    };
  }
}

/**
 * Campaign workflow orchestrator
 */
export class CampaignWorkflowOrchestrator {
  /**
   * Initialize campaign workflow
   */
  static async initializeCampaignWorkflow(campaignBrief: CampaignBrief): Promise<{
    workflow_id: string;
    stages_created: number;
    automations_activated: number;
    estimated_completion: string;
  }> {
    // Simulate workflow initialization
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const workflowId = `workflow_${campaignBrief.campaign_id}_${Date.now()}`;
    const stagesCreated = 6; // Briefing, Content Creation, Approval, Scheduling, Publishing, Analysis
    const automationsActivated = 3; // Content reminders, approval escalation, publishing automation
    
    // Calculate estimated completion based on timeline
    const estimatedCompletion = new Date(campaignBrief.timeline.go_live_date);
    estimatedCompletion.setDate(estimatedCompletion.getDate() + 7); // Add 7 days for analysis
    
    return {
      workflow_id: workflowId,
      stages_created: stagesCreated,
      automations_activated: automationsActivated,
      estimated_completion: estimatedCompletion.toISOString()
    };
  }

  /**
   * Progress campaign to next stage
   */
  static async progressCampaignStage(
    campaignId: string, 
    currentStage: string, 
    nextStage: string
  ): Promise<{
    success: boolean;
    new_stage: string;
    automations_triggered: string[];
    next_actions: string[];
  }> {
    // Simulate stage progression
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const automationsTriggered = [];
    const nextActions = [];
    
    switch (nextStage) {
      case 'content_creation':
        automationsTriggered.push('content_submission_reminder');
        nextActions.push('Send brief to influencers', 'Set content deadlines');
        break;
      case 'approval':
        automationsTriggered.push('approval_workflow_initiation');
        nextActions.push('Assign reviewers', 'Set approval deadlines');
        break;
      case 'scheduling':
        automationsTriggered.push('scheduling_optimization');
        nextActions.push('Optimize posting times', 'Set up auto-publishing');
        break;
      case 'publishing':
        automationsTriggered.push('automated_publishing');
        nextActions.push('Monitor post performance', 'Track engagement');
        break;
    }
    
    return {
      success: true,
      new_stage: nextStage,
      automations_triggered: automationsTriggered,
      next_actions: nextActions
    };
  }

  /**
   * Get workflow status and progress
   */
  static getWorkflowStatus(campaignId: string): {
    current_stage: string;
    progress_percentage: number;
    pending_tasks: number;
    overdue_items: number;
    next_milestone: string;
    estimated_completion: string;
  } {
    // Simulate workflow status calculation
    return {
      current_stage: 'content_creation',
      progress_percentage: Math.floor(Math.random() * 60) + 20, // 20-80%
      pending_tasks: Math.floor(Math.random() * 5) + 1,
      overdue_items: Math.floor(Math.random() * 2),
      next_milestone: 'Content submission deadline',
      estimated_completion: new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString()
    };
  }
}