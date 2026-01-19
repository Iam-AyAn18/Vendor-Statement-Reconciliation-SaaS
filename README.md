# ReconcileAI - Vendor Statement Reconciliation SaaS

A production-ready React.js application for reconciling vendor statements with internal transaction records. Built with TypeScript, this SaaS-style application runs entirely in the browser with no backend required.

## 🚀 Features

### Core Functionality
- **File Upload**: Upload CSV files for both vendor statements and internal records
- **Client-Side CSV Parsing**: Parse and validate CSV files entirely in the browser
- **Intelligent Reconciliation**: Match transactions based on Invoice ID and Amount
- **Results Categorization**:
  - ✅ **Matched**: Transactions that match perfectly
  - ⚠️ **Amount Mismatch**: Matching Invoice IDs but different amounts
  - ❌ **Missing**: Transactions present in only one dataset

### UI/UX
- **Modern SaaS Dashboard**: Clean, professional interface
- **Sidebar Navigation**: Dashboard, Upload, Reconciliation, Reports
- **Summary Cards**: Visual display of reconciliation statistics
- **Data Table**: Filterable and searchable results table
- **Light/Dark Mode**: Toggle between themes
- **Responsive Design**: Works on desktop and mobile devices

### Additional Features
- **Export to CSV**: Download reconciliation results
- **Empty States**: Helpful guidance when no data is present
- **Loading States**: Visual feedback during file processing
- **Error Handling**: Validation and error messages for invalid files

## 🛠️ Tech Stack

- **React 19** - UI Framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **PapaCSV** - CSV parsing
- **Lucide React** - Modern icons
- **CSS Variables** - Theming system

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm

### Setup
```bash
# Clone the repository
git clone https://github.com/Iam-AyAn18/Vendor-Statement-Reconciliation-SaaS.git
cd Vendor-Statement-Reconciliation-SaaS

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── Navbar.tsx      # Top navigation bar
│   ├── Sidebar.tsx     # Side navigation menu
│   ├── Dashboard.tsx   # Dashboard view
│   ├── Upload.tsx      # File upload interface
│   ├── Reconciliation.tsx  # Results display
│   └── Reports.tsx     # Analytics and insights
├── contexts/
│   └── AppContext.tsx  # Global state management
├── types/
│   └── index.ts        # TypeScript type definitions
├── utils/
│   ├── csvParser.ts    # CSV parsing utilities
│   └── reconciliation.ts  # Reconciliation logic
├── App.tsx             # Main application component
├── App.css             # Component styles
├── index.css           # Global styles and theme
└── main.tsx            # Application entry point
```

## 📝 CSV File Format

Your CSV files should include the following columns:

### Required Columns
- `invoiceId` (or `invoice_id`, `Invoice ID`) - Unique transaction identifier
- `amount` - Transaction amount (can include $ and commas)
- `date` - Transaction date

### Optional Columns
- `description` - Transaction description
- `vendor` - Vendor name
- Any additional columns will be preserved

### Sample Format
```csv
invoiceId,amount,date,description,vendor
INV-001,1500.00,2024-01-15,Website Development,TechCorp Inc
INV-002,2300.50,2024-01-18,Cloud Hosting Services,CloudServe LLC
```

Multiple sample CSV files are provided in `public/samples/` for testing:
- **Basic samples**: `vendor-statement.csv` and `internal-records.csv` (10 records each)
- **Large dataset**: `test-large-*.csv` (50+ records) - for performance testing
- **Edge cases**: `test-edge-cases-*.csv` (30+ records) - special characters, formats, and edge cases
- **Perfect match**: `test-perfect-match-*.csv` (10 records) - 100% match scenario

See `public/samples/README.md` for detailed documentation of all test files.

## 🔄 How Reconciliation Works

The reconciliation algorithm follows these steps:

1. **Parse CSV Files**: Extract and normalize data from both uploaded files
2. **Create Invoice Map**: Index all transactions by Invoice ID for O(1) lookup
3. **Match Transactions**: For each unique Invoice ID:
   - If found in both datasets with matching amounts (±$0.01 tolerance) → **MATCHED** ✅
   - If found in both datasets with different amounts → **AMOUNT MISMATCH** ⚠️
   - If found in only one dataset → **MISSING** ❌
4. **Sort Results**: Mismatches first, then missing, then matched
5. **Display & Export**: Show results in table and allow CSV export

## 🎨 Features Deep Dive

### Dashboard
- Summary statistics with visual cards
- File upload status
- Match rate percentage
- Quick navigation to detailed results

### Upload
- Drag-and-drop file upload
- Real-time validation
- File preview with row and column counts
- Clear error messages
- Format requirements guide

### Reconciliation
- Comprehensive results table
- Status-based filtering
- Invoice ID search
- Export to CSV functionality
- Color-coded status badges

### Reports
- Executive summary metrics
- Visual progress bars
- Data source information
- Actionable recommendations

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

The optimized production build will be created in the `dist/` directory.

### Deploy to Azure Static Web Apps
```bash
# Install Azure Static Web Apps CLI
npm install -g @azure/static-web-apps-cli

# Deploy (follow prompts)
swa deploy
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Or simply connect your GitHub repository to [Vercel](https://vercel.com) or [Azure Static Web Apps](https://azure.microsoft.com/en-us/services/app-service/static/) for automatic deployments.

## 🧪 Development

### Run Development Server
```bash
npm run dev
```

### Build Project
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Lint Code
```bash
npm run lint
```

## 🎯 Use Cases

- **Finance Teams**: Reconcile vendor invoices with payment records
- **Accounting**: Match transactions between different systems
- **Auditing**: Identify discrepancies in financial records
- **Portfolio Projects**: Demonstrate frontend and algorithmic skills

## 🔐 Security & Privacy

- **No Backend**: All processing happens in the browser
- **No Data Storage**: Files are not uploaded to any server
- **Client-Side Only**: Complete privacy and security
- **No External APIs**: Works completely offline after initial load

## 🤝 Contributing

This is a portfolio project. Feel free to fork and customize for your own needs.

## 📄 License

MIT License - Feel free to use this project for your portfolio or learning purposes.

## 👤 Author

Created by [Iam-AyAn18](https://github.com/Iam-AyAn18)

---

**Note**: This is a frontend-only application designed to showcase React.js, TypeScript, and algorithmic thinking. No backend or database is required.
