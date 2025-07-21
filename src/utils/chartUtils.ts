// Chart utility functions for enhanced analytics

export interface TrendlineData {
  slope: number;
  intercept: number;
  rSquared: number;
  points: { x: number; y: number }[];
}

/**
 * Calculate linear regression trendline for chart data
 */
export const calculateLinearTrendline = (data: { x: string; y: number }[]): TrendlineData => {
  if (data.length < 2) {
    return { slope: 0, intercept: 0, rSquared: 0, points: [] };
  }

  const n = data.length;
  const sumX = data.reduce((sum, _, i) => sum + i, 0);
  const sumY = data.reduce((sum, point) => sum + point.y, 0);
  const sumXY = data.reduce((sum, point, i) => sum + i * point.y, 0);
  const sumXX = data.reduce((sum, _, i) => sum + i * i, 0);
  const sumYY = data.reduce((sum, point) => sum + point.y * point.y, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Calculate R-squared
  const yMean = sumY / n;
  const ssTotal = data.reduce((sum, point) => sum + Math.pow(point.y - yMean, 2), 0);
  const ssResidual = data.reduce((sum, point, i) => {
    const predicted = slope * i + intercept;
    return sum + Math.pow(point.y - predicted, 2);
  }, 0);
  const rSquared = 1 - (ssResidual / ssTotal);

  const points = data.map((point, i) => ({
    x: i,
    y: slope * i + intercept
  }));

  return { slope, intercept, rSquared, points };
};

/**
 * Detect peaks and troughs in time series data
 */
export const detectPeaksAndTroughs = (data: { x: string; y: number }[]): {
  peaks: { index: number; value: number; x: string }[];
  troughs: { index: number; value: number; x: string }[];
} => {
  const peaks: { index: number; value: number; x: string }[] = [];
  const troughs: { index: number; value: number; x: string }[] = [];

  for (let i = 1; i < data.length - 1; i++) {
    const prev = data[i - 1].y;
    const current = data[i].y;
    const next = data[i + 1].y;

    // Peak detection
    if (current > prev && current > next) {
      peaks.push({ index: i, value: current, x: data[i].x });
    }

    // Trough detection
    if (current < prev && current < next) {
      troughs.push({ index: i, value: current, x: data[i].x });
    }
  }

  return { peaks, troughs };
};

/**
 * Calculate moving average for smoothing data
 */
export const calculateMovingAverage = (
  data: { x: string; y: number }[], 
  windowSize: number = 3
): { x: string; y: number }[] => {
  if (windowSize >= data.length) return data;

  const result: { x: string; y: number }[] = [];

  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - Math.floor(windowSize / 2));
    const end = Math.min(data.length, start + windowSize);
    const window = data.slice(start, end);
    const average = window.reduce((sum, point) => sum + point.y, 0) / window.length;

    result.push({ x: data[i].x, y: average });
  }

  return result;
};

/**
 * Format chart data for export
 */
export const formatChartDataForExport = (
  lines: { label: string; data: { x: string; y: number }[] }[]
): string[][] => {
  if (lines.length === 0) return [];

  const headers = ['Date', ...lines.map(line => line.label)];
  const xLabels = lines[0].data.map(point => point.x);

  const rows = xLabels.map(label => [
    label,
    ...lines.map(line => {
      const point = line.data.find(p => p.x === label);
      return point ? point.y.toFixed(2) : '0';
    })
  ]);

  return [headers, ...rows];
};

/**
 * Generate color palette for multiple lines
 */
export const generateChartColors = (count: number): string[] => {
  const baseColors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Orange
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#F97316'  // Orange
  ];

  if (count <= baseColors.length) {
    return baseColors.slice(0, count);
  }

  // Generate additional colors if needed
  const additionalColors = [];
  for (let i = baseColors.length; i < count; i++) {
    const hue = (i * 137.508) % 360; // Golden angle approximation
    additionalColors.push(`hsl(${hue}, 70%, 50%)`);
  }

  return [...baseColors, ...additionalColors];
};

/**
 * Calculate chart statistics
 */
export const calculateChartStats = (data: { x: string; y: number }[]): {
  min: number;
  max: number;
  average: number;
  median: number;
  standardDeviation: number;
  trend: 'increasing' | 'decreasing' | 'stable';
} => {
  if (data.length === 0) {
    return { min: 0, max: 0, average: 0, median: 0, standardDeviation: 0, trend: 'stable' };
  }

  const values = data.map(point => point.y);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const average = values.reduce((sum, val) => sum + val, 0) / values.length;

  // Calculate median
  const sortedValues = [...values].sort((a, b) => a - b);
  const median = sortedValues.length % 2 === 0
    ? (sortedValues[sortedValues.length / 2 - 1] + sortedValues[sortedValues.length / 2]) / 2
    : sortedValues[Math.floor(sortedValues.length / 2)];

  // Calculate standard deviation
  const variance = values.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / values.length;
  const standardDeviation = Math.sqrt(variance);

  // Determine trend
  const firstHalf = values.slice(0, Math.floor(values.length / 2));
  const secondHalf = values.slice(Math.floor(values.length / 2));
  const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
  
  const trendThreshold = standardDeviation * 0.5;
  let trend: 'increasing' | 'decreasing' | 'stable';
  
  if (secondAvg - firstAvg > trendThreshold) {
    trend = 'increasing';
  } else if (firstAvg - secondAvg > trendThreshold) {
    trend = 'decreasing';
  } else {
    trend = 'stable';
  }

  return { min, max, average, median, standardDeviation, trend };
};