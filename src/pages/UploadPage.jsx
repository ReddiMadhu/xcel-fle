import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobStore } from '../stores/jobStore.js';
import { useUIStore } from '../stores/uiStore.js';
import { jobsApi } from '../services/jobsApi.js';
import { config } from '../config.js';
import FileUploadZone from '../components/upload/FileUploadZone.jsx';
import FileList from '../components/upload/FileList.jsx';
import UploadProgress from '../components/upload/UploadProgress.jsx';
import Button from '../components/common/Button.jsx';

const UploadPage = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const setCurrentJob = useJobStore(state => state.actions.setCurrentJob);
  const clearJob = useJobStore(state => state.actions.clearJob);
  const showToast = useUIStore(state => state.actions.showToast);

  const handleFilesSelected = (newFiles) => {
    const validFiles = newFiles.filter(file => {
      const ext = '.' + file.name.split('.').pop().toLowerCase();
      const isValidExt = config.allowedExtensions.includes(ext);
      const isValidSize = file.size <= config.maxFileSize;

      if (!isValidExt) {
        showToast(`File '${file.name}' is not a valid Excel file`, 'error');
        return false;
      }
      if (!isValidSize) {
        showToast(`File '${file.name}' exceeds ${config.maxFileSize / (1024 * 1024)}MB limit`, 'error');
        return false;
      }
      return true;
    });

    setFiles(prevFiles => {
      const combined = [...prevFiles, ...validFiles];
      // Remove duplicates based on name
      const unique = combined.filter((file, index, self) =>
        index === self.findIndex(f => f.name === file.name)
      );

      if (unique.length > config.maxFiles) {
        showToast(`Maximum ${config.maxFiles} files allowed`, 'warning');
        return unique.slice(0, config.maxFiles);
      }

      return unique;
    });
  };

  const handleRemoveFile = (fileName) => {
    setFiles(prevFiles => prevFiles.filter(f => f.name !== fileName));
  };

  const validateFiles = () => {
    if (files.length === 0) {
      showToast('Please select at least 1 file', 'error');
      return false;
    }

    if (files.length > config.maxFiles) {
      showToast(`Maximum ${config.maxFiles} files allowed`, 'error');
      return false;
    }

    const hasInvalidFiles = files.some(file => {
      const ext = '.' + file.name.split('.').pop().toLowerCase();
      return !config.allowedExtensions.includes(ext) || file.size > config.maxFileSize;
    });

    if (hasInvalidFiles) {
      showToast('Please remove invalid files before uploading', 'error');
      return false;
    }

    return true;
  };

  const handleUpload = async () => {
    if (!validateFiles()) return;

    setIsUploading(true);
    setUploadProgress(0);
    clearJob();

    try {
      const response = await jobsApi.createJob(files, (progress) => {
        setUploadProgress(progress);
      });

      showToast('Files uploaded successfully! Starting analysis...', 'success');

      // Store job in store
      setCurrentJob(response);

      // Navigate to processing page
      setTimeout(() => {
        navigate(`/jobs/${response.job_id}/processing`);
      }, 500);

    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error.response?.data?.error?.message ||
                          error.response?.data?.detail?.error?.message ||
                          'Upload failed. Please check your connection and try again.';
      showToast(errorMessage, 'error');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const canUpload = files.length > 0 && files.length <= config.maxFiles && !isUploading;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Excel Relationship Discovery
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your Excel files and let AI discover hidden relationships between your data.
            Get business insights, validation, and actionable recommendations.
          </p>
        </div>

        {/* Main Upload Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 animate-slide-up">
          {!isUploading ? (
            <>
              <FileUploadZone
                onFilesSelected={handleFilesSelected}
                disabled={isUploading}
              />

              <FileList
                files={files}
                onRemove={handleRemoveFile}
                disabled={isUploading}
              />

              {/* Upload Button */}
              {files.length > 0 && (
                <div className="mt-8 flex justify-end gap-4">
                  <Button
                    variant="secondary"
                    onClick={() => setFiles([])}
                    disabled={isUploading}
                  >
                    Clear All
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleUpload}
                    disabled={!canUpload}
                    loading={isUploading}
                  >
                    Analyze Relationships
                  </Button>
                </div>
              )}
            </>
          ) : (
            <UploadProgress
              progress={uploadProgress}
              fileName={files.length > 1 ? `${files.length} files` : files[0]?.name}
            />
          )}
        </div>

      </div>
    </div>
  );
};

export default UploadPage;
