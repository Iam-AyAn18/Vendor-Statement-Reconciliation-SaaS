import React from 'react';
import { FileCheck, Upload, AlertTriangle, TrendingUp } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { calculateSummary } from '../utils/reconciliation';

const Dashboard: React.FC = () => {
  const { vendorFile, internalFile, reconciliationResults, setCurrentView } = useApp();
  
  const summary = reconciliationResults ? calculateSummary(reconciliationResults) : null;
  
  const matchRate = summary && summary.totalRecords > 0
    ? ((summary.matched / summary.totalRecords) * 100).toFixed(1)
    : '0';
  
  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p className="page-subtitle">Overview of your reconciliation status</p>
      </div>
      
      {!vendorFile && !internalFile ? (
        <div className="empty-state">
          <Upload size={64} className="empty-state-icon" />
          <h2>Welcome to ReconcileAI</h2>
          <p>Start by uploading your vendor statements and internal records</p>
          <button 
            className="btn btn-primary"
            onClick={() => setCurrentView('upload')}
          >
            Upload Files
          </button>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'var(--primary-light)' }}>
                <FileCheck size={24} style={{ color: 'var(--primary)' }} />
              </div>
              <div className="stat-content">
                <div className="stat-label">Total Records</div>
                <div className="stat-value">{summary?.totalRecords || 0}</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'var(--success-light)' }}>
                <FileCheck size={24} style={{ color: 'var(--success)' }} />
              </div>
              <div className="stat-content">
                <div className="stat-label">Matched</div>
                <div className="stat-value success">{summary?.matched || 0}</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'var(--warning-light)' }}>
                <AlertTriangle size={24} style={{ color: 'var(--warning)' }} />
              </div>
              <div className="stat-content">
                <div className="stat-label">Amount Mismatch</div>
                <div className="stat-value warning">{summary?.amountMismatch || 0}</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'var(--danger-light)' }}>
                <AlertTriangle size={24} style={{ color: 'var(--danger)' }} />
              </div>
              <div className="stat-content">
                <div className="stat-label">Missing</div>
                <div className="stat-value danger">{summary?.missing || 0}</div>
              </div>
            </div>
          </div>
          
          {/* File Status */}
          <div className="dashboard-grid">
            <div className="card">
              <h3 className="card-title">Uploaded Files</h3>
              <div className="file-status-list">
                <div className="file-status-item">
                  <div className="file-status-icon success">
                    {vendorFile ? '✓' : '○'}
                  </div>
                  <div>
                    <div className="file-status-label">Vendor Statement</div>
                    <div className="file-status-value">
                      {vendorFile ? `${vendorFile.name} (${vendorFile.rowCount} rows)` : 'Not uploaded'}
                    </div>
                  </div>
                </div>
                
                <div className="file-status-item">
                  <div className="file-status-icon success">
                    {internalFile ? '✓' : '○'}
                  </div>
                  <div>
                    <div className="file-status-label">Internal Records</div>
                    <div className="file-status-value">
                      {internalFile ? `${internalFile.name} (${internalFile.rowCount} rows)` : 'Not uploaded'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card">
              <h3 className="card-title">Match Rate</h3>
              <div className="match-rate">
                <div className="match-rate-circle">
                  <TrendingUp size={32} />
                </div>
                <div className="match-rate-value">{matchRate}%</div>
                <div className="match-rate-label">Successfully Matched</div>
              </div>
            </div>
          </div>
          
          {reconciliationResults && (
            <div className="dashboard-actions">
              <button 
                className="btn btn-primary"
                onClick={() => setCurrentView('reconciliation')}
              >
                View Detailed Results
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
