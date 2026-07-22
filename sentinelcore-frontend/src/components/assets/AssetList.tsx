import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
} from '@mui/material';

import type { Asset } from '../../types';

type AssetListProps = {
  assets: Asset[];
};

// Helper function to extract status styles cleanly
const getStatusStyles = (status: Asset['status']) => {
  switch (status) {
    case 'HEALTHY':
      return {
        color: '#16a34a',
        glow: 'rgba(22, 163, 74, 0.18)',
        glassBg: 'rgba(240, 253, 244, 0.45)',
      };
    case 'WARNING':
      return {
        color: '#d97706',
        glow: 'rgba(217, 119, 6, 0.18)',
        glassBg: 'rgba(254, 243, 199, 0.45)',
      };
    default: // CRITICAL
      return {
        color: '#dc2626',
        glow: 'rgba(220, 38, 38, 0.18)',
        glassBg: 'rgba(254, 242, 242, 0.45)',
      };
  }
};

export default function AssetList({
  assets,
}: AssetListProps) {
  if (assets.length === 0) {
    return (
      <Card
        sx={{
          borderRadius: 4,
          background: 'rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.12)',
        }}
      >
        <CardContent
          sx={{
            py: 8,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ fontWeight: 600 }}
          >
            No Assets Found
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            Add an asset or change the search filter.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Grid container spacing={3} sx={{ width: '100%', m: 0 }}>
      {assets.map((asset) => {
        const statusConfig = getStatusStyles(asset.status);

        return (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={asset.assetId}>
            <Card
              sx={{
                height: '100%',
                borderRadius: 4,
                position: 'relative',
                overflow: 'hidden',
                background: statusConfig.glassBg,
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                boxShadow: `0 8px 32px 0 ${statusConfig.glow}`,
                transition: 'all .25s ease-in-out',

                // top sheen, consistent with the rest of the app's glass panels
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
                  background: 'rgba(255, 255, 255, 0.75)',
                  boxShadow: '0 18px 40px rgba(15,23,42,.14)',
                },
              }}
            >
              <CardContent
                sx={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  justifyContent: 'space-between',
                  gap: 2,
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700 }}
                  >
                    {asset.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    {asset.type}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {asset.ip}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <Chip
                    label={asset.status}
                    sx={{
                      minWidth: 100,
                      borderRadius: 2,
                      fontWeight: 700,
                      color: '#fff',
                      bgcolor: statusConfig.color,
                      border: '1px solid rgba(255, 255, 255, 0.4)',
                      boxShadow: `0 4px 14px ${statusConfig.glow}`,
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}
