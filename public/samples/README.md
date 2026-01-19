# Sample CSV Files for Testing

This directory contains various CSV files for testing the Vendor Statement Reconciliation application.

## File Pairs

Each test scenario includes two files:
- **Vendor Statement** file (vendor records)
- **Internal Records** file (internal transaction records)

## Available Test Files

### 1. Original Sample Files
- `vendor-statement.csv` - Original vendor statement sample
- `internal-records.csv` - Original internal records sample

**Purpose**: Basic testing with 10 transactions including matched, amount mismatch, and missing records.

### 2. Large Dataset Test Files
- `test-large-vendor.csv` (51 records)
- `test-large-internal.csv` (52 records)

**Purpose**: Test performance and UI with larger datasets
- Contains 50+ transactions
- Includes various scenarios: perfect matches, amount mismatches, and missing records
- One record with intentional amount mismatch (INV-1004: $2200 vs $2150)
- One vendor record missing in internal (INV-1026)
- Two internal records missing in vendor (INV-1052, INV-1053)

### 3. Edge Cases Test Files
- `test-edge-cases-vendor.csv` (30 records)
- `test-edge-cases-internal.csv` (31 records)

**Purpose**: Test CSV parsing and data handling edge cases
- Dollar signs in amounts ($1,500.50)
- Commas in amounts ("2,300.00")
- Minimum amounts (0.01)
- Maximum amounts (99999.99)
- Negative amounts (refunds: -150.00)
- Zero amounts
- Special characters (@#$%&/\)
- Quotes in descriptions
- Unicode characters (café, émojis 🚀)
- Multiple date formats
- Empty fields
- Very long descriptions
- Leading/trailing spaces
- Amount mismatch test (INV-2019: $1100.00 vs $1150.00)
- Missing record test (INV-2031 only in internal)

### 4. Perfect Match Test Files
- `test-perfect-match-vendor.csv` (10 records)
- `test-perfect-match-internal.csv` (10 records)

**Purpose**: Test 100% match scenario
- All 10 transactions match perfectly
- Clean data with no discrepancies
- Ideal for testing successful reconciliation flow

## CSV Format Requirements

All CSV files follow this structure:

### Vendor Statement Format
```csv
invoiceId,amount,date,description,vendor
INV-001,1500.00,2024-01-15,Website Development,TechCorp Inc
```

### Internal Records Format
```csv
invoiceId,amount,date,description
INV-001,1500.00,2024-01-15,Website Development Payment
```

### Required Columns
- `invoiceId` - Unique transaction identifier
- `amount` - Transaction amount
- `date` - Transaction date

### Optional Columns
- `description` - Transaction description
- `vendor` - Vendor name (vendor statements only)

## How to Use

1. **Basic Testing**: Use the original sample files
2. **Performance Testing**: Use the large dataset files
3. **Edge Case Testing**: Use the edge cases files to validate CSV parsing
4. **Success Testing**: Use the perfect match files to test 100% match scenarios

## Testing Scenarios Covered

- ✅ **Perfect Matches**: Transactions that match exactly
- ⚠️ **Amount Mismatches**: Same invoice ID but different amounts
- ❌ **Missing in Vendor**: Transactions only in internal records
- ❌ **Missing in Internal**: Transactions only in vendor statement
- 🔤 **Special Characters**: Unicode, quotes, commas, symbols
- 💰 **Amount Formats**: Dollar signs, commas, negative values, decimals
- 📅 **Date Formats**: Different date format variations
- 📏 **Data Sizes**: Small (10), Medium (30), Large (50+) datasets

## Notes

- All amounts use 2 decimal places unless testing edge cases
- Invoice IDs follow the format: INV-XXXX
- Dates are primarily in YYYY-MM-DD format (edge cases test other formats)
- The reconciliation tolerance is ±$0.01 for matching
