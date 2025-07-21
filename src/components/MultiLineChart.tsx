import React, { useState, useRef } from 'react';
import { Download, Filter, TrendingUp } from 'lucide-react';

interface DataPoint {
  x: string;
  y: number;
}

interface LineData {
  label: string;
  data: DataPoint[];
  color: string;
  lineType?: 'solid' | 'dashed' | 'dotted';
}

interface Annotation {
  x: string;
  label: string;
  color: string;
  type: 'event' | 'milestone' | 'alert';
}

interface MultiLineChartProps {
  lines: LineData[];
  title?: string;
  height?: number;
  width?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  showTrendlines?: boolean;
  annotations?: Annotation[];
  onExportImage?: () => void;
  onExportData?: () => void;
  filterOptions?: {
    platforms: string[];
    selectedPlatform: string;
    onPlatformChange: (platform: string) => void;
  };
}

interface TooltipData {
  x: number;
  y: number;
  point: DataPoint;
  line: LineData;
  visible: boolean;
}

const MultiLineChart: React.FC<MultiLineChartProps> = ({
  lines,
  title,
  height = 300,
  width = 600,
  showGrid = true,
  showLegend = true,
  showTrendlines = false,
  annotations = [],
  onExportImage,
  onExportData,
  filterOptions
}) => {
  const [tooltip, setTooltip] = useState<TooltipData>({ x: 0, y: 0, point: { x: '', y: 0 }, line: { label: '', data: [], color: '' }, visible: false });
  const [hoveredLine, setHoveredLine] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  if (!lines || lines.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
        <div className="text-center py-8">
          <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No chart data available</p>
        </div>
      </div>
    );
  }

  const allValues = lines.flatMap(line => line.data.map(d => d.y));
  const maxValue = Math.max(...allValues);
  const minValue = Math.min(...allValues);
  const range = maxValue - minValue || 1;

  const xLabels = lines[0]?.data.map(d => d.x) || [];
  const padding = 60;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const getX = (index: number) => padding + (index / Math.max(xLabels.length - 1, 1)) * chartWidth;
  const getY = (value: number) => padding + chartHeight - ((value - minValue) / range) * chartHeight;

  // Calculate trendline using linear regression
  const calculateTrendline = (data: DataPoint[]): DataPoint[] => {
    if (data.length < 2) return [];
    
    const n = data.length;
    const sumX = data.reduce((sum, _, i) => sum + i, 0);
    const sumY = data.reduce((sum, point) => sum + point.y, 0);
    const sumXY = data.reduce((sum, point, i) => sum + i * point.y, 0);
    const sumXX = data.reduce((sum, _, i) => sum + i * i, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    return data.map((point, i) => ({
      x: point.x,
      y: slope * i + intercept
    }));
  };

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Find closest data point
    let closestPoint: { point: DataPoint; line: LineData; distance: number } | null = null;

    lines.forEach(line => {
      line.data.forEach((point, index) => {
        const pointX = getX(index);
        const pointY = getY(point.y);
        const distance = Math.sqrt(Math.pow(mouseX - pointX, 2) + Math.pow(mouseY - pointY, 2));
        
        if (distance < 20 && (!closestPoint || distance < closestPoint.distance)) {
          closestPoint = { point, line, distance };
        }
      });
    });

    if (closestPoint) {
      setTooltip({
        x: mouseX,
        y: mouseY,
        point: closestPoint.point,
        line: closestPoint.line,
        visible: true
      });
      setHoveredLine(closestPoint.line.label);
    } else {
      setTooltip(prev => ({ ...prev, visible: false }));
      setHoveredLine(null);
    }
  };

  const handleMouseLeave = () => {
    setTooltip(prev => ({ ...prev, visible: false }));
    setHoveredLine(null);
  };

  const getLineStrokeDashArray = (lineType?: string) => {
    switch (lineType) {
      case 'dashed': return '8,4';
      case 'dotted': return '2,2';
      default: return 'none';
    }
  };

  const exportAsImage = () => {
    if (!svgRef.current) return;
    
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    canvas.width = width;
    canvas.height = height;
    
    img.onload = () => {
      ctx?.drawImage(img, 0, 0);
      const link = document.createElement('a');
      link.download = `${title || 'chart'}.png`;
      link.href = canvas.toDataURL();
      link.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const exportAsCSV = () => {
    const csvData = [
      ['Date', ...lines.map(line => line.label)],
      ...xLabels.map((label, index) => [
        label,
        ...lines.map(line => line.data[index]?.y.toFixed(2) || '0')
      ])
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.download = `${title || 'chart'}-data.csv`;
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      {/* Header with title and controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Platform Filter */}
          {filterOptions && (
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterOptions.selectedPlatform}
                onChange={(e) => filterOptions.onPlatformChange(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {filterOptions.platforms.map(platform => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
            </div>
          )}
          
          {/* Export buttons */}
          <button
            onClick={onExportImage || exportAsImage}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Export as Image"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={onExportData || exportAsCSV}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Export Data as CSV"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="relative">
        <svg 
          ref={svgRef}
          width={width} 
          height={height} 
          className="overflow-visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Grid lines */}
          {showGrid && (
            <g>
              {/* Horizontal grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map(ratio => {
                const y = padding + chartHeight - (ratio * chartHeight);
                return (
                  <line
                    key={ratio}
                    x1={padding}
                    y1={y}
                    x2={padding + chartWidth}
                    y2={y}
                    stroke="#E5E7EB"
                    strokeWidth="1"
                    strokeDasharray={ratio === 0 ? "none" : "2,2"}
                    opacity="0.6"
                  />
                );
              })}
              
              {/* Vertical grid lines */}
              {xLabels.map((_, index) => {
                const x = getX(index);
                return (
                  <line
                    key={index}
                    x1={x}
                    y1={padding}
                    x2={x}
                    y2={padding + chartHeight}
                    stroke="#E5E7EB"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                    opacity="0.4"
                  />
                );
              })}
            </g>
          )}

          {/* Y-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map(ratio => {
            const y = padding + chartHeight - (ratio * chartHeight);
            const value = minValue + (ratio * range);
            return (
              <text
                key={ratio}
                x={padding - 15}
                y={y + 4}
                textAnchor="end"
                className="text-xs fill-gray-600"
                fontSize="12"
              >
                {value.toFixed(1)}x
              </text>
            );
          })}

          {/* X-axis labels */}
          {xLabels.map((label, index) => (
            <text
              key={index}
              x={getX(index)}
              y={height - 15}
              textAnchor="middle"
              className="text-xs fill-gray-600"
              fontSize="12"
            >
              {label}
            </text>
          ))}

          {/* Annotations */}
          {annotations.map((annotation, index) => {
            const xIndex = xLabels.indexOf(annotation.x);
            if (xIndex === -1) return null;
            
            const x = getX(xIndex);
            return (
              <g key={index}>
                <line
                  x1={x}
                  y1={padding}
                  x2={x}
                  y2={padding + chartHeight}
                  stroke={annotation.color}
                  strokeWidth="2"
                  strokeDasharray="4,2"
                  opacity="0.7"
                />
                <text
                  x={x}
                  y={padding - 10}
                  textAnchor="middle"
                  className="text-xs font-medium"
                  fill={annotation.color}
                  fontSize="11"
                >
                  {annotation.label}
                </text>
              </g>
            );
          })}

          {/* Lines and trendlines */}
          {lines.map((line, lineIndex) => {
            const points = line.data.map((point, index) => ({
              x: getX(index),
              y: getY(point.y)
            }));

            const pathData = points.reduce((path, point, index) => {
              return path + (index === 0 ? `M ${point.x} ${point.y}` : ` L ${point.x} ${point.y}`);
            }, '');

            const isHovered = hoveredLine === line.label;
            const opacity = hoveredLine ? (isHovered ? 1 : 0.3) : 0.8;

            return (
              <g key={lineIndex}>
                {/* Trendline */}
                {showTrendlines && (
                  (() => {
                    const trendData = calculateTrendline(line.data);
                    const trendPoints = trendData.map((point, index) => ({
                      x: getX(index),
                      y: getY(point.y)
                    }));
                    const trendPath = trendPoints.reduce((path, point, index) => {
                      return path + (index === 0 ? `M ${point.x} ${point.y}` : ` L ${point.x} ${point.y}`);
                    }, '');
                    
                    return (
                      <path
                        d={trendPath}
                        fill="none"
                        stroke={line.color}
                        strokeWidth="1"
                        strokeDasharray="3,3"
                        opacity="0.5"
                      />
                    );
                  })()
                )}
                
                {/* Main line */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={line.color}
                  strokeWidth={isHovered ? "3" : "2"}
                  strokeDasharray={getLineStrokeDashArray(line.lineType)}
                  opacity={opacity}
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredLine(line.label)}
                />
                
                {/* Data points */}
                {points.map((point, pointIndex) => (
                  <circle
                    key={pointIndex}
                    cx={point.x}
                    cy={point.y}
                    r={isHovered ? "6" : "4"}
                    fill={line.color}
                    stroke="white"
                    strokeWidth="2"
                    opacity={opacity}
                    className="transition-all duration-200 cursor-pointer hover:r-8"
                    onMouseEnter={() => setHoveredLine(line.label)}
                  />
                ))}
              </g>
            );
          })}

          {/* Axis lines */}
          <line
            x1={padding}
            y1={padding + chartHeight}
            x2={padding + chartWidth}
            y2={padding + chartHeight}
            stroke="#374151"
            strokeWidth="2"
          />
          <line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={padding + chartHeight}
            stroke="#374151"
            strokeWidth="2"
          />
        </svg>

        {/* Interactive Tooltip */}
        {tooltip.visible && (
          <div
            className="absolute z-10 bg-gray-900 text-white text-xs rounded-lg p-3 pointer-events-none shadow-lg border border-gray-700"
            style={{
              left: tooltip.x + 10,
              top: tooltip.y - 10,
              transform: tooltip.x > width - 150 ? 'translateX(-100%)' : 'none'
            }}
          >
            <div className="font-semibold text-white mb-1">{tooltip.line.label}</div>
            <div className="text-gray-300">Date: {tooltip.point.x}</div>
            <div className="text-gray-300">ROAS: {tooltip.point.y.toFixed(2)}x</div>
            <div 
              className="w-3 h-3 rounded-full mt-1"
              style={{ backgroundColor: tooltip.line.color }}
            />
          </div>
        )}
      </div>

      {/* Enhanced Legend */}
      {showLegend && (
        <div className="flex flex-wrap gap-6 justify-center mt-6 p-4 bg-gray-50 rounded-lg">
          {lines.map((line, index) => (
            <div 
              key={index} 
              className={`flex items-center space-x-3 cursor-pointer p-2 rounded-lg transition-all ${
                hoveredLine === line.label ? 'bg-white shadow-sm' : 'hover:bg-white'
              }`}
              onMouseEnter={() => setHoveredLine(line.label)}
              onMouseLeave={() => setHoveredLine(null)}
            >
              <div className="flex items-center space-x-2">
                <svg width="20" height="3">
                  <line
                    x1="0"
                    y1="1.5"
                    x2="20"
                    y2="1.5"
                    stroke={line.color}
                    strokeWidth="3"
                    strokeDasharray={getLineStrokeDashArray(line.lineType)}
                  />
                </svg>
                <div
                  className="w-3 h-3 rounded-full border-2 border-white"
                  style={{ backgroundColor: line.color }}
                />
              </div>
              <span className="text-sm font-medium text-gray-700">{line.label}</span>
              {showTrendlines && (
                <span className="text-xs text-gray-500">(with trend)</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiLineChart;