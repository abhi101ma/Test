import React, { useState } from 'react';
import { Database, Download, RefreshCw, Settings, BarChart3, Users } from 'lucide-react';
import { MarketingDataGenerator, DataGenerationConfig, defaultConfig } from '../data/dataGenerator';

interface DataGeneratorPanelProps {
  onDataGenerated: (data: any) => void;
}

const DataGeneratorPanel: React.FC<DataGeneratorPanelProps> = ({ onDataGenerated }) => {
  const [config, setConfig] = useState<DataGenerationConfig>(defaultConfig);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<any>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate generation time for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const generatedData = MarketingDataGenerator.generateCompleteDataset(config);
      setLastGenerated(generatedData);
      onDataGenerated(generatedData);
      
      // Show success message
      alert(`Successfully generated:
• ${generatedData.summary.totalInfluencers} influencers
• ${generatedData.summary.totalCampaigns} campaigns  
• ${generatedData.summary.totalPosts} posts
• ${generatedData.summary.totalOrders} orders
• ${generatedData.summary.totalPayouts} payouts

Total Revenue: ₹${generatedData.summary.totalRevenue.toLocaleString()}
Total Spend: ₹${generatedData.summary.totalSpend.toLocaleString()}`);
      
    } catch (error) {
      console.error('Data generation failed:', error);
      alert('Failed to generate data. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportData = () => {
    if (!lastGenerated) {
      alert('No data to export. Generate data first.');
      return;
    }

    const dataToExport = {
      ...lastGenerated,
      generatedAt: new Date().toISOString(),
      config: config
    };

    const jsonString = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const date = new Date().toISOString().split('T')[0];
    const a = document.createElement('a');
    a.href = url;
    a.download = `marketing_analytics_data_${date}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleConfigChange = (key: keyof DataGenerationConfig, value: number) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const presetConfigs = {
    small: { influencerCount: 15, campaignCount: 8, postsPerInfluencer: 5, ordersPerPost: 2, timeRangeMonths: 3 },
    medium: { influencerCount: 30, campaignCount: 15, postsPerInfluencer: 8, ordersPerPost: 3, timeRangeMonths: 6 },
    large: { influencerCount: 50, campaignCount: 25, postsPerInfluencer: 12, ordersPerPost: 5, timeRangeMonths: 12 },
    enterprise: { influencerCount: 100, campaignCount: 50, postsPerInfluencer: 20, ordersPerPost: 8, timeRangeMonths: 18 }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Database className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-900">Marketing Data Generator</h3>
      </div>

      {/* Quick Presets */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Quick Presets</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(presetConfigs).map(([name, preset]) => (
            <button
              key={name}
              onClick={() => setConfig(preset)}
              className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              <div className="font-medium text-gray-900 capitalize">{name}</div>
              <div className="text-xs text-gray-500">
                {preset.influencerCount} influencers
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Configuration */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-900">Configuration</h4>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
          >
            <Settings className="w-4 h-4" />
            <span>{showAdvanced ? 'Hide' : 'Show'} Advanced</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Influencers
            </label>
            <input
              type="number"
              value={config.influencerCount}
              onChange={(e) => handleConfigChange('influencerCount', Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="5"
              max="200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaigns
            </label>
            <input
              type="number"
              value={config.campaignCount}
              onChange={(e) => handleConfigChange('campaignCount', Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="3"
              max="100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Posts per Influencer
            </label>
            <input
              type="number"
              value={config.postsPerInfluencer}
              onChange={(e) => handleConfigChange('postsPerInfluencer', Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
              max="50"
            />
          </div>

          {showAdvanced && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Orders per Post
                </label>
                <input
                  type="number"
                  value={config.ordersPerPost}
                  onChange={(e) => handleConfigChange('ordersPerPost', Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  max="20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Range (Months)
                </label>
                <input
                  type="number"
                  value={config.timeRangeMonths}
                  onChange={(e) => handleConfigChange('timeRangeMonths', Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                  max="24"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Estimated Output */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2">Estimated Output</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <Users className="w-4 h-4 text-blue-600 mb-1" />
            <p className="text-blue-700">Influencers</p>
            <p className="font-semibold text-blue-900">{config.influencerCount}</p>
          </div>
          <div>
            <BarChart3 className="w-4 h-4 text-blue-600 mb-1" />
            <p className="text-blue-700">Posts</p>
            <p className="font-semibold text-blue-900">~{config.influencerCount * config.postsPerInfluencer}</p>
          </div>
          <div>
            <Database className="w-4 h-4 text-blue-600 mb-1" />
            <p className="text-blue-700">Orders</p>
            <p className="font-semibold text-blue-900">~{config.influencerCount * config.postsPerInfluencer * config.ordersPerPost}</p>
          </div>
          <div>
            <RefreshCw className="w-4 h-4 text-blue-600 mb-1" />
            <p className="text-blue-700">Data Points</p>
            <p className="font-semibold text-blue-900">~{(config.influencerCount * config.postsPerInfluencer * config.ordersPerPost * 1.5).toFixed(0)}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-3">
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          <span>{isGenerating ? 'Generating...' : 'Generate Data'}</span>
        </button>

        {lastGenerated && (
          <button
            onClick={handleExportData}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON</span>
          </button>
        )}
      </div>

      {/* Last Generated Summary */}
      {lastGenerated && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="font-medium text-green-900 mb-2">Last Generated Dataset</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div>
              <p className="text-green-700">Influencers</p>
              <p className="font-semibold text-green-900">{lastGenerated.summary.totalInfluencers}</p>
            </div>
            <div>
              <p className="text-green-700">Campaigns</p>
              <p className="font-semibold text-green-900">{lastGenerated.summary.totalCampaigns}</p>
            </div>
            <div>
              <p className="text-green-700">Posts</p>
              <p className="font-semibold text-green-900">{lastGenerated.summary.totalPosts}</p>
            </div>
            <div>
              <p className="text-green-700">Orders</p>
              <p className="font-semibold text-green-900">{lastGenerated.summary.totalOrders}</p>
            </div>
            <div>
              <p className="text-green-700">Revenue</p>
              <p className="font-semibold text-green-900">₹{lastGenerated.summary.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataGeneratorPanel;