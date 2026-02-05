import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ArrowLeft, Play, Trash2 } from 'lucide-react';
import Button from '../common/Button';
import usePreviewStore from '../../stores/previewStore';
import { jobsApi } from '../../services/jobsApi';
import toast from 'react-hot-toast';

const PreviewActions = ({ previewId, onCancel }) => {
  const navigate = useNavigate();
  const { getTotalColumnsToDelete, getConfirmPayload } = usePreviewStore();
  const columnsToDelete = getTotalColumnsToDelete();

  const handleConfirm = async () => {
    try {
      const payload = getConfirmPayload();
      toast.loading('Starting analysis...', { id: 'confirm-preview' });

      const response = await jobsApi.confirmPreview(previewId, payload.file_selections);

      toast.success(
        `Analysis started! ${response.columns_removed} column${response.columns_removed !== 1 ? 's' : ''} removed.`,
        { id: 'confirm-preview' }
      );

      // Navigate to processing page
      navigate(`/jobs/${response.job_id}/processing`);
    } catch (error) {
      console.error('Failed to confirm preview:', error);
      toast.error(
        error.response?.data?.error?.message || 'Failed to start analysis',
        { id: 'confirm-preview' }
      );
    }
  };

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel? All preview data will be deleted.')) {
      try {
        toast.loading('Cancelling preview...', { id: 'cancel-preview' });

        await jobsApi.cancelPreview(previewId);

        toast.success('Preview cancelled', { id: 'cancel-preview' });

        // Call parent cancel handler or navigate back
        if (onCancel) {
          onCancel();
        } else {
          navigate('/upload');
        }
      } catch (error) {
        console.error('Failed to cancel preview:', error);
        toast.error('Failed to cancel preview', { id: 'cancel-preview' });
      }
    }
  };

  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-200 p-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Cancel button (compact) */}
        <button
          onClick={handleCancel}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Cancel
        </button>

        {/* Center: Info (compact) */}
        <div className="text-center">
          {columnsToDelete > 0 ? (
            <div className="flex items-center gap-1.5">
              <Trash2 className="w-4 h-4 text-red-600" />
              <span className="text-xs font-medium text-gray-700">
                <span className="text-red-600 font-bold">{columnsToDelete}</span> column
                {columnsToDelete !== 1 ? 's' : ''} to delete
              </span>
            </div>
          ) : (
            <span className="text-xs text-gray-600">
              No columns selected
            </span>
          )}
        </div>

        {/* Right: Process button (compact) */}
        <button
          onClick={handleConfirm}
          className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
        >
          <Play className="w-3.5 h-3.5" />
          Start Analysis
        </button>
      </div>
    </div>
  );
};

PreviewActions.propTypes = {
  previewId: PropTypes.string.isRequired,
  onCancel: PropTypes.func
};

export default PreviewActions;
