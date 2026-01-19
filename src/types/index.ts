// Core data types for the reconciliation system

export interface Transaction {
  invoiceId: string;
  amount: number;
  date: string;
  description?: string;
  vendor?: string;
  [key: string]: string | number | undefined; // Allow additional fields from CSV
}

export interface UploadedFile {
  name: string;
  rowCount: number;
  columns: string[];
  data: Transaction[];
}

export type ReconciliationStatus = 'matched' | 'missing' | 'amount-mismatch';

export interface ReconciliationResult {
  vendorRecord?: Transaction;
  internalRecord?: Transaction;
  status: ReconciliationStatus;
  invoiceId: string;
  amountDifference?: number;
}

export interface ReconciliationSummary {
  totalRecords: number;
  matched: number;
  missing: number;
  amountMismatch: number;
}

export type Theme = 'light' | 'dark';

export type NavigationView = 'dashboard' | 'upload' | 'reconciliation' | 'reports';
