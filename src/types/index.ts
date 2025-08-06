export interface Entity {
  id: string;
  name: string;
  type: 'user' | 'device' | 'application';
  department: string;
  riskScore: number;
  status: 'low' | 'medium' | 'high' | 'critical';
  lastActivity: string;
  patterns: Pattern[];
  recommendations: Recommendation[];
}

export interface Pattern {
  id: string;
  name: string;
  severity: number;
  frequency: number;
  impact: number;
  description: string;
  lastDetected: string;
}

export interface Recommendation {
  id: string;
  type: 'configuration' | 'firewall' | 'access' | 'monitoring';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  impact: string;
  estimatedTime: string;
}

export interface RiskTrend {
  timestamp: string;
  score: number;
  entityId: string;
}

export interface Alert {
  id: string;
  entityId: string;
  type: 'anomaly' | 'threshold' | 'pattern';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface RiskRule {
  id: string;
  name: string;
  description: string;
  weight: number;
  threshold: number;
  enabled: boolean;
  category: 'access' | 'behavior' | 'network' | 'authentication';
}

export interface EntityFormData {
  name: string;
  type: 'user' | 'device' | 'application';
  department: string;
  initialRiskScore?: number;
}

export interface PatternFormData {
  name: string;
  description: string;
  severity: number;
  category: 'access' | 'behavior' | 'network' | 'authentication';
  threshold: number;
}