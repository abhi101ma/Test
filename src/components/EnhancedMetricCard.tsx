import React from 'react';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

interface EnhancedMetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  format?: 'currency' | 'percentage' | 'number' | 'score';
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  subtitle?: string;
  confidence?: number;
  tooltip?: string;
}

const EnhancedMetricCard: React.FC<EnhancedMetricCardProps> = ({
  title,
  value,
  change,
  format = 'number',
  icon,
  color = 'blue',
  subtitle,
  confidence,
  tooltip
}) => {
  const { settings } = useSettings();
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    green: 'bg-green-50 border-green-200 text-green-600',
    purple: 'bg-purple-50 border-purple-200 text-purple-600',
    orange: 'bg-orange-50 border-orange-200 text-orange-600',
    red: 'bg-red-50 border-red-200 text-red-600'
  };

  const iconColorClasses = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    purple: 'text-purple-500',
    orange: 'text-orange-500',
    red: 'text-red-500'
  };

  const formatValue = (val: string | number) => {
    if (typeof val === 'string') return val;
    
    switch (format) { // Use the global formatCurrency for currency
      case 'currency':
        return new Intl.NumberFormat('en-IN', { // Fallback if useSettings is not available
          style: 'currency',
          currency: settings.defaultCurrency,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(val);
      case 'percentage':
        return `${val.toFixed(1)}%`;
      case 'score':
        return `${val.toFixed(1)}/100`;
      default:
        if (val >= 10000000) {
          return (val / 10000000).toFixed(1) + 'Cr';
        }
        if (val >= 100000) {
          return (val / 100000).toFixed(1) + 'L';
        }
        if (val >= 1000) {
          return (val / 1000).toFixed(1) + 'K';
        }
        return val.toLocaleString();
    }
  };

  const getTrendIcon = () => {
    if (change === undefined) return null;
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getTrendColor = () => {
    if (change === undefined) return '';
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-500';
  };

  const getConfidenceColor = () => {
    if (!confidence) return 'text-gray-500';
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className={`p-4 sm:p-6 rounded-xl border-2 ${colorClasses[color]} transition-all duration-200 hover:shadow-lg hover:scale-105 relative group`}>
      {tooltip && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Info className="w-4 h-4 text-gray-400" />
          <div className="absolute top-6 right-0 bg-gray-900 text-white text-xs rounded-lg p-2 w-48 z-10 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
            {tooltip}
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs sm:text-sm font-medium text-gray-600">{title}</h3>
        {icon && <div className={iconColorClasses[color]}>{icon}</div>}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="text-xl sm:text-2xl font-bold text-gray-900">
            {formatValue(value)}
          </span>
          
          {change !== undefined && (
            <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
              {getTrendIcon()}
              <span className="text-xs sm:text-sm font-medium">
                {Math.abs(change).toFixed(1)}%
              </span>
            </div>
          )}
        </div>
        
        {subtitle && (
          <p className="text-xs text-gray-500 truncate">{subtitle}</p>
        )}
        
        {confidence !== undefined && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Confidence:</span>
            <span className={`font-medium ${getConfidenceColor()}`}>
              {confidence.toFixed(1)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedMetricCard;