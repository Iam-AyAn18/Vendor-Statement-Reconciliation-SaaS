import React from 'react';
import { LayoutDashboard, Upload, RefreshCw, FileText } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import type { NavigationView } from '../types';

interface MenuItem {
  id: NavigationView;
  label: string;
  icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'upload', label: 'Upload', icon: <Upload size={20} /> },
  { id: 'reconciliation', label: 'Reconciliation', icon: <RefreshCw size={20} /> },
  { id: 'reports', label: 'Reports', icon: <FileText size={20} /> },
];

const Sidebar: React.FC = () => {
  const { currentView, setCurrentView } = useApp();
  
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`sidebar-item ${currentView === item.id ? 'active' : ''}`}
            onClick={() => setCurrentView(item.id)}
          >
            <span className="sidebar-item-icon">{item.icon}</span>
            <span className="sidebar-item-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
