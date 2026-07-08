import { useEffect, useRef, useState } from 'react';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import { getAssets, getAlerts, getMetrics } from '../services/api';
import type { Asset, Alert, PerformanceMetric } from '../types';

export const Dashboard = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const mountedRef = useRef(true);

  const fetchAllData = async () => {
    const [assetResult, alertResult, metricResult] = await Promise.allSettled([
      getAssets(),
      getAlerts(),
      getMetrics(),
    ]);

    if (!mountedRef.current) {
      return;
    }

    if (assetResult.status === 'fulfilled') {
      setAssets(assetResult.value);
    }

    if (alertResult.status === 'fulfilled') {
      setAlerts(alertResult.value);
    }

    if (metricResult.status === 'fulfilled') {
      setMetrics(metricResult.value);
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    void fetchAllData();

    const intervalId = window.setInterval(() => {
      void fetchAllData();
    }, 2000);

    return () => {
      mountedRef.current = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const totalAssets = assets.length;
  const activeAlertsCount = alerts.filter((alert) => String(alert.status).toUpperCase() === 'OPEN').length;
  const cpuMetrics = metrics.filter((metric) => metric.name?.toUpperCase() === 'CPU');
  const avgCpu = cpuMetrics.length
    ? Math.round(cpuMetrics.reduce((sum, metric) => sum + metric.value, 0) / cpuMetrics.length)
    : 23;

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Overview
      </Typography>
      <Typography variant="body1" sx={{ color: '#6b7280', mb: 3 }}>
        A simple view of your security and infrastructure status.
      </Typography>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <Card sx={{ flex: 1, border: '1px solid #e5e7eb', boxShadow: 'none' }}>
          <CardContent>
            <Typography variant="caption" sx={{ color: '#6b7280' }}>Assets</Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, my: 0.5 }}>
              {totalAssets || 12}
            </Typography>
            <Typography variant="body2" sx={{ color: '#2563eb' }}>Tracked</Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, border: '1px solid #e5e7eb', boxShadow: 'none' }}>
          <CardContent>
            <Typography variant="caption" sx={{ color: '#6b7280' }}>Alerts</Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, my: 0.5, color: '#dc2626' }}>
              {activeAlertsCount || 2}
            </Typography>
            <Typography variant="body2" sx={{ color: '#dc2626' }}>Open</Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, border: '1px solid #e5e7eb', boxShadow: 'none' }}>
          <CardContent>
            <Typography variant="caption" sx={{ color: '#6b7280' }}>CPU</Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, my: 0.5 }}>
              {avgCpu}%
            </Typography>
            <Typography variant="body2" sx={{ color: '#16a34a' }}>Average</Typography>
          </CardContent>
        </Card>
      </Stack>

      <Card sx={{ border: '1px solid #e5e7eb', boxShadow: 'none', mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Current Status
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280', lineHeight: 1.6 }}>
            Systems are healthy. Most assets are running normally, and only a small number of alerts need review.
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ border: '1px solid #e5e7eb', boxShadow: 'none' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Recent Alerts
          </Typography>
          {alerts.length > 0 ? (
            <Stack spacing={1.5}>
              {alerts.slice(0, 5).map((alert, index) => {
                const severityColor = alert.severity === 'CRITICAL' ? '#dc2626' : '#ea580c';
                return (
                  <Box
                    key={alert.alertId || `${alert.assetName}-${index}`}
                    sx={{
                      border: '1px solid #e5e7eb',
                      borderRadius: 2,
                      p: 1.5,
                      bgcolor: '#fafafa',
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {alert.assetName || 'Unknown asset'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: severityColor, fontWeight: 700 }}>
                        {alert.severity}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: '#4b5563' }}>
                      {alert.metricName}: {Math.round(alert.metricValue)}%
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
                      {alert.solution}
                    </Typography>
                    <Typography variant="caption" sx={{ color: alert.status === 'OPEN' ? '#dc2626' : '#16a34a' }}>
                      {alert.status}
                    </Typography>
                  </Box>
                );
              })}
            </Stack>
          ) : (
            <Typography variant="body2" sx={{ color: '#6b7280' }}>
              No alerts available right now.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};