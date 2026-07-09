import {
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from '@mui/material';

import type { Asset } from '../../types';

type AssetListProps = {
  assets: Asset[];
};

export default function AssetList({
  assets,
}: AssetListProps) {
  if (assets.length === 0) {
    return (
      <Card
        sx={{
          borderRadius: 4,
          boxShadow: '0 10px 30px rgba(15,23,42,.08)',
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
            fontWeight={600}
            color="text.secondary"
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
    <Stack spacing={2}>
      {assets.map((asset) => (
        <Card
          key={asset.assetId}
          sx={{
            borderRadius: 4,
            border: '1px solid #e5e7eb',
            boxShadow: '0 8px 24px rgba(15,23,42,.06)',
            transition: '.25s',

            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow:
                '0 18px 40px rgba(15,23,42,.12)',
            },
          }}
        >
          <CardContent
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box>

              <Typography
                variant="h6"
                fontWeight={700}
              >
                {asset.name}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: .5 }}
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

            <Chip
              label={asset.status}
              sx={{
                minWidth: 100,
                fontWeight: 700,
                color: '#fff',
                borderRadius: 2,

                bgcolor:
                  asset.status === 'HEALTHY'
                    ? '#16a34a'
                    : asset.status === 'WARNING'
                    ? '#f59e0b'
                    : '#dc2626',
              }}
            />

          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}