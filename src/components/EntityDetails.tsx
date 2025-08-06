import React from 'react';
import { AlertTriangle, Clock, Target, Zap, CheckCircle2, X, Plus, Settings } from 'lucide-react';
import { Entity } from '../types';
import RiskScoreAdjuster from './RiskScoreAdjuster';

interface EntityDetailsProps {
  entity: Entity;
  onClose: () => void;
  onAddPattern: (entityId: string) => void;
  onScoreUpdate: (entityId: string, newScore: number, reason: string) => void;
}

const EntityDetails: React.FC<EntityDetailsProps> = ({ 
  entity, 
  onClose, 
  onAddPattern, 
  onScoreUpdate 
}) => {
  const getSeverityColor = (severity: number) => {
    if (severity >= 8) return 'text-red-400 bg-red-400/10';
    if (severity >= 6) return 'text-orange-400 bg-orange-400/10';
    if (severity >= 4) return 'text-yellow-400 bg-yellow-400/10';
    return 'text-green-400 bg-green-400/10';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      critical: 'text-red-400 bg-red-400/10 border-red-400/20',
      high: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
      medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
      low: 'text-green-400 bg-green-400/10 border-green-400/20'
    };
    return colors[priority as keyof typeof colors] || colors.low;
  };

  const getRecommendationIcon = (type: string) => {
    const icons = {
      configuration: CheckCircle2,
      firewall: Target,
      access: AlertTriangle,
      monitoring: Zap
    };
    const Icon = icons[type as keyof typeof icons] || CheckCircle2;
    return Icon;
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl">
      <div className="p-6 border-b border-slate-700 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">{entity.name}</h2>
          <p className="text-slate-400 capitalize">{entity.type} • {entity.department}</p>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
        >
          <X className="h-5 w-5 text-slate-400" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Risk Score */}
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">Current Risk Score</h3>
            <button
              onClick={() => onAddPattern(entity.id)}
              className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-lg transition-colors flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Pattern
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-3xl font-bold text-red-400">{entity.riskScore}</div>
            <div className="flex-1">
              <div className="bg-slate-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-3 rounded-full"
                  style={{ width: `${(entity.riskScore / 50) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>5</span>
                <span>25</span>
                <span>50</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <RiskScoreAdjuster
              entityId={entity.id}
              entityName={entity.name}
              currentScore={entity.riskScore}
              onScoreUpdate={onScoreUpdate}
            />
          </div>
        </div>

        {/* Patterns */}
        <div>
          <h3 className="text-lg font-medium text-white mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-orange-400" />
            Detected Patterns ({entity.patterns.length})
          </h3>
          <div className="space-y-3">
            {entity.patterns.map((pattern) => (
              <div key={pattern.id} className="bg-slate-900 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-white">{pattern.name}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(pattern.severity)}`}>
                    Severity: {pattern.severity}/10
                  </span>
                </div>
                <p className="text-slate-400 text-sm mb-3">{pattern.description}</p>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Frequency:</span>
                    <div className="text-white font-medium">{pattern.frequency}/day</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Impact:</span>
                    <div className="text-white font-medium">{pattern.impact}/10</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Last Detected:</span>
                    <div className="text-white font-medium">
                      {new Date(pattern.lastDetected).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h3 className="text-lg font-medium text-white mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2 text-blue-400" />
            Recommendations ({entity.recommendations.length})
          </h3>
          <div className="space-y-3">
            {entity.recommendations.map((rec) => {
              const Icon = getRecommendationIcon(rec.type);
              return (
                <div key={rec.id} className={`border rounded-lg p-4 ${getPriorityColor(rec.priority)}`}>
                  <div className="flex items-start space-x-3">
                    <Icon className="h-5 w-5 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{rec.title}</h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-medium capitalize">{rec.priority}</span>
                          <Clock className="h-3 w-3" />
                          <span className="text-xs">{rec.estimatedTime}</span>
                        </div>
                      </div>
                      <p className="text-sm mb-2">{rec.description}</p>
                      <p className="text-xs opacity-75">{rec.impact}</p>
                      <button className="mt-3 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg transition-colors">
                        Apply Recommendation
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntityDetails;