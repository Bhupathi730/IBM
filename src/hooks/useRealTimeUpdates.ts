import { useState, useEffect, useCallback } from 'react';
import { Entity, Alert, RiskRule, EntityFormData, PatternFormData, Pattern, Recommendation } from '../types';

export const useRealTimeUpdates = (entities: Entity[], alerts: Alert[], rules: RiskRule[]) => {
  const [updatedEntities, setUpdatedEntities] = useState(entities);
  const [updatedAlerts, setUpdatedAlerts] = useState(alerts);
  const [updatedRules, setUpdatedRules] = useState(rules);

  // Simulate real-time risk score updates
  useEffect(() => {
    const interval = setInterval(() => {
      setUpdatedEntities(prevEntities => 
        prevEntities.map(entity => {
          // Small random fluctuations in risk score
          const fluctuation = (Math.random() - 0.5) * 2; // -1 to +1
          const newScore = Math.max(5, Math.min(50, entity.riskScore + fluctuation));
          
          // Update status based on new score
          let newStatus: 'low' | 'medium' | 'high' | 'critical';
          if (newScore >= 40) newStatus = 'critical';
          else if (newScore >= 25) newStatus = 'high';
          else if (newScore >= 15) newStatus = 'medium';
          else newStatus = 'low';
          
          return {
            ...entity,
            riskScore: Math.round(newScore),
            status: newStatus,
            lastActivity: new Date().toISOString()
          };
        })
      );
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  // Simulate new alerts
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance of new alert
        const newAlert: Alert = {
          id: `A${Date.now()}`,
          entityId: updatedEntities[Math.floor(Math.random() * updatedEntities.length)].id,
          type: ['anomaly', 'threshold', 'pattern'][Math.floor(Math.random() * 3)] as 'anomaly' | 'threshold' | 'pattern',
          severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as 'low' | 'medium' | 'high' | 'critical',
          message: [
            'Unusual network activity detected',
            'Failed authentication attempts exceeded threshold',
            'Suspicious file access pattern identified',
            'Privilege escalation attempt detected'
          ][Math.floor(Math.random() * 4)],
          timestamp: new Date().toISOString(),
          acknowledged: false
        };

        setUpdatedAlerts(prevAlerts => [newAlert, ...prevAlerts]);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [updatedEntities]);

  const acknowledgeAlert = useCallback((alertId: string) => {
    setUpdatedAlerts(prevAlerts =>
      prevAlerts.map(alert =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
  }, []);

  const addEntity = useCallback((data: EntityFormData) => {
    const newEntity: Entity = {
      id: `E${Date.now()}`,
      name: data.name,
      type: data.type,
      department: data.department,
      riskScore: data.initialRiskScore || 10,
      status: data.initialRiskScore && data.initialRiskScore >= 25 ? 'high' : 'low',
      lastActivity: new Date().toISOString(),
      patterns: [],
      recommendations: [
        {
          id: `R${Date.now()}`,
          type: 'monitoring',
          priority: 'medium',
          title: 'Enable Baseline Monitoring',
          description: 'Establish baseline behavior patterns for this new entity',
          impact: 'Improves future threat detection accuracy',
          estimatedTime: '5 minutes'
        }
      ]
    };
    
    setUpdatedEntities(prev => [...prev, newEntity]);
  }, []);

  const addPattern = useCallback((data: PatternFormData & { entityId: string }) => {
    const newPattern: Pattern = {
      id: `P${Date.now()}`,
      name: data.name,
      severity: data.severity,
      frequency: Math.floor(Math.random() * 10) + 1,
      impact: Math.floor(data.severity * 0.8) + Math.floor(Math.random() * 3),
      description: data.description,
      lastDetected: new Date().toISOString()
    };

    const newRecommendation: Recommendation = {
      id: `R${Date.now()}`,
      type: data.category === 'access' ? 'access' : 
            data.category === 'network' ? 'firewall' : 
            data.category === 'authentication' ? 'configuration' : 'monitoring',
      priority: data.severity >= 8 ? 'critical' : 
                data.severity >= 6 ? 'high' : 
                data.severity >= 4 ? 'medium' : 'low',
      title: `Address ${data.name}`,
      description: `Take action to mitigate the ${data.name.toLowerCase()} pattern`,
      impact: `Reduces risk from ${data.category} threats`,
      estimatedTime: data.severity >= 8 ? '2 minutes' : '10 minutes'
    setUpdatedEntities(prev => 
      prev.map(entity => 
        entity.id === data.entityId 
          ? { 
              ...entity, 
              patterns: [...entity.patterns, newPattern],
              recommendations: [...entity.recommendations, newRecommendation],
              riskScore: Math.min(50, entity.riskScore + Math.floor(data.severity / 2))
            }
          : entity
      )
    );
  }, []);

  const updateRiskScore = useCallback((entityId: string, newScore: number, reason: string) => {
    setUpdatedEntities(prev => 
      prev.map(entity => {
        if (entity.id === entityId) {
          let newStatus: 'low' | 'medium' | 'high' | 'critical';
          if (newScore >= 40) newStatus = 'critical';
          else if (newScore >= 25) newStatus = 'high';
          else if (newScore >= 15) newStatus = 'medium';
          else newStatus = 'low';
          
          return {
            ...entity,
            riskScore: newScore,
            status: newStatus,
            lastActivity: new Date().toISOString()
          };
        }
        return entity;
      })
    );

    // Create an alert for manual score adjustment
    const newAlert: Alert = {
      id: `A${Date.now()}`,
      entityId,
      type: 'threshold',
      severity: 'medium',
      message: `Risk score manually adjusted: ${reason}`,
      timestamp: new Date().toISOString(),
      acknowledged: false
    };
    
    setUpdatedAlerts(prev => [newAlert, ...prev]);
  }, []);

  const updateRule = useCallback((rule: RiskRule) => {
    setUpdatedRules(prev => 
      prev.map(r => r.id === rule.id ? rule : r)
    );
  }, []);

  const deleteRule = useCallback((ruleId: string) => {
    setUpdatedRules(prev => prev.filter(r => r.id !== ruleId));
  }, []);

  const addRule = useCallback((ruleData: Omit<RiskRule, 'id'>) => {
    const newRule: RiskRule = {
      ...ruleData,
      id: `RR${Date.now()}`
    };
    setUpdatedRules(prev => [...prev, newRule]);
  }, []);
    };
  return {
    entities: updatedEntities,
    alerts: updatedAlerts,
    rules: updatedRules,
    acknowledgeAlert,
    addEntity,
    addPattern,
    updateRiskScore,
    updateRule,
    deleteRule,
    addRule
  };
};