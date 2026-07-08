import { Box, List, ListItemButton, ListItemText, Typography } from '@mui/material';

const menuItems = ['Dashboard', 'Assets'];

type SidebarProps = {
  activeView: string;
  onNavigate: (view: string) => void;
};

export const Sidebar = ({ activeView, onNavigate }: SidebarProps) => {
  return (
    <Box sx={{ width: 220, bgcolor: '#ffffff', borderRight: '1px solid #e5e7eb', height: '100vh', p: 3, boxSizing: 'border-box' }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#111827' }}>
        SentinelCore
      </Typography>
      <List disablePadding>
        {menuItems.map((item) => (
          <ListItemButton
            key={item}
            selected={activeView === item}
            onClick={() => onNavigate(item)}
            sx={{
              borderRadius: 2,
              mb: 1,
              color: activeView === item ? '#2563eb' : '#4b5563',
              '&.Mui-selected': {
                bgcolor: '#eff6ff',
                color: '#2563eb',
              },
            }}
          >
            <ListItemText primary={item} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};