import { useState, useEffect, useCallback } from 'react';
import { Entity, Alert } from '../types';

export const useRealTimeUpdates = (entities: Entity[], alerts: Alert[]) => {
  const [updatedEntities, setUpdatedEntities] = useState(entities);
  const [updatedAlerts, setUpdatedAlerts] = useState(alerts);

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

  return {
    entities: updatedEntities,
    alerts: updatedAlerts,
    acknowledgeAlert
  };
};