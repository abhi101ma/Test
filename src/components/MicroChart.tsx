import React from 'react';

interface MicroChartProps {
  data: number[];
  type: 'line' | 'bar' | 'area';
  color?: string;
  height?: number;
  width?: number;
  showTrend?: boolean;
}

const MicroChart: React.FC<MicroChartProps> = ({
  data,
  type,
  color = '#3B82F6',
  height = 40,
  width = 100,
  showTrend = false
}) => {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => ({
    x: (index / (data.length - 1)) * width,
    y: height - ((value - min) / range) * height
  }));

  const trend = data[data.length - 1] > data[0] ? 'up' : 'down';
  const trendColor = trend === 'up' ? '#10B981' : '#EF4444';

  return (
    <div className="relative inline-block">
      <svg width={width} height={height} className="overflow-visible">
        {type === 'line' && (
          <path
            d={`M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`}
            fill="none"
            stroke={color}
            strokeWidth="2"
            className="animate-pulse"
          />
        )}
        
        {type === 'area' && (
          <path
            d={`M 0,${height} L ${points.map(p => `${p.x},${p.y}`).join(' L ')} L ${width},${height} Z`}
            fill={`url(#gradient-${color.replace('#', '')})`}
            stroke={color}
            strokeWidth="1"
          />
        )}
        
        {type === 'bar' && (
          data.map((value, index) => (
            <rect
              key={index}
              x={index * (width / data.length)}
              y={height - ((value - min) / range) * height}
              width={width / data.length - 1}
              height={((value - min) / range) * height}
              fill={color}
              className="animate-pulse"
            />
          ))
        )}
        
        {/* Gradient definitions */}
        <defs>
          <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>
      
      {showTrend && (
        <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${trend === 'up' ? 'bg-green-500' : 'bg-red-500'}`} />
      )}
    </div>
  );
};

export default MicroChart;