import React from 'react';

interface FunnelStage {
  label: string;
  value: number;
  color?: string;
}

interface FunnelChartProps {
  stages: FunnelStage[];
  title?: string;
  height?: number;
}

const FunnelChart: React.FC<FunnelChartProps> = ({
  stages,
  title,
  height = 300
}) => {
  const maxValue = Math.max(...stages.map(s => s.value));
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  if (!stages || stages.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
        <div className="text-center py-8">
          <p className="text-gray-500">No funnel data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
      
      <div className="relative" style={{ height }}>
        {stages.map((stage, index) => {
          const width = (stage.value / maxValue) * 100;
          const stageHeight = height / stages.length - 8;
          const top = index * (height / stages.length);
          const color = stage.color || colors[index % colors.length];
          
          return (
            <div key={stage.label} className="absolute w-full flex items-center" style={{ top, height: stageHeight }}>
              {/* Funnel segment */}
              <div className="flex items-center w-full">
                <div
                  className="rounded-lg shadow-sm transition-all duration-500 hover:shadow-md flex-shrink-0"
                  style={{
                    width: `${width}%`,
                    height: stageHeight,
                    backgroundColor: color,
                    marginLeft: `${(100 - width) / 2}%`,
                    position: 'relative'
                  }}
                >
                  {/* Optional: Add a subtle gradient overlay */}
                  <div 
                    className="absolute inset-0 rounded-lg"
                    style={{
                      background: `linear-gradient(135deg, ${color}ee, ${color}cc)`
                    }}
                  />
                </div>
                
                {/* Label and value positioned outside */}
                <div className="ml-4 text-gray-900 font-medium text-sm whitespace-nowrap flex-shrink-0">
                  <div className="font-semibold">{stage.label}</div>
                  <div className="text-lg font-bold" style={{ color }}>
                    {stage.value.toLocaleString()}
                  </div>
                </div>
                
                {/* Conversion rate */}
                {index > 0 && (
                  <div className="ml-4 text-xs text-gray-500 whitespace-nowrap flex-shrink-0">
                    <div className="bg-gray-100 px-2 py-1 rounded-full">
                      {((stage.value / stages[index - 1].value) * 100).toFixed(1)}% conversion
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 justify-center">
        {stages.map((stage, index) => (
          <div key={stage.label} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: stage.color || colors[index % colors.length] }}
            />
            <span className="text-sm text-gray-600">{stage.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FunnelChart;