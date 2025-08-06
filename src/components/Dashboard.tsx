import React from 'react';
import { Activity, TrendingUp, Shield, AlertTriangle } from 'lucide-react';
import { Entity, Alert } from '../types';

interface DashboardProps {
  entities: Entity[];
  alerts: Alert[];
}

const Dashboard: React.FC<DashboardProps> = ({ entities, alerts }) => {
  const totalEntities = entities.length;
  const highRiskEntities = entities.filter(e => e.status === 'high' || e.status === 'critical').length;
  const activeAlerts = alerts.filter(a => !a.acknowledged).length;
  const averageRiskScore = Math.round(entities.reduce((sum, e) => sum + e.riskScore, 0) / entities.length);

  const stats = [
    {
      title: 'Total Entities',
      value: totalEntities.toString(),
      icon: Activity,
      color: 'blue',
      change: '+2.3%'
    },
    {
      title: 'High Risk Entities',
      value: highRiskEntities.toString(),
      icon: AlertTriangle,
      color: 'red',
      change: '+12.1%'
    },
    {
      title: 'Active Alerts',
      value: activeAlerts.toString(),
      icon: Shield,
      color: 'orange',
      change: '-5.2%'
    },
    {
      title: 'Avg Risk Score',
      value: averageRiskScore.toString(),
      icon: TrendingUp,
      color: 'green',
      change: '+3.7%'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'text-blue-400 bg-blue-400/10',
      red: 'text-red-400 bg-red-400/10',
      orange: 'text-orange-400 bg-orange-400/10',
      green: 'text-green-400 bg-green-400/10'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:bg-slate-750 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${getColorClasses(stat.color)}`}>
                <Icon className="h-6 w-6" />
              </div>
              <span className={`text-sm ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-slate-400 text-sm">{stat.title}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Dashboard;