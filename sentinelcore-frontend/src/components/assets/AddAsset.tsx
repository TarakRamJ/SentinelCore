import { FormEvent } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import type { Asset } from '../../types';

type AssetFormState = {
  name: string;
  ip: string;
  type: Asset['type'];
  status: Asset['status'];
};

type AddAssetProps = {
  form: AssetFormState;
  setForm: React.Dispatch<React.SetStateAction<AssetFormState>>;
  loading: boolean;
  isAdmin: boolean;
  feedback: string | null;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function AddAsset({
  form,
  setForm,
  loading,
  isAdmin,
  feedback,
  onSubmit,
}: AddAssetProps) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: '0 10px 30px rgba(15,23,42,.08)',
        mb: 4,
      }}
    >
      <CardContent>

        <Typography
          variant="h5"
          fontWeight={700}
          mb={3}
        >
          Add New Asset
        </Typography>

        {isAdmin ? (
          <Box
            component="form"
            onSubmit={onSubmit}
          >
            <Stack spacing={3}>

              <TextField
                label="Asset Name"
                fullWidth
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                  },
                }}
              />

              <TextField
                label="IP Address"
                fullWidth
                value={form.ip}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    ip: e.target.value,
                  }))
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                  },
                }}
              />

              <TextField
                select
                label="Asset Type"
                value={form.type}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    type: e.target.value as Asset['type'],
                  }))
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                  },
                }}
              >
                <MenuItem value="SERVER">
                  SERVER
                </MenuItem>

                <MenuItem value="CLOUD_AWS">
                  CLOUD AWS
                </MenuItem>

                <MenuItem value="CLOUD_AZURE">
                  CLOUD AZURE
                </MenuItem>

                <MenuItem value="K8S_POD">
                  K8S POD
                </MenuItem>

              </TextField>

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  height: 52,
                  borderRadius: 3,
                  fontWeight: 700,
                  background:
                    "linear-gradient(90deg,#2563eb,#4f46e5)",

                  "&:hover": {
                    background:
                      "linear-gradient(90deg,#1d4ed8,#4338ca)",
                  },
                }}
              >
                {loading ? "Adding..." : "Add Asset"}
              </Button>

            </Stack>
          </Box>
        ) : (
          <Alert severity="info">
            Only administrators can add assets.
          </Alert>
        )}

        {feedback && (
          <Alert
            sx={{ mt: 3 }}
            severity={
              feedback.toLowerCase().includes("success")
                ? "success"
                : "info"
            }
          >
            {feedback}
          </Alert>
        )}

      </CardContent>
    </Card>
  );
}