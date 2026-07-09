import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import AssetsPage from './pages/Assets';
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

  useEffect(() => {
    const storedToken = localStorage.getItem('sentinelcore_token');
    if (storedToken) {
      setAuthToken(storedToken, getStoredUserRole());
      setIsAuthenticated(true);
      setIsAdmin(getStoredUserRole() === 'ADMIN');
    }
  }, []);

  const renderView = () => {
    if (activeView === 'Assets') {
      return <AssetsPage />;
    }

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

  const handleLogout = () => {
    clearAuthToken();
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
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f7fb', color: '#111827' }}>
      <Sidebar activeView={activeView} onNavigate={setActiveView} />
      <Box
  sx={{
    flex: 1,
    ml: '260px',   // same as sidebar width
    minHeight: '100vh',
    p: 4,
    bgcolor: '#f8fafc',
  }}
>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button variant="outlined" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
        {renderView()}
      </Box>
    </Box>
  );
}

export default App;