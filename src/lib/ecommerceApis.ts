// E-commerce Backend API Service - Simulated integrations for Shopify, WooCommerce, Magento
import { EnhancedTrackingData } from '../types/enhanced';

export interface EcommerceOrder {
  order_id: string;
  customer_id: string;
  order_date: string;
  total_amount: number;
  currency: string;
  items: EcommerceOrderItem[];
  customer_info: {
    is_new_customer: boolean;
    email: string;
    phone?: string;
    location: string;
  };
  attribution: {
    source: string;
    campaign_id?: string;
    influencer_id?: string;
    coupon_code?: string;
    utm_parameters?: { [key: string]: string };
  };
  fulfillment_status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

export interface EcommerceOrderItem {
  product_id: string;
  product_name: string;
  sku: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  category: string;
}

export interface CustomerProfile {
  customer_id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  location: string;
  registration_date: string;
  total_orders: number;
  total_spent: number;
  avg_order_value: number;
  last_order_date: string;
  preferred_categories: string[];
  acquisition_source: string;
}

export interface InventoryStatus {
  product_id: string;
  product_name: string;
  sku: string;
  current_stock: number;
  reserved_stock: number;
  available_stock: number;
  reorder_level: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued';
  last_updated: string;
}

export class EcommerceAPI {
  /**
   * Fetch real-time order data from Shopify API (Simulated)
   */
  static async fetchShopifyOrders(
    startDate: string, 
    endDate: string, 
    limit: number = 100
  ): Promise<EcommerceOrder[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const orders: EcommerceOrder[] = [];
    const orderCount = Math.min(limit, Math.floor(Math.random() * 50) + 20);

    for (let i = 0; i < orderCount; i++) {
      orders.push(this.generateMockOrder(i));
    }

    return orders.filter(order => 
      order.order_date >= startDate && order.order_date <= endDate
    );
  }

