import { Box, Button, Card, CardContent, Stack, TextField } from '@mui/material';

type SearchAssetProps = {
  searchPrefix: string;
  setSearchPrefix: React.Dispatch<React.SetStateAction<string>>;
  searching: boolean;
  loading: boolean;
  onSearch: () => void;
  onClear: () => void;
};

export default function SearchAsset({
  searchPrefix,
  setSearchPrefix,
  searching,
  loading,
  onSearch,
  onClear,
}: SearchAssetProps) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        mb: 4,
        boxShadow: '0 10px 30px rgba(15,23,42,.08)',
      }}
    >
      <CardContent>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          // FIXED: Moved alignItems from a direct prop into the sx object
          sx={{ alignItems: 'center' }}
        >
          <TextField
            label="Search by IP Prefix"
            fullWidth
            value={searchPrefix}
            onChange={(e) => setSearchPrefix(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
              },
            }}
          />

          <Button
            variant="contained"
            onClick={onSearch}
            disabled={searching}
            sx={{
              minWidth: 150,
              height: 56,
              borderRadius: 3,
              fontWeight: 700,
              background: 'linear-gradient(90deg,#2563eb,#4f46e5)',
              '&:hover': {
                background: 'linear-gradient(90deg,#1d4ed8,#4338ca)',
              },
            }}
          >
            {searching ? 'Searching...' : 'Search'}
          </Button>

          <Button
            variant="outlined"
            onClick={onClear}
            disabled={loading || searching}
            sx={{
              minWidth: 120,
              height: 56,
              borderRadius: 3,
            }}
          >
            Clear
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}