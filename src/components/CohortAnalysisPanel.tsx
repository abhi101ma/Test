import React from 'react';
import { Users, TrendingUp, DollarSign, Repeat, BarChart3, Info } from 'lucide-react';
import { CustomerCohort } from '../types/analytics';
import { formatCurrency } from '../utils/enhancedCalculations';
import { useSettings } from '../contexts/SettingsContext';

interface CohortAnalysisPanelProps {
  cohorts: CustomerCohort[];
  insights: {
    bestPerformingSource: string;
    avgCLV: number;
    retentionTrend: string;
    recommendations: string[];
  };
}


const CohortAnalysisPanel: React.FC<CohortAnalysisPanelProps> = ({ cohorts, insights }) => {
  const [viewMode, setViewMode] = React.useState<'heatmap' | 'curves' | 'table'>('heatmap');
  const [selectedCohort, setSelectedCohort] = React.useState<string | null>(null);
  const [hoveredCell, setHoveredCell] = React.useState<{ cohort: string; period: string } | null>(null);

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'influencer': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'organic': return 'bg-green-100 text-green-800 border-green-200';
      case 'paid_search': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'direct': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRetentionColor = (rate: number) => {
    if (rate >= 0.6) return 'text-green-600';
    if (rate >= 0.4) return 'text-yellow-600';
    return 'text-red-600';
  };

  const { settings } = useSettings();

  // Prepare data for heatmap visualization
  const prepareHeatmapData = () => {
    const periods = ['month_1', 'month_3', 'month_6', 'month_12'];
    const periodLabels = ['1M', '3M', '6M', '12M'];
    
    return cohorts.map(cohort => ({
      ...cohort,
      retentionData: periods.map((period, index) => ({
        period: periodLabels[index],
        rate: cohort.retention_rates[period as keyof typeof cohort.retention_rates],
        customers: Math.round(cohort.initial_customers * cohort.retention_rates[period as keyof typeof cohort.retention_rates])
      }))
    }));
  };

  const heatmapData = prepareHeatmapData();

  const getHeatmapColor = (rate: number) => {
    if (rate >= 0.8) return 'bg-green-500';
    if (rate >= 0.6) return 'bg-green-400';
    if (rate >= 0.4) return 'bg-yellow-400';
    if (rate >= 0.2) return 'bg-orange-400';
    return 'bg-red-400';
  };

  const getCohortColor = (index: number) => {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
    return colors[index % colors.length];
  };
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Users className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-900">Customer Cohort Analysis</h3>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-center">
            <TrendingUp className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-blue-700 font-medium">Best Source</p>
            <p className="font-semibold text-blue-900">{insights.bestPerformingSource}</p>
          </div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="text-center">
            <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-green-700 font-medium">Avg CLV</p>
            <p className="font-semibold text-green-900">{formatCurrency(insights.avgCLV, settings.defaultCurrency)}</p>
          </div>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="text-center">
            <Repeat className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <p className="text-sm text-purple-700 font-medium">Retention Trend</p>
            <p className="font-semibold text-purple-900 capitalize">{insights.retentionTrend}</p>
          </div>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
          <div className="text-center">
            <Users className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <p className="text-sm text-orange-700 font-medium">Total Cohorts</p>
            <p className="font-semibold text-orange-900">{cohorts.length}</p>
          </div>
        </div>
      </div>

      {/* Cohort Table */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Cohort Performance</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 font-medium text-gray-700">Cohort</th>
                <th className="text-left py-2 px-3 font-medium text-gray-700">Source</th>
                <th className="text-right py-2 px-3 font-medium text-gray-700">Customers</th>
                <th className="text-right py-2 px-3 font-medium text-gray-700">AOV</th>
                <th className="text-right py-2 px-3 font-medium text-gray-700">CLV</th>
                <th className="text-right py-2 px-3 font-medium text-gray-700">1M Retention</th>
                <th className="text-right py-2 px-3 font-medium text-gray-700">12M Retention</th>
              </tr>
            </thead>
            <tbody>
              {cohorts.slice(0, 10).map((cohort) => (
                <tr key={cohort.cohort_id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-3">
                    <span className="font-medium text-gray-900">{cohort.acquisition_date}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSourceColor(cohort.acquisition_source)}`}>
                      {cohort.acquisition_source}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-medium text-gray-900">
                    {cohort.initial_customers}
                  </td>
                  <td className="py-3 px-3 text-right text-gray-700">
                    ₹{cohort.avg_order_value.toFixed(0)}
                  </td>
                  <td className="py-3 px-3 text-right font-medium text-green-600">
                    {formatCurrency(cohort.customer_lifetime_value, settings.defaultCurrency)}
                  </td>
                  <td className={`py-3 px-3 text-right font-medium ${getRetentionColor(cohort.retention_rates.month_1)}`}>
                    {(cohort.retention_rates.month_1 * 100).toFixed(1)}%
                  </td>
                  <td className={`py-3 px-3 text-right font-medium ${getRetentionColor(cohort.retention_rates.month_12)}`}>
                    {(cohort.retention_rates.month_12 * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-medium text-gray-900 dark:text-gray-100">Retention Analysis</h4>
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setViewMode('heatmap')}
            className={`px-3 py-2 rounded-md font-medium transition-all text-sm ${
              viewMode === 'heatmap'
                ? 'bg-white dark:bg-gray-600 text-blue-700 dark:text-blue-300 shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            Heatmap
          </button>
          <button
            onClick={() => setViewMode('curves')}
            className={`px-3 py-2 rounded-md font-medium transition-all text-sm ${
              viewMode === 'curves'
                ? 'bg-white dark:bg-gray-600 text-blue-700 dark:text-blue-300 shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            Curves
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-2 rounded-md font-medium transition-all text-sm ${
              viewMode === 'table'
                ? 'bg-white dark:bg-gray-600 text-blue-700 dark:text-blue-300 shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            Table
          </button>
        </div>
      </div>

      {/* Heatmap View */}
      {viewMode === 'heatmap' && (
        <div className="mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Heatmap Header */}
            <div className="grid grid-cols-6 bg-gray-50 dark:bg-gray-700">
              <div className="p-3 text-sm font-medium text-gray-700 dark:text-gray-300">Cohort</div>
              <div className="p-3 text-sm font-medium text-gray-700 dark:text-gray-300 text-center">Source</div>
              <div className="p-3 text-sm font-medium text-gray-700 dark:text-gray-300 text-center">1M</div>
              <div className="p-3 text-sm font-medium text-gray-700 dark:text-gray-300 text-center">3M</div>
              <div className="p-3 text-sm font-medium text-gray-700 dark:text-gray-300 text-center">6M</div>
              <div className="p-3 text-sm font-medium text-gray-700 dark:text-gray-300 text-center">12M</div>
            </div>
            
            {/* Heatmap Body */}
            {heatmapData.slice(0, 8).map((cohort, cohortIndex) => (
              <div key={cohort.cohort_id} className="grid grid-cols-6 border-t border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <div className="p-3">
                  <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">{cohort.acquisition_date}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{cohort.initial_customers} customers</div>
                </div>
                <div className="p-3 flex justify-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSourceColor(cohort.acquisition_source)}`}>
                    {cohort.acquisition_source}
                  </span>
                </div>
                {cohort.retentionData.map((data, periodIndex) => (
                  <div 
                    key={data.period}
                    className="p-3 relative"
                    onMouseEnter={() => setHoveredCell({ cohort: cohort.cohort_id, period: data.period })}
                    onMouseLeave={() => setHoveredCell(null)}
                  >
                    <div className={`w-full h-8 rounded ${getHeatmapColor(data.rate)} flex items-center justify-center relative overflow-hidden`}>
                      <span className="text-white text-xs font-medium z-10">{(data.rate * 100).toFixed(0)}%</span>
                      <div 
                        className="absolute inset-0 bg-white bg-opacity-20"
                        style={{ width: `${(1 - data.rate) * 100}%`, right: 0 }}
                      />
                    </div>
                    
                    {/* Tooltip */}
                    {hoveredCell?.cohort === cohort.cohort_id && hoveredCell?.period === data.period && (
                      <div className="absolute z-20 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg p-2 -top-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                        <div>{(data.rate * 100).toFixed(1)}% retained</div>
                        <div>{data.customers} customers</div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
          
          {/* Heatmap Legend */}
          <div className="mt-4 flex items-center justify-center space-x-4 text-sm">
            <span className="text-gray-600 dark:text-gray-400">Retention Rate:</span>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-400 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">0-20%</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-400 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">20-40%</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-400 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">40-60%</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-400 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">60-80%</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">80%+</span>
            </div>
          </div>
        </div>
      )}

      {/* Retention Curves View */}
      {viewMode === 'curves' && (
        <div className="mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            {/* Chart Area */}
            <div className="relative h-64 mb-4">
              <svg className="w-full h-full" viewBox="0 0 400 200">
                {/* Grid Lines */}
                {[0, 25, 50, 75, 100].map(y => (
                  <line
                    key={y}
                    x1="40"
                    y1={160 - (y * 1.2)}
                    x2="380"
                    y2={160 - (y * 1.2)}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                    strokeDasharray={y === 0 ? "none" : "2,2"}
                  />
                ))}
                
                {/* Y-axis labels */}
                {[0, 25, 50, 75, 100].map(y => (
                  <text
                    key={y}
                    x="35"
                    y={165 - (y * 1.2)}
                    textAnchor="end"
                    className="text-xs fill-gray-500 dark:fill-gray-400"
                  >
                    {y}%
                  </text>
                ))}
                
                {/* X-axis labels */}
                {['1M', '3M', '6M', '12M'].map((label, index) => (
                  <text
                    key={label}
                    x={70 + (index * 80)}
                    y="185"
                    textAnchor="middle"
                    className="text-xs fill-gray-500 dark:fill-gray-400"
                  >
                    {label}
                  </text>
                ))}
                
                {/* Retention Curves */}
                {heatmapData.slice(0, 5).map((cohort, cohortIndex) => {
                  const points = cohort.retentionData.map((data, index) => ({
                    x: 70 + (index * 80),
                    y: 160 - (data.rate * 100 * 1.2)
                  }));
                  
                  const pathData = points.reduce((path, point, index) => {
                    return path + (index === 0 ? `M ${point.x} ${point.y}` : ` L ${point.x} ${point.y}`);
                  }, '');
                  
                  return (
                    <g key={cohort.cohort_id}>
                      {/* Line */}
                      <path
                        d={pathData}
                        fill="none"
                        stroke={getCohortColor(cohortIndex)}
                        strokeWidth="2"
                        className={selectedCohort === cohort.cohort_id ? 'opacity-100' : selectedCohort ? 'opacity-30' : 'opacity-80'}
                      />
                      
                      {/* Data Points */}
                      {points.map((point, pointIndex) => (
                        <circle
                          key={pointIndex}
                          cx={point.x}
                          cy={point.y}
                          r="4"
                          fill={getCohortColor(cohortIndex)}
                          className={`cursor-pointer ${selectedCohort === cohort.cohort_id ? 'opacity-100' : selectedCohort ? 'opacity-30' : 'opacity-80'}`}
                          onMouseEnter={() => setSelectedCohort(cohort.cohort_id)}
                          onMouseLeave={() => setSelectedCohort(null)}
                        />
                      ))}
                    </g>
                  );
                })}
              </svg>
            </div>
            
            {/* Chart Legend */}
            <div className="flex flex-wrap gap-4 justify-center">
              {heatmapData.slice(0, 5).map((cohort, index) => (
                <div 
                  key={cohort.cohort_id}
                  className={`flex items-center space-x-2 cursor-pointer p-2 rounded ${
                    selectedCohort === cohort.cohort_id ? 'bg-gray-100 dark:bg-gray-700' : ''
                  }`}
                  onMouseEnter={() => setSelectedCohort(cohort.cohort_id)}
                  onMouseLeave={() => setSelectedCohort(null)}
                >
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getCohortColor(index) }}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {cohort.acquisition_date} ({cohort.acquisition_source})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Cohort</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Source</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Initial</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">1M Retention</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">3M Retention</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">6M Retention</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">12M Retention</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">CLV</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800">
                {cohorts.slice(0, 10).map((cohort, index) => (
                  <tr key={cohort.cohort_id} className="border-t border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">{cohort.acquisition_date}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSourceColor(cohort.acquisition_source)}`}>
                        {cohort.acquisition_source}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-gray-900 dark:text-gray-100">{cohort.initial_customers}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <span className={`font-medium ${getRetentionColor(cohort.retention_rates.month_1)}`}>
                          {(cohort.retention_rates.month_1 * 100).toFixed(1)}%
                        </span>
                        <div className="w-12 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${cohort.retention_rates.month_1 * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <span className={`font-medium ${getRetentionColor(cohort.retention_rates.month_3)}`}>
                          {(cohort.retention_rates.month_3 * 100).toFixed(1)}%
                        </span>
                        <div className="w-12 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${cohort.retention_rates.month_3 * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <span className={`font-medium ${getRetentionColor(cohort.retention_rates.month_6)}`}>
                          {(cohort.retention_rates.month_6 * 100).toFixed(1)}%
                        </span>
                        <div className="w-12 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-yellow-500 rounded-full"
                            style={{ width: `${cohort.retention_rates.month_6 * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <span className={`font-medium ${getRetentionColor(cohort.retention_rates.month_12)}`}>
                          {(cohort.retention_rates.month_12 * 100).toFixed(1)}%
                        </span>
                        <div className="w-12 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-red-500 rounded-full"
                            style={{ width: `${cohort.retention_rates.month_12 * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-green-600 dark:text-green-400">
                      {formatCurrency(cohort.customer_lifetime_value, settings.defaultCurrency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Recommendations */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Strategic Recommendations</h4>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          {insights.recommendations.map((rec, index) => (
            <li key={index}>• {rec}</li>
          ))}
        </ul>
      </div>

      {/* Analytics Insights */}
      <div className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
        <div className="flex items-center space-x-2 mb-3">
          <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h4 className="font-medium text-purple-900 dark:text-purple-100">Cohort Analysis Insights</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-medium text-purple-700 dark:text-purple-300">Retention Pattern</p>
            <p className="text-purple-600 dark:text-purple-400">
              {insights.retentionTrend === 'stable' ? 'Healthy retention across periods' : 'Declining retention needs attention'}
            </p>
          </div>
          <div>
            <p className="font-medium text-purple-700 dark:text-purple-300">Best Acquisition Channel</p>
            <p className="text-purple-600 dark:text-purple-400">
              {insights.bestPerformingSource} delivers highest CLV
            </p>
          </div>
          <div>
            <p className="font-medium text-purple-700 dark:text-purple-300">Optimization Opportunity</p>
            <p className="text-purple-600 dark:text-purple-400">
              Focus on {cohorts.filter(c => c.retention_rates.month_1 < 0.5).length > 0 ? 'early retention' : 'long-term engagement'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CohortAnalysisPanel;