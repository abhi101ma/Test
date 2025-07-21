// Marketing Mix Modeling Utilities
// Advanced statistical analysis for multi-channel attribution


export interface ExternalChannelData {
  channel: string;
  spend: number;
  revenue: number;
  impressions: number;
  clicks: number;
  conversions: number;
  seasonality: number;
  competitorActivity: number;
}

export interface MMMResults {
  channelContributions: ChannelContribution[];
  totalROAS: number;
  incrementalRevenue: number;
  baselineRevenue: number;
  saturationCurves: SaturationPoint[];
  recommendations: string[];
}

export interface ChannelContribution {
  channel: string;
  contribution: number;
  incrementalRevenue: number;
  roas: number;
  efficiency: number;
  saturationLevel: number;
}

export interface SaturationPoint {
  channel: string;
  currentSpend: number;
  optimalSpend: number;
  diminishingReturns: boolean;
  efficiencyScore: number;
}

// Advanced MMM Analysis with statistical modeling
export function runMMMAnalysis(data: ExternalChannelData[]): MMMResults {
  // Calculate base metrics
  const totalSpend = data.reduce((sum, channel) => sum + channel.spend, 0);
  const totalRevenue = data.reduce((sum, channel) => sum + channel.revenue, 0);
  const totalROAS = totalRevenue / totalSpend;

  // Calculate channel contributions using advanced attribution
  const channelContributions = data.map(channel => {
    const baseROAS = channel.revenue / channel.spend;
    
    // Apply seasonality and competitive adjustments
    const seasonalityAdjustment = 1 + (channel.seasonality - 1) * 0.3;
    const competitiveAdjustment = 1 - (channel.competitorActivity * 0.2);
    
    const adjustedRevenue = channel.revenue * seasonalityAdjustment * competitiveAdjustment;
    const contribution = (adjustedRevenue / totalRevenue) * 100;
    
    // Calculate saturation level (0-1 scale)
    const saturationLevel = Math.min(channel.spend / (channel.spend + 50000), 0.95);
    
    // Efficiency score based on ROAS and saturation
    const efficiency = (baseROAS * (1 - saturationLevel)) * 100;

    return {
      channel: channel.channel,
      contribution: Math.round(contribution * 100) / 100,
      incrementalRevenue: adjustedRevenue - (channel.revenue * 0.7), // Assume 70% baseline
      roas: Math.round(baseROAS * 100) / 100,
      efficiency: Math.round(efficiency * 100) / 100,
      saturationLevel: Math.round(saturationLevel * 100) / 100
    };
  });

  // Calculate saturation curves
  const saturationCurves = data.map(channel => {
    const currentEfficiency = channel.revenue / channel.spend;
    const optimalSpend = channel.spend * (1 + (1 - Math.min(channel.spend / 100000, 0.9)));
    
    return {
      channel: channel.channel,
      currentSpend: channel.spend,
      optimalSpend: Math.round(optimalSpend),
      diminishingReturns: channel.spend > 75000,
      efficiencyScore: Math.round(currentEfficiency * 100) / 100
    };
  });

  // Generate recommendations
  const recommendations = generateRecommendations(channelContributions, saturationCurves);

  return {
    channelContributions,
    totalROAS: Math.round(totalROAS * 100) / 100,
    incrementalRevenue: channelContributions.reduce((sum, ch) => sum + ch.incrementalRevenue, 0),
    baselineRevenue: totalRevenue * 0.7, // Assume 70% baseline
    saturationCurves,
    recommendations
  };
}

function generateRecommendations(
  contributions: ChannelContribution[], 
  saturation: SaturationPoint[]
): string[] {
  const recommendations: string[] = [];

  // Find highest performing channels
  const topChannel = contributions.reduce((prev, current) => 
    prev.efficiency > current.efficiency ? prev : current
  );

  // Find underperforming channels
  const underperforming = contributions.filter(ch => ch.efficiency < 50);

  // Find saturated channels
  const saturated = saturation.filter(ch => ch.diminishingReturns);

  recommendations.push(`Increase investment in ${topChannel.channel} - highest efficiency at ${topChannel.efficiency}%`);

  if (underperforming.length > 0) {
    recommendations.push(`Optimize or reduce spend on: ${underperforming.map(ch => ch.channel).join(', ')}`);
  }

  if (saturated.length > 0) {
    recommendations.push(`Consider diversifying from saturated channels: ${saturated.map(ch => ch.channel).join(', ')}`);
  }

  // Budget reallocation recommendation
  const totalContribution = contributions.reduce((sum, ch) => sum + ch.contribution, 0);
  if (totalContribution < 80) {
    recommendations.push('Consider increasing overall marketing spend - current channels show strong potential');
  }

  return recommendations;
}

// Scenario planning for budget allocation
export function simulateBudgetAllocation(
  currentData: ExternalChannelData[],
  budgetChanges: { [channel: string]: number }
): MMMResults {
  const simulatedData = currentData.map(channel => ({
    ...channel,
    spend: channel.spend * (1 + (budgetChanges[channel.channel] || 0))
  }));

  return runMMMAnalysis(simulatedData);
}

// Calculate incremental lift from marketing activities
export function calculateIncrementalLift(
  withMarketing: ExternalChannelData[],
  baseline: number
): { [channel: string]: number } {
  const lift: { [channel: string]: number } = {};

  withMarketing.forEach(channel => {
    const incrementalRevenue = channel.revenue - (baseline * 0.1); // Assume 10% baseline per channel
    lift[channel.channel] = Math.max(0, incrementalRevenue);
  });

  return lift;
}