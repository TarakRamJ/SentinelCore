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
    <Box sx={{ display: 'flex' }}>
      <Sidebar activeView={activeView} onNavigate={setActiveView} />
      {renderView()}
    </Box>
  );
}

export default App;