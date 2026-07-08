import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { createAsset, getAssets } from '../services/api';
import type { Asset } from '../types';

type AssetFormState = {
  name: string;
  type: Asset['type'];
  status: Asset['status'];
};

const initialFormState: AssetFormState = {
  name: '',
  type: 'SERVER',
  status: 'HEALTHY',
};

export const AssetsPage = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [form, setForm] = useState<AssetFormState>(initialFormState);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadAssets = async () => {
    try {
      const data = await getAssets();
      setAssets(data);
    } catch (error) {
      console.error('Failed to load assets', error);
      setFeedback('Unable to load assets right now.');
    }
  };

  useEffect(() => {
    void loadAssets();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanedName = form.name.trim();

    if (!cleanedName) {
      setFeedback('Please enter an asset name.');
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      const createdAsset = await createAsset({
        name: cleanedName,
        type: form.type,
        status: form.status,
      } as Asset);

      setAssets((prev) => [createdAsset, ...prev]);
      setForm(initialFormState);
      setFeedback(`Asset ${createdAsset.name} added successfully.`);
    } catch (error) {
      console.error('Failed to add asset', error);
      setFeedback('Unable to add asset. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#0B0F19', minHeight: '100vh', p: 4, color: 'white' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
        Assets Module
      </Typography>
      <Typography variant="body1" sx={{ color: '#9CA3AF', mb: 4 }}>
        Add and review assets from the navigation panel.
      </Typography>

      <Card sx={{ bgcolor: '#111622', border: '1px solid #1F2937', mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, color: '#3B82F6' }}>
            Add New Asset
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} sx={{ mb: 2 }}>
              <TextField
                label="Asset name"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                fullWidth
                required
                sx={{
                  '& .MuiInputLabel-root': { color: '#9CA3AF' },
                  '& .MuiInputBase-input': { color: 'white' },
                  '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#374151' } },
                }}
              />
              <TextField
  select
  label="Asset type"
  value={form.type}
  onChange={(event) =>
    setForm((prev) => ({
      ...prev,
      type: event.target.value as Asset['type'],
    }))
  }
  fullWidth
  SelectProps={{
    MenuProps: {
      PaperProps: {
        sx: {
          bgcolor: '#111622',
          color: 'white',
          border: '1px solid #374151',
          '& .MuiMenuItem-root': {
            color: 'white',
          },
          '& .MuiMenuItem-root:hover': {
            bgcolor: '#1F2937',
          },
          '& .Mui-selected': {
            bgcolor: '#2563EB !important',
            color: 'white',
          },
        },
      },
    },
  }}
  sx={{
    minWidth: 180,
    '& .MuiInputLabel-root': {
      color: '#9CA3AF',
    },
    '& .MuiOutlinedInput-root': {
      color: 'white',
      '& fieldset': {
        borderColor: '#374151',
      },
      '&:hover fieldset': {
        borderColor: '#3B82F6',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#3B82F6',
      },
    },
    '& .MuiSvgIcon-root': {
      color: 'white',
    },
  }}
>
  <MenuItem value="SERVER">SERVER</MenuItem>
  <MenuItem value="CLOUD_AWS">CLOUD AWS</MenuItem>
  <MenuItem value="CLOUD_AZURE">CLOUD AZURE</MenuItem>
  <MenuItem value="K8S_POD">K8S POD</MenuItem>
</TextField>
              
            </Stack>
            <Button type="submit" variant="contained" disabled={loading} sx={{ bgcolor: '#EF4444', '&:hover': { bgcolor: '#DC2626' } }}>
              {loading ? 'Adding...' : 'Add Asset'}
            </Button>
          </Box>
          {feedback ? (
            <Alert severity={feedback.includes('success') ? 'success' : 'info'} sx={{ mt: 2 }}>
              {feedback}
            </Alert>
          ) : null}
        </CardContent>
      </Card>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Current Inventory
      </Typography>
      <Stack spacing={2}>
        {assets.map((asset) => (
          <Card key={asset.assetId || asset.name} sx={{ bgcolor: '#111622', border: '1px solid #1F2937' }}>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography
  variant="subtitle1"
  sx={{
    fontWeight: 600,
    color: "white",
  }}
>
  {asset.name}
</Typography>
                <Typography
  variant="body2"
  sx={{
    color: "#D1D5DB",
  }}
>
  Type: {asset.type}
</Typography>
              </Box>
              <Chip
                label={asset.status}
                sx={{
                  bgcolor: asset.status === 'CRITICAL' ? '#7F1D1D' : asset.status === 'WARNING' ? '#78350F' : '#064E3B',
                  color: 'white',
                  fontWeight: 'bold',
                }}
              />
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};
