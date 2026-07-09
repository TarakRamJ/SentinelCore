import {
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
    <Grid container spacing={3} sx={{ mb: 4 }}>

      <Grid item xs={12} sm={6} md={3}>
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: '0 10px 30px rgba(15,23,42,.08)',
          }}
        >
          <CardContent>
            <StorageRoundedIcon
              color="primary"
              sx={{ fontSize: 34, mb: 1 }}
            />

            <Typography color="text.secondary">
              Total Assets
            </Typography>

            <Typography
              variant="h4"
              fontWeight={700}
            >
              {totalAssets}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: '0 10px 30px rgba(15,23,42,.08)',
          }}
        >
          <CardContent>
            <CheckCircleRoundedIcon
              color="success"
              sx={{ fontSize: 34, mb: 1 }}
            />

            <Typography color="text.secondary">
              Healthy
            </Typography>

            <Typography
              variant="h4"
              fontWeight={700}
              color="success.main"
            >
              {healthyCount}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: '0 10px 30px rgba(15,23,42,.08)',
          }}
        >
          <CardContent>
            <WarningAmberRoundedIcon
              color="warning"
              sx={{ fontSize: 34, mb: 1 }}
            />

            <Typography color="text.secondary">
              Warning
            </Typography>

            <Typography
              variant="h4"
              fontWeight={700}
              color="warning.main"
            >
              {warningCount}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: '0 10px 30px rgba(15,23,42,.08)',
          }}
        >
          <CardContent>
            <ErrorRoundedIcon
              color="error"
              sx={{ fontSize: 34, mb: 1 }}
            />

            <Typography color="text.secondary">
              Critical
            </Typography>

            <Typography
              variant="h4"
              fontWeight={700}
              color="error.main"
            >
              {criticalCount}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

    </Grid>
  );
}