import React from 'react';
import { DollarSign, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Payout } from '../types';
import { formatCurrency } from '../utils/enhancedCalculations'; // Use enhanced calculations
import { useSettings } from '../contexts/SettingsContext';

interface PayoutTrackerProps {
  payouts: Payout[];
}

const PayoutTracker: React.FC<PayoutTrackerProps> = ({ payouts }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalPending = payouts
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.totalPayout, 0);

  const totalProcessing = payouts
    .filter(p => p.status === 'processing')
    .reduce((sum, p) => sum + p.totalPayout, 0);

  const totalPaid = payouts
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.totalPayout, 0);

  const { settings } = useSettings();
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <DollarSign className="w-5 h-5 text-green-500" />
        <h3 className="text-lg font-semibold text-gray-900">Payout Tracker</h3>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600">Pending</p>
              <p className="text-lg font-semibold text-red-700">{formatCurrency(totalPending, settings.defaultCurrency)}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600">Processing</p>
              <p className="text-lg font-semibold text-yellow-700">{formatCurrency(totalProcessing, settings.defaultCurrency)}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Paid</p>
              <p className="text-lg font-semibold text-green-700">{formatCurrency(totalPaid, settings.defaultCurrency)}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Payout List */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-800 mb-3">Recent Payouts</h4>
        {payouts.slice(0, 5).map((payout) => (
          <div
            key={payout.id}
            className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              {getStatusIcon(payout.status)}
              <div>
                <p className="font-medium text-gray-900">{payout.campaign}</p>
                <p className="text-sm text-gray-500">
                  {payout.basis === 'post' ? 'Per Post' : 'Per Order'} • {payout.orders} orders
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="font-semibold text-gray-900">{formatCurrency(payout.totalPayout, settings.defaultCurrency)}</p>
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(payout.status)}`}>
                {payout.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PayoutTracker;