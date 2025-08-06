import { Entity, Pattern, Recommendation, RiskTrend, Alert, RiskRule } from '../types';

export const mockEntities: Entity[] = [
  {
    id: 'E001',
    name: 'John Smith',
    type: 'user',
    department: 'Engineering',
    riskScore: 42,
    status: 'high',
    lastActivity: '2025-01-27T10:30:00Z',
    patterns: [
      {
        id: 'P001',
        name: 'Unusual Data Access',
        severity: 8,
        frequency: 5,
        impact: 9,
        description: 'Accessing sensitive files outside normal working hours',
        lastDetected: '2025-01-27T02:15:00Z'
      },
      {
        id: 'P002',
        name: 'Privilege Escalation',
        severity: 9,
        frequency: 3,
        impact: 10,
        description: 'Multiple attempts to access restricted systems',
        lastDetected: '2025-01-27T01:45:00Z'
      }
    ],
    recommendations: [
      {
        id: 'R001',
        type: 'access',
        priority: 'critical',
        title: 'Restrict Database Access',
        description: 'Temporarily limit database access permissions for this user',
        impact: 'Prevents unauthorized data extraction',
        estimatedTime: '5 minutes'
      },
      {
        id: 'R002',
        type: 'monitoring',
        priority: 'high',
        title: 'Enable Enhanced Logging',
        description: 'Activate detailed activity monitoring for this user',
        impact: 'Improves threat detection accuracy',
        estimatedTime: '2 minutes'
      }
    ]
  },
  {
    id: 'E002',
    name: 'Sarah Johnson',
    type: 'user',
    department: 'Finance',
    riskScore: 15,
    status: 'low',
    lastActivity: '2025-01-27T09:45:00Z',
    patterns: [
      {
        id: 'P003',
        name: 'Normal Usage Pattern',
        severity: 2,
        frequency: 10,
        impact: 1,
        description: 'Standard work hours and access patterns',
        lastDetected: '2025-01-27T09:45:00Z'
      }
    ],
    recommendations: [
      {
        id: 'R003',
        type: 'configuration',
        priority: 'low',
        title: 'Update Security Policies',
        description: 'Ensure latest security policies are applied',
        impact: 'Maintains security baseline',
        estimatedTime: '10 minutes'
      }
    ]
  },
  {
    id: 'E003',
    name: 'Dev-Server-01',
    type: 'device',
    department: 'IT Infrastructure',
    riskScore: 28,
    status: 'medium',
    lastActivity: '2025-01-27T11:20:00Z',
    patterns: [
      {
        id: 'P004',
        name: 'Suspicious Network Traffic',
        severity: 6,
        frequency: 7,
        impact: 5,
        description: 'Unusual outbound connections to unknown hosts',
        lastDetected: '2025-01-27T11:00:00Z'
      }
    ],
    recommendations: [
      {
        id: 'R004',
        type: 'firewall',
        priority: 'medium',
        title: 'Update Firewall Rules',
        description: 'Block suspicious outbound connections',
        impact: 'Prevents data exfiltration',
        estimatedTime: '15 minutes'
      }
    ]
  },
  {
    id: 'E004',
    name: 'CRM-Application',
    type: 'application',
    department: 'Sales',
    riskScore: 35,
    status: 'medium',
    lastActivity: '2025-01-27T10:15:00Z',
    patterns: [
      {
        id: 'P005',
        name: 'Failed Authentication',
        severity: 7,
        frequency: 12,
        impact: 6,
        description: 'Multiple failed login attempts detected',
        lastDetected: '2025-01-27T10:15:00Z'
      }
    ],
    recommendations: [
      {
        id: 'R005',
        type: 'configuration',
        priority: 'high',
        title: 'Enable Account Lockout',
        description: 'Implement account lockout after failed attempts',
        impact: 'Prevents brute force attacks',
        estimatedTime: '5 minutes'
      }
    ]
  }
];

export const mockRiskTrends: RiskTrend[] = [
  { timestamp: '2025-01-27T06:00:00Z', score: 25, entityId: 'E001' },
  { timestamp: '2025-01-27T07:00:00Z', score: 30, entityId: 'E001' },
  { timestamp: '2025-01-27T08:00:00Z', score: 35, entityId: 'E001' },
  { timestamp: '2025-01-27T09:00:00Z', score: 38, entityId: 'E001' },
  { timestamp: '2025-01-27T10:00:00Z', score: 42, entityId: 'E001' },
];

export const mockAlerts: Alert[] = [
  {
    id: 'A001',
    entityId: 'E001',
    type: 'anomaly',
    severity: 'critical',
    message: 'Unusual data access pattern detected for John Smith',
    timestamp: '2025-01-27T02:15:00Z',
    acknowledged: false
  },
  {
    id: 'A002',
    entityId: 'E003',
    type: 'threshold',
    severity: 'medium',
    message: 'Dev-Server-01 exceeded normal network traffic threshold',
    timestamp: '2025-01-27T11:00:00Z',
    acknowledged: false
  },
  {
    id: 'A003',
    entityId: 'E004',
    type: 'pattern',
    severity: 'high',
    message: 'Multiple failed authentication attempts on CRM-Application',
    timestamp: '2025-01-27T10:15:00Z',
    acknowledged: true
  }
];

export const mockRiskRules: RiskRule[] = [
  {
    id: 'RR001',
    name: 'Failed Login Attempts',
    description: 'Detects multiple failed authentication attempts',
    weight: 8,
    threshold: 5,
    enabled: true,
    category: 'authentication'
  },
  {
    id: 'RR002',
    name: 'Off-Hours Access',
    description: 'Monitors access attempts outside business hours',
    weight: 6,
    threshold: 3,
    enabled: true,
    category: 'behavior'
  },
  {
    id: 'RR003',
    name: 'Privilege Escalation',
    description: 'Detects attempts to gain elevated privileges',
    weight: 10,
    threshold: 1,
    enabled: true,
    category: 'access'
  },
  {
    id: 'RR004',
    name: 'Unusual Data Transfer',
    description: 'Monitors large or unusual data transfers',
    weight: 7,
    threshold: 10,
    enabled: true,
    category: 'network'
  },
  {
    id: 'RR005',
    name: 'Suspicious File Access',
    description: 'Detects access to sensitive files',
    weight: 9,
    threshold: 2,
    enabled: false,
    category: 'access'
  }
];