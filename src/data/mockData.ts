import { Influencer, Post, TrackingData, Payout, Campaign } from '../types';

export const influencers: Influencer[] = [
  {
    id: 'inf001',
    name: 'Fitness Guru Raj',
    category: 'Fitness',
    gender: 'Male',
    followerCount: 125000,
    platform: 'Instagram',
    profileImage: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    engagementRate: 4.2,
    avgReach: 45000
  },
  {
    id: 'inf002',
    name: 'Health Maven Priya',
    category: 'Nutrition',
    gender: 'Female',
    followerCount: 89000,
    platform: 'YouTube',
    profileImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    engagementRate: 6.8,
    avgReach: 32000
  },
  {
    id: 'inf003',
    name: 'Muscle Builder Mike',
    category: 'Bodybuilding',
    gender: 'Male',
    followerCount: 198000,
    platform: 'Instagram',
    profileImage: 'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    engagementRate: 3.9,
    avgReach: 78000
  },
  {
    id: 'inf004',
    name: 'Wellness Queen Sara',
    category: 'Wellness',
    gender: 'Female',
    followerCount: 156000,
    platform: 'Instagram',
    profileImage: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    engagementRate: 5.1,
    avgReach: 62000
  },
  {
    id: 'inf005',
    name: 'Protein Expert Dev',
    category: 'Nutrition',
    gender: 'Male',
    followerCount: 73000,
    platform: 'YouTube',
    profileImage: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    engagementRate: 7.2,
    avgReach: 28000
  },
  {
    id: 'inf006',
    name: 'Yoga Instructor Maya',
    category: 'Fitness',
    gender: 'Female',
    followerCount: 112000,
    platform: 'Instagram',
    profileImage: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    engagementRate: 4.8,
    avgReach: 48000
  }
];

export const campaigns: Campaign[] = [
  {
    id: 'camp001',
    name: 'MuscleBlaze Protein Launch',
    brand: 'MuscleBlaze',
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    budget: 250000,
    status: 'completed',
    objective: 'Product Launch'
  },
  {
    id: 'camp002',
    name: 'HKVitals Immunity Boost',
    brand: 'HKVitals',
    startDate: '2024-02-01',
    endDate: '2024-03-01',
    budget: 180000,
    status: 'active',
    objective: 'Brand Awareness'
  },
  {
    id: 'camp003',
    name: 'Gritzo Kids Nutrition',
    brand: 'Gritzo',
    startDate: '2024-02-20',
    endDate: '2024-03-20',
    budget: 120000,
    status: 'active',
    objective: 'Sales Drive'
  }
];

export const posts: Post[] = [
  {
    id: 'post001',
    influencerId: 'inf001',
    platform: 'Instagram',
    date: '2024-01-20',
    url: 'https://instagram.com/p/example1',
    caption: 'Just tried the new MuscleBlaze protein! Amazing results! 💪 #MuscleBlaze #Fitness',
    reach: 52000,
    likes: 2800,
    comments: 156,
    shares: 89,
    campaignId: 'camp001'
  },
  {
    id: 'post002',
    influencerId: 'inf002',
    platform: 'YouTube',
    date: '2024-02-05',
    url: 'https://youtube.com/watch?v=example1',
    caption: 'Complete review of HKVitals immunity supplements - everything you need to know!',
    reach: 38000,
    likes: 1950,
    comments: 245,
    shares: 167,
    campaignId: 'camp002'
  },
  {
    id: 'post003',
    influencerId: 'inf003',
    platform: 'Instagram',
    date: '2024-01-25',
    url: 'https://instagram.com/p/example2',
    caption: 'Fueling my workouts with @MuscleBlaze 🔥 Use code MUSCLE20 for 20% off!',
    reach: 89000,
    likes: 4200,
    comments: 298,
    shares: 178,
    campaignId: 'camp001'
  },
  {
    id: 'post004',
    influencerId: 'inf004',
    platform: 'Instagram',
    date: '2024-02-08',
    url: 'https://instagram.com/p/example3',
    caption: 'Immunity is everything! Love these @HKVitals supplements ✨ #WellnessJourney',
    reach: 71000,
    likes: 3600,
    comments: 189,
    shares: 145,
    campaignId: 'camp002'
  },
  {
    id: 'post005',
    influencerId: 'inf005',
    platform: 'YouTube',
    date: '2024-02-25',
    url: 'https://youtube.com/watch?v=example2',
    caption: 'Gritzo Kids Nutrition: Why I recommend it to all parents | Detailed Review',
    reach: 31000,
    likes: 1680,
    comments: 167,
    shares: 98,
    campaignId: 'camp003'
  },
  {
    id: 'post006',
    influencerId: 'inf006',
    platform: 'Instagram',
    date: '2024-02-12',
    url: 'https://instagram.com/p/example4',
    caption: 'Morning yoga with my daily dose of @HKVitals 🧘‍♀️ Feeling energized!',
    reach: 54000,
    likes: 2890,
    comments: 178,
    shares: 156,
    campaignId: 'camp002'
  }
];

