import React, { useState } from 'react';
import { CheckCircle, XCircle, MessageSquare, Clock, Eye, Download, Upload } from 'lucide-react';

interface ContentDraft {
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
}

interface ApprovalComment {
  comment_id: string;
  user_name: string;
  comment: string;
  timestamp: string;
  comment_type: 'approval' | 'revision' | 'rejection' | 'general';
}

interface ContentApprovalProps {
  drafts: ContentDraft[];
  onApprove: (draftId: string, comments?: string) => void;
  onReject: (draftId: string, reason: string) => void;
  onRequestRevision: (draftId: string, feedback: string) => void;
  onAddComment: (draftId: string, comment: string) => void;
}

const ContentApproval: React.FC<ContentApprovalProps> = ({
  drafts,
  onApprove,
  onReject,
  onRequestRevision,
  onAddComment
}) => {
  const [selectedDraft, setSelectedDraft] = useState<ContentDraft | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [newComment, setNewComment] = useState('');
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'revise' | null>(null);
  const [actionComment, setActionComment] = useState('');

  const filteredDrafts = drafts.filter(draft => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return draft.status === 'pending' || draft.status === 'revision_requested';
    return draft.status === activeTab;
  });

  const getStatusColor = (status: ContentDraft['status']) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100 border-green-200';
      case 'rejected': return 'text-red-600 bg-red-100 border-red-200';
      case 'revision_requested': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'pending': return 'text-blue-600 bg-blue-100 border-blue-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status: ContentDraft['status']) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'revision_requested': return <MessageSquare className="w-4 h-4 text-yellow-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-blue-500" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const handleAction = () => {
    if (!selectedDraft || !actionType) return;

    switch (actionType) {
      case 'approve':
        onApprove(selectedDraft.draft_id, actionComment);
        break;
      case 'reject':
        onReject(selectedDraft.draft_id, actionComment);
        break;
      case 'revise':
        onRequestRevision(selectedDraft.draft_id, actionComment);
        break;
    }

    setActionType(null);
    setActionComment('');
    setSelectedDraft(null);
  };

  const handleAddComment = () => {
    if (!selectedDraft || !newComment.trim()) return;
    
    onAddComment(selectedDraft.draft_id, newComment);
    setNewComment('');
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Content Approval</h3>
        
        {/* Status Filter Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { id: 'pending', label: 'Pending', count: drafts.filter(d => d.status === 'pending' || d.status === 'revision_requested').length },
            { id: 'approved', label: 'Approved', count: drafts.filter(d => d.status === 'approved').length },
            { id: 'rejected', label: 'Rejected', count: drafts.filter(d => d.status === 'rejected').length },
            { id: 'all', label: 'All', count: drafts.length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2 rounded-md font-medium transition-all text-sm ${
                activeTab === tab.id
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content List */}
        <div className="lg:col-span-1 space-y-4 order-2 lg:order-1">
          <h4 className="font-medium text-gray-900">Content Drafts</h4>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredDrafts.map(draft => (
              <div
                key={draft.draft_id}
                onClick={() => setSelectedDraft(draft)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedDraft?.draft_id === draft.draft_id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{draft.influencer_name}</span>
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(draft.status)}`}>
                    {getStatusIcon(draft.status)}
                    <span>{draft.status.replace('_', ' ').toUpperCase()}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{draft.post_type}</p>
                <p className="text-xs text-gray-500">
                  Submitted: {new Date(draft.submission_date).toLocaleDateString()}
                </p>
                
                {/* Compliance Indicators */}
                <div className="flex space-x-2 mt-2">
                  <span className={`w-2 h-2 rounded-full ${draft.compliance_check.has_disclosure ? 'bg-green-500' : 'bg-red-500'}`} title="Disclosure" />
                  <span className={`w-2 h-2 rounded-full ${draft.compliance_check.brand_guidelines_met ? 'bg-green-500' : 'bg-red-500'}`} title="Brand Guidelines" />
                  <span className={`w-2 h-2 rounded-full ${draft.compliance_check.content_appropriate ? 'bg-green-500' : 'bg-red-500'}`} title="Content Appropriate" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Detail */}
        <div className="lg:col-span-2 order-1 lg:order-2">
          {selectedDraft ? (
            <div className="space-y-6">
              {/* Content Preview */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">Content Preview</h4>
                  <div className="flex space-x-2">
                    <button className="flex items-center space-x-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Eye className="w-4 h-4" />
                      <span>Preview</span>
                    </button>
                    <button className="flex items-center space-x-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>

                {/* Content Display */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    {selectedDraft.thumbnail_url ? (
                      <img
                        src={selectedDraft.thumbnail_url}
                        alt="Content preview"
                        className="w-full h-48 object-cover rounded-lg border border-gray-200"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                        <Upload className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Caption</h5>
                    <p className="text-sm text-gray-700 mb-4">{selectedDraft.caption}</p>
                    
                    <h5 className="font-medium text-gray-900 mb-2">Hashtags</h5>
                    <div className="flex flex-wrap gap-1">
                      {selectedDraft.hashtags.map(hashtag => (
                        <span key={hashtag} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                          #{hashtag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Compliance Check */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Compliance Check</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className={`p-3 rounded-lg border ${selectedDraft.compliance_check.has_disclosure ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="text-center">
                      <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${selectedDraft.compliance_check.has_disclosure ? 'bg-green-500' : 'bg-red-500'}`}>
                        {selectedDraft.compliance_check.has_disclosure ? <CheckCircle className="w-5 h-5 text-white" /> : <XCircle className="w-5 h-5 text-white" />}
                      </div>
                      <p className="text-sm font-medium">Disclosure</p>
                      <p className="text-xs text-gray-600">{selectedDraft.compliance_check.has_disclosure ? 'Present' : 'Missing'}</p>
                    </div>
                  </div>
                  
                  <div className={`p-3 rounded-lg border ${selectedDraft.compliance_check.brand_guidelines_met ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="text-center">
                      <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${selectedDraft.compliance_check.brand_guidelines_met ? 'bg-green-500' : 'bg-red-500'}`}>
                        {selectedDraft.compliance_check.brand_guidelines_met ? <CheckCircle className="w-5 h-5 text-white" /> : <XCircle className="w-5 h-5 text-white" />}
                      </div>
                      <p className="text-sm font-medium">Brand Guidelines</p>
                      <p className="text-xs text-gray-600">{selectedDraft.compliance_check.brand_guidelines_met ? 'Met' : 'Not Met'}</p>
                    </div>
                  </div>
                  
                  <div className={`p-3 rounded-lg border ${selectedDraft.compliance_check.content_appropriate ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="text-center">
                      <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${selectedDraft.compliance_check.content_appropriate ? 'bg-green-500' : 'bg-red-500'}`}>
                        {selectedDraft.compliance_check.content_appropriate ? <CheckCircle className="w-5 h-5 text-white" /> : <XCircle className="w-5 h-5 text-white" />}
                      </div>
                      <p className="text-sm font-medium">Content Quality</p>
                      <p className="text-xs text-gray-600">{selectedDraft.compliance_check.content_appropriate ? 'Appropriate' : 'Issues Found'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {selectedDraft.status === 'pending' && (
                <div className="flex space-x-3">
                  <button
                    onClick={() => setActionType('approve')}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => setActionType('revise')}
                    className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Request Revision</span>
                  </button>
                  <button
                    onClick={() => setActionType('reject')}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                </div>
              )}

              {/* Action Modal */}
              {actionType && (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h4 className="font-medium text-gray-900 mb-3">
                    {actionType === 'approve' ? 'Approve Content' :
                     actionType === 'reject' ? 'Reject Content' : 'Request Revision'}
                  </h4>
                  <textarea
                    value={actionComment}
                    onChange={(e) => setActionComment(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
                    rows={3}
                    placeholder={
                      actionType === 'approve' ? 'Add approval comments (optional)' :
                      actionType === 'reject' ? 'Explain reason for rejection' :
                      'Provide specific feedback for revision'
                    }
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleAction}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => {
                        setActionType(null);
                        setActionComment('');
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Comments Section */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Comments & Feedback</h4>
                
                {/* Existing Comments */}
                <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                  {selectedDraft.approval_comments.map(comment => (
                    <div key={comment.comment_id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">{comment.user_name}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.comment}</p>
                    </div>
                  ))}
                </div>

                {/* Add New Comment */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add a comment..."
                  />
                  <button
                    onClick={handleAddComment}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Upload className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Select Content to Review</h4>
              <p className="text-gray-500">Choose a content draft from the list to review and approve.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentApproval;