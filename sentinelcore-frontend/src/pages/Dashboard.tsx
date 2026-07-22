import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from '@mui/material';

import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import MemoryRoundedIcon from '@mui/icons-material/MemoryRounded';

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

    if (!mountedRef.current) return;

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

    const interval = window.setInterval(() => {
      void fetchAllData();
    }, 2000);

    return () => {
      mountedRef.current = false;
      window.clearInterval(interval);
    };
  }, []);

  const totalAssets = assets.length;

  const activeAlerts = alerts.filter(
    (alert) => String(alert.status).toUpperCase() === 'OPEN'
  ).length;
 const avgCpu =
  metrics.length > 0
    ? Math.round(
        metrics.reduce(
          (sum, metric) => sum + Number(metric.cpuUsage),
          0
        ) / metrics.length
      )
    : 0;

  return (
    <Box sx={{ width: '100%', maxWidth: 1350, mx: 'auto', p: 4 }}>
      <Box
        sx={{
          mb: 4,
          p: 4,
          borderRadius: 4,
          color: '#fff',
          background: 'linear-gradient(135deg,#2563eb,#4f46e5 100%)',
          boxShadow: '0 20px 45px rgba(37,99,235,.25)',
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 700 }}>
          Security Dashboard
        </Typography>

        <Typography sx={{ mt: 1, opacity: 0.9 }}>
          Real-time monitoring of infrastructure, alerts and system performance.
        </Typography>
      </Box>

      <Box sx={{ width: '100%', mb: 4 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ height: '100%', borderRadius: 4, boxShadow: '0 10px 30px rgba(15,23,42,.08)' }}>
              <CardContent>
                <Inventory2RoundedIcon color="primary" sx={{ fontSize: 38, mb: 1 }} />
                <Typography color="text.secondary">Assets</Typography>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  {totalAssets}
                </Typography>
                <Chip label="Tracked" color="primary" sx={{ mt: 2 }} />
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ height: '100%', borderRadius: 4, boxShadow: '0 10px 30px rgba(15,23,42,.08)' }}>
              <CardContent>
                <WarningAmberRoundedIcon color="error" sx={{ fontSize: 38, mb: 1 }} />
                <Typography color="text.secondary">Open Alerts</Typography>
                <Typography variant="h3" color="error.main" sx={{ fontWeight: 700 }}>
                  {activeAlerts}
                </Typography>
                <Chip label="Needs Attention" color="error" sx={{ mt: 2 }} />
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ height: '100%', borderRadius: 4, boxShadow: '0 10px 30px rgba(15,23,42,.08)' }}>
              <CardContent>
                <MemoryRoundedIcon color="success" sx={{ fontSize: 38, mb: 1 }} />
                <Typography color="text.secondary">Average CPU</Typography>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  {avgCpu}%
                </Typography>
                <Chip label="Live" color="success" sx={{ mt: 2 }} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Card sx={{ borderRadius: 4, boxShadow: '0 10px 30px rgba(15,23,42,.08)', mb: 4 }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Current Status
          </Typography>

          <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
            Your infrastructure is being monitored continuously. Asset health,
            performance metrics and security alerts are refreshed automatically
            every two seconds. Review critical alerts below and investigate any
            systems that require immediate attention.
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 4, boxShadow: '0 10px 30px rgba(15,23,42,.08)' }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
            Recent Alerts
          </Typography>

          {alerts.length === 0 ? (
            <Box sx={{ py: 8, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No alerts available.
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              {alerts.slice(0, 5).map((alert, index) => {
                const critical = alert.severity === 'CRITICAL';
                
                // Color configuration mapping based on asset metrics severity states
                const statusColor = critical ? '#dc2626' : '#d97706';
                const statusBg = critical ? 'rgba(254, 242, 242, 0.4)' : 'rgba(254, 243, 199, 0.4)';
                const statusGlow = critical ? 'rgba(220, 38, 38, 0.08)' : 'rgba(217, 119, 6, 0.08)';

                return (
                  <Card
                    key={alert.alertId ?? `${alert.assetName}-${index}`}
                    sx={{
                      borderRadius: 4,
                      // FIXED: Premium glassmorphism item list update matching system colors
                      background: statusBg,
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      boxShadow: `0 4px 20px 0 ${statusGlow}`,
                      border: '1px solid rgba(255, 255, 255, 0.4)',
                      borderLeft: `5px solid ${statusColor}`, 
                      transition: 'all 0.25s ease-in-out',
                      '&:hover': {
                        transform: 'translateX(4px)',
                        background: 'rgba(255, 255, 255, 0.85)',
                        boxShadow: '0 10px 25px rgba(15,23,42,.08)',
                      },
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: 2,
                        }}
                      >
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {alert.assetName ?? 'Unknown Asset'}
                        </Typography>

                        <Chip
                          label={alert.severity}
                          color={critical ? 'error' : 'warning'}
                          sx={{ fontWeight: 700, borderRadius: 2 }}
                        />
                      </Box>

                      <Grid container spacing={2} sx={{ mb: 1 }}>
                        <Grid size={{ xs: 6, sm: 4 }}>
                          <Typography variant="body2" color="text.secondary">Metric</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 600, color: statusColor }}>
                            {alert.metricName}: {Math.round(alert.metricValue)}%
                          </Typography>
                        </Grid>
                        
                        <Grid size={{ xs: 6, sm: 8 }}>
                          <Typography variant="body2" color="text.secondary">Suggested Action</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {alert.solution}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                );
              })}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};