  /**
   * Fetch customer profile data from e-commerce platform (Simulated)
   */
  static async fetchCustomerProfile(customerId: string): Promise<CustomerProfile> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      customer_id: customerId,
      email: `customer${customerId}@example.com`,
      first_name: `Customer`,
      last_name: `${customerId}`,
      phone: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      location: this.getRandomLocation(),
      registration_date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      total_orders: Math.floor(Math.random() * 20) + 1,
      total_spent: Math.floor(Math.random() * 50000) + 5000,
      avg_order_value: Math.floor(Math.random() * 3000) + 1000,
      last_order_date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      preferred_categories: this.getRandomCategories(),
      acquisition_source: Math.random() > 0.6 ? 'influencer' : 'organic'
    };
  }

  /**
   * Fetch inventory status for products (Simulated)
   */
  static async fetchInventoryStatus(productIds?: string[]): Promise<InventoryStatus[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const products = [
      'MB_WHEY_GOLD_1KG', 'MB_MASS_GAINER_3KG', 'HK_VITAMIN_C', 'HK_MULTIVIT',
      'HK_OMEGA3', 'HK_VITAMIN_D', 'GRITZO_SUPERMILK_CHOCO', 'HK_COLLAGEN', 'HK_BIOTIN'
    ];

    const targetProducts = productIds || products;
    
    return targetProducts.map(productId => ({
      product_id: productId,
      product_name: this.getProductName(productId),
      sku: productId,
      current_stock: Math.floor(Math.random() * 1000) + 100,
      reserved_stock: Math.floor(Math.random() * 50) + 10,
      available_stock: Math.floor(Math.random() * 950) + 50,
      reorder_level: 100,
      status: this.getRandomStockStatus(),
      last_updated: new Date().toISOString()
    }));
  }

  /**
   * Convert e-commerce orders to enhanced tracking data format
   */
  static convertOrdersToTrackingData(orders: EcommerceOrder[]): EnhancedTrackingData[] {
    return orders.map(order => ({
      event_id: `ecom_${order.order_id}`,
      user_id: order.customer_id,
      order_id: order.order_id,
      order_date: order.order_date,
      revenue: order.total_amount,
      items_in_cart: order.items.map(item => item.product_id),
      attribution_source: order.attribution.source as any,
      attribution_details: {
        campaign_id: order.attribution.campaign_id,
        influencer_id: order.attribution.influencer_id,
        coupon_code: order.attribution.coupon_code,
        utm_parameters: order.attribution.utm_parameters
      },
      is_new_customer: order.customer_info.is_new_customer,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
  }

  /**
   * Sync orders with attribution data (Simulated)
   */
  static async syncOrdersWithAttribution(
    startDate: string, 
    endDate: string
  ): Promise<{
    orders_synced: number;
    tracking_data: EnhancedTrackingData[];
    sync_timestamp: string;
  }> {
    // Simulate comprehensive sync process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const orders = await this.fetchShopifyOrders(startDate, endDate);
    const trackingData = this.convertOrdersToTrackingData(orders);
    
    return {
      orders_synced: orders.length,
      tracking_data: trackingData,
      sync_timestamp: new Date().toISOString()
    };
  }

  /**
   * Get e-commerce platform connection status (Simulated)
   */
  static async getConnectionStatus(): Promise<{
    platform: string;
    status: 'connected' | 'disconnected' | 'error';
    last_sync: string;
    total_orders_synced: number;
    api_quota_used: number;
    api_quota_limit: number;
  }> {
    return {
      platform: 'Shopify',
      status: 'connected',
      last_sync: new Date(Date.now() - Math.random() * 60 * 60 * 1000).toISOString(),
      total_orders_synced: Math.floor(Math.random() * 10000) + 5000,
      api_quota_used: Math.floor(Math.random() * 800) + 100,
      api_quota_limit: 1000
    };
  }

  // Helper methods
  private static generateMockOrder(index: number): EcommerceOrder {
    const orderId = `ORD_${Date.now()}_${index}`;
    const customerId = `CUST_${Math.floor(Math.random() * 10000)}`;
    const isInfluencerOrder = Math.random() > 0.4;
    
    const items = this.generateOrderItems();
    const totalAmount = items.reduce((sum, item) => sum + item.total_price, 0);

    return {
      order_id: orderId,
      customer_id: customerId,
      order_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      total_amount: totalAmount,
      currency: 'INR',
      items,
      customer_info: {
        is_new_customer: Math.random() > 0.6,
        email: `customer${customerId}@example.com`,
        phone: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        location: this.getRandomLocation()
      },
      attribution: isInfluencerOrder ? {
        source: 'influencer',
        campaign_id: `camp_00${Math.floor(Math.random() * 3) + 1}`,
        influencer_id: `inf_00${Math.floor(Math.random() * 6) + 1}`,
        coupon_code: this.getRandomCouponCode(),
        utm_parameters: {
          utm_source: 'instagram',
          utm_medium: 'influencer',
          utm_campaign: 'protein_launch'
        }
      } : {
        source: Math.random() > 0.5 ? 'organic' : 'paid_search'
      },
      fulfillment_status: this.getRandomFulfillmentStatus()
    };
  }

  private static generateOrderItems(): EcommerceOrderItem[] {
    const products = [
      { id: 'MB_WHEY_GOLD_1KG', name: 'MuscleBlaze Whey Gold 1kg', category: 'Protein', price: 1575 },
      { id: 'MB_MASS_GAINER_3KG', name: 'MuscleBlaze Mass Gainer 3kg', category: 'Mass Gainer', price: 1620 },
      { id: 'HK_VITAMIN_C', name: 'HKVitals Vitamin C', category: 'Vitamins', price: 400 },
      { id: 'HK_MULTIVIT', name: 'HKVitals Multivitamin', category: 'Vitamins', price: 550 },
      { id: 'GRITZO_SUPERMILK_CHOCO', name: 'Gritzo SuperMilk Chocolate', category: 'Kids Nutrition', price: 600 }
    ];

    const itemCount = Math.floor(Math.random() * 3) + 1; // 1-3 items
    const selectedProducts = products.sort(() => 0.5 - Math.random()).slice(0, itemCount);

    return selectedProducts.map(product => {
      const quantity = Math.floor(Math.random() * 2) + 1; // 1-2 quantity
      return {
        product_id: product.id,
        product_name: product.name,
        sku: product.id,
        quantity,
        unit_price: product.price,
        total_price: product.price * quantity,
        category: product.category
      };
    });
  }

  private static getRandomLocation(): string {
    const locations = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad'];
    return locations[Math.floor(Math.random() * locations.length)];
  }

  private static getRandomCategories(): string[] {
    const categories = ['Protein', 'Vitamins', 'Mass Gainer', 'Pre-workout', 'BCAA', 'Creatine'];
    return categories.filter(() => Math.random() > 0.6).slice(0, 3);
  }

  private static getRandomCouponCode(): string {
    const codes = ['RAJFIT20', 'MIKE25', 'SARA15', 'MAYA10', 'HEALTH30', 'FITNESS25'];
    return codes[Math.floor(Math.random() * codes.length)];
  }

  private static getRandomFulfillmentStatus(): EcommerceOrder['fulfillment_status'] {
    const statuses: EcommerceOrder['fulfillment_status'][] = ['pending', 'processing', 'shipped', 'delivered'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }

  private static getRandomStockStatus(): InventoryStatus['status'] {
    const statuses: InventoryStatus['status'][] = ['in_stock', 'low_stock', 'out_of_stock'];
    const weights = [0.7, 0.2, 0.1]; // 70% in stock, 20% low stock, 10% out of stock
    const random = Math.random();
    
    if (random < weights[0]) return 'in_stock';
    if (random < weights[0] + weights[1]) return 'low_stock';
    return 'out_of_stock';
  }

  private static getProductName(productId: string): string {
    const productNames: { [key: string]: string } = {
      'MB_WHEY_GOLD_1KG': 'MuscleBlaze Whey Gold 1kg',
      'MB_MASS_GAINER_3KG': 'MuscleBlaze Mass Gainer 3kg',
      'HK_VITAMIN_C': 'HKVitals Vitamin C',
      'HK_MULTIVIT': 'HKVitals Multivitamin',
      'HK_OMEGA3': 'HKVitals Omega-3',
      'HK_VITAMIN_D': 'HKVitals Vitamin D',
      'GRITZO_SUPERMILK_CHOCO': 'Gritzo SuperMilk Chocolate',
      'HK_COLLAGEN': 'HKVitals Collagen',
      'HK_BIOTIN': 'HKVitals Biotin'
    };
    
    return productNames[productId] || productId;
  }
}