import PropTypes from 'prop-types';
import { AlertTriangle } from 'lucide-react';
import usePreviewStore from '../../stores/previewStore';

const CompactDuplicateAlert = ({ group, fileId }) => {
  const { isColumnMarkedForDeletion, toggleColumnDeletion } = usePreviewStore();

  return (
    <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-yellow-900 mb-2">
            {group.detection_type.replace(/_/g, ' ')} - {group.similarity_score}% similar
          </h4>

          {/* Columns in horizontal layout */}
          <div className="flex items-center gap-2 flex-wrap">
            {group.columns.map((columnName, index) => {
              const isMarked = isColumnMarkedForDeletion(fileId, columnName);

              return (
                <button
                  key={index}
                  onClick={() => toggleColumnDeletion(fileId, columnName)}
                  className={`
                    inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                    ${isMarked
                      ? 'bg-red-100 text-red-700 border border-red-300'
                      : 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50'
                    }
                  `}
                >
                  <span className={isMarked ? 'line-through' : ''}>{columnName}</span>
                  <span className={`
                    text-xs px-1.5 py-0.5 rounded
                    ${isMarked ? 'bg-red-200 text-red-800' : 'bg-emerald-100 text-emerald-700'}
                  `}>
                    {isMarked ? 'Delete' : 'Keep'}
                  </span>
                </button>
              );
            })}
          </div>

          {group.recommendation && (
            <p className="text-xs text-yellow-700 mt-2">
              <strong>Recommendation:</strong> {group.recommendation}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

CompactDuplicateAlert.propTypes = {
  group: PropTypes.shape({
    group_id: PropTypes.string,
    detection_type: PropTypes.string.isRequired,
    similarity_score: PropTypes.number.isRequired,
    columns: PropTypes.arrayOf(PropTypes.string).isRequired,
    recommendation: PropTypes.string
  }).isRequired,
  fileId: PropTypes.string.isRequired
};

export default CompactDuplicateAlert;
