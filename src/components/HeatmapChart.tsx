import React from 'react';

interface HeatmapData {
  x: string;
  y: string;
  value: number;
  label?: string;
}

interface HeatmapChartProps {
  data: HeatmapData[];
  title?: string;
  colorScheme?: 'blue' | 'green' | 'red' | 'purple';
  cellSize?: number;
}

const HeatmapChart: React.FC<HeatmapChartProps> = ({
  data,
  title,
  colorScheme = 'blue',
  cellSize = 60
}) => {
  const xLabels = [...new Set(data.map(d => d.x))];
  const yLabels = [...new Set(data.map(d => d.y))];
  const maxValue = Math.max(...data.map(d => d.value));

  const getColor = (value: number) => {
    const intensity = value / maxValue;
    const colors = {
      blue: `rgba(59, 130, 246, ${intensity})`,
      green: `rgba(16, 185, 129, ${intensity})`,
      red: `rgba(239, 68, 68, ${intensity})`,
      purple: `rgba(139, 92, 246, ${intensity})`
    };
    return colors[colorScheme];
  };

  const getCellData = (x: string, y: string) => {
    return data.find(d => d.x === x && d.y === y);
  };

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
        <div className="text-center py-8">
          <p className="text-gray-500">No data available for heatmap</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
      
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Header */}
          <div className="flex">
            <div style={{ width: cellSize * 2, height: cellSize }} className="flex-shrink-0" />
            {xLabels.map(label => (
              <div
                key={label}
                style={{ width: cellSize, height: cellSize }}
                className="flex items-center justify-center text-sm font-medium text-gray-600 border-b border-gray-200 px-1"
              >
                {label}
              </div>
            ))}
          </div>
          
          {/* Body */}
          {yLabels.map(yLabel => (
            <div key={yLabel} className="flex">
              <div
                style={{ width: cellSize * 2, height: cellSize }}
                className="flex items-center justify-start text-sm font-medium text-gray-600 border-r border-gray-200 px-2 flex-shrink-0"
                title={yLabel}
              >
                <span className="truncate">{yLabel}</span>
              </div>
              {xLabels.map(xLabel => {
                const cellData = getCellData(xLabel, yLabel);
                return (
                  <div
                    key={`${xLabel}-${yLabel}`}
                    style={{ 
                      width: cellSize, 
                      height: cellSize,
                      backgroundColor: cellData ? getColor(cellData.value) : '#f3f4f6'
                    }}
                    className="flex items-center justify-center text-sm font-medium text-gray-900 border border-gray-200 hover:ring-2 hover:ring-blue-500 cursor-pointer transition-all hover:z-10 relative"
                    title={cellData ? `${cellData.label || cellData.value}` : 'No data'}
                  >
                    {cellData ? cellData.value.toFixed(0) : '-'}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex items-center justify-center space-x-4 text-sm">
        <span className="text-gray-600">Engagement Rate:</span>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
          <span className="text-gray-600">Low</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-4 h-4 rounded ${
            colorScheme === 'blue' ? 'bg-blue-300' :
            colorScheme === 'green' ? 'bg-green-300' :
            colorScheme === 'red' ? 'bg-red-300' :
            'bg-purple-300'
          }`}></div>
          <span className="text-gray-600">Medium</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-4 h-4 rounded ${
            colorScheme === 'blue' ? 'bg-blue-600' :
            colorScheme === 'green' ? 'bg-green-600' :
            colorScheme === 'red' ? 'bg-red-600' :
            'bg-purple-600'
          }`}></div>
          <span className="text-gray-600">High</span>
        </div>
      </div>
    </div>
  );
};

export default HeatmapChart;