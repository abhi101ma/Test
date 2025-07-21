import React from 'react';
import { AlertTriangle, TrendingDown, TrendingUp, Bell, CheckCircle, X } from 'lucide-react';

interface ActionableAlertProps {
  type: 'warning' | 'critical' | 'info' | 'success';
  title: string;
  description: string;
  metric?: {
    current: number;
    target: number;
    format?: 'currency' | 'percentage' | 'number';
  };
  actions: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  }[];
  onDismiss?: () => void;
  trend?: 'up' | 'down' | 'stable';
}

const ActionableAlert: React.FC<ActionableAlertProps> = ({
  type,
  title,
  description,
  metric,
  actions,
  onDismiss,
  trend
}) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'critical':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Bell className="w-5 h-5 text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const formatMetricValue = (value: number, format?: string) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          minimumFractionDigits: 0
        }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      default:
        return value.toLocaleString();
    }
  };

  return (
    <div className={`rounded-xl border-2 p-4 ${getTypeStyles()} transition-all duration-200 hover:shadow-lg`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-semibold">{title}</h4>
              {trend && getTrendIcon()}
            </div>
            
            <p className="text-sm opacity-90 mb-3">{description}</p>
            
            {/* Metric Display */}
            {metric && (
              <div className="bg-white bg-opacity-50 rounded-lg p-3 mb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs opacity-75">Current</p>
                    <p className="font-bold text-lg">
                      {formatMetricValue(metric.current, metric.format)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs opacity-75">Target</p>
                    <p className="font-semibold">
                      {formatMetricValue(metric.target, metric.format)}
                    </p>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="mt-2">
                  <div className="w-full bg-white bg-opacity-50 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        metric.current >= metric.target ? 'bg-green-500' :
                        metric.current >= metric.target * 0.8 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min((metric.current / metric.target) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs mt-1 opacity-75">
                    {((metric.current / metric.target) * 100).toFixed(1)}% of target
                  </p>
                </div>
              </div>
            )}
            
            {/* Action buttons */}
            <div className="flex flex-wrap gap-2">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                    action.variant === 'primary'
                      ? 'bg-white text-gray-900 hover:bg-gray-100 shadow-sm'
                      : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Dismiss button */}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 p-1 hover:bg-white hover:bg-opacity-50 rounded-full transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ActionableAlert;