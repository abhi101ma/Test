export interface Influencer {
  id: string;
  name: string;
  category: string;
  gender: 'Male' | 'Female' | 'Other';
  followerCount: number;
  platform: string;
  profileImage: string;
  engagementRate: number;
  avgReach: number;
}

export interface Post {
  id: string;
  influencerId: string;
  platform: string;
  date: string;
  url: string;
  caption: string;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  campaignId: string;
}

export interface TrackingData {
  id: string;
  source: string;
  campaign: string;
  influencerId: string;
  userId: string;
  product: string;
  brand: string;
  date: string;
  orders: number;
  revenue: number;
  costPerOrder: number;
}

export interface Payout {
  id: string;
  influencerId: string;
  basis: 'post' | 'order';
  rate: number;
  orders: number;
  totalPayout: number;
  campaign: string;
  date: string;
  status: 'pending' | 'paid' | 'processing';
}

export interface Campaign {
  id: string;
  name: string;
  brand: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: 'active' | 'completed' | 'paused';
  objective: string;
}

export interface ROASMetrics {
  totalRevenue: number;
  totalSpend: number;
  roas: number;
  incrementalRevenue: number;
  incrementalROAS: number;
  orders: number;
  costPerOrder: number;
  conversionRate: number;
}