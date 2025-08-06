import React, { useState } from 'react';
import { X, AlertTriangle, Plus } from 'lucide-react';
import { PatternFormData } from '../types';

interface PatternConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PatternFormData & { entityId: string }) => void;
  entityId: string;
  entityName: string;
}

const PatternConfigModal: React.FC<PatternConfigModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  entityId, 
  entityName 
}) => {
  const [formData, setFormData] = useState<PatternFormData>({
    name: '',
    description: '',
    severity: 5,
    category: 'behavior',
    threshold: 3
  });

  const [errors, setErrors] = useState<Partial<PatternFormData>>({});

  const categories = [
    { value: 'access', label: 'Access Control Violations' },
    { value: 'behavior', label: 'Behavioral Anomalies' },
    { value: 'network', label: 'Network Activity' },
    { value: 'authentication', label: 'Authentication Issues' }
  ];

  const patternTemplates = [
    {
      name: 'Unusual Login Hours',
      description: 'Login attempts outside normal business hours',
      severity: 6,
      category: 'authentication' as const,
      threshold: 2
    },
    {
      name: 'Excessive File Access',
      description: 'Accessing unusually large number of files',
      severity: 7,
      category: 'access' as const,
      threshold: 10
    },
    {
      name: 'Privilege Escalation',
      description: 'Attempts to gain higher system privileges',
      severity: 9,
      category: 'access' as const,
      threshold: 1
    },
    {
      name: 'Data Exfiltration Pattern',
      description: 'Large data transfers to external locations',
      severity: 8,
      category: 'network' as const,
      threshold: 5
    }
  ];

  const validateForm = () => {
    const newErrors: Partial<PatternFormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Pattern name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (formData.severity < 1 || formData.severity > 10) {
      newErrors.severity = 'Severity must be between 1 and 10';
    }
    
    if (formData.threshold < 1) {
      newErrors.threshold = 'Threshold must be at least 1';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({ ...formData, entityId });
      setFormData({
        name: '',
        description: '',
        severity: 5,
        category: 'behavior',
        threshold: 3
      });
      setErrors({});
      onClose();
    }
  };

  const applyTemplate = (template: typeof patternTemplates[0]) => {
    setFormData(template);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-orange-400" />
            Add Pattern for {entityName}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>

        {/* Pattern Templates */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-slate-300 mb-3">Quick Templates</h3>
          <div className="grid grid-cols-2 gap-2">
            {patternTemplates.map((template, index) => (
              <button
                key={index}
                onClick={() => applyTemplate(template)}
                className="p-3 text-left bg-slate-900 border border-slate-600 rounded-lg hover:border-slate-500 transition-colors"
              >
                <div className="text-sm font-medium text-white">{template.name}</div>
                <div className="text-xs text-slate-400 mt-1">{template.description}</div>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-xs text-orange-400">Severity: {template.severity}</span>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="text-xs text-slate-400 capitalize">{template.category}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Pattern Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
              placeholder="Enter pattern name"
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
              rows={3}
              placeholder="Describe what this pattern detects"
            />
            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Severity (1-10) *
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: parseInt(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
              />
              {errors.severity && <p className="text-red-400 text-xs mt-1">{errors.severity}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Detection Threshold *
            </label>
            <input
              type="number"
              min="1"
              value={formData.threshold}
              onChange={(e) => setFormData({ ...formData, threshold: parseInt(e.target.value) })}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
            />
            <p className="text-xs text-slate-400 mt-1">
              Number of occurrences before triggering this pattern
            </p>
            {errors.threshold && <p className="text-red-400 text-xs mt-1">{errors.threshold}</p>}
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Pattern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatternConfigModal;