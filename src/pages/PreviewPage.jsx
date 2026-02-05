import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import usePreviewStore from '../stores/previewStore';
import Spinner from '../components/common/Spinner';
import FileListSidebar from '../components/preview/FileListSidebar';
import StatsCards from '../components/preview/StatsCards';
import DataSpreadsheetView from '../components/preview/DataSpreadsheetView';
import CompactDuplicateAlert from '../components/preview/CompactDuplicateAlert';
import PreviewActions from '../components/preview/PreviewActions';

const PreviewPage = () => {
  const { previewId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    previewData,
    setPreviewData,
    isLoading,
    error
  } = usePreviewStore();

  // Local state for selected file index
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);

  useEffect(() => {
    // Get preview data from location state (passed from upload page)
    if (location.state?.previewData) {
      setPreviewData(location.state.previewData);
    } else if (!previewData) {
      // If no preview data, redirect back to upload
      navigate('/upload');
    }
  }, [location.state, previewData, setPreviewData, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Loading preview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Preview</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/upload')}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Back to Upload
          </button>
        </div>
      </div>
    );
  }

  if (!previewData || !previewData.files || previewData.files.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Preview Data</h2>
          <p className="text-gray-600 mb-6">No files to preview. Please upload files first.</p>
          <button
            onClick={() => navigate('/upload')}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Go to Upload
          </button>
        </div>
      </div>
    );
  }

  const currentFile = previewData.files[selectedFileIndex];
  const hasDuplicates = currentFile?.duplicate_groups && currentFile.duplicate_groups.length > 0;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Compact Sidebar - File List */}
      <FileListSidebar
        files={previewData.files}
        selectedIndex={selectedFileIndex}
        onSelectFile={setSelectedFileIndex}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Slim Top Bar */}
        <div className="h-12 bg-white border-b border-gray-200 px-4 flex items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/upload')}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-gray-600" />
            </button>
            <nav className="flex items-center gap-1.5 text-xs text-gray-500">
              <span>Upload</span>
              <span>›</span>
              <span className="text-primary-600 font-semibold">Review</span>
              <span>›</span>
              <span>Analyze</span>
            </nav>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto px-6 py-6">
            {/* Stats Cards - Now in main content */}
            <div className="mb-6">
              <StatsCards currentFile={currentFile} />
            </div>

            {/* Duplicate Warnings (Compact horizontal layout) */}
            {hasDuplicates && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <h3 className="text-sm font-semibold text-gray-700">
                    Duplicate Columns Detected ({currentFile.duplicate_groups.length})
                  </h3>
                </div>
                <div className="space-y-3">
                  {currentFile.duplicate_groups.map((group) => (
                    <CompactDuplicateAlert
                      key={group.group_id}
                      group={group}
                      fileId={currentFile.file_id}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Spreadsheet View with scrolling */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-700">
                  {currentFile.original_filename}
                </h3>
                <span className="text-xs text-gray-500">
                  Preview of {currentFile.row_count?.toLocaleString()} rows
                </span>
              </div>
              <DataSpreadsheetView
                fileId={currentFile.file_id}
                columns={currentFile.columns}
              />
            </div>
          </div>
        </div>

        {/* Compact Sticky Footer */}
        <PreviewActions previewId={previewId} />
      </div>
    </div>
  );
};

export default PreviewPage;
