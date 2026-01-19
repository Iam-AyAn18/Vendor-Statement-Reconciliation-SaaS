import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Theme, NavigationView, UploadedFile, ReconciliationResult } from '../types';

interface AppContextType {
  // Theme
  theme: Theme;
  toggleTheme: () => void;
  
  // Navigation
  currentView: NavigationView;
  setCurrentView: (view: NavigationView) => void;
  
  // File uploads
  vendorFile: UploadedFile | null;
  internalFile: UploadedFile | null;
  setVendorFile: (file: UploadedFile | null) => void;
  setInternalFile: (file: UploadedFile | null) => void;
  
  // Reconciliation results
  reconciliationResults: ReconciliationResult[] | null;
  setReconciliationResults: (results: ReconciliationResult[] | null) => void;
  
  // Loading state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as Theme) || 'light';
  });
  
  const [currentView, setCurrentView] = useState<NavigationView>('dashboard');
  const [vendorFile, setVendorFile] = useState<UploadedFile | null>(null);
  const [internalFile, setInternalFile] = useState<UploadedFile | null>(null);
  const [reconciliationResults, setReconciliationResults] = useState<ReconciliationResult[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Persist theme to localStorage and apply to document
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  return (
    <AppContext.Provider value={{
      theme,
      toggleTheme,
      currentView,
      setCurrentView,
      vendorFile,
      internalFile,
      setVendorFile,
      setInternalFile,
      reconciliationResults,
      setReconciliationResults,
      isLoading,
      setIsLoading
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
