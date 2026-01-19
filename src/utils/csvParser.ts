import Papa from 'papaparse';
import type { Transaction, UploadedFile } from '../types';

/**
 * Parse CSV file and convert to Transaction objects
 * Handles different column name variations (invoice_id, invoiceId, etc.)
 */
export const parseCSV = (file: File): Promise<UploadedFile> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const columns = results.meta.fields || [];
          
          // Map CSV rows to Transaction objects
          const data: Transaction[] = results.data.map((row: any) => {
            // Find invoice ID field (case-insensitive, handle variations)
            const invoiceIdKey = Object.keys(row).find(key => 
              key.toLowerCase().replace(/[_\s]/g, '') === 'invoiceid'
            ) || 'invoiceId';
            
            // Find amount field (case-insensitive, handle variations)
            const amountKey = Object.keys(row).find(key => 
              key.toLowerCase().replace(/[_\s]/g, '') === 'amount'
            ) || 'amount';
            
            // Find date field
            const dateKey = Object.keys(row).find(key => 
              key.toLowerCase().replace(/[_\s]/g, '') === 'date'
            ) || 'date';

            // Parse amount (remove currency symbols and commas)
            const amountStr = String(row[amountKey] || '0')
              .replace(/[,$]/g, '')
              .trim();
            const amount = parseFloat(amountStr) || 0;

            return {
              invoiceId: String(row[invoiceIdKey] || '').trim(),
              amount: amount,
              date: String(row[dateKey] || '').trim(),
              description: row.description || row.Description || '',
              vendor: row.vendor || row.Vendor || '',
              ...row // Include all other fields
            };
          });

          // Filter out invalid records (no invoice ID)
          const validData = data.filter(t => t.invoiceId && t.invoiceId !== '');

          resolve({
            name: file.name,
            rowCount: validData.length,
            columns: columns,
            data: validData
          });
        } catch (error) {
          reject(new Error('Failed to parse CSV data'));
        }
      },
      error: (error) => {
        reject(new Error(`CSV parsing error: ${error.message}`));
      }
    });
  });
};

/**
 * Validate CSV file before parsing
 */
export const validateCSVFile = (file: File): string | null => {
  if (!file) {
    return 'No file selected';
  }
  
  if (!file.name.toLowerCase().endsWith('.csv')) {
    return 'File must be a CSV file';
  }
  
  if (file.size === 0) {
    return 'File is empty';
  }
  
  if (file.size > 10 * 1024 * 1024) { // 10MB limit
    return 'File size must be less than 10MB';
  }
  
  return null;
};
