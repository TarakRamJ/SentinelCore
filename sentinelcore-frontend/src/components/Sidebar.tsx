import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Divider,
} from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import DnsRoundedIcon from '@mui/icons-material/DnsRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';

const menuItems = [
  {
    label: 'Dashboard',
    // route: 'Dashboard',
    icon: <DashboardRoundedIcon fontSize="small" />,
  },
  {
    label: 'Assets',
    icon: <DnsRoundedIcon fontSize="small" />,
  },
];

type SidebarProps = {
  activeView: string;
  onNavigate: (view: string) => void;
};

export const Sidebar = ({ activeView, onNavigate }: SidebarProps) => {
  return (
    <Box
  sx={{
    width: 260,
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    bgcolor: '#0f172a',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid rgba(255,255,255,0.08)',
    zIndex: 1200,
  }}
>
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: 2,
            background:
              'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 25px rgba(37,99,235,0.35)',
          }}
        >
          <ShieldRoundedIcon />
        </Box>

        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            SentinelCore
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: '#94a3b8',
              letterSpacing: 1,
            }}
          >
            Security Platform
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />

      <List sx={{ px: 2, py: 2 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.label}
            selected={activeView === item.label}
            onClick={() => onNavigate(item.label)}
            sx={{
              borderRadius: 3,
              mb: 1,
              py: 1.4,
              px: 2,
              color: '#cbd5e1',
              transition: 'all .25s ease',

              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.08)',
                transform: 'translateX(5px)',
              },

              '&.Mui-selected': {
                background:
                  'linear-gradient(90deg, #2563eb 0%, #4f46e5 100%)',
                color: '#fff',
                boxShadow: '0 8px 24px rgba(37,99,235,0.35)',

                '&:hover': {
                  background:
                    'linear-gradient(90deg, #2563eb 0%, #4f46e5 100%)',
                },
              },
            }}
          >
            <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
              {item.icon}
            </Box>

            <ListItemText
              primary={item.label}
              slotProps={{
                primary: {
                  sx: {
                    fontWeight: activeView === item.label ? 700 : 500,
                    fontSize: '0.95rem',
                    color: activeView === item.label ? '#fff' : '#cbd5e1',
                  },
                },
              }}
            />
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Box
        sx={{
          m: 2,
          p: 2,
          borderRadius: 3,
          bgcolor: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: '#fff',
            mb: 0.5,
          }}
        >
          Enterprise Security
        </Typography>

        <Typography
          variant="caption"
          sx={{
            color: '#94a3b8',
          }}
        >
          Monitor infrastructure and assets from a unified dashboard.
        </Typography>
      </Box>
    </Box>
  );
};