export const trackingData: TrackingData[] = [
  {
    id: 'track001',
    source: 'Instagram',
    campaign: 'MuscleBlaze Protein Launch',
    influencerId: 'inf001',
    userId: 'user001',
    product: 'MuscleBlaze Whey Protein',
    brand: 'MuscleBlaze',
    date: '2024-01-21',
    orders: 12,
    revenue: 18900,
    costPerOrder: 158.33
  },
  {
    id: 'track002',
    source: 'YouTube',
    campaign: 'HKVitals Immunity Boost',
    influencerId: 'inf002',
    userId: 'user002',
    product: 'HKVitals Vitamin C',
    brand: 'HKVitals',
    date: '2024-02-06',
    orders: 28,
    revenue: 22400,
    costPerOrder: 64.29
  },
  {
    id: 'track003',
    source: 'Instagram',
    campaign: 'MuscleBlaze Protein Launch',
    influencerId: 'inf003',
    userId: 'user003',
    product: 'MuscleBlaze Mass Gainer',
    brand: 'MuscleBlaze',
    date: '2024-01-26',
    orders: 35,
    revenue: 56700,
    costPerOrder: 171.43
  },
  {
    id: 'track004',
    source: 'Instagram',
    campaign: 'HKVitals Immunity Boost',
    influencerId: 'inf004',
    userId: 'user004',
    product: 'HKVitals Multivitamin',
    brand: 'HKVitals',
    date: '2024-02-09',
    orders: 19,
    revenue: 15200,
    costPerOrder: 80
  },
  {
    id: 'track005',
    source: 'YouTube',
    campaign: 'Gritzo Kids Nutrition',
    influencerId: 'inf005',
    userId: 'user005',
    product: 'Gritzo SuperMilk',
    brand: 'Gritzo',
    date: '2024-02-26',
    orders: 22,
    revenue: 13200,
    costPerOrder: 60
  },
  {
    id: 'track006',
    source: 'Instagram',
    campaign: 'HKVitals Immunity Boost',
    influencerId: 'inf006',
    userId: 'user006',
    product: 'HKVitals Omega-3',
    brand: 'HKVitals',
    date: '2024-02-13',
    orders: 16,
    revenue: 19200,
    costPerOrder: 120
  }
];

export const payouts: Payout[] = [
  {
    id: 'pay001',
    influencerId: 'inf001',
    basis: 'post',
    rate: 15000,
    orders: 12,
    totalPayout: 15000,
    campaign: 'MuscleBlaze Protein Launch',
    date: '2024-01-31',
    status: 'paid'
  },
  {
    id: 'pay002',
    influencerId: 'inf002',
    basis: 'order',
    rate: 500,
    orders: 28,
    totalPayout: 14000,
    campaign: 'HKVitals Immunity Boost',
    date: '2024-02-28',
    status: 'processing'
  },
  {
    id: 'pay003',
    influencerId: 'inf003',
    basis: 'post',
    rate: 25000,
    orders: 35,
    totalPayout: 25000,
    campaign: 'MuscleBlaze Protein Launch',
    date: '2024-01-31',
    status: 'paid'
  },
  {
    id: 'pay004',
    influencerId: 'inf004',
    basis: 'order',
    rate: 400,
    orders: 19,
    totalPayout: 7600,
    campaign: 'HKVitals Immunity Boost',
    date: '2024-02-28',
    status: 'pending'
  },
  {
    id: 'pay005',
    influencerId: 'inf005',
    basis: 'order',
    rate: 300,
    orders: 22,
    totalPayout: 6600,
    campaign: 'Gritzo Kids Nutrition',
    date: '2024-03-31',
    status: 'pending'
  },
  {
    id: 'pay006',
    influencerId: 'inf006',
    basis: 'post',
    rate: 12000,
    orders: 16,
    totalPayout: 12000,
    campaign: 'HKVitals Immunity Boost',
    date: '2024-02-28',
    status: 'processing'
  }
];