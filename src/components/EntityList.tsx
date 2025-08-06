import React from 'react';
import { User, Monitor, Layers, AlertCircle, TrendingUp } from 'lucide-react';
import { Entity } from '../types';

interface EntityListProps {
  entities: Entity[];
  onEntitySelect: (entity: Entity) => void;
  selectedEntity?: Entity;
}

const EntityList: React.FC<EntityListProps> = ({ entities, onEntitySelect, selectedEntity }) => {
  const getStatusColor = (status: string) => {
    const colors = {
      low: 'bg-green-500',
      medium: 'bg-yellow-500',
      high: 'bg-orange-500',
      critical: 'bg-red-500'
    };
    return colors[status as keyof typeof colors] || colors.low;
  };

  const getEntityIcon = (type: string) => {
    const icons = {
      user: User,
      device: Monitor,
      application: Layers
    };
    return icons[type as keyof typeof icons] || User;
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 40) return 'text-red-400';
    if (score >= 25) return 'text-orange-400';
    if (score >= 15) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl">
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-blue-400" />
          Entity Risk Assessment
        </h2>
        <p className="text-slate-400 mt-1">Monitor and assess entity risk levels</p>
      </div>
      
      <div className="divide-y divide-slate-700">
        {entities.map((entity) => {
          const Icon = getEntityIcon(entity.type);
          const isSelected = selectedEntity?.id === entity.id;
          
          return (
            <div
              key={entity.id}
              className={`p-6 cursor-pointer transition-all hover:bg-slate-750 ${
                isSelected ? 'bg-slate-750 border-r-4 border-blue-400' : ''
              }`}
              onClick={() => onEntitySelect(entity)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg bg-slate-700`}>
                    <Icon className="h-5 w-5 text-slate-300" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{entity.name}</h3>
                    <p className="text-sm text-slate-400 capitalize">{entity.type} • {entity.department}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getRiskScoreColor(entity.riskScore)}`}>
                      {entity.riskScore}
                    </div>
                    <div className="text-xs text-slate-400">Risk Score</div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(entity.status)}`}></div>
                    <span className="text-sm text-slate-300 capitalize">{entity.status}</span>
                  </div>
                  
                  {entity.patterns.some(p => p.severity >= 8) && (
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  )}
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Last Activity:</span>
                  <br />
                  <span className="text-white">
                    {new Date(entity.lastActivity).toLocaleTimeString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Patterns:</span>
                  <br />
                  <span className="text-white">{entity.patterns.length} detected</span>
                </div>
                <div>
                  <span className="text-slate-400">Recommendations:</span>
                  <br />
                  <span className="text-white">{entity.recommendations.length} pending</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EntityList;