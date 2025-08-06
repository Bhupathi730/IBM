import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import EntityList from './components/EntityList';
import EntityDetails from './components/EntityDetails';
import AlertsPanel from './components/AlertsPanel';
import RiskTrendChart from './components/RiskTrendChart';
import { mockEntities, mockAlerts, mockRiskTrends } from './data/mockData';
import { useRealTimeUpdates } from './hooks/useRealTimeUpdates';
import { Entity } from './types';

function App() {
  const [selectedEntity, setSelectedEntity] = useState<Entity | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  
  const { entities, alerts, acknowledgeAlert } = useRealTimeUpdates(mockEntities, mockAlerts);

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

  return (
    <div className="min-h-screen bg-slate-900">
      <Header 
        unacknowledgedAlerts={unacknowledgedAlerts}
        onSearchChange={handleSearchChange}
      />
      
      <div className="p-6">
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
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;