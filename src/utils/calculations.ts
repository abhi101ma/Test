import { TrackingData, Payout, ROASMetrics } from '../types';

export const calculateROAS = (
  trackingData: TrackingData[],
  payouts: Payout[],
  influencerId?: string,
  campaign?: string
): ROASMetrics => {
  let filteredTracking = trackingData;
  let filteredPayouts = payouts;

  if (influencerId) {
    filteredTracking = trackingData.filter(t => t.influencerId === influencerId);
    filteredPayouts = payouts.filter(p => p.influencerId === influencerId);
  }

  if (campaign) {
    filteredTracking = filteredTracking.filter(t => t.campaign === campaign);
    filteredPayouts = filteredPayouts.filter(p => p.campaign === campaign);
  }

  const totalRevenue = filteredTracking.reduce((sum, data) => sum + data.revenue, 0);
  const totalSpend = filteredPayouts.reduce((sum, payout) => sum + payout.totalPayout, 0);
  const totalOrders = filteredTracking.reduce((sum, data) => sum + data.orders, 0);

  // Simulate baseline revenue (what would have happened without influencer marketing)
  const baselineRevenue = totalRevenue * 0.3; // Assume 30% would have happened organically
  const incrementalRevenue = totalRevenue - baselineRevenue;

  const roas = totalSpend > 0 ? totalRevenue / totalSpend : 0;
  const incrementalROAS = totalSpend > 0 ? incrementalRevenue / totalSpend : 0;
  const costPerOrder = totalOrders > 0 ? totalSpend / totalOrders : 0;
  
  // Simulate conversion rate based on reach and orders
  const totalReach = filteredTracking.length * 50000; // Approximate reach
  const conversionRate = totalReach > 0 ? (totalOrders / totalReach) * 100 : 0;

  return {
    totalRevenue,
    totalSpend,
    roas,
    incrementalRevenue,
    incrementalROAS,
    orders: totalOrders,
    costPerOrder,
    conversionRate
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const getInfluencerPerformanceScore = (
  influencer: any,
  trackingData: TrackingData[],
  payouts: Payout[]
): number => {
  const influencerData = trackingData.filter(t => t.influencerId === influencer.id);
  const influencerPayouts = payouts.filter(p => p.influencerId === influencer.id);
  
  const metrics = calculateROAS(influencerData, influencerPayouts);
  
  // Performance score based on ROAS, engagement rate, and conversion rate
  const roasScore = Math.min(metrics.incrementalROAS / 3, 1) * 40; // Max 40 points
  const engagementScore = Math.min(influencer.engagementRate / 8, 1) * 30; // Max 30 points
  const conversionScore = Math.min(metrics.conversionRate / 2, 1) * 30; // Max 30 points
  
  return Math.round(roasScore + engagementScore + conversionScore);
};