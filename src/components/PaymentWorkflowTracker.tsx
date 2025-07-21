import React, { useState } from 'react';
import { 
  CreditCard, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  DollarSign,
  ArrowRight,
  RefreshCw,
  X
} from 'lucide-react';
import { PaymentWorkflow, PaymentStep } from '../types/workflow';
import { useSettings } from '../contexts/SettingsContext';

interface PaymentWorkflowTrackerProps {
  paymentWorkflows: PaymentWorkflow[];
  onRetryPayment: (workflowId: string) => void;
  onCancelPayment: (workflowId: string) => void;
  onApproveStep: (workflowId: string, stepId: string) => void;
}

const PaymentWorkflowTracker: React.FC<PaymentWorkflowTrackerProps> = ({
  paymentWorkflows,
  onRetryPayment,
  onCancelPayment,
  onApproveStep
}) => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);

  const { settings } = useSettings();
  const getStatusColor = (status: PaymentWorkflow['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100 border-green-200';
      case 'processing': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'failed': return 'text-red-600 bg-red-100 border-red-200';
      case 'cancelled': return 'text-gray-600 bg-gray-100 border-gray-200';
      case 'initiated': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStepStatusIcon = (status: PaymentStep['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in_progress': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'failed': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-gray-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStepTypeIcon = (stepType: PaymentStep['step_type']) => {
    switch (stepType) {
      case 'validation': return <CheckCircle className="w-4 h-4" />;
      case 'approval': return <CheckCircle className="w-4 h-4" />;
      case 'processing': return <CreditCard className="w-4 h-4" />;
      case 'confirmation': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate summary metrics
  const totalPayments = paymentWorkflows.length;
  const completedPayments = paymentWorkflows.filter(w => w.status === 'completed').length;
  const processingPayments = paymentWorkflows.filter(w => w.status === 'processing').length;
  const failedPayments = paymentWorkflows.filter(w => w.status === 'failed').length;
  const totalAmount = paymentWorkflows.reduce((sum, w) => sum + w.amount, 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <CreditCard className="w-5 h-5 text-green-500" />
        <h3 className="text-lg font-semibold text-gray-900">Payment Workflow Tracker</h3>
      </div>

      {/* Payment Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
          <DollarSign className="w-6 h-6 text-blue-600 mx-auto mb-1" />
          <p className="text-sm text-blue-700">Total Amount</p>
          <p className="font-semibold text-blue-900">{formatCurrency(totalAmount, settings.defaultCurrency)}</p>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
          <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-1" />
          <p className="text-sm text-green-700">Completed</p>
          <p className="font-semibold text-green-900">{completedPayments}</p>
        </div>
        <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <Clock className="w-6 h-6 text-yellow-600 mx-auto mb-1" />
          <p className="text-sm text-yellow-700">Processing</p>
          <p className="font-semibold text-yellow-900">{processingPayments}</p>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
          <AlertTriangle className="w-6 h-6 text-red-600 mx-auto mb-1" />
          <p className="text-sm text-red-700">Failed</p>
          <p className="font-semibold text-red-900">{failedPayments}</p>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
          <CreditCard className="w-6 h-6 text-purple-600 mx-auto mb-1" />
          <p className="text-sm text-purple-700">Success Rate</p>
          <p className="font-semibold text-purple-900">
            {totalPayments > 0 ? ((completedPayments / totalPayments) * 100).toFixed(1) : 0}%
          </p>
        </div>
      </div>

      {/* Payment Workflows */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Active Payment Workflows</h4>
        
        {paymentWorkflows.map(workflow => (
          <div key={workflow.workflow_id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-blue-500" />
                <div>
                  <h5 className="font-medium text-gray-900">
                    Payment to Influencer {workflow.influencer_id.slice(-3)}
                  </h5>
                  <p className="text-sm text-gray-500">
                    {formatCurrency(workflow.amount)} • {workflow.currency}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(workflow.status)}`}>
                  {workflow.status.toUpperCase()}
                </span>
                
                {workflow.status === 'failed' && (
                  <button
                    onClick={() => onRetryPayment(workflow.workflow_id)}
                    className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Retry</span>
                  </button>
                )}
                
                {(workflow.status === 'initiated' || workflow.status === 'processing') && (
                  <button
                    onClick={() => onCancelPayment(workflow.workflow_id)}
                    className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                )}
              </div>
            </div>

            {/* Workflow Steps */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h6 className="font-medium text-gray-900">Workflow Progress</h6>
                <span className="text-sm text-gray-500">
                  Step {workflow.current_step} of {workflow.workflow_steps.length}
                </span>
              </div>
              
              <div className="space-y-2">
                {workflow.workflow_steps.map((step, index) => (
                  <div key={step.step_id} className="flex items-center space-x-3">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                      step.status === 'completed' ? 'bg-green-100 border-green-500' :
                      step.status === 'in_progress' ? 'bg-blue-100 border-blue-500' :
                      step.status === 'failed' ? 'bg-red-100 border-red-500' :
                      'bg-gray-100 border-gray-300'
                    }`}>
                      {getStepStatusIcon(step.status)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{step.step_name}</span>
                        <span className="text-xs text-gray-500 capitalize">{step.step_type}</span>
                      </div>
                      
                      {step.assigned_to && (
                        <p className="text-sm text-gray-500">Assigned to: {step.assigned_to}</p>
                      )}
                      
                      {step.notes && (
                        <p className="text-sm text-gray-600 mt-1">{step.notes}</p>
                      )}
                    </div>
                    
                    {step.status === 'pending' && step.step_type === 'approval' && (
                      <button
                        onClick={() => onApproveStep(workflow.workflow_id, step.step_id)}
                        className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors"
                      >
                        Approve
                      </button>
                    )}
                    
                    {index < workflow.workflow_steps.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Workflow Details */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Estimated Completion:</span>
                  <span className="font-medium text-gray-900 ml-1">
                    {new Date(workflow.estimated_completion).toLocaleDateString('en-US', { timeZone: settings.timeZone })}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Retry Count:</span>
                  <span className="font-medium text-gray-900 ml-1">{workflow.retry_count}</span>
                </div>
                {workflow.failure_reason && (
                  <div>
                    <span className="text-gray-500">Failure Reason:</span>
                    <span className="font-medium text-red-600 ml-1">{workflow.failure_reason}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Workflow Insights */}
      <div className="mt-6 bg-green-50 rounded-lg p-4 border border-green-200">
        <h4 className="font-medium text-green-900 mb-2">Payment Workflow Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-green-700">Average Processing Time:</p>
            <p className="font-medium text-green-900">2.3 hours</p>
          </div>
          <div>
            <p className="text-green-700">Most Common Delay:</p>
            <p className="font-medium text-green-900">Manual approval steps</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentWorkflowTracker;