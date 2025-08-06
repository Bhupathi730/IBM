import React from 'react';
import { TrendingUp, Calendar } from 'lucide-react';
import { RiskTrend } from '../types';

interface RiskTrendChartProps {
  trends: RiskTrend[];
}

const RiskTrendChart: React.FC<RiskTrendChartProps> = ({ trends }) => {
  const maxScore = Math.max(...trends.map(t => t.score));
  const minScore = Math.min(...trends.map(t => t.score));

  const getPointPosition = (trend: RiskTrend, index: number) => {
    const x = (index / (trends.length - 1)) * 100;
    const y = 100 - ((trend.score - minScore) / (maxScore - minScore)) * 80;
    return { x, y };
  };

  const pathData = trends.map((trend, index) => {
    const { x, y } = getPointPosition(trend, index);
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-blue-400" />
          Risk Trend Analysis
        </h3>
        <div className="flex items-center text-sm text-slate-400">
          <Calendar className="h-4 w-4 mr-1" />
          Last 24 Hours
        </div>
      </div>

      <div className="relative h-64 bg-slate-900 rounded-lg p-4">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#334155" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
          
          {/* Trend line */}
          <path
            d={pathData}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
          
          {/* Data points */}
          {trends.map((trend, index) => {
            const { x, y } = getPointPosition(trend, index);
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                fill="#3B82F6"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>
        
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-slate-400 -ml-8">
          <span>{maxScore}</span>
          <span>{Math.round((maxScore + minScore) / 2)}</span>
          <span>{minScore}</span>
        </div>
        
        {/* X-axis labels */}
        <div className="absolute bottom-0 left-0 w-full flex justify-between text-xs text-slate-400 -mb-6">
          {trends.map((trend, index) => (
            <span key={index}>
              {new Date(trend.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          ))}
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-6 flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
          <span className="text-slate-400">Low Risk (5-15)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
          <span className="text-slate-400">Medium Risk (16-25)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-orange-400 rounded-full mr-2"></div>
          <span className="text-slate-400">High Risk (26-40)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
          <span className="text-slate-400">Critical Risk (41-50)</span>
        </div>
      </div>
    </div>
  );
};

export default RiskTrendChart;