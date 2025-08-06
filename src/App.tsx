import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import EntityList from './components/EntityList';
import EntityDetails from './components/EntityDetails';
import AlertsPanel from './components/AlertsPanel';
import RiskTrendChart from './components/RiskTrendChart';
import AddEntityModal from './components/AddEntityModal';
import RiskRulesPanel from './components/RiskRulesPanel';
import PatternConfigModal from './components/PatternConfigModal';
import { mockEntities, mockAlerts, mockRiskTrends, mockRiskRules } from './data/mockData';
import { useRealTimeUpdates } from './hooks/useRealTimeUpdates';
import { Entity } from './types';

function App() {
  const [selectedEntity, setSelectedEntity] = useState<Entity | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddEntityModal, setShowAddEntityModal] = useState(false);
  const [showPatternModal, setShowPatternModal] = useState(false);
  const [patternEntityId, setPatternEntityId] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'rules'>('overview');
  
  const { 
    entities, 
    alerts, 
    rules,
    acknowledgeAlert,
    addEntity,
    addPattern,
    updateRiskScore,
    updateRule,
    deleteRule,
    addRule
  } = useRealTimeUpdates(mockEntities, mockAlerts, mockRiskRules);

  // Filter entities based on search query
  const filteredEntities = useMemo(() => {
    if (!searchQuery) return entities;
    return entities.filter(entity =>
      entity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entity.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entity.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [entities, searchQuery]);

  const unacknowledgedAlerts = alerts.filter(alert => !alert.acknowledged).length;

  const handleEntitySelect = (entity: Entity) => {
    setSelectedEntity(entity);
  };

  const handleEntityClose = () => {
    setSelectedEntity(undefined);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleAddEntity = () => {
    setShowAddEntityModal(true);
  };

  const handleAddPattern = (entityId: string) => {
    setPatternEntityId(entityId);
    setShowPatternModal(true);
  };

  const selectedEntityForPattern = entities.find(e => e.id === patternEntityId);
  return (
    <div className="min-h-screen bg-slate-900">
      <Header 
        unacknowledgedAlerts={unacknowledgedAlerts}
        onSearchChange={handleSearchChange}
        onAddEntity={handleAddEntity}
      />
      
      <div className="p-6">
        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-slate-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-400 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300'
                }`}
              >
                Risk Overview
              </button>
              <button
                onClick={() => setActiveTab('rules')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'rules'
                    ? 'border-blue-400 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300'
                }`}
              >
                Risk Rules & Configuration
              </button>
            </nav>
          </div>
        </div>
        
        {activeTab === 'overview' ? (
          <>
            <Dashboard entities={entities} alerts={alerts} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <EntityList 
                  entities={filteredEntities}
                  onEntitySelect={handleEntitySelect}
                  selectedEntity={selectedEntity}
                />
              </div>
              <div>
                <AlertsPanel 
                  alerts={alerts}
                  onAlertAcknowledge={acknowledgeAlert}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <RiskTrendChart trends={mockRiskTrends} />
              </div>
              {selectedEntity && (
                <div>
                  <EntityDetails 
                    entity={selectedEntity}
                    onClose={handleEntityClose}
                    onAddPattern={handleAddPattern}
                    onScoreUpdate={updateRiskScore}
                  />
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <RiskRulesPanel
              rules={rules}
              onRuleUpdate={updateRule}
              onRuleDelete={deleteRule}
              onRuleAdd={addRule}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      <AddEntityModal
        isOpen={showAddEntityModal}
        onClose={() => setShowAddEntityModal(false)}
        onSubmit={addEntity}
      />

      <PatternConfigModal
        isOpen={showPatternModal}
        onClose={() => setShowPatternModal(false)}
        onSubmit={addPattern}
        entityId={patternEntityId}
        entityName={selectedEntityForPattern?.name || ''}
      />
    </div>
  );
}

export default App;