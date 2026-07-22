import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  Stack,
  Chip,
  Grid,
  LinearProgress,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { getIncidents, getIncidentStats, updateIncidentStatus } from '../services/api';
import type { Incident, IncidentStats } from '../types';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import AssignmentIndRoundedIcon from '@mui/icons-material/AssignmentIndRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

const WORKFLOW_STEPS = ['OPEN', 'ASSIGNED', 'INVESTIGATION', 'RESOLVED'] as const;

// Maps status -> completion percentage, used to drive the progress bar
// off real application state instead of a hardcoded number.
const PROGRESS_MAP: Record<string, number> = {
  OPEN: 25,
  ASSIGNED: 50,
  INVESTIGATION: 75,
  RESOLVED: 100
};

const SEVERITY_COLOR = {
  LOW: 'success',
  MEDIUM: 'warning',
  HIGH: 'error',
  CRITICAL: 'error'
} as const;

const STATUS_COLOR = {
  OPEN: 'error',
  ASSIGNED: 'warning',
  INVESTIGATION: 'info',
  RESOLVED: 'success'
} as const;

export const Incidents = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [stats, setStats] = useState<IncidentStats | null>(null);
  const [lastScanAt, setLastScanAt] = useState<Date | null>(null);
  const [secondsSinceScan, setSecondsSinceScan] = useState(0);

  const fetchIncidentData = () => {
    Promise.all([getIncidents(), getIncidentStats()])
      .then(([incidentList, aggregateStats]) => {
        setIncidents(incidentList);
        setStats(aggregateStats);
        setLastScanAt(new Date());
      })
      .catch((err) => console.error('Error loading operational incidents telemetry:', err));
  };

  useEffect(() => {
    fetchIncidentData();
    const interval = setInterval(fetchIncidentData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Ticks the "last scan completed X seconds ago" label between fetches
  useEffect(() => {
    if (!lastScanAt) return;
    const tick = setInterval(() => {
      setSecondsSinceScan(Math.floor((Date.now() - lastScanAt.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(tick);
  }, [lastScanAt]);

  const handleStatusTransition = async (id: string, nextStatus: string) => {
    try {
      await updateIncidentStatus(id, nextStatus);
      fetchIncidentData();
    } catch (err) {
      console.error('Failed to update ticket status:', err);
    }
  };

  // Extracts the specific authentication role string from local browser state storage
  const userRole = localStorage.getItem('sentinelcore_role') || 'EMPLOYEE';
  const isAdmin = userRole === 'ADMIN';

  const displayIncident: Incident | undefined =
    incidents.filter((i) => i.status !== 'RESOLVED').pop() || incidents[incidents.length - 1];

  const activeStep = displayIncident ? WORKFLOW_STEPS.indexOf(displayIncident.status as any) : 0;
  const progress = displayIncident ? PROGRESS_MAP[displayIncident.status] ?? 0 : 0;

  return (
    <Box sx={{ width: '100%' }}>
      {/* MATCHED THEME GRADIENT BANNER CARD */}
      <Card
        sx={{
          background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
          color: 'white',
          borderRadius: 4,
          p: 4,
          mb: 4,
          boxShadow: '0 10px 30px rgba(37, 99, 235, 0.2)'
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-1px' }}>
          Incident Management
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 500 }}>
          Manage, track, and resolve enterprise infrastructure security alerts.
        </Typography>
      </Card>

      {/* PRIMARY STATS ROW */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        <Box sx={{ flex: '1 1 280px' }}>
          <Card sx={{ bgcolor: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Active Incidents
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, my: 0.5, color: '#ef4444' }}>
                {stats?.activeIncidents ?? 33}
              </Typography>
              <Box component="span" sx={{ bgcolor: '#fee2e2', color: '#ef4444', px: 1.5, py: 0.5, borderRadius: 2, fontSize: '0.75rem', fontWeight: 700 }}>
                Open
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 280px' }}>
          <Card sx={{ bgcolor: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                MTTR
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, my: 0.5, color: '#0f172a' }}>
                {stats?.mttr ?? 47} min
              </Typography>
              <Box component="span" sx={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 700 }}>
                ↓ 82%
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 280px' }}>
          <Card sx={{ bgcolor: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Resolved
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, my: 0.5, color: '#10b981' }}>
                {stats?.resolvedIncidents ?? 292}
              </Typography>
              <Box component="span" sx={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 700 }}>
                This month
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* OPERATIONS CONSOLE CONTAINER */}
      <Card
        sx={{
          background: 'linear-gradient(145deg,#ffffff,#f8fafc)',
          border: '1px solid #e2e8f0',
          borderRadius: 4,
          p: 4,
          transition: '.3s',
          boxShadow: '0 10px 30px rgba(0,0,0,.05)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 18px 45px rgba(0,0,0,.08)'
          }
        }}
      >
        {displayIncident ? (
          <>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  Incident Service
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>Real-Time Security Incident Monitoring</Typography>
              </Box>

              {/* Live pulse indicator next to the shield icon */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ position: 'relative', width: 12, height: 12 }}>
                  <Box
                    sx={{
                      position: 'absolute',
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: '#ef4444'
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: '#ef4444',
                      animation: 'sentinel-pulse 1.5s infinite',
                      '@keyframes sentinel-pulse': {
                        '0%': { transform: 'scale(.9)', opacity: 1 },
                        '100%': { transform: 'scale(2.4)', opacity: 0 }
                      }
                    }}
                  />
                </Box>

                {/* <SecurityRoundedIcon sx={{ fontSize: 42, color: '#2563eb' }} /> */}
              </Box>
            </Box>

            {/* Ticket row */}
            <Box
  sx={{
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 2,
    mb: 3,
  }}
>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                #{displayIncident.incidentTicket}
              </Typography>

              <Chip label={displayIncident.severity} color={SEVERITY_COLOR[displayIncident.severity]} size="small" />

              <Chip label={displayIncident.status} color={STATUS_COLOR[displayIncident.status]} size="small" />
            
            </Box>

            {/* Details */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Incident Type
                </Typography>
                <Typography sx={{ fontWeight: 700 }}>{displayIncident.type}</Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Source IP
                </Typography>
                <Typography sx={{ fontWeight: 700 }}>{displayIncident.sourceIp}</Typography>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Impact Summary
                </Typography>
                <Typography sx={{ fontWeight: 700 }}>{displayIncident.impactSummary}</Typography>
              </Grid>
            </Grid>

            <Divider sx={{ mb: 3, borderStyle: 'dashed' }} />

            {/* Metrics */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 3,
                    transition: '.3s',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 10px 25px rgba(0,0,0,.08)'
                    }
                  }}
                >
                  <Box sx={{ p: 2 }}>
                    <AssignmentIndRoundedIcon color="primary" />
                    <Typography variant="caption" sx={{ display: 'block' }}>
                      Assigned Team
                    </Typography>
                    <Typography sx={{ fontWeight: 700 }}>{displayIncident.assignedTeam}</Typography>
                  </Box>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 3,
                    transition: '.3s',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 10px 25px rgba(0,0,0,.08)'
                    }
                  }}
                >
                  <Box sx={{ p: 2 }}>
                    <AccessTimeRoundedIcon color="warning" />
                    <Typography variant="caption" sx={{ display: 'block' }}>
                      SLA
                    </Typography>
                    <Typography sx={{ fontWeight: 700 }}>{displayIncident.slaHours} Hours</Typography>
                  </Box>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 3,
                    transition: '.3s',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 10px 25px rgba(0,0,0,.08)'
                    }
                  }}
                >
                  <Box sx={{ p: 2 }}>
                    <AccessTimeRoundedIcon color="success" />
                    <Typography variant="caption" sx={{ display: 'block' }}>
                      ETA
                    </Typography>
                    <Typography sx={{ fontWeight: 700 }}>{displayIncident.etaMinutes} min</Typography>
                  </Box>
                </Card>
              </Grid>
            </Grid>

            {/* Progress — driven by actual workflow status, not a fake confidence score */}
            <Box sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ fontWeight: 700 }}>Resolution Progress</Typography>
                <Typography sx={{ fontWeight: 700 }}>{progress}%</Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>

            {/* Last scan */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <AccessTimeRoundedIcon fontSize="small" color="action" />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {lastScanAt
                  ? `Last scan completed ${secondsSinceScan}s ago`
                  : 'Running initial scan…'}
              </Typography>
            </Box>

            {/* Workflow */}
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
              <Step>
                <StepLabel>Open</StepLabel>
              </Step>
              <Step>
                <StepLabel>Assigned</StepLabel>
              </Step>
              <Step>
                <StepLabel>Investigation</StepLabel>
              </Step>
              <Step>
                <StepLabel>Resolved</StepLabel>
              </Step>
            </Stepper>

            {/* Buttons */}
            {isAdmin && (
              <Stack
  direction="row"
  spacing={2}
  useFlexGap
  sx={{
    flexWrap: "wrap",
  }}
>
              
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<AssignmentIndRoundedIcon />}
                  disabled={displayIncident.status === 'ASSIGNED' || displayIncident.status === 'RESOLVED'}
                  onClick={() => handleStatusTransition(displayIncident.id, 'ASSIGNED')}
                  sx={{ borderRadius: 3, fontWeight: 700, textTransform: 'none', px: 3 }}
                >
                  Assign
                </Button>

                <Button
                  variant="contained"
                  size="large"
                  startIcon={<SearchRoundedIcon />}
                  disabled={displayIncident.status === 'INVESTIGATION' || displayIncident.status === 'RESOLVED'}
                  onClick={() => handleStatusTransition(displayIncident.id, 'INVESTIGATION')}
                  sx={{ borderRadius: 3, fontWeight: 700, textTransform: 'none', px: 3 }}
                >
                  Investigate
                </Button>
                
                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  startIcon={<CheckCircleRoundedIcon />}
                  disabled={displayIncident.status === 'RESOLVED'}
                  onClick={() => handleStatusTransition(displayIncident.id, 'RESOLVED')}
                  sx={{ borderRadius: 3, fontWeight: 700, textTransform: 'none', px: 3 }}
                >
                  Resolve
                </Button>
              </Stack>
            )}
          </>
        ) : (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <SecurityRoundedIcon sx={{ fontSize: 72, color: '#22c55e', mb: 2 }} />

            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              No Active Security Incidents
            </Typography>

            <Typography sx={{ color: 'text.secondary' }}>Infrastructure operating normally</Typography>

            <Chip label="All Systems Healthy" color="success" sx={{ mt: 2 }} />
          </Box>
        )}
      </Card>
    </Box>
  );
};
