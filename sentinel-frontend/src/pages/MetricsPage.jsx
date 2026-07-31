import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { CustomLoader } from '../components/CustomLoader';

export const MetricsPage = () => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/api/metrics')
      .then(res => setMetrics(res.data))
      .catch(err => console.error("Metrics error", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <CustomLoader message="Fetching Performance Telemetry..." />;

  return (
    <div className="page-container">
      <h2 style={{ marginBottom: '20px', color: '#fff' }}>Infrastructure Telemetry & Performance Metrics</h2>

      <div className="table-panel">
        <h4 style={{ padding: '16px', color: 'var(--sentinelcore-text-muted)', margin: 0 }}>Metrics Telemetry Stream</h4>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Metric ID</th>
              <th>Asset ID</th>
              <th>CPU Usage</th>
              <th>Memory Usage</th>
              <th>Disk Usage</th>
              <th>Network Telemetry</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((m) => (
              <tr key={m.metricId}>
                <td style={{ fontFamily: 'monospace' }}>{m.metricId}</td>
                <td style={{ fontFamily: 'monospace' }}>{m.assetId}</td>
                <td><span style={{ color: m.cpuUsage > 85 ? 'var(--sentinelcore-red)' : 'var(--sentinelcore-green)' }}>{m.cpuUsage}%</span></td>
                <td>{m.memoryUsage}%</td>
                <td>{m.diskUsage}%</td>
                <td>{m.networkUsage} MB/s</td>
                <td>{new Date(m.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};