import React, { useState } from 'react';
import { Calendar, Target, DollarSign, Users, TrendingUp, Play, Pause, CheckCircle, FileText, Clock, Settings } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import CampaignBriefing from '../components/CampaignBriefing';
import ContentApproval from '../components/ContentApproval';
import CampaignScheduling from '../components/CampaignScheduling';
import CampaignWorkflowManager from '../components/CampaignWorkflowManager';
import { campaigns, trackingData, payouts, influencers } from '../data/mockData';
import { calculateROAS, formatCurrency } from '../utils/calculations';
import { WorkflowStage } from '../types/workflow';

const Campaigns: React.FC = () => {
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [activeWorkflowTab, setActiveWorkflowTab] = useState<'overview' | 'briefing' | 'approval' | 'scheduling' | 'workflow'>('overview');
  const [showBriefingModal, setShowBriefingModal] = useState(false);

  // Mock data for workflow components
  const [contentDrafts] = useState([
    {
      draft_id: 'draft_001',
      influencer_id: 'inf001',
      influencer_name: 'Fitness Guru Raj',
      campaign_id: 'camp001',
      post_type: 'Reel',
      content_url: 'https://example.com/draft1.mp4',
      thumbnail_url: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      caption: 'Just tried the new MuscleBlaze protein! Amazing results! 💪 #MuscleBlaze #Fitness',
      hashtags: ['MuscleBlaze', 'Fitness', 'Protein', 'Workout'],
      submission_date: '2024-01-25',
      status: 'pending' as const,
      approval_comments: [],
      estimated_reach: 45000,
      compliance_check: {
        has_disclosure: true,
        brand_guidelines_met: true,
        content_appropriate: true
      }
    },
    {
      draft_id: 'draft_002',
      influencer_id: 'inf002',
      influencer_name: 'Health Maven Priya',
      campaign_id: 'camp002',
      post_type: 'YouTube Video',
      content_url: 'https://example.com/draft2.mp4',
      caption: 'Complete review of HKVitals immunity supplements - everything you need to know!',
      hashtags: ['HKVitals', 'Health', 'Immunity', 'Review'],
      submission_date: '2024-01-24',
      status: 'approved' as const,
      approval_comments: [
        {
          comment_id: 'comment_001',
          user_name: 'Campaign Manager',
          comment: 'Great content! Approved for publishing.',
          timestamp: '2024-01-25T10:30:00Z',
          comment_type: 'approval' as const
        }
      ],
      estimated_reach: 32000,
      compliance_check: {
        has_disclosure: true,
        brand_guidelines_met: true,
        content_appropriate: true
      }
    }
  ]);

  const [scheduledPosts] = useState([
    {
      post_id: 'sched_001',
      influencer_id: 'inf001',
      influencer_name: 'Fitness Guru Raj',
      campaign_id: 'camp001',
      post_type: 'Reel',
      content_title: 'MuscleBlaze Protein Review',
      scheduled_date: '2024-02-01',
      scheduled_time: '10:00',
      platform: 'Instagram',
      status: 'scheduled' as const,
      estimated_reach: 45000,
      priority: 'high' as const,
      approval_status: 'approved' as const,
      auto_publish: true,
      reminder_sent: false
    },
    {
      post_id: 'sched_002',
      influencer_id: 'inf002',
      influencer_name: 'Health Maven Priya',
      campaign_id: 'camp002',
      post_type: 'YouTube Video',
      content_title: 'HKVitals Complete Review',
      scheduled_date: '2024-02-02',
      scheduled_time: '15:00',
      platform: 'YouTube',
      status: 'published' as const,
      estimated_reach: 32000,
      priority: 'medium' as const,
      approval_status: 'approved' as const,
      auto_publish: false,
      reminder_sent: true,
      published_url: 'https://youtube.com/watch?v=example'
    }
  ]);

  // Mock workflow stages for campaign workflow management
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
      automation_triggers: ['content_deadline_reminder']
    },
    {
      stage_id: 'stage_approval',
      stage_name: 'Content Approval',
      stage_type: 'approval',
      dependencies: ['stage_content_creation'],
      estimated_duration: '3 days',
      required_approvals: ['content_manager'],
      automation_triggers: ['approval_escalation']
    }
  ];

  const campaignsWithMetrics = campaigns.map(campaign => {
    const campaignTracking = trackingData.filter(t => t.campaign === campaign.name);
    const campaignPayouts = payouts.filter(p => p.campaign === campaign.name);
    const metrics = calculateROAS(campaignTracking, campaignPayouts);
    
    // Get influencers for this campaign
    const campaignInfluencers = new Set(campaignTracking.map(t => t.influencerId));
    
    return {
      ...campaign,
      metrics,
      influencerCount: campaignInfluencers.size,
      progress: campaign.status === 'completed' ? 100 : 
                campaign.status === 'active' ? 75 : 25
    };
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Play className="w-4 h-4 text-green-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'paused':
        return <Pause className="w-4 h-4 text-yellow-500" />;
      default:
        return <Calendar className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const selectedCampaignData = selectedCampaign 
    ? campaignsWithMetrics.find(c => c.id === selectedCampaign)
    : null;

  const handleSaveBrief = (brief: any) => {
    console.log('Saving campaign brief:', brief);
    setShowBriefingModal(false);
    // In a real app, this would save to the database
  };

  const handleApproveContent = (draftId: string, comments?: string) => {
    console.log('Approving content:', draftId, comments);
    // In a real app, this would update the content status
  };

  const handleRejectContent = (draftId: string, reason: string) => {
    console.log('Rejecting content:', draftId, reason);
    // In a real app, this would update the content status
  };

  const handleRequestRevision = (draftId: string, feedback: string) => {
    console.log('Requesting revision:', draftId, feedback);
    // In a real app, this would update the content status
  };

  const handleAddComment = (draftId: string, comment: string) => {
    console.log('Adding comment:', draftId, comment);
    // In a real app, this would add the comment to the database
  };

  const handleSchedulePost = (post: any) => {
    console.log('Scheduling post:', post);
    // In a real app, this would create a scheduled post
  };

  const handleUpdateSchedule = (postId: string, updates: any) => {
    console.log('Updating schedule:', postId, updates);
    // In a real app, this would update the scheduled post
  };

  const handleCancelSchedule = (postId: string) => {
    console.log('Cancelling schedule:', postId);
    // In a real app, this would cancel the scheduled post
  };

  const handlePublishNow = (postId: string) => {
    console.log('Publishing now:', postId);
    // In a real app, this would immediately publish the post
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Campaign Management</h1>
        <p className="text-gray-600">Monitor and analyze campaign performance</p>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <MetricCard
          title="Active Campaigns"
          value={campaigns.filter(c => c.status === 'active').length}
          icon={<Play className="w-6 h-6" />}
          color="green"
        />
        <MetricCard
          title="Total Budget"
          value={campaigns.reduce((sum, c) => sum + c.budget, 0)}
          format="currency"
          icon={<DollarSign className="w-6 h-6" />}
          color="blue"
        />
        <MetricCard
          title="Avg ROAS"
          value={campaignsWithMetrics.reduce((sum, c) => sum + c.metrics.roas, 0) / campaignsWithMetrics.length}
          icon={<TrendingUp className="w-6 h-6" />}
          color="purple"
        />
        <MetricCard
          title="Total Influencers"
          value={new Set(trackingData.map(t => t.influencerId)).size}
          icon={<Users className="w-6 h-6" />}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Campaign List */}
        <div className="xl:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">All Campaigns</h2>
          
          {campaignsWithMetrics.map((campaign) => (
            <div
              key={campaign.id}
              className={`bg-white rounded-xl border-2 p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedCampaign === campaign.id 
                  ? 'border-blue-500 shadow-md' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => {
                console.log('Campaign clicked:', campaign.id);
                setSelectedCampaign(campaign.id);
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{campaign.name}</h3>
                  <p className="text-sm text-gray-500">{campaign.brand} • {campaign.objective}</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  {getStatusIcon(campaign.status)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                    {campaign.status}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{campaign.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${campaign.progress}%` }}
                  />
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                <div>
                  <p className="text-xs text-gray-500">Revenue</p>
                  <p className="font-semibold text-green-600">
                    {formatCurrency(campaign.metrics.totalRevenue)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">ROAS</p>
                  <p className="font-semibold text-blue-600">
                    {campaign.metrics.roas.toFixed(1)}x
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Orders</p>
                  <p className="font-semibold text-purple-600">
                    {campaign.metrics.orders}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Influencers</p>
                  <p className="font-semibold text-orange-600">
                    {campaign.influencerCount}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Campaign Details */}
        <div className="space-y-6">
          {selectedCampaignData ? (
            <>
              {/* Workflow Tabs */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="flex flex-wrap border-b border-gray-200 overflow-x-auto">
                  {[
                    { id: 'overview', label: 'Overview', icon: Target },
                    { id: 'briefing', label: 'Briefing', icon: FileText },
                    { id: 'approval', label: 'Content Approval', icon: CheckCircle },
                    { id: 'scheduling', label: 'Scheduling', icon: Clock },
                    { id: 'workflow', label: 'Workflow', icon: Settings }
                  ].map(tab => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveWorkflowTab(tab.id as any)}
                        className={`flex items-center space-x-2 px-4 sm:px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                          activeWorkflowTab === tab.id
                            ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="p-6">
                  {/* Overview Tab */}
                  {activeWorkflowTab === 'overview' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Campaign Details</h3>
                        <button
                          onClick={() => setShowBriefingModal(true)}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Create Brief</span>
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-gray-500">Campaign Name</p>
                            <p className="font-medium text-gray-900">{selectedCampaignData.name}</p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Start Date</p>
                              <p className="font-medium text-gray-900">
                                {new Date(selectedCampaignData.startDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">End Date</p>
                              <p className="font-medium text-gray-900">
                                {new Date(selectedCampaignData.endDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-500">Budget</p>
                            <p className="font-medium text-gray-900">{formatCurrency(selectedCampaignData.budget)}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-500">Objective</p>
                            <p className="font-medium text-gray-900">{selectedCampaignData.objective}</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900">Workflow Status</h4>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                              <span className="text-green-700">Brief Created</span>
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            </div>
                            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                              <span className="text-yellow-700">Content Pending</span>
                              <Clock className="w-5 h-5 text-yellow-500" />
                            </div>
                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <span className="text-blue-700">Posts Scheduled</span>
                              <Calendar className="w-5 h-5 text-blue-500" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Briefing Tab */}
                  {activeWorkflowTab === 'briefing' && (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">Campaign Brief</h4>
                      <p className="text-gray-500 mb-4">Create and manage campaign briefs for influencers</p>
                      <button
                        onClick={() => setShowBriefingModal(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Create Campaign Brief</span>
                      </button>
                    </div>
                  )}

                  {/* Content Approval Tab */}
                  {activeWorkflowTab === 'approval' && (
                    <ContentApproval
                      drafts={contentDrafts}
                      onApprove={handleApproveContent}
                      onReject={handleRejectContent}
                      onRequestRevision={handleRequestRevision}
                      onAddComment={handleAddComment}
                    />
                  )}

                  {/* Scheduling Tab */}
                  {activeWorkflowTab === 'scheduling' && (
                    <CampaignScheduling
                      scheduledPosts={scheduledPosts}
                      onSchedulePost={handleSchedulePost}
                      onUpdateSchedule={handleUpdateSchedule}
                      onCancelSchedule={handleCancelSchedule}
                      onPublishNow={handlePublishNow}
                    />
                  )}

                  {/* Workflow Management Tab */}
                  {activeWorkflowTab === 'workflow' && selectedCampaignData && (
                    <CampaignWorkflowManager
                      campaignBrief={{
                        campaign_id: selectedCampaignData.id,
                        campaign_name: selectedCampaignData.name,
                        brand: selectedCampaignData.brand,
                        product_focus: 'Whey Protein',
                        campaign_objectives: [selectedCampaignData.objective],
                        target_audience: {
                          age_range: '25-34',
                          gender: 'All',
                          interests: ['Fitness', 'Nutrition'],
                          locations: ['Mumbai', 'Delhi']
                        },
                        key_messages: ['Quality protein', 'Proven results'],
                        content_requirements: {
                          post_types: ['Reel', 'Static Post'],
                          content_themes: ['Product Demo'],
                          mandatory_elements: ['Brand logo'],
                          prohibited_elements: ['Competitor mentions']
                        },
                        budget_allocation: {
                          total_budget: selectedCampaignData.budget,
                          influencer_fees: selectedCampaignData.budget * 0.6,
                          content_creation: selectedCampaignData.budget * 0.2,
                          promotion_budget: selectedCampaignData.budget * 0.2
                        },
                        timeline: {
                          brief_deadline: selectedCampaignData.startDate,
                          content_submission: selectedCampaignData.endDate,
                          approval_deadline: selectedCampaignData.endDate,
                          go_live_date: selectedCampaignData.endDate
                        },
                        success_metrics: ['Reach', 'Engagement'],
                        additional_notes: '',
                        status: selectedCampaignData.status === 'active' ? 'active' : 'draft',
                        created_by: 'campaign_manager',
                        created_at: selectedCampaignData.startDate,
                        updated_at: selectedCampaignData.startDate
                      }}
                      workflowStages={mockWorkflowStages}
                      currentStage="stage_content_creation"
                      onStageProgress={(stageId) => console.log('Progress stage:', stageId)}
                      workflowMetrics={{
                        progress_percentage: selectedCampaignData.progress,
                        pending_tasks: 3,
                        overdue_items: 1,
                        estimated_completion: selectedCampaignData.endDate
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Performance Metrics */}
              {activeWorkflowTab === 'overview' && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Revenue</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(selectedCampaignData.metrics.totalRevenue)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Spend</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(selectedCampaignData.metrics.totalSpend)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">ROAS</span>
                    <span className="font-semibold text-blue-600">
                      {selectedCampaignData.metrics.roas.toFixed(2)}x
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Incremental ROAS</span>
                    <span className="font-semibold text-purple-600">
                      {selectedCampaignData.metrics.incrementalROAS.toFixed(2)}x
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cost per Order</span>
                    <span className="font-semibold text-orange-600">
                      {formatCurrency(selectedCampaignData.metrics.costPerOrder)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Conversion Rate</span>
                    <span className="font-semibold text-gray-900">
                      {selectedCampaignData.metrics.conversionRate.toFixed(2)}%
                    </span>
                  </div>
                </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Campaign</h3>
                <p className="text-gray-500">Choose a campaign from the list to view detailed metrics and insights.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Campaign Briefing Modal */}
      <CampaignBriefing
        campaignId={selectedCampaign || undefined}
        isOpen={showBriefingModal}
        onSave={handleSaveBrief}
        onCancel={() => setShowBriefingModal(false)}
      />
    </div>
  );
};

export default Campaigns;