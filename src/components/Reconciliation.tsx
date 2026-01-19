import React, { useState, useMemo } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Search, Download } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import type { ReconciliationStatus } from '../types';
import { calculateSummary, exportToCSV, downloadCSV } from '../utils/reconciliation';

const Reconciliation: React.FC = () => {
  const { reconciliationResults } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReconciliationStatus | 'all'>('all');
  
  const summary = reconciliationResults ? calculateSummary(reconciliationResults) : null;
  
  // Filter results based on search and status
  const filteredResults = useMemo(() => {
    if (!reconciliationResults) return [];
    
    return reconciliationResults.filter(result => {
      const matchesSearch = searchTerm === '' || 
        result.invoiceId.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || result.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [reconciliationResults, searchTerm, statusFilter]);
  
  const handleExport = () => {
    if (!reconciliationResults) return;
    const csvContent = exportToCSV(reconciliationResults);
    downloadCSV(csvContent);
  };
  
  if (!reconciliationResults) {
    return (
      <div className="reconciliation">
        <div className="page-header">
          <h1>Reconciliation</h1>
          <p className="page-subtitle">View and analyze reconciliation results</p>
        </div>
        <div className="empty-state">
          <AlertTriangle size={64} className="empty-state-icon" />
          <h2>No Reconciliation Data</h2>
          <p>Please upload files and run reconciliation first</p>
        </div>
      </div>
    );
  }
  
  const getStatusIcon = (status: ReconciliationStatus) => {
    switch (status) {
      case 'matched':
        return <CheckCircle size={20} className="status-icon success" />;
      case 'missing':
        return <XCircle size={20} className="status-icon danger" />;
      case 'amount-mismatch':
        return <AlertTriangle size={20} className="status-icon warning" />;
    }
  };
  
  const getStatusLabel = (status: ReconciliationStatus) => {
    switch (status) {
      case 'matched':
        return 'Matched';
      case 'missing':
        return 'Missing';
      case 'amount-mismatch':
        return 'Amount Mismatch';
    }
  };
  
  const getStatusClass = (status: ReconciliationStatus) => {
    switch (status) {
      case 'matched':
        return 'success';
      case 'missing':
        return 'danger';
      case 'amount-mismatch':
        return 'warning';
    }
  };
  
  return (
    <div className="reconciliation">
      <div className="page-header">
        <h1>Reconciliation Results</h1>
        <p className="page-subtitle">Detailed view of matched and mismatched transactions</p>
      </div>
      
      {/* Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-label">Total Records</div>
            <div className="stat-value">{summary?.totalRecords || 0}</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-label">Matched</div>
            <div className="stat-value success">{summary?.matched || 0}</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-label">Amount Mismatch</div>
            <div className="stat-value warning">{summary?.amountMismatch || 0}</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-label">Missing</div>
            <div className="stat-value danger">{summary?.missing || 0}</div>
          </div>
        </div>
      </div>
      
      {/* Filters and Actions */}
      <div className="card">
        <div className="filters-bar">
          <div className="search-box">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search by Invoice ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-group">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ReconciliationStatus | 'all')}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="matched">Matched</option>
              <option value="amount-mismatch">Amount Mismatch</option>
              <option value="missing">Missing</option>
            </select>
            
            <button 
              className="btn btn-secondary"
              onClick={handleExport}
            >
              <Download size={18} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Results Table */}
      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Invoice ID</th>
                <th>Vendor Amount</th>
                <th>Internal Amount</th>
                <th>Difference</th>
                <th>Vendor Date</th>
                <th>Internal Date</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.length === 0 ? (
                <tr>
                  <td colSpan={8} className="no-results">
                    No results found
                  </td>
                </tr>
              ) : (
                filteredResults.map((result, index) => (
                  <tr key={index}>
                    <td>
                      <div className={`status-badge ${getStatusClass(result.status)}`}>
                        {getStatusIcon(result.status)}
                        <span>{getStatusLabel(result.status)}</span>
                      </div>
                    </td>
                    <td className="invoice-id">{result.invoiceId}</td>
                    <td className="amount">
                      {result.vendorRecord 
                        ? `$${Number(result.vendorRecord.amount).toFixed(2)}` 
                        : <span className="text-muted">N/A</span>
                      }
                    </td>
                    <td className="amount">
                      {result.internalRecord 
                        ? `$${Number(result.internalRecord.amount).toFixed(2)}` 
                        : <span className="text-muted">N/A</span>
                      }
                    </td>
                    <td className={`amount ${result.amountDifference ? 'warning' : ''}`}>
                      {result.amountDifference 
                        ? `$${Number(result.amountDifference).toFixed(2)}` 
                        : <span className="text-muted">-</span>
                      }
                    </td>
                    <td>
                      {result.vendorRecord?.date || <span className="text-muted">N/A</span>}
                    </td>
                    <td>
                      {result.internalRecord?.date || <span className="text-muted">N/A</span>}
                    </td>
                    <td className="description">
                      {result.vendorRecord?.description || 
                       result.internalRecord?.description || 
                       <span className="text-muted">N/A</span>
                      }
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="table-footer">
          Showing {filteredResults.length} of {reconciliationResults.length} records
        </div>
      </div>
    </div>
  );
};

export default Reconciliation;
