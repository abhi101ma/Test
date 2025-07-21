import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please set up Supabase connection.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database service functions
export class DatabaseService {
  // Influencers
  static async getInfluencers() {
    const { data, error } = await supabase
      .from('enhanced_influencers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async insertInfluencers(influencers: any[]) {
    const { data, error } = await supabase
      .from('enhanced_influencers')
      .insert(influencers)
      .select();
    
    if (error) throw error;
    return data;
  }

  // Campaigns
  static async getCampaigns() {
    const { data, error } = await supabase
      .from('enhanced_campaigns')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async insertCampaigns(campaigns: any[]) {
    const { data, error } = await supabase
      .from('enhanced_campaigns')
      .insert(campaigns)
      .select();
    
    if (error) throw error;
    return data;
  }

  // Posts
  static async getPosts() {
    const { data, error } = await supabase
      .from('enhanced_posts')
      .select(`
        *,
        enhanced_influencers(name, handle),
        enhanced_campaigns(campaign_name, brand)
      `)
      .order('post_date', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async insertPosts(posts: any[]) {
    const { data, error } = await supabase
      .from('enhanced_posts')
      .insert(posts)
      .select();
    
    if (error) throw error;
    return data;
  }

  // Tracking Data
  static async getTrackingData() {
    const { data, error } = await supabase
      .from('enhanced_tracking_data')
      .select('*')
      .order('order_date', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async insertTrackingData(trackingData: any[]) {
    const { data, error } = await supabase
      .from('enhanced_tracking_data')
      .insert(trackingData)
      .select();
    
    if (error) throw error;
    return data;
  }

  // Payouts
  static async getPayouts() {
    const { data, error } = await supabase
      .from('enhanced_payouts')
      .select(`
        *,
        enhanced_influencers(name, handle),
        enhanced_campaigns(campaign_name, brand)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async insertPayouts(payouts: any[]) {
    const { data, error } = await supabase
      .from('enhanced_payouts')
      .insert(payouts)
      .select();
    
    if (error) throw error;
    return data;
  }

  // Seed initial data
  static async seedDatabase() {
    try {
      // Import mock data
      const { 
        enhancedInfluencers, 
        enhancedCampaigns, 
        enhancedPosts, 
        enhancedTrackingData, 
        enhancedPayouts 
      } = await import('../data/enhancedMockData');

      // Insert data in order (respecting foreign key constraints)
      await this.insertInfluencers(enhancedInfluencers);
      await this.insertCampaigns(enhancedCampaigns);
      await this.insertPosts(enhancedPosts);
      await this.insertTrackingData(enhancedTrackingData);
      await this.insertPayouts(enhancedPayouts);

      console.log('Database seeded successfully');
      return true;
    } catch (error) {
      console.error('Error seeding database:', error);
      return false;
    }
  }
}