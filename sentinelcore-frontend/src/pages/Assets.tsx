import { useEffect, useState, type FormEvent } from 'react';
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Assets
      </Typography>
      <Typography variant="body1" sx={{ color: '#6b7280', mb: 3 }}>
        Add and review assets in a simple list.
      </Typography>

      <Card sx={{ border: '1px solid #e5e7eb', boxShadow: 'none', mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Add New Asset
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2} sx={{ mb: 2 }}>
              <TextField
                label="Asset name"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                fullWidth
                required
              />
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
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
                >
                  <MenuItem value="SERVER">SERVER</MenuItem>
                  <MenuItem value="CLOUD_AWS">CLOUD AWS</MenuItem>
                  <MenuItem value="CLOUD_AZURE">CLOUD AZURE</MenuItem>
                  <MenuItem value="K8S_POD">K8S POD</MenuItem>
                </TextField>
                {/* <TextField
                  select
                  label="Status"
                  value={form.status}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      status: event.target.value as Asset['status'],
                    }))
                  }
                  fullWidth
                >
                  <MenuItem value="HEALTHY">HEALTHY</MenuItem>
                  <MenuItem value="WARNING">WARNING</MenuItem>
                  <MenuItem value="CRITICAL">CRITICAL</MenuItem>
                </TextField> */}
              </Stack>
            </Stack>
            <Button type="submit" variant="contained" disabled={loading} sx={{ bgcolor: '#2563eb', '&:hover': { bgcolor: '#1d4ed8' } }}>
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
        Inventory
      </Typography>
      <Stack spacing={2}>
        {assets.map((asset) => (
          <Card key={asset.assetId || asset.name} sx={{ border: '1px solid #e5e7eb', boxShadow: 'none' }}>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {asset.name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#6b7280' }}>
                  {asset.type}
                </Typography>
              </Box>
              <Chip
                label={asset.status}
                sx={{
                  bgcolor: asset.status === 'CRITICAL' ? '#fee2e2' : asset.status === 'WARNING' ? '#fef3c7' : '#dcfce7',
                  color: asset.status === 'CRITICAL' ? '#b91c1c' : asset.status === 'WARNING' ? '#92400e' : '#166534',
                  fontWeight: 700,
                }}
              />
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};
