import type { Transaction, ReconciliationResult, ReconciliationSummary } from '../types';

/**
 * Core reconciliation logic - matches vendor statements with internal records
 * 
 * Matching criteria:
 * 1. Invoice ID must match exactly
 * 2. If amounts match within tolerance -> Status: MATCHED ✅
 * 3. If Invoice ID exists but amounts differ -> Status: AMOUNT MISMATCH ⚠️
 * 4. If Invoice ID only in one dataset -> Status: MISSING ❌
 */
export const reconcileTransactions = (
  vendorTransactions: Transaction[],
  internalTransactions: Transaction[],
  amountTolerance: number = 0.01 // Allow 1 cent difference for rounding
): ReconciliationResult[] => {
  const results: ReconciliationResult[] = [];
  
  // Create maps for efficient lookup
  const vendorMap = new Map<string, Transaction>();
  const internalMap = new Map<string, Transaction>();
  
  vendorTransactions.forEach(t => vendorMap.set(t.invoiceId, t));
  internalTransactions.forEach(t => internalMap.set(t.invoiceId, t));
  
  // Get all unique invoice IDs from both datasets
  const allInvoiceIds = new Set([
    ...vendorMap.keys(),
    ...internalMap.keys()
  ]);
  
  // Process each invoice ID
  allInvoiceIds.forEach(invoiceId => {
    const vendorRecord = vendorMap.get(invoiceId);
    const internalRecord = internalMap.get(invoiceId);
    
    if (vendorRecord && internalRecord) {
      // Both records exist - check amount match
      const amountDiff = Math.abs(vendorRecord.amount - internalRecord.amount);
      
      if (amountDiff <= amountTolerance) {
        // Amounts match (within tolerance)
        results.push({
          vendorRecord,
          internalRecord,
          status: 'matched',
          invoiceId,
          amountDifference: amountDiff
        });
      } else {
        // Amount mismatch
        results.push({
          vendorRecord,
          internalRecord,
          status: 'amount-mismatch',
          invoiceId,
          amountDifference: amountDiff
        });
      }
    } else if (vendorRecord && !internalRecord) {
      // Only in vendor records (missing from internal)
      results.push({
        vendorRecord,
        status: 'missing',
        invoiceId
      });
    } else if (!vendorRecord && internalRecord) {
      // Only in internal records (missing from vendor)
      results.push({
        internalRecord,
        status: 'missing',
        invoiceId
      });
    }
  });
  
  // Sort results: mismatches first, then missing, then matched
  const statusOrder = { 'amount-mismatch': 0, 'missing': 1, 'matched': 2 };
  results.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
  
  return results;
};

/**
 * Calculate summary statistics from reconciliation results
 */
export const calculateSummary = (results: ReconciliationResult[]): ReconciliationSummary => {
  return {
    totalRecords: results.length,
    matched: results.filter(r => r.status === 'matched').length,
    missing: results.filter(r => r.status === 'missing').length,
    amountMismatch: results.filter(r => r.status === 'amount-mismatch').length
  };
};

/**
 * Export reconciliation results to CSV
 */
export const exportToCSV = (results: ReconciliationResult[]): string => {
  const headers = [
    'Invoice ID',
    'Status',
    'Vendor Amount',
    'Internal Amount',
    'Difference',
    'Vendor Date',
    'Internal Date',
    'Description'
  ];
  
  const rows = results.map(result => [
    result.invoiceId,
    result.status.toUpperCase(),
    result.vendorRecord?.amount.toFixed(2) || 'N/A',
    result.internalRecord?.amount.toFixed(2) || 'N/A',
    result.amountDifference?.toFixed(2) || 'N/A',
    result.vendorRecord?.date || 'N/A',
    result.internalRecord?.date || 'N/A',
    result.vendorRecord?.description || result.internalRecord?.description || 'N/A'
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  return csvContent;
};

/**
 * Download CSV file
 */
export const downloadCSV = (csvContent: string, filename: string = 'reconciliation-results.csv') => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
