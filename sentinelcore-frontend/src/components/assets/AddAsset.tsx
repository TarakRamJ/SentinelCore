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
  onSubmit: (event: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => void; // FIXED: Replaced FormEvent with modern event type
};

// Shared glass tokens so every field/button on this card reads as one material
const glassField = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 3,
    background: "rgba(255, 255, 255, 0.35)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    transition: "background .2s ease, box-shadow .2s ease",

    "& fieldset": {
      borderColor: "rgba(148, 163, 184, 0.35)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(99, 102, 241, 0.45)",
    },
    "&.Mui-focused": {
      background: "rgba(255, 255, 255, 0.55)",
      boxShadow: "0 0 0 4px rgba(99, 102, 241, 0.12)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "rgba(99, 102, 241, 0.6)",
    },
  },
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
        mb: 4,
        position: 'relative',
        overflow: 'hidden',
        background: 'rgba(255, 255, 255, 0.55)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.14)',

        // subtle top sheen to sell the "glass panel" read
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 40%)',
          pointerEvents: 'none',
        },
      }}
    >
      <CardContent sx={{ position: 'relative' }}>

        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            mb: 3,
            background: 'linear-gradient(90deg,#1e293b,#4f46e5)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
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
                sx={glassField}
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
                sx={glassField}
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
                sx={glassField}
                slotProps={{
                  select: {
                    MenuProps: {
  slotProps: {
    paper: {
      sx: {
        borderRadius: 2,
        mt: 0.5,
        background: 'rgba(255, 255, 255, 0.75)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.18)',
      },
    },
  },
},
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
                  textTransform: 'none',
                  fontSize: '1rem',
                  background:
                    "linear-gradient(90deg,#2563eb,#4f46e5)",
                  boxShadow: '0 8px 24px rgba(79, 70, 229, 0.35)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  transition: 'transform .2s ease, box-shadow .2s ease',

                  "&:hover": {
                    background:
                      "linear-gradient(90deg,#1d4ed8,#4338ca)",
                    boxShadow: '0 12px 28px rgba(79, 70, 229, 0.45)',
                    transform: 'translateY(-2px)',
                  },
                  "&:active": {
                    transform: 'translateY(0)',
                  },
                  "&.Mui-disabled": {
                    background: 'rgba(99, 102, 241, 0.35)',
                    color: 'rgba(255,255,255,0.7)',
                  },
                }}
              >
                {loading ? "Adding..." : "Add Asset"}
              </Button>

            </Stack>
          </Box>
        ) : (
          <Alert
            severity="info"
            sx={{
              borderRadius: 3,
              background: 'rgba(224, 242, 254, 0.5)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.5)',
            }}
          >
            Only administrators can add assets. Contact Admin.
          </Alert>
        )}

        {feedback && (
          <Alert
            sx={{
              mt: 3,
              borderRadius: 3,
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              background: feedback.toLowerCase().includes('success')
                ? 'rgba(220, 252, 231, 0.55)'
                : 'rgba(224, 242, 254, 0.5)',
            }}
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
