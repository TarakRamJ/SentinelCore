export interface Asset {
  assetId: string;
  type: 'SERVER' | 'CLOUD' | 'NETWORK'; // Maps to AssetType enum
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL'; // Maps to HealthStatus enum
  name: string;
}

export interface PerformanceMetric {
  metricId: string;
  name: string;      // e.g., "CPU", "Memory"
  value: number;     // e.g., 23.5
  timestamp: string;
}

export interface Alert {
  alertId: string;
  assetId: string;
  assetName: string;              // e.g., "DB-SRV-12"
  serverType?: string;            // e.g., "DB-SRV"
  serverName?: string;            // e.g., "12"
  metricName: string;             // e.g., "CPU"
  metricValue: number;            // e.g., 94
  severity: string;               // e.g., "CRITICAL", "HIGH"
  status: string;                 // e.g., "OPEN", "RESOLVED"
  solution: string;               // e.g., "Auto-scaled", "Cleanup scheduled"
}