import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import MicroChart from './MicroChart';

interface AnimatedMetricCardProps {
  title: string;
  value: number;
  previousValue?: number;
  format?: 'currency' | 'percentage' | 'number';
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  chartData?: number[];
  chartType?: 'line' | 'bar' | 'area';
  isLoading?: boolean;
  onClick?: () => void;
  badge?: string;
  subtitle?: string;
}

const AnimatedMetricCard: React.FC<AnimatedMetricCardProps> = ({
  title,
  value,
  previousValue,
  format = 'number',
  icon,
  color = 'blue',
  chartData,
  chartType = 'line',
  isLoading = false,
  onClick,
  badge,
  subtitle
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const duration = 1000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(value, increment * step);
      setDisplayValue(current);
      
      if (step >= steps) {
        clearInterval(timer);
        setDisplayValue(value);
        setIsAnimating(false);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  const colorClasses = {
    blue: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 text-blue-600',
    green: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200 text-green-600',
    purple: 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 text-purple-600',
    orange: 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 text-orange-600',
    red: 'bg-gradient-to-br from-red-50 to-red-100 border-red-200 text-red-600'
  };

  const iconColorClasses = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    purple: 'text-purple-500',
    orange: 'text-orange-500',
    red: 'text-red-500'
  };

  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(val);
      case 'percentage':
        return `${val.toFixed(1)}%`;
      default:
        if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
        if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
        return Math.round(val).toLocaleString();
    }
  };

  const change = previousValue ? ((value - previousValue) / previousValue) * 100 : 0;

  const getTrendIcon = () => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div
      className={`relative p-6 rounded-xl border-2 ${colorClasses[color]} transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer group overflow-hidden ${
        onClick ? 'hover:shadow-xl' : ''
      }`}
      onClick={onClick}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10 transform rotate-12 translate-x-8 -translate-y-8">
        {icon}
      </div>
      
      {/* Badge */}
      {badge && (
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 bg-white bg-opacity-80 text-xs font-medium rounded-full">
            {badge}
          </span>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center rounded-xl">
          <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      )}

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          {icon && <div className={iconColorClasses[color]}>{icon}</div>}
        </div>

        {/* Value and trend */}
        <div className="flex items-baseline justify-between mb-2">
          <span className={`text-2xl font-bold text-gray-900 ${isAnimating ? 'animate-pulse' : ''}`}>
            {formatValue(displayValue)}
          </span>
          
          {previousValue && (
            <div className="flex items-center space-x-1">
              {getTrendIcon()}
              <span className={`text-sm font-medium ${
                change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-500'
              }`}>
                {Math.abs(change).toFixed(1)}%
              </span>
            </div>
          )}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-xs text-gray-500 mb-3">{subtitle}</p>
        )}

        {/* Micro chart */}
        {chartData && chartData.length > 0 && (
          <div className="mt-4 flex justify-center">
            <MicroChart
              data={chartData}
              type={chartType}
              color={color === 'blue' ? '#3B82F6' : color === 'green' ? '#10B981' : '#8B5CF6'}
              showTrend
            />
          </div>
        )}

        {/* Hover effect indicator */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </div>
  );
};

export default AnimatedMetricCard;