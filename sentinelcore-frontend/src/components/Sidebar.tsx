import { Box, List, ListItemButton, ListItemText, Typography } from '@mui/material';

const menuItems = ['Dashboard', 'Assets', 'Incidents', 'Vulnerabilities', 'Audit', 'Compliance', 'DevSecOps'];

type SidebarProps = {
  activeView: string;
  onNavigate: (view: string) => void;
};

export const Sidebar = ({ activeView, onNavigate }: SidebarProps) => {
  return (
    <Box sx={{ width: 240, bgcolor: '#111827', color: 'white', height: '100vh', p: 2 }}>
      <Typography variant="h6" sx={{ color: '#EF4444', fontWeight: 'bold', mb: 4 }}>
        SentinelCore SecureOps
      </Typography>
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item}
            selected={activeView === item}
            sx={{ borderRadius: 1, mb: 0.5 }}
            onClick={() => onNavigate(item)}
          >
            <ListItemText primary={item} sx={{ color: activeView === item ? '#3B82F6' : '#9CA3AF' }} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};