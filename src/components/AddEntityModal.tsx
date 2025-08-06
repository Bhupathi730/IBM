import React, { useState } from 'react';
import { X, User, Monitor, Layers, Plus } from 'lucide-react';
import { EntityFormData } from '../types';

interface AddEntityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EntityFormData) => void;
}

const AddEntityModal: React.FC<AddEntityModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<EntityFormData>({
    name: '',
    type: 'user',
    department: '',
    initialRiskScore: 10
  });

  const [errors, setErrors] = useState<Partial<EntityFormData>>({});

  const departments = [
    'Engineering', 'Finance', 'HR', 'Sales', 'Marketing', 
    'IT Infrastructure', 'Security', 'Operations', 'Legal'
  ];

  const validateForm = () => {
    const newErrors: Partial<EntityFormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }
    
    if (formData.initialRiskScore && (formData.initialRiskScore < 5 || formData.initialRiskScore > 50)) {
      newErrors.initialRiskScore = 'Risk score must be between 5 and 50';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      setFormData({ name: '', type: 'user', department: '', initialRiskScore: 10 });
      setErrors({});
      onClose();
    }
  };

  const getEntityIcon = (type: string) => {
    const icons = { user: User, device: Monitor, application: Layers };
    return icons[type as keyof typeof icons] || User;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <Plus className="h-5 w-5 mr-2 text-blue-400" />
            Add New Entity
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Entity Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
              placeholder="Enter entity name"
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Entity Type *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['user', 'device', 'application'] as const).map((type) => {
                const Icon = getEntityIcon(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, type })}
                    className={`p-3 rounded-lg border transition-colors flex flex-col items-center space-y-1 ${
                      formData.type === type
                        ? 'border-blue-400 bg-blue-400/10 text-blue-400'
                        : 'border-slate-600 bg-slate-900 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs capitalize">{type}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Department *
            </label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            {errors.department && <p className="text-red-400 text-xs mt-1">{errors.department}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Initial Risk Score (5-50)
            </label>
            <input
              type="number"
              min="5"
              max="50"
              value={formData.initialRiskScore}
              onChange={(e) => setFormData({ ...formData, initialRiskScore: parseInt(e.target.value) })}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
            />
            {errors.initialRiskScore && <p className="text-red-400 text-xs mt-1">{errors.initialRiskScore}</p>}
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
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add Entity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEntityModal;