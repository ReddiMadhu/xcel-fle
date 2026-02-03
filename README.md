# Excel Relationship Discovery - Frontend

A highly polished, visualization-focused React web application for discovering and exploring relationships in Excel files using AI.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Backend API running at `http://localhost:8000` (see excel-r backend)

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   ├── upload/          # File upload components
│   ├── processing/      # Processing view components (Phase 3)
│   ├── visualization/   # ER diagram components (Phase 4+)
│   └── export/          # Export functionality (Phase 7)
├── hooks/               # Custom React hooks
├── pages/               # Route pages
├── services/            # API communication
├── stores/              # Zustand state stores
├── utils/               # Helper functions
└── config.js            # App configuration
```

## ✅ Phase 2 - Upload Flow (Completed)

### Features Implemented
- ✅ Drag-and-drop file upload with visual feedback
- ✅ File validation (type, size, count)
- ✅ Multi-file selection (1-5 files, max 100MB each)
- ✅ Upload progress tracking with per-file progress bars
- ✅ File list with remove capability
- ✅ Toast notifications for errors and success
- ✅ Responsive design (desktop-optimized)
- ✅ Smooth animations and transitions
- ✅ Client-side routing with React Router
- ✅ Zustand state management
- ✅ Axios API integration

### Routes
- `/` - Redirects to `/upload`
- `/upload` - Main file upload page
- `/jobs/:jobId/processing` - Processing page (placeholder, Phase 3)
- `/jobs/:jobId/results` - Results visualization (placeholder, Phase 4+)

### Components Created
**Common:**
- `Button.jsx` - Reusable button with variants (primary, secondary, danger, ghost)
- `Spinner.jsx` - Loading spinner with size variants
- `ProgressBar.jsx` - Progress bar with optional label

**Upload:**
- `FileUploadZone.jsx` - Drag-drop upload zone
- `FileList.jsx` - File list with validation status
- `UploadProgress.jsx` - Upload progress display

### State Management
**jobStore.js:**
- Current job state
- Uploaded files tracking
- Upload progress
- Actions: setCurrentJob, updateProgress, setResult, clearJob

**uiStore.js:**
- Modal state
- Active view
- WebSocket connection state
- Toast notifications

### API Integration
**services/api.js:**
- Axios client with interceptors
- Base URL configuration
- Global error handling

**services/jobsApi.js:**
- `createJob()` - Upload files with progress tracking
- `getJobStatus()` - Poll job status
- `getJobResult()` - Fetch analysis results
- `deleteJob()` - Delete job (future)

## 🎨 Design System

### Colors
- Primary: Blue (#3b82f6)
- Success: Green (#10b981)
- Warning: Orange (#f59e0b)
- Error: Red (#ef4444)

### Animations
- Fade-in: 0.3s ease-in-out
- Slide-up: 0.4s ease-out
- Pulse-slow: 3s infinite

## 🔧 Configuration

### Environment Variables
Create `.env.development` and `.env.production`:

```bash
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_BASE_URL=ws://localhost:8000
```

### File Constraints
- Max files: 5
- Max file size: 100MB
- Allowed extensions: .xlsx, .xls, .xlsm, .csv

## 📝 Testing Phase 2

### Manual Test Scenarios

**Valid Upload:**
1. Navigate to `http://localhost:5173/upload`
2. Drag-drop 2-3 Excel files
3. Verify files appear in list with checkmarks
4. Click "Analyze Relationships"
5. Verify upload progress (0-100%)
6. Should navigate to `/jobs/{job_id}/processing`

**Validation Errors:**
1. Upload PDF file → Toast: "Invalid file type"
2. Upload 6 files → Toast: "Maximum 5 files allowed"
3. Upload 150MB file → Toast: "File exceeds 100MB limit"

**File Removal:**
1. Upload 3 files
2. Click X button on second file
3. Verify file removed from list

**Error Handling:**
1. Stop backend server
2. Try to upload files
3. Verify error toast appears

## 🚧 Next Steps - Phase 3

**Processing Flow Implementation:**
- WebSocket real-time progress updates
- Polling fallback mechanism
- Table preview (first 20 rows)
- Stage-specific progress messages
- Circular progress indicator
- Auto-navigation to results on completion

## 📦 Dependencies

**Core:**
- react 18+
- react-dom 18+
- react-router-dom 7+
- zustand 5+
- axios 1+

**UI:**
- @radix-ui/react-dialog
- @radix-ui/react-tooltip
- react-hot-toast
- tailwindcss

**Dev:**
- vite
- @tailwindcss/postcss
- autoprefixer
- prop-types

## 🎯 Success Criteria - Phase 2

- ✅ Users can drag-drop Excel files
- ✅ File validation works (type, size, count)
- ✅ Upload progress tracked per file
- ✅ Navigate to processing page after upload
- ✅ Toast notifications for errors
- ✅ Smooth animations and transitions
- ✅ Desktop-optimized responsive design
- ✅ Build completes without errors

## 📄 License

See main project README
