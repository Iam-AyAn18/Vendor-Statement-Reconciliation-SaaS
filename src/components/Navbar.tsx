import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useApp();
  
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <div className="logo">
            <span className="logo-icon">🔄</span>
            <span className="logo-text">ReconcileAI</span>
          </div>
        </div>
        
        <div className="navbar-actions">
          <button 
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
