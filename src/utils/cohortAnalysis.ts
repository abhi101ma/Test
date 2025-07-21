// Customer cohort analysis utilities
import { CustomerCohort } from '../types/analytics';
import { EnhancedTrackingData } from '../types/enhanced';

export class CohortAnalyzer {
  static analyzeCohorts(trackingData: EnhancedTrackingData[]): CustomerCohort[] {
    // Group customers by acquisition month and source
    const cohortGroups: { [key: string]: EnhancedTrackingData[] } = {};

    trackingData.forEach(order => {
      if (order.is_new_customer) {
        const acquisitionMonth = order.order_date.substring(0, 7); // YYYY-MM
        const source = order.attribution_source;
        const key = `${acquisitionMonth}_${source}`;

        if (!cohortGroups[key]) {
          cohortGroups[key] = [];
        }
        cohortGroups[key].push(order);
      }
    });

    const cohorts: CustomerCohort[] = [];

    Object.entries(cohortGroups).forEach(([key, orders]) => {
      const [acquisitionMonth, source] = key.split('_');
      const customerIds = new Set(orders.map(o => o.user_id));
      const initialCustomers = customerIds.size;

      if (initialCustomers === 0) return;

      // Calculate retention rates (simulated for demo)
      const retentionRates = this.calculateRetentionRates(orders, trackingData);
      
      // Calculate financial metrics
      const totalRevenue = orders.reduce((sum, o) => sum + o.revenue, 0);
      const avgOrderValue = totalRevenue / orders.length;
      
      // Calculate repeat purchase rate
      const repeatCustomers = this.calculateRepeatCustomers(customerIds, trackingData, acquisitionMonth);
      const repeatPurchaseRate = (repeatCustomers / initialCustomers) * 100;
      
      // Calculate CLV (simplified)
      const customerLifetimeValue = this.calculateCLV(avgOrderValue, repeatPurchaseRate, retentionRates);

      cohorts.push({
        cohort_id: key,
        acquisition_source: source,
        acquisition_date: acquisitionMonth,
        initial_customers: initialCustomers,
        retention_rates: retentionRates,
        avg_order_value: avgOrderValue,
        repeat_purchase_rate: repeatPurchaseRate,
        customer_lifetime_value: customerLifetimeValue,
        total_revenue: totalRevenue
      });
    });

    return cohorts.sort((a, b) => b.initial_customers - a.initial_customers);
  }

  private static calculateRetentionRates(
    cohortOrders: EnhancedTrackingData[], 
    allTrackingData: EnhancedTrackingData[]
  ): CustomerCohort['retention_rates'] {
    const customerIds = new Set(cohortOrders.map(o => o.user_id));
    const acquisitionMonth = cohortOrders[0].order_date.substring(0, 7);
    
    // Simulate retention rates based on attribution source
    const source = cohortOrders[0].attribution_source;
    let baseRetention = 0.6; // 60% base retention
    
    if (source === 'influencer') {
      baseRetention = 0.75; // Influencer customers tend to be more loyal
    } else if (source === 'organic') {
      baseRetention = 0.65;
    }

    // Apply decay over time
    return {
      month_1: baseRetention,
      month_3: baseRetention * 0.8,
      month_6: baseRetention * 0.6,
      month_12: baseRetention * 0.4
    };
  }

  private static calculateRepeatCustomers(
    customerIds: Set<string>, 
    allTrackingData: EnhancedTrackingData[], 
    acquisitionMonth: string
  ): number {
    let repeatCustomers = 0;

    customerIds.forEach(customerId => {
      const customerOrders = allTrackingData.filter(o => 
        o.user_id === customerId && 
        o.order_date.substring(0, 7) > acquisitionMonth
      );
      
      if (customerOrders.length > 0) {
        repeatCustomers++;
      }
    });

    return repeatCustomers;
  }

  private static calculateCLV(
    avgOrderValue: number, 
    repeatPurchaseRate: number, 
    retentionRates: CustomerCohort['retention_rates']
  ): number {
    // Simplified CLV calculation
    const avgRetention = (retentionRates.month_1 + retentionRates.month_3 + 
                         retentionRates.month_6 + retentionRates.month_12) / 4;
    
    const purchaseFrequency = 1 + (repeatPurchaseRate / 100) * 2; // Estimated purchases per year
    const customerLifespan = avgRetention * 2; // Estimated years
    
    return avgOrderValue * purchaseFrequency * customerLifespan;
  }

  static getCohortInsights(cohorts: CustomerCohort[]): {
    bestPerformingSource: string;
    avgCLV: number;
    retentionTrend: string;
    recommendations: string[];
  } {
    if (cohorts.length === 0) {
      return {
        bestPerformingSource: 'N/A',
        avgCLV: 0,
        retentionTrend: 'insufficient data',
        recommendations: ['Collect more customer data for analysis']
      };
    }

    // Find best performing source by CLV
    const sourcePerformance = cohorts.reduce((acc, cohort) => {
      if (!acc[cohort.acquisition_source]) {
        acc[cohort.acquisition_source] = { totalCLV: 0, count: 0 };
      }
      acc[cohort.acquisition_source].totalCLV += cohort.customer_lifetime_value;
      acc[cohort.acquisition_source].count++;
      return acc;
    }, {} as { [key: string]: { totalCLV: number; count: number } });

    const bestSource = Object.entries(sourcePerformance)
      .map(([source, data]) => ({ source, avgCLV: data.totalCLV / data.count }))
      .sort((a, b) => b.avgCLV - a.avgCLV)[0];

    const avgCLV = cohorts.reduce((sum, c) => sum + c.customer_lifetime_value, 0) / cohorts.length;

    // Analyze retention trend
    const avgMonth1Retention = cohorts.reduce((sum, c) => sum + c.retention_rates.month_1, 0) / cohorts.length;
    const avgMonth12Retention = cohorts.reduce((sum, c) => sum + c.retention_rates.month_12, 0) / cohorts.length;
    
    const retentionTrend = avgMonth12Retention > (avgMonth1Retention * 0.5) ? 'stable' : 'declining';

    const recommendations = [
      `Focus acquisition budget on ${bestSource.source} channel (highest CLV)`,
      `Implement retention campaigns for ${retentionTrend === 'declining' ? 'declining' : 'stable'} cohorts`,
      'Develop loyalty programs for high-value customer segments',
      'A/B test onboarding flows to improve early retention'
    ];

    return {
      bestPerformingSource: bestSource.source,
      avgCLV,
      retentionTrend,
      recommendations
    };
  }
}