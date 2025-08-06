import React, { useState } from 'react';
import { Settings, Plus, ToggleLeft, ToggleRight, Edit3, Trash2 } from 'lucide-react';
import { RiskRule } from '../types';

interface RiskRulesPanelProps {
  rules: RiskRule[];
  onRuleUpdate: (rule: RiskRule) => void;
  onRuleDelete: (ruleId: string) => void;
  onRuleAdd: (rule: Omit<RiskRule, 'id'>) => void;
}

const RiskRulesPanel: React.FC<RiskRulesPanelProps> = ({ 
  rules, 
  onRuleUpdate, 
  onRuleDelete, 
  onRuleAdd 
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRule, setEditingRule] = useState<string | null>(null);
  const [newRule, setNewRule] = useState({
    name: '',
    description: '',
    weight: 1,
    threshold: 5,
    enabled: true,
    category: 'behavior' as const
  });

  const categories = [
    { value: 'access', label: 'Access Control', color: 'text-blue-400' },
    { value: 'behavior', label: 'Behavior Analysis', color: 'text-green-400' },
    { value: 'network', label: 'Network Activity', color: 'text-orange-400' },
    { value: 'authentication', label: 'Authentication', color: 'text-purple-400' }
  ];

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRule.name && newRule.description) {
      onRuleAdd(newRule);
      setNewRule({
        name: '',
        description: '',
        weight: 1,
        threshold: 5,
        enabled: true,
        category: 'behavior'
      });
      setShowAddForm(false);
    }
  };

  const handleRuleToggle = (rule: RiskRule) => {
    onRuleUpdate({ ...rule, enabled: !rule.enabled });
  };

  const getCategoryColor = (category: string) => {
    return categories.find(c => c.value === category)?.color || 'text-slate-400';
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <Settings className="h-5 w-5 mr-2 text-blue-400" />
            Risk Assessment Rules
          </h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Rule
          </button>
        </div>
        <p className="text-slate-400 mt-1">Configure risk scoring rules and thresholds</p>
      </div>

      {showAddForm && (
        <div className="p-6 border-b border-slate-700 bg-slate-900">
          <form onSubmit={handleAddRule} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Rule Name</label>
                <input
                  type="text"
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:border-blue-400 focus:outline-none"
                  placeholder="Enter rule name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
                <select
                  value={newRule.category}
                  onChange={(e) => setNewRule({ ...newRule, category: e.target.value as any })}
                  className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:border-blue-400 focus:outline-none"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
              <textarea
                value={newRule.description}
                onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:border-blue-400 focus:outline-none"
                rows={2}
                placeholder="Describe what this rule detects"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Weight (1-10)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={newRule.weight}
                  onChange={(e) => setNewRule({ ...newRule, weight: parseInt(e.target.value) })}
                  className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:border-blue-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Threshold</label>
                <input
                  type="number"
                  min="1"
                  value={newRule.threshold}
                  onChange={(e) => setNewRule({ ...newRule, threshold: parseInt(e.target.value) })}
                  className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:border-blue-400 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded transition-colors"
              >
                Add Rule
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-slate-600 text-slate-300 text-sm rounded hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="max-h-96 overflow-y-auto">
        {rules.map((rule) => (
          <div key={rule.id} className="p-4 border-b border-slate-700 last:border-b-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-medium text-white">{rule.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(rule.category)} bg-opacity-20`}>
                    {categories.find(c => c.value === rule.category)?.label}
                  </span>
                  <span className="text-xs text-slate-400">Weight: {rule.weight}</span>
                </div>
                <p className="text-sm text-slate-400 mb-2">{rule.description}</p>
                <div className="text-xs text-slate-500">
                  Threshold: {rule.threshold} | Status: {rule.enabled ? 'Active' : 'Disabled'}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => handleRuleToggle(rule)}
                  className="p-1 hover:bg-slate-700 rounded transition-colors"
                >
                  {rule.enabled ? (
                    <ToggleRight className="h-5 w-5 text-green-400" />
                  ) : (
                    <ToggleLeft className="h-5 w-5 text-slate-500" />
                  )}
                </button>
                <button
                  onClick={() => setEditingRule(rule.id)}
                  className="p-1 hover:bg-slate-700 rounded transition-colors"
                >
                  <Edit3 className="h-4 w-4 text-slate-400" />
                </button>
                <button
                  onClick={() => onRuleDelete(rule.id)}
                  className="p-1 hover:bg-slate-700 rounded transition-colors"
                >
                  <Trash2 className="h-4 w-4 text-red-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiskRulesPanel;