import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from '@mui/material';

import StorageRoundedIcon from '@mui/icons-material/StorageRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';

import type { Asset } from '../../types';

type AssetStatsProps = {
  assets: Asset[];
};

// Shared glass card shell so all four stat tiles read as one material
const glassCardSx = {
  height: '100%',
  borderRadius: 4,
  position: 'relative' as const,
  overflow: 'hidden' as const,
  background: 'rgba(255, 255, 255, 0.5)',
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  border: '1px solid rgba(255, 255, 255, 0.6)',
  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.12)',
  transition: 'transform .25s ease, box-shadow .25s ease',

  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background:
      'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 45%)',
    pointerEvents: 'none',
  },

  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 18px 40px rgba(15,23,42,.14)',
  },
};

export default function AssetStats({
  assets,
}: AssetStatsProps) {
  const totalAssets = assets.length;

  const healthyCount = assets.filter(
    (asset) => asset.status === 'HEALTHY'
  ).length;

  const warningCount = assets.filter(
    (asset) => asset.status === 'WARNING'
  ).length;

  const criticalCount = assets.filter(
    (asset) => asset.status === 'CRITICAL'
  ).length;

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Grid container spacing={3}>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={glassCardSx}>
            <CardContent sx={{ position: 'relative' }}>
              <StorageRoundedIcon
                color="primary"
                sx={{ fontSize: 34, mb: 1 }}
              />

              <Typography color="text.secondary">
                Total Assets
              </Typography>

              <Typography
                variant="h4"
                sx={{ fontWeight: 700 }}
              >
                {totalAssets}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={glassCardSx}>
            <CardContent sx={{ position: 'relative' }}>
              <CheckCircleRoundedIcon
                color="success"
                sx={{ fontSize: 34, mb: 1 }}
              />

              <Typography color="text.secondary">
                Healthy
              </Typography>

              <Typography
                variant="h4"
                color="success.main"
                sx={{ fontWeight: 700 }}
              >
                {healthyCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={glassCardSx}>
            <CardContent sx={{ position: 'relative' }}>
              <WarningAmberRoundedIcon
                color="warning"
                sx={{ fontSize: 34, mb: 1 }}
              />

              <Typography color="text.secondary">
                Warning
              </Typography>

              <Typography
                variant="h4"
                color="warning.main"
                sx={{ fontWeight: 700 }}
              >
                {warningCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={glassCardSx}>
            <CardContent sx={{ position: 'relative' }}>
              <ErrorRoundedIcon
                color="error"
                sx={{ fontSize: 34, mb: 1 }}
              />

              <Typography color="text.secondary">
                Critical
              </Typography>

              <Typography
                variant="h4"
                color="error.main"
                sx={{ fontWeight: 700 }}
              >
                {criticalCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </Box>
  );
}
