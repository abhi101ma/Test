import React from 'react';

interface DonutChartProps {
  data: { label: string; value: number; color: string }[];
  size?: number;
  strokeWidth?: number;
  centerText?: string;
  centerSubtext?: string;
}

const DonutChart: React.FC<DonutChartProps> = ({
  data,
  size = 120,
  strokeWidth = 12,
  centerText,
  centerSubtext
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  let cumulativePercentage = 0;

  return (
    <div className="relative inline-block">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
        />
        
        {/* Data segments */}
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
          const strokeDashoffset = -((cumulativePercentage / 100) * circumference);
          
          cumulativePercentage += percentage;
          
          return (
            <circle
              key={index}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
              style={{
                animationDelay: `${index * 200}ms`
              }}
            />
          );
        })}
      </svg>
      
      {/* Center text */}
      {(centerText || centerSubtext) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {centerText && (
            <div className="text-lg font-bold text-gray-900">{centerText}</div>
          )}
          {centerSubtext && (
            <div className="text-xs text-gray-500">{centerSubtext}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default DonutChart;