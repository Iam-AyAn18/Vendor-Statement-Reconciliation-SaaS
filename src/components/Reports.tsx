import React from 'react';
import { FileText, TrendingUp, AlertCircle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { calculateSummary } from '../utils/reconciliation';

const Reports: React.FC = () => {
  const { reconciliationResults, vendorFile, internalFile } = useApp();
  const summary = reconciliationResults ? calculateSummary(reconciliationResults) : null;
  
  const matchRate = summary && summary.totalRecords > 0
    ? ((summary.matched / summary.totalRecords) * 100).toFixed(1)
    : '0';
  
  const mismatchRate = summary && summary.totalRecords > 0
    ? (((summary.amountMismatch + summary.missing) / summary.totalRecords) * 100).toFixed(1)
    : '0';
  
  if (!reconciliationResults) {
    return (
      <div className="reports">
        <div className="page-header">
          <h1>Reports</h1>
          <p className="page-subtitle">Analytics and insights from reconciliation</p>
        </div>
        <div className="empty-state">
          <FileText size={64} className="empty-state-icon" />
          <h2>No Reports Available</h2>
          <p>Complete a reconciliation to view detailed reports</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="reports">
      <div className="page-header">
        <h1>Reports</h1>
        <p className="page-subtitle">Analytics and insights from reconciliation</p>
      </div>
      
      {/* Summary Section */}
      <div className="card">
        <h3 className="card-title">Executive Summary</h3>
        <div className="report-grid">
          <div className="report-metric">
            <div className="report-metric-label">Match Rate</div>
            <div className="report-metric-value success">{matchRate}%</div>
            <div className="report-metric-description">
              Successfully matched transactions
            </div>
          </div>
          
          <div className="report-metric">
            <div className="report-metric-label">Discrepancy Rate</div>
            <div className="report-metric-value warning">{mismatchRate}%</div>
            <div className="report-metric-description">
              Transactions requiring attention
            </div>
          </div>
          
          <div className="report-metric">
            <div className="report-metric-label">Total Processed</div>
            <div className="report-metric-value">{summary?.totalRecords}</div>
            <div className="report-metric-description">
              Combined unique transactions
            </div>
          </div>
        </div>
      </div>
      
      {/* Breakdown Section */}
      <div className="report-breakdown">
        <div className="card">
          <h3 className="card-title">Status Breakdown</h3>
          <div className="breakdown-list">
            <div className="breakdown-item">
              <div className="breakdown-bar-container">
                <div 
                  className="breakdown-bar success"
                  style={{ 
                    width: `${summary ? (summary.matched / summary.totalRecords) * 100 : 0}%` 
                  }}
                />
              </div>
              <div className="breakdown-info">
                <div className="breakdown-label">
                  <span className="breakdown-dot success"></span>
                  Matched
                </div>
                <div className="breakdown-value">{summary?.matched || 0}</div>
              </div>
            </div>
            
            <div className="breakdown-item">
              <div className="breakdown-bar-container">
                <div 
                  className="breakdown-bar warning"
                  style={{ 
                    width: `${summary ? (summary.amountMismatch / summary.totalRecords) * 100 : 0}%` 
                  }}
                />
              </div>
              <div className="breakdown-info">
                <div className="breakdown-label">
                  <span className="breakdown-dot warning"></span>
                  Amount Mismatch
                </div>
                <div className="breakdown-value">{summary?.amountMismatch || 0}</div>
              </div>
            </div>
            
            <div className="breakdown-item">
              <div className="breakdown-bar-container">
                <div 
                  className="breakdown-bar danger"
                  style={{ 
                    width: `${summary ? (summary.missing / summary.totalRecords) * 100 : 0}%` 
                  }}
                />
              </div>
              <div className="breakdown-info">
                <div className="breakdown-label">
                  <span className="breakdown-dot danger"></span>
                  Missing
                </div>
                <div className="breakdown-value">{summary?.missing || 0}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <h3 className="card-title">Data Sources</h3>
          <div className="source-list">
            <div className="source-item">
              <TrendingUp size={20} className="source-icon" />
              <div>
                <div className="source-label">Vendor Statement</div>
                <div className="source-value">{vendorFile?.name}</div>
                <div className="source-meta">{vendorFile?.rowCount} records</div>
              </div>
            </div>
            
            <div className="source-item">
              <TrendingUp size={20} className="source-icon" />
              <div>
                <div className="source-label">Internal Records</div>
                <div className="source-value">{internalFile?.name}</div>
                <div className="source-meta">{internalFile?.rowCount} records</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recommendations */}
      {(summary?.amountMismatch || 0) > 0 || (summary?.missing || 0) > 0 ? (
        <div className="card info-card warning">
          <div className="info-card-icon">
            <AlertCircle size={24} />
          </div>
          <div className="info-card-content">
            <h4>Action Required</h4>
            <ul>
              {(summary?.amountMismatch || 0) > 0 && (
                <li>
                  Review {summary?.amountMismatch} transactions with amount mismatches
                </li>
              )}
              {(summary?.missing || 0) > 0 && (
                <li>
                  Investigate {summary?.missing} missing transactions
                </li>
              )}
              <li>Export detailed results for further analysis</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="card info-card success">
          <div className="info-card-icon">
            <TrendingUp size={24} />
          </div>
          <div className="info-card-content">
            <h4>Perfect Match! 🎉</h4>
            <p>All transactions have been successfully reconciled with no discrepancies.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
