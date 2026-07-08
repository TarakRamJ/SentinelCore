import { useState } from 'react';
import { Box } from '@mui/material';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { AssetsPage } from './pages/Assets';

function App() {
  const [activeView, setActiveView] = useState('Dashboard');

  const renderView = () => {
    if (activeView === 'Assets') {
      return <AssetsPage />;
    }

    return <Dashboard />;
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f7fb', color: '#111827' }}>
      <Sidebar activeView={activeView} onNavigate={setActiveView} />
      <Box sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>{renderView()}</Box>
    </Box>
  );
}

export default App;