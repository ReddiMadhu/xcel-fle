import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useJobStore } from '../stores/jobStore.js';
import { useUIStore } from '../stores/uiStore.js';
import { useWebSocket } from '../hooks/useWebSocket.js';
import { useJobPolling } from '../hooks/useJobPolling.js';
import { jobsApi } from '../services/jobsApi.js';
import StageProgress from '../components/processing/StageProgress.jsx';
import TablePreview from '../components/processing/TablePreview.jsx';
import Button from '../components/common/Button.jsx';
import Spinner from '../components/common/Spinner.jsx';

const ProcessingPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [filePreview, setFilePreview] = useState(null);

  const currentJob = useJobStore(state => state.currentJob);
  const updateProgress = useJobStore(state => state.actions.updateProgress);
  const wsConnected = useUIStore(state => state.wsConnected);
  const showToast = useUIStore(state => state.actions.showToast);

  // Try WebSocket first
  const { connected } = useWebSocket(jobId);

  // Fallback to polling if WebSocket fails
  useJobPolling(jobId, !connected);

  // Fetch initial job status
  useEffect(() => {
    const fetchJobStatus = async () => {
      try {
        const data = await jobsApi.getJobStatus(jobId);
        updateProgress(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch job status:', error);
        showToast('Failed to load job status', 'error');
        setLoading(false);
      }
    };

    fetchJobStatus();
  }, [jobId, updateProgress, showToast]);

  // Fetch file preview data (mock for now, will come from backend)
  useEffect(() => {
    // In real implementation, this would fetch from an endpoint
    // For now, we'll show preview once profiling_data stage is complete
    if (currentJob?.current_stage === 'profiling_data' || currentJob?.progress_percent > 25) {
      // Mock data - replace with actual API call
      setFilePreview(null); // Will be populated by backend
    }
  }, [currentJob?.current_stage, currentJob?.progress_percent]);

  // Auto-navigate to results when complete
  useEffect(() => {
    if (currentJob?.status === 'completed') {
      setTimeout(() => {
        navigate(`/jobs/${jobId}/results`);
      }, 2000);
    }
  }, [currentJob?.status, jobId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  if (!currentJob) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Job Not Found</h2>
          <p className="text-gray-600 mt-2">The job {jobId} could not be found.</p>
          <Button
            className="mt-4"
            onClick={() => navigate('/upload')}
          >
            Return to Upload
          </Button>
        </div>
      </div>
    );
  }

  const progress = currentJob.progress_percent || 0;
  const stage = currentJob.current_stage || 'loading_files';
  const status = currentJob.status || 'pending';

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Analyzing Your Data
          </h1>
          <p className="text-gray-600">
            Job ID: <span className="font-mono text-sm">{jobId}</span>
          </p>

          {/* Connection status */}
          <div className="mt-2 flex items-center justify-center gap-2">
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-orange-500'}`} />
            <span className="text-xs text-gray-500">
              {connected ? 'Live updates connected' : 'Polling for updates'}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Progress */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            {status === 'failed' ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Analysis Failed</h3>
                <p className="text-gray-600 mb-4">{currentJob.error || 'An error occurred during processing'}</p>
                <Button onClick={() => navigate('/upload')}>
                  Upload New Files
                </Button>
              </div>
            ) : status === 'completed' ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg animate-bounce-once">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Analysis Complete!</h3>
                <p className="text-gray-600 mb-4">
                  Found {currentJob.relationships_found || 0} relationships across {currentJob.file_count} files
                </p>
                <div className="flex items-center justify-center gap-2">
                  <Spinner size="sm" />
                  <p className="text-sm text-gray-500">Redirecting to results...</p>
                </div>
              </div>
            ) : (
              <StageProgress
                progress={progress}
                stage={stage}
                status={status}
              />
            )}
          </div>

          {/* Right: File Preview */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Uploaded Files
            </h2>

            {currentJob.file_count > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl border border-primary-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-md">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{currentJob.file_count} Excel files</p>
                      <p className="text-xs text-gray-600">Uploaded successfully</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>

                {filePreview && (
                  <div className="mt-4">
                    <TablePreview files={filePreview} />
                  </div>
                )}

                {!filePreview && progress > 10 && (
                  <div className="text-center py-8 text-gray-500">
                    <Spinner size="md" className="mb-2" />
                    <p className="text-sm">Loading table preview...</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No files information available</p>
            )}
          </div>
        </div>

        {/* Cancel button (only if still processing) */}
        {(status === 'pending' || status === 'running') && (
          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (confirm('Are you sure you want to cancel this analysis?')) {
                  navigate('/upload');
                }
              }}
            >
              Cancel Analysis
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessingPage;
