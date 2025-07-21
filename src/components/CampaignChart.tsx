import React from 'react';
import { BarChart3, TrendingUp, Calendar } from 'lucide-react';

interface CampaignData {
  campaign: string;
  revenue: number;
  spend: number;
  roas: number;
  orders: number;
}

interface CampaignChartProps {
  data: CampaignData[];
}

const CampaignChart: React.FC<CampaignChartProps> = ({ data }) => {
  const maxRevenue = Math.max(...data.map(d => d.revenue));
  const maxROAS = Math.max(...data.map(d => d.roas));

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-blue-500" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Campaign Performance</h3>
        </div>
        <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span className="hidden sm:inline">Last 30 days</span>
        </div>
      </div>

      <div className="space-y-6">
        {data.map((campaign, index) => (
          <div key={campaign.campaign} className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-800 text-sm sm:text-base truncate">{campaign.campaign}</h4>
              <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm">
                <span className="text-green-600 font-medium hidden sm:inline">
                  ₹{campaign.revenue.toLocaleString()}
                </span>
                <span className="text-blue-600 font-medium">
                  {campaign.roas.toFixed(1)}x ROAS
                </span>
                <span className="text-gray-500 hidden md:inline">
                  {campaign.orders} orders
                </span>
              </div>
            </div>
            
            {/* Revenue Bar */}
            <div className="relative">
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500"
                  style={{ width: `${(campaign.revenue / maxRevenue) * 100}%` }}
                />
              </div>
            </div>
            
            {/* ROAS Indicator */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Spend: ₹{campaign.spend.toLocaleString()}</span>
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-3 h-3" />
                <span>{((campaign.roas / maxROAS) * 100).toFixed(0)}% of best ROAS</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampaignChart;