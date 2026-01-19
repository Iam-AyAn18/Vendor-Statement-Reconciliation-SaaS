import React from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Upload from './components/Upload';
import Reconciliation from './components/Reconciliation';
import Reports from './components/Reports';
import './App.css';

const AppContent: React.FC = () => {
  const { currentView } = useApp();
  
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'upload':
        return <Upload />;
      case 'reconciliation':
        return <Reconciliation />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };
  
  return (
    <div className="app">
      <Navbar />
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
