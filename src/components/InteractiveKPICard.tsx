import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Info, Pin, PinOff, ExternalLink } from 'lucide-react';
import MicroChart from './MicroChart';

interface InteractiveKPICardProps {
  title: string;
  value: number;
  previousValue?: number;
  format?: 'currency' | 'percentage' | 'number';
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  chartData?: number[];
  chartType?: 'line' | 'bar' | 'area';
  subtitle?: string;
  tooltip?: string;
  isPinned?: boolean;
  onPin?: () => void;
  onDrillDown?: () => void;
  goal?: {
    target: number;
    label: string;
  };
  alerts?: {
    type: 'warning' | 'success' | 'info';
    message: string;
  }[];
}

const InteractiveKPICard: React.FC<InteractiveKPICardProps> = ({
  title,
  value,
  previousValue,
  format = 'number',
  icon,
  color = 'blue',
  chartData,
  chartType = 'line',
  subtitle,
  tooltip,
  isPinned = false,
  onPin,
  onDrillDown,
  goal,
  alerts
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
  const goalProgress = goal ? (value / goal.target) * 100 : 0;

  const getTrendIcon = () => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return null;
  };

  return (
    <div
      className={`relative p-6 rounded-xl border-2 ${colorClasses[color]} transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer group ${
        isPinned ? 'ring-2 ring-yellow-400' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onDrillDown}
    >
      {/* Pin button */}
      {onPin && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPin();
          }}
          className={`absolute top-2 right-2 p-1 rounded-full transition-all ${
            isPinned ? 'bg-yellow-100 text-yellow-600' : 'bg-white bg-opacity-50 text-gray-400 hover:text-gray-600'
          }`}
        >
          {isPinned ? <Pin className="w-4 h-4" /> : <PinOff className="w-4 h-4" />}
        </button>
      )}

      {/* Tooltip */}
      {tooltip && (
        <div className="absolute top-2 left-2">
          <button
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <Info className="w-4 h-4" />
          </button>
          {showTooltip && (
            <div className="absolute top-6 left-0 bg-gray-900 text-white text-xs rounded-lg p-2 w-48 z-10">
              {tooltip}
              <div className="absolute -top-1 left-2 w-2 h-2 bg-gray-900 transform rotate-45"></div>
            </div>
          )}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {icon && <div className={iconColorClasses[color]}>{icon}</div>}
      </div>

      {/* Value and trend */}
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-2xl font-bold text-gray-900">
          {formatValue(value)}
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

      {/* Goal progress */}
      {goal && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>{goal.label}</span>
            <span>{goalProgress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                goalProgress >= 100 ? 'bg-green-500' :
                goalProgress >= 80 ? 'bg-blue-500' :
                goalProgress >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(goalProgress, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Alerts */}
      {alerts && alerts.length > 0 && (
        <div className="mb-3 space-y-1">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className={`text-xs px-2 py-1 rounded-full ${
                alert.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                alert.type === 'success' ? 'bg-green-100 text-green-800' :
                'bg-blue-100 text-blue-800'
              }`}
            >
              {alert.message}
            </div>
          ))}
        </div>
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

      {/* Drill-down indicator */}
      {onDrillDown && isHovered && (
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <ExternalLink className="w-4 h-4 text-gray-400" />
        </div>
      )}

      {/* Hover effect */}
      <div className="absolute inset-0 bg-white bg-opacity-0 group-hover:bg-opacity-10 rounded-xl transition-all duration-300 pointer-events-none"></div>
    </div>
  );
};

export default InteractiveKPICard;