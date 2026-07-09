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

  const cpuMetrics = metrics.filter(
    (metric) => metric.name?.toUpperCase() === 'CPU'
  );

  const avgCpu = cpuMetrics.length
    ? Math.round(
        cpuMetrics.reduce((sum, metric) => sum + metric.value, 0) /
          cpuMetrics.length
      )
    : 0;

  return (
    <Box
      sx={{
        width: '100%', // <-- ADDED: Forces the wrapper to expand fully
        maxWidth: 1350,
        mx: 'auto',
        p: 4,
      }}
    >
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
        <Typography variant="h3" fontWeight={700}>
          Security Dashboard
        </Typography>

        <Typography
          sx={{
            mt: 1,
            opacity: 0.9,
          }}
        >
          Real-time monitoring of infrastructure, alerts and system performance.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* ADDED sx={{ display: 'flex' }} to all Grid items to allow vertical stretching */}
        <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
          <Card
            sx={{
              width: '100%', // <-- CHANGED from flex: 1 to enforce full horizontal width
              borderRadius: 4,
              boxShadow: '0 10px 30px rgba(15,23,42,.08)',
            }}
          >
            <CardContent>
              <Inventory2RoundedIcon
                color="primary"
                sx={{
                  fontSize: 38,
                  mb: 1,
                }}
              />
              <Typography color="text.secondary">Assets</Typography>
              <Typography variant="h3" fontWeight={700}>
                {totalAssets}
              </Typography>
              <Chip label="Tracked" color="primary" sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
          <Card
            sx={{
              width: '100%',
              borderRadius: 4,
              boxShadow: '0 10px 30px rgba(15,23,42,.08)',
            }}
          >
            <CardContent>
              <WarningAmberRoundedIcon
                color="error"
                sx={{
                  fontSize: 38,
                  mb: 1,
                }}
              />
              <Typography color="text.secondary">Open Alerts</Typography>
              <Typography variant="h3" fontWeight={700} color="error.main">
                {activeAlerts}
              </Typography>
              <Chip label="Needs Attention" color="error" sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
          <Card
            sx={{
              width: '100%',
              borderRadius: 4,
              boxShadow: '0 10px 30px rgba(15,23,42,.08)',
            }}
          >
            <CardContent>
              <MemoryRoundedIcon
                color="success"
                sx={{
                  fontSize: 38,
                  mb: 1,
                }}
              />
              <Typography color="text.secondary">Average CPU</Typography>
              <Typography variant="h3" fontWeight={700}>
                {avgCpu}%
              </Typography>
              <Chip label="Live" color="success" sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card
        sx={{
          width: '100%', // <-- ADDED to ensure bottom cards stretch fully too
          borderRadius: 4,
          boxShadow: '0 10px 30px rgba(15,23,42,.08)',
          mb: 4,
        }}
      >
        <CardContent>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
            Current Status
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              lineHeight: 1.8,
            }}
          >
            Your infrastructure is being monitored continuously. Asset health,
            performance metrics and security alerts are refreshed automatically
            every two seconds. Review critical alerts below and investigate any
            systems that require immediate attention.
          </Typography>
        </CardContent>
      </Card>

      <Card
        sx={{
          width: '100%', // <-- ADDED
          borderRadius: 4,
          boxShadow: '0 10px 30px rgba(15,23,42,.08)',
        }}
      >
        <CardContent>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
            Recent Alerts
          </Typography>

          {alerts.length === 0 ? (
            <Box
              sx={{
                py: 8,
                textAlign: 'center',
              }}
            >
              <Typography variant="h6" color="text.secondary">
                No alerts available.
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              {alerts.slice(0, 5).map((alert, index) => {
                const critical = alert.severity === 'CRITICAL';

                return (
                  <Card
                    key={alert.alertId ?? `${alert.assetName}-${index}`}
                    sx={{
                      width: '100%', // <-- ADDED
                      borderRadius: 4,
                      boxShadow: '0 10px 30px rgba(15,23,42,.08)',
                      border: '1px solid #e5e7eb',
                      transition: '.25s',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 15px 35px rgba(15,23,42,.12)',
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
                        <Typography variant="h6" fontWeight={700}>
                          {alert.assetName ?? 'Unknown Asset'}
                        </Typography>

                        <Chip
                          label={alert.severity}
                          color={critical ? 'error' : 'warning'}
                          sx={{
                            fontWeight: 700,
                          }}
                        />
                      </Box>

                      <Typography color="text.secondary">Metric</Typography>

                      <Typography fontWeight={600} sx={{ mb: 2 }}>
                        {alert.metricName}: {Math.round(alert.metricValue)}%
                      </Typography>

                      <Typography color="text.secondary">
                        Suggested Action
                      </Typography>

                      <Typography sx={{ mb: 2 }}>{alert.solution}</Typography>

                      <Chip
                        label={alert.status}
                        color={alert.status === 'OPEN' ? 'error' : 'success'}
                      />
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