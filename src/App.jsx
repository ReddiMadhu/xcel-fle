import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Spinner from './components/common/Spinner.jsx';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';

// Lazy load pages for code splitting
const UploadPage = lazy(() => import('./pages/UploadPage.jsx'));
const ProcessingPage = lazy(() => import('./pages/ProcessingPage.jsx'));
const ResultsPage = lazy(() => import('./pages/ResultsPage.jsx'));

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#111827',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      {/* Routes */}
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Spinner size="xl" />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Navigate to="/upload" replace />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/jobs/:jobId/processing" element={<ProcessingPage />} />
          <Route path="/jobs/:jobId/results" element={<ResultsPage />} />
          <Route path="*" element={<Navigate to="/upload" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </ErrorBoundary>
  );
}

export default App;
