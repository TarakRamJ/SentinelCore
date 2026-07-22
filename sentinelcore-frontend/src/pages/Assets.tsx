import { useEffect, useState, type FormEvent } from 'react';
import { Alert, Box, Typography } from '@mui/material';

import type { Asset } from '../types';

import {
  createAsset,
  getAssets,
  getAssetsByIpPrefix,
  getStoredUserRole,
} from '../services/api';

import AddAsset from '../components/assets/AddAsset';
import AssetStats from '../components/assets/AssetStats';
import SearchAsset from '../components/assets/SearchAsset';
import AssetList from '../components/assets/AssetList';

type AssetFormState = {
  name: string;
  ip: string;
  type: Asset['type'];
  status: Asset['status'];
};

const initialFormState: AssetFormState = {
  name: '',
  ip: '',
  type: 'SERVER',
  status: 'HEALTHY',
};

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [form, setForm] = useState(initialFormState);

  const [searchPrefix, setSearchPrefix] = useState('');

  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  const [feedback, setFeedback] = useState<string | null>(null);

  const [isAdmin, setIsAdmin] = useState(
    getStoredUserRole() === 'ADMIN'
  );

  const loadAssets = async () => {
    try {
      const data = await getAssets();
      setAssets(data);
    } catch (error) {
      console.error(error);
      setFeedback('Unable to load assets.');
    }
  };

  useEffect(() => {
    setIsAdmin(getStoredUserRole() === 'ADMIN');
    void loadAssets();
  }, []);

  const handleSearch = async () => {
    if (!searchPrefix.trim()) {
      void loadAssets();
      return;
    }

    setSearching(true);

    try {
      const data = await getAssetsByIpPrefix(searchPrefix.trim());
      setAssets(data);

      if (!data.length) {
        setFeedback('No assets found.');
      } else {
        setFeedback(null);
      }
    } catch (error) {
      console.error(error);
      setFeedback('Search failed.');
    } finally {
      setSearching(false);
    }
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const cleanedName = form.name.trim();
    const cleanedIp = form.ip.trim();

    if (!cleanedName || !cleanedIp) {
      setFeedback('Please complete all fields.');
      return;
    }

    if (!isAdmin) {
      setFeedback('Only administrators can add assets.');
      return;
    }

    setLoading(true);

    try {
      const createdAsset = await createAsset({
        name: cleanedName,
        ip: cleanedIp,
        type: form.type,
        status: form.status,
      } as Asset);

      setAssets((prev) => [createdAsset, ...prev]);

      setForm(initialFormState);

      setFeedback(
        `Asset "${createdAsset.name}" added successfully.`
      );
    } catch (error) {
      console.error(error);
      setFeedback('Unable to add asset.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 1300,
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
          background: 'linear-gradient(135deg,#2563eb 0%,#4f46e5 100%)',
          boxShadow: '0 20px 45px rgba(37,99,235,.25)',
        }}
      >
        {/* FIXED: Moved fontWeight to sx */}
        <Typography
          variant="h3"
          sx={{ fontWeight: 700 }}
        >
          Asset Management
        </Typography>

        <Typography sx={{ mt: 1, opacity: 0.9 }}>
          Manage and monitor enterprise assets.
        </Typography>
      </Box>

      <AssetStats assets={assets} />

      <AddAsset
        form={form}
        setForm={setForm}
        loading={loading}
        isAdmin={isAdmin}
        feedback={feedback}
        onSubmit={handleSubmit}
      />

      {/* FIXED: Moved fontWeight to sx */}
      <Typography
        variant="h5"
        sx={{ fontWeight: 700, mb: 2 }}
      >
        Asset Inventory
      </Typography>

      <SearchAsset
        searchPrefix={searchPrefix}
        setSearchPrefix={setSearchPrefix}
        searching={searching}
        loading={loading}
        onSearch={handleSearch}
        onClear={() => {
          setSearchPrefix('');
          setFeedback(null);
          void loadAssets();
        }}
      />

      {!feedback?.includes('success') &&
        feedback && (
          <Alert
            severity="info"
            sx={{ mb: 3 }}
          >
            {feedback}
          </Alert>
        )}

      <AssetList assets={assets} />
    </Box>
  );
}