import React, { useState } from 'react';
import { TrendingUp, TrendingDown, RotateCcw, Save } from 'lucide-react';

interface RiskScoreAdjusterProps {
  entityId: string;
  entityName: string;
  currentScore: number;
  onScoreUpdate: (entityId: string, newScore: number, reason: string) => void;
}

const RiskScoreAdjuster: React.FC<RiskScoreAdjusterProps> = ({
  entityId,
  entityName,
  currentScore,
  onScoreUpdate
}) => {
  const [adjustedScore, setAdjustedScore] = useState(currentScore);
  const [reason, setReason] = useState('');
  const [showAdjuster, setShowAdjuster] = useState(false);

  const handleScoreChange = (value: number) => {
    setAdjustedScore(Math.max(5, Math.min(50, value)));
  };

  const handleSave = () => {
    if (reason.trim()) {
      onScoreUpdate(entityId, adjustedScore, reason);
      setReason('');
      setShowAdjuster(false);
    }
  };

  const handleReset = () => {
    setAdjustedScore(currentScore);
    setReason('');
  };

  const scoreDifference = adjustedScore - currentScore;
  const getRiskColor = (score: number) => {
    if (score >= 40) return 'text-red-400';
    if (score >= 25) return 'text-orange-400';
    if (score >= 15) return 'text-yellow-400';
    return 'text-green-400';
  };

  if (!showAdjuster) {
    return (
      <button
        onClick={() => setShowAdjuster(true)}
        className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm rounded-lg transition-colors flex items-center"
      >
        <TrendingUp className="h-4 w-4 mr-1" />
        Adjust Score
      </button>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-600 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-white">Risk Score Adjustment</h4>
        <button
          onClick={() => setShowAdjuster(false)}
          className="text-slate-400 hover:text-white text-sm"
        >
          Cancel
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">Current Score:</span>
          <span className={`font-bold ${getRiskColor(currentScore)}`}>{currentScore}</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">New Score:</span>
            <span className={`font-bold ${getRiskColor(adjustedScore)}`}>{adjustedScore}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleScoreChange(adjustedScore - 5)}
              className="p-1 bg-slate-700 hover:bg-slate-600 rounded text-slate-300"
            >
              <TrendingDown className="h-4 w-4" />
            </button>
            
            <input
              type="range"
              min="5"
              max="50"
              value={adjustedScore}
              onChange={(e) => handleScoreChange(parseInt(e.target.value))}
              className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
            
            <button
              onClick={() => handleScoreChange(adjustedScore + 5)}
              className="p-1 bg-slate-700 hover:bg-slate-600 rounded text-slate-300"
            >
              <TrendingUp className="h-4 w-4" />
            </button>
          </div>

          <div className="text-center">
            <input
              type="number"
              min="5"
              max="50"
              value={adjustedScore}
              onChange={(e) => handleScoreChange(parseInt(e.target.value))}
              className="w-20 bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white text-center text-sm focus:border-blue-400 focus:outline-none"
            />
          </div>
        </div>

        {scoreDifference !== 0 && (
          <div className={`text-sm text-center ${scoreDifference > 0 ? 'text-red-400' : 'text-green-400'}`}>
            {scoreDifference > 0 ? '+' : ''}{scoreDifference} points
          </div>
        )}

        <div>
          <label className="block text-sm text-slate-400 mb-1">Reason for adjustment:</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain why you're adjusting this score..."
            className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:border-blue-400 focus:outline-none"
            rows={2}
          />
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleReset}
            className="flex-1 px-3 py-2 border border-slate-600 text-slate-300 text-sm rounded hover:bg-slate-700 transition-colors flex items-center justify-center"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={!reason.trim() || scoreDifference === 0}
            className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white text-sm rounded transition-colors flex items-center justify-center"
          >
            <Save className="h-4 w-4 mr-1" />
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default RiskScoreAdjuster;