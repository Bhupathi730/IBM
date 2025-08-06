import React from 'react';
import { AlertTriangle, CheckCircle2, Clock, Filter } from 'lucide-react';
import { Alert } from '../types';

interface AlertsPanelProps {
  alerts: Alert[];
  onAlertAcknowledge: (alertId: string) => void;
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts, onAlertAcknowledge }) => {
  const getSeverityColor = (severity: string) => {
    const colors = {
      critical: 'text-red-400 bg-red-400/10 border-red-400/20',
      high: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
      medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
      low: 'text-green-400 bg-green-400/10 border-green-400/20'
    };
    return colors[severity as keyof typeof colors] || colors.low;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      anomaly: AlertTriangle,
      threshold: CheckCircle2,
      pattern: Filter
    };
    return icons[type as keyof typeof icons] || AlertTriangle;
  };

  const activeAlerts = alerts.filter(alert => !alert.acknowledged);
  const acknowledgedAlerts = alerts.filter(alert => alert.acknowledged);

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl">
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-red-400" />
          Security Alerts
        </h2>
        <div className="flex items-center space-x-4 mt-2 text-sm text-slate-400">
          <span>{activeAlerts.length} Active</span>
          <span>•</span>
          <span>{acknowledgedAlerts.length} Acknowledged</span>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {/* Active Alerts */}
        {activeAlerts.length > 0 && (
          <div className="p-4">
            <h3 className="text-sm font-medium text-white mb-3">Active Alerts</h3>
            <div className="space-y-3">
              {activeAlerts.map((alert) => {
                const TypeIcon = getTypeIcon(alert.type);
                return (
                  <div key={alert.id} className={`border rounded-lg p-4 ${getSeverityColor(alert.severity)}`}>
                    <div className="flex items-start space-x-3">
                      <TypeIcon className="h-5 w-5 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium uppercase tracking-wider">
                            {alert.severity} • {alert.type}
                          </span>
                          <div className="flex items-center text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(alert.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                        <p className="text-sm mb-3">{alert.message}</p>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onAlertAcknowledge(alert.id)}
                            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg transition-colors"
                          >
                            Acknowledge
                          </button>
                          <span className="text-xs opacity-75">Entity: {alert.entityId}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Acknowledged Alerts */}
        {acknowledgedAlerts.length > 0 && (
          <div className="p-4 border-t border-slate-700">
            <h3 className="text-sm font-medium text-slate-400 mb-3">Recently Acknowledged</h3>
            <div className="space-y-2">
              {acknowledgedAlerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="bg-slate-900 rounded-lg p-3 opacity-60">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">{alert.message}</span>
                    <div className="flex items-center text-xs text-slate-500">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Acknowledged
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {alerts.length === 0 && (
          <div className="p-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">All Clear</h3>
            <p className="text-slate-400">No security alerts at this time</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsPanel;