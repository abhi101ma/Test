import React from 'react';
import PayoutTracker from '../components/PayoutTracker';
import MetricCard from '../components/MetricCard';
import { useSettings } from '../contexts/SettingsContext';
import { DollarSign, TrendingUp, Clock, CheckCircle, CreditCard, AlertCircle } from 'lucide-react';
import { payouts, influencers } from '../data/mockData'; // Keep this import
import { formatCurrency } from '../utils/calculations';
import { PaymentGatewayAPI } from '../lib/paymentGatewayApi';
import { AccountingSoftwareAPI } from '../lib/accountingSoftwareApi';

const Payouts: React.FC = () => {
  const [payoutsBeingProcessed, setPayoutsBeingProcessed] = React.useState<Set<string>>(new Set());
  const [paymentResults, setPaymentResults] = React.useState<{ [key: string]: any }>({});
  const { settings } = useSettings();

  const totalPayouts = payouts.reduce((sum, p) => sum + p.totalPayout, 0);
  const pendingPayouts = payouts.filter(p => p.status === 'pending');
  const processingPayouts = payouts.filter(p => p.status === 'processing');
  const paidPayouts = payouts.filter(p => p.status === 'paid');

  const avgPayoutPerInfluencer = totalPayouts / new Set(payouts.map(p => p.influencerId)).size;

  // Payment method breakdown
  const postBasedPayouts = payouts.filter(p => p.basis === 'post');
  const orderBasedPayouts = payouts.filter(p => p.basis === 'order');

  const postBasedTotal = postBasedPayouts.reduce((sum, p) => sum + p.totalPayout, 0);
  const orderBasedTotal = orderBasedPayouts.reduce((sum, p) => sum + p.totalPayout, 0);

  const handleProcessPayout = async (payout: any) => {
    setPayoutsBeingProcessed(prev => new Set(prev).add(payout.id));
    
    try {
      // Simulate payment processing
      const paymentRequest = {
        payout_id: payout.id,
        recipient_id: payout.influencerId,
        amount: payout.totalPayout,
        currency: 'INR',
        payment_method: 'bank_transfer' as const,
        recipient_details: {
          account_number: '1234567890',
          ifsc_code: 'HDFC0001234',
          account_holder_name: 'Influencer Name',
          bank_name: 'HDFC Bank'
        },
        description: `Influencer payout for campaign ${payout.campaign}`
      };

      // Process payment via gateway
      const paymentResult = await PaymentGatewayAPI.processRazorpayPayout(paymentRequest);
      
      if (paymentResult.status === 'success') {
        // Log expense in accounting software
        const expenseEntry = AccountingSoftwareAPI.createPayoutExpenseEntry(
          payout.id,
          payout.influencerId,
          payout.campaign,
          payout.totalPayout,
          `Influencer payout for ${payout.campaign}`
        );
        
        const accountingResult = await AccountingSoftwareAPI.logZohoBooksExpense(expenseEntry);
        
        setPaymentResults(prev => ({
          ...prev,
          [payout.id]: {
            payment: paymentResult,
            accounting: accountingResult,
            status: 'success'
          }
        }));
      } else {
        setPaymentResults(prev => ({
          ...prev,
          [payout.id]: {
            payment: paymentResult,
            status: 'failed'
          }
        }));
      }
    } catch (error) {
      console.error('Payout processing failed:', error);
      setPaymentResults(prev => ({
        ...prev,
        [payout.id]: {
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }));
    } finally {
      setPayoutsBeingProcessed(prev => {
        const newSet = new Set(prev);
        newSet.delete(payout.id);
        return newSet;
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payout Management</h1>
        <p className="text-gray-600">Track and manage influencer payments</p>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <MetricCard
          title="Total Payouts"
          value={totalPayouts} // MetricCard uses its own formatCurrency
          format="currency"
          change={8.5}
          icon={<DollarSign className="w-6 h-6" />}
          color="green"
        />
        <MetricCard
          title="Pending Payments"
          value={pendingPayouts.reduce((sum, p) => sum + p.totalPayout, 0)} // MetricCard uses its own formatCurrency
          format="currency"
          icon={<Clock className="w-6 h-6" />}
          color="orange"
        />
        <MetricCard
          title="Processing"
          value={processingPayouts.reduce((sum, p) => sum + p.totalPayout, 0)} // MetricCard uses its own formatCurrency
          format="currency"
          icon={<TrendingUp className="w-6 h-6" />}
          color="blue"
        />
        <MetricCard
          title="Completed"
          value={paidPayouts.reduce((sum, p) => sum + p.totalPayout, 0)} // MetricCard uses its own formatCurrency
          format="currency"
          icon={<CheckCircle className="w-6 h-6" />}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Payout Tracker */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                <h3 className="text-lg font-semibold text-gray-900">Enhanced Payout Tracker</h3>
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <CreditCard className="w-4 h-4" />
                <span>Bulk Process</span>
              </button>
            </div>

            {/* Payout List with Actions */}
            <div className="space-y-3">
              {payouts.slice(0, 8).map((payout) => {
                const isProcessing = payoutsBeingProcessed.has(payout.id);
                const result = paymentResults[payout.id];
                
                return (
                  <div
                    key={payout.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-medium text-gray-900">{payout.campaign}</p>
                        <p className="text-sm text-gray-500">
                          {payout.basis === 'post' ? 'Per Post' : 'Per Order'} • {payout.orders} orders
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatCurrency(payout.totalPayout, settings.defaultCurrency)}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          payout.status === 'paid' ? 'bg-green-100 text-green-800' :
                          payout.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {payout.status}
                        </span>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2">
                        {payout.status === 'pending' && !isProcessing && !result && (
                          <button
                            onClick={() => handleProcessPayout(payout)}
                            className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                          >
                            <CreditCard className="w-4 h-4" />
                            <span>Process Payment</span>
                          </button>
                        )}
                        
                        {isProcessing && (
                          <div className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg">
                            <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
                            <span className="text-sm">Processing...</span>
                          </div>
                        )}
                        
                        {result && (
                          <div className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm ${
                            result.status === 'success' ? 'bg-green-100 text-green-700' :
                            result.status === 'failed' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {result.status === 'success' ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <AlertCircle className="w-4 h-4" />
                            )}
                            <span>
                              {result.status === 'success' ? 'Processed' :
                               result.status === 'failed' ? 'Failed' : 'Error'}
                            </span>
                          </div>
                        )}
                        
                        {result && payout.status === 'pending' && (
                          <div className="flex items-center space-x-1 px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span>Status Conflict - Check System</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Payment Analytics */}
        <div className="space-y-6">
          {/* Payment Method Breakdown */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method Breakdown</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Per Post</p>
                  <p className="text-sm text-gray-600">{postBasedPayouts.length} payments</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-blue-600">{formatCurrency(postBasedTotal, settings.defaultCurrency)}</p>
                  <p className="text-xs text-gray-500">
                    {((postBasedTotal / totalPayouts) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Per Order</p>
                  <p className="text-sm text-gray-600">{orderBasedPayouts.length} payments</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{formatCurrency(orderBasedTotal, settings.defaultCurrency)}</p>
                  <p className="text-xs text-gray-500">
                    {((orderBasedTotal / totalPayouts) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Top Earners */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Earners</h3>
            
            <div className="space-y-3">
              {influencers
                .map(influencer => {
                  const influencerPayouts = payouts.filter(p => p.influencerId === influencer.id);
                  const totalEarned = influencerPayouts.reduce((sum, p) => sum + p.totalPayout, 0);
                  return { influencer, totalEarned, payoutCount: influencerPayouts.length };
                })
                .filter(item => item.totalEarned > 0)
                .sort((a, b) => b.totalEarned - a.totalEarned)
                .slice(0, 5)
                .map((item, index) => (
                  <div key={item.influencer.id} className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <span className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                        {index + 1}
                      </span>
                    </div>
                    <img
                      src={item.influencer.profileImage}
                      alt={item.influencer.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.influencer.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.payoutCount} payment{item.payoutCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900"> {/* Use formatCurrency here */}
                        {formatCurrency(item.totalEarned, settings.defaultCurrency)}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Avg per Influencer</span>
                <span className="font-semibold text-gray-900"> {/* Use formatCurrency here */}
                  {formatCurrency(avgPayoutPerInfluencer, settings.defaultCurrency)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Total Influencers Paid</span>
                <span className="font-semibold text-gray-900">
                  {new Set(payouts.map(p => p.influencerId)).size}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Success Rate</span>
                <span className="font-semibold text-green-600">
                  {(((paidPayouts.length + processingPayouts.length) / payouts.length) * 100).toFixed(1)}%
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Processing Time</span>
                <span className="font-semibold text-gray-900">2.3 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payouts;