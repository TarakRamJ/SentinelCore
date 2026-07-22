export interface Asset {
  assetId: string;
  type: 'SERVER' | 'CLOUD' | 'NETWORK'; // Maps to AssetType enum
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL'; // Maps to HealthStatus enum
  name: string;
  ip: string;
}

export interface PerformanceMetric {
  metricId: string;
  assetId: string;

  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkUsage: number;

  timestamp: string;
}

export interface Alert {
  alertId: string;
  assetId: string;
  assetName: string;              
  serverType?: string;           
  serverName?: string;
  metricName: string;
  metricValue: number;
  severity: string;
  status: string;  
  solution: string;               
}

export interface Incident {
  id: string;
  incidentTicket: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'ASSIGNED' | 'INVESTIGATION' | 'RESOLVED';
  type: string;
  sourceIp: string;
  impactSummary: string;
  assignedTeam: string;
  slaHours: number;
  etaMinutes: number;
  createdAt: string;
}

export interface IncidentStats {
  activeIncidents: number;
  resolvedIncidents: number;
  mttr: number;
}