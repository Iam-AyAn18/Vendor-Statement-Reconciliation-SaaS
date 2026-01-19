import React, { useState } from 'react';
import { Upload as UploadIcon, FileText, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { parseCSV, validateCSVFile } from '../utils/csvParser';
import { reconcileTransactions } from '../utils/reconciliation';

const Upload: React.FC = () => {
  const { 
    vendorFile, 
    internalFile, 
    setVendorFile, 
    setInternalFile,
    setReconciliationResults,
    setCurrentView
  } = useApp();
  
  const [vendorLoading, setVendorLoading] = useState(false);
  const [internalLoading, setInternalLoading] = useState(false);
  const [vendorError, setVendorError] = useState<string | null>(null);
  const [internalError, setInternalError] = useState<string | null>(null);
  
  const handleVendorUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setVendorError(null);
    const validationError = validateCSVFile(file);
    
    if (validationError) {
      setVendorError(validationError);
      return;
    }
    
    setVendorLoading(true);
    
    try {
      const parsed = await parseCSV(file);
      setVendorFile(parsed);
    } catch (error) {
      setVendorError(error instanceof Error ? error.message : 'Failed to parse file');
    } finally {
      setVendorLoading(false);
    }
  };
  
  const handleInternalUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setInternalError(null);
    const validationError = validateCSVFile(file);
    
    if (validationError) {
      setInternalError(validationError);
      return;
    }
    
    setInternalLoading(true);
    
    try {
      const parsed = await parseCSV(file);
      setInternalFile(parsed);
    } catch (error) {
      setInternalError(error instanceof Error ? error.message : 'Failed to parse file');
    } finally {
      setInternalLoading(false);
    }
  };
  
  const handleReconcile = () => {
    if (!vendorFile || !internalFile) return;
    
    const results = reconcileTransactions(vendorFile.data, internalFile.data);
    setReconciliationResults(results);
    setCurrentView('reconciliation');
  };
  
  const canReconcile = vendorFile && internalFile && !vendorLoading && !internalLoading;
  
  return (
    <div className="upload">
      <div className="page-header">
        <h1>Upload Files</h1>
        <p className="page-subtitle">Upload your vendor statements and internal records to begin reconciliation</p>
      </div>
      
      <div className="upload-grid">
        {/* Vendor Statement Upload */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Vendor Statement</h3>
            <p className="card-subtitle">Upload CSV file containing vendor transactions</p>
          </div>
          
          <div className="upload-zone">
            <input
              type="file"
              accept=".csv"
              onChange={handleVendorUpload}
              id="vendor-upload"
              className="upload-input"
              disabled={vendorLoading}
            />
            <label htmlFor="vendor-upload" className="upload-label">
              {vendorLoading ? (
                <>
                  <Loader className="upload-icon spinning" size={48} />
                  <p>Processing file...</p>
                </>
              ) : vendorFile ? (
                <>
                  <CheckCircle className="upload-icon success" size={48} />
                  <p className="upload-filename">{vendorFile.name}</p>
                  <p className="upload-meta">{vendorFile.rowCount} records • {vendorFile.columns.length} columns</p>
                </>
              ) : (
                <>
                  <UploadIcon className="upload-icon" size={48} />
                  <p>Click to upload or drag and drop</p>
                  <p className="upload-hint">CSV file (max 10MB)</p>
                </>
              )}
            </label>
            
            {vendorError && (
              <div className="upload-error">
                <AlertCircle size={16} />
                <span>{vendorError}</span>
              </div>
            )}
            
            {vendorFile && (
              <div className="file-details">
                <h4>File Details</h4>
                <div className="file-details-grid">
                  <div>
                    <span className="file-details-label">Columns:</span>
                    <span className="file-details-value">{vendorFile.columns.join(', ')}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Internal Records Upload */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Internal Transactions</h3>
            <p className="card-subtitle">Upload CSV file containing internal transaction records</p>
          </div>
          
          <div className="upload-zone">
            <input
              type="file"
              accept=".csv"
              onChange={handleInternalUpload}
              id="internal-upload"
              className="upload-input"
              disabled={internalLoading}
            />
            <label htmlFor="internal-upload" className="upload-label">
              {internalLoading ? (
                <>
                  <Loader className="upload-icon spinning" size={48} />
                  <p>Processing file...</p>
                </>
              ) : internalFile ? (
                <>
                  <CheckCircle className="upload-icon success" size={48} />
                  <p className="upload-filename">{internalFile.name}</p>
                  <p className="upload-meta">{internalFile.rowCount} records • {internalFile.columns.length} columns</p>
                </>
              ) : (
                <>
                  <UploadIcon className="upload-icon" size={48} />
                  <p>Click to upload or drag and drop</p>
                  <p className="upload-hint">CSV file (max 10MB)</p>
                </>
              )}
            </label>
            
            {internalError && (
              <div className="upload-error">
                <AlertCircle size={16} />
                <span>{internalError}</span>
              </div>
            )}
            
            {internalFile && (
              <div className="file-details">
                <h4>File Details</h4>
                <div className="file-details-grid">
                  <div>
                    <span className="file-details-label">Columns:</span>
                    <span className="file-details-value">{internalFile.columns.join(', ')}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* CSV Format Guide */}
      <div className="card info-card">
        <div className="info-card-icon">
          <FileText size={24} />
        </div>
        <div className="info-card-content">
          <h4>CSV Format Requirements</h4>
          <ul>
            <li>Required columns: <code>invoiceId</code> (or invoice_id, Invoice ID), <code>amount</code>, <code>date</code></li>
            <li>Optional columns: <code>description</code>, <code>vendor</code></li>
            <li>First row must contain column headers</li>
            <li>Amount can include currency symbols ($) and commas</li>
          </ul>
        </div>
      </div>
      
      {/* Reconcile Button */}
      {canReconcile && (
        <div className="upload-actions">
          <button 
            className="btn btn-primary btn-lg"
            onClick={handleReconcile}
          >
            Start Reconciliation
          </button>
        </div>
      )}
    </div>
  );
};

export default Upload;
