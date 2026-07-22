import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { 
  Alert, 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Stack, 
  TextField, 
  Typography,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider,
  Avatar
} from '@mui/material';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import AssetsPage from './pages/Assets';
import { Incidents } from './pages/Incidents';
import { clearAuthToken, getStoredUserRole, loginUser, registerUser, setAuthToken } from './services/api';

type AuthMode = 'login' | 'register';

type AuthFormState = {
  username: string;
  email: string;
  password: string;
};

const initialAuthState: AuthFormState = {
  username: '',
  email: '',
  password: '',
};

function App() {
  const [activeView, setActiveView] = useState('Dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(localStorage.getItem('sentinelcore_token')));
  const [isAdmin, setIsAdmin] = useState(getStoredUserRole() === 'ADMIN');
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [authForm, setAuthForm] = useState<AuthFormState>(initialAuthState);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const username = localStorage.getItem('sentinelcore_username') || authForm.username || 'Guest';

  const userRole = isAdmin ? 'ADMIN' : 'EMPLOYEE';

  useEffect(() => {
    const storedToken = localStorage.getItem('sentinelcore_token');
    if (storedToken) {
      setAuthToken(storedToken, getStoredUserRole());
      setIsAuthenticated(true);
      setIsAdmin(getStoredUserRole() === 'ADMIN');
    }
  }, []);

  const renderView = () => {
    if (activeView === 'Assets') return <AssetsPage />;
    if (activeView === 'Incidents') return <Incidents />;
    return <Dashboard />;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setFeedback(null);
    try {
      if (authMode === 'login') {
        const response = await loginUser({
          username: authForm.username.trim(),
          password: authForm.password,
        });
        
        // DYNAMIC FIX: Store the real username from the backend database payload
        localStorage.setItem('sentinelcore_username', response.username);
        
        setAuthToken(response.token, response.role);
        setIsAuthenticated(true);
        setIsAdmin(response.role === 'ADMIN');
        setFeedback('Signed in successfully.');
      } else {
        if (!authForm.email.trim()) {
          setFeedback('Please enter an email address.');
          setLoading(false);
          return;
        }

        await registerUser({
          username: authForm.username.trim(),
          email: authForm.email.trim(),
          password: authForm.password,
        });

        const loginResponse = await loginUser({
          username: authForm.username.trim(),
          password: authForm.password,
        });

        localStorage.setItem('sentinelcore_username', loginResponse.username);

        setAuthToken(loginResponse.token, loginResponse.role);
        setIsAuthenticated(true);
        setIsAdmin(loginResponse.role === 'ADMIN');
        setFeedback('Account created and signed in.');
      }
    } catch (error) {
      console.error('Authentication failed', error);
      setFeedback(authMode === 'login' ? 'Unable to sign in. Check your credentials.' : 'Unable to create the account right now.');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const openLogoutConfirmation = () => {
    handleMenuClose();
    setLogoutDialogOpen(true);
  };
  const closeLogoutConfirmation = () => {
    setLogoutDialogOpen(false);
  };

  const handleLogout = () => {
    setLogoutDialogOpen(false);
    clearAuthToken();
    localStorage.removeItem('sentinelcore_username');
    setIsAuthenticated(false);
    setIsAdmin(false);
    setAuthForm(initialAuthState);
    setFeedback('You have been signed out.');
  };

  const title = useMemo(() => (authMode === 'login' ? 'Sign in' : 'Create account'), [authMode]);

  if (!isAuthenticated) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fb', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
        <Card sx={{ width: '100%', maxWidth: 430, border: '1px solid #e5e7eb', boxShadow: 'none' }}>
          <CardContent>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              SentinelCore
            </Typography>
            <Typography variant="body1" sx={{ color: '#6b7280', mb: 3 }}>
              Secure operations monitoring for your infrastructure.
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
              <Button variant={authMode === 'login' ? 'contained' : 'outlined'} onClick={() => setAuthMode('login')} sx={{ flex: 1 }}>
                Login
              </Button>
              <Button variant={authMode === 'register' ? 'contained' : 'outlined'} onClick={() => setAuthMode('register')} sx={{ flex: 1 }}>
                Register
              </Button>
            </Stack>
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2}>
                {authMode === 'register' ? (
                  <TextField
                    label="Email"
                    type="email"
                    value={authForm.email}
                    onChange={(event) => setAuthForm((prev) => ({ ...prev, email: event.target.value }))}
                    fullWidth
                  />
                ) : null}
                <TextField
                  label="Username"
                  value={authForm.username}
                  onChange={(event) => setAuthForm((prev) => ({ ...prev, username: event.target.value }))}
                  fullWidth
                  required
                />
                <TextField
                  label="Password"
                  type="password"
                  value={authForm.password}
                  onChange={(event) => setAuthForm((prev) => ({ ...prev, password: event.target.value }))}
                  fullWidth
                  required
                />
                <Button type="submit" variant="contained" disabled={loading} sx={{ bgcolor: '#2563eb', '&:hover': { bgcolor: '#1d4ed8' } }}>
                  {loading ? 'Working...' : title}
                </Button>
              </Stack>
            </Box>
            {feedback ? (
              <Alert severity={feedback.includes('success') || feedback.includes('signed in') || feedback.includes('created') ? 'success' : 'info'} sx={{ mt: 2 }}>
                {feedback}
              </Alert>
            ) : null}
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc', color: '#111827' }}>
      <Sidebar activeView={activeView} onNavigate={setActiveView} />
      
      <Box sx={{ flex: 1, ml: '260px', minHeight: '100vh', p: 4, bgcolor: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
        
        {/* RE-STYLED TOP MENU PROFILE ROW */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
          <Button
            onClick={handleMenuOpen}
            endIcon={<KeyboardArrowDownRoundedIcon sx={{ color: '#64748b' }} />}
            sx={{
              p: 0.75,
              pr: 1.5,
              borderRadius: 3,
              textTransform: 'none',
              bgcolor: '#fff',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              '&:hover': {
                bgcolor: '#f1f5f9',
                borderColor: '#cbd5e1'
              }
            }}
          >
            <Avatar 
              sx={{ 
                width: 32, 
                height: 32, 
                bgcolor: '#2563eb', 
                fontSize: '0.875rem', 
                fontWeight: 700,
                mr: 1
              }}
            >
              {username.charAt(0).toUpperCase()}
            </Avatar>
            <Stack spacing={0} sx={{ alignItems: 'flex-start', textAlign: 'left', mr: 0.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
                {username}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, fontSize: '0.7rem' }}>
                {userRole.toLowerCase()}
              </Typography>
            </Stack>
          </Button>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            slotProps={{
              paper: {
                sx: {
                  mt: 1,
                  minWidth: 200,
                  boxShadow: '0 10px 25px rgba(15, 23, 42, 0.08)',
                  borderRadius: 3,
                  border: '1px solid #e2e8f0',
                  p: 0.5
                }
              }
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                Account Session
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.5 }}>
                Signed in as <strong>{username}</strong>
              </Typography>
            </Box>
            
            <Divider sx={{ my: 0.5, borderColor: '#f1f5f9' }} />
            
            <MenuItem 
              onClick={openLogoutConfirmation} 
              sx={{ 
                color: '#ef4444', 
                gap: 1.5, 
                py: 1.2,
                borderRadius: 2,
                fontWeight: 600,
                fontSize: '0.9rem',
                '&:hover': { bgcolor: '#fef2f2' }
              }}
            >
              <LogoutRoundedIcon fontSize="small" />
              Logout
            </MenuItem>
          </Menu>
        </Box>

        {/* LOGOUT DIALOG CONFIRMATION INTERFACE */}
        <Dialog
          open={logoutDialogOpen}
          onClose={closeLogoutConfirmation}
          slotProps={{
            paper: {
              sx: { borderRadius: 4, p: 1.5, maxWidth: 400, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }
            }
          }}
        >
          <DialogTitle sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.25rem', pb: 1 }}>
            Confirm Sign Out
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ color: '#475569', fontWeight: 500, fontSize: '0.95rem', lineHeight: 1.5 }}>
              Are you sure you want to log out of the SentinelCore Security Platform?
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
            <Button 
              onClick={closeLogoutConfirmation} 
              sx={{ color: '#64748b', fontWeight: 700, textTransform: 'none', fontSize: '0.9rem' }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleLogout} 
              variant="contained" 
              color="error" 
              sx={{ borderRadius: 2.5, boxShadow: 'none', fontWeight: 700, textTransform: 'none', px: 3, bgcolor: '#dc2626', '&:hover': { bgcolor: '#b91c1c', boxShadow: 'none' } }}
            >
              Logout
            </Button>
          </DialogActions>
        </Dialog>

        {renderView()}
      </Box>
    </Box>
  );
}

export default App;