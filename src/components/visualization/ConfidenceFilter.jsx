import { useGraphStore } from '../../stores/graphStore.js';
import ToggleSwitch from '../common/ToggleSwitch.jsx';

const ConfidenceFilter = () => {
  const confidenceFilter = useGraphStore(state => state.confidenceFilter);
  const toggleConfidenceLevel = useGraphStore(state => state.actions.toggleConfidenceLevel);

  const getLevelConfig = (level) => {
    switch (level) {
      case 'HIGH':
        return {
          color: 'bg-green-500',
          label: 'High Confidence',
          textColor: 'text-green-700'
        };
      case 'MEDIUM':
        return {
          color: 'bg-orange-500',
          label: 'Medium Confidence',
          textColor: 'text-orange-700'
        };
      case 'LOW':
        return {
          color: 'bg-gray-400',
          label: 'Low Confidence',
          textColor: 'text-gray-700'
        };
      default:
        return {
          color: 'bg-gray-400',
          label: level,
          textColor: 'text-gray-700'
        };
    }
  };

  const totalCount = confidenceFilter.HIGH.count + confidenceFilter.MEDIUM.count + confidenceFilter.LOW.count;

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-md">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            Filter Relationships
          </h3>
          <p className="text-xs text-gray-500">{totalCount} total</p>
        </div>
      </div>

      {/* Filter Toggles */}
      <div className="space-y-3">
        {['HIGH', 'MEDIUM', 'LOW'].map((level) => {
          const filter = confidenceFilter[level];
          const isVisible = filter.visible;
          const count = filter.count;
          const config = getLevelConfig(level);

          return (
            <div
              key={level}
              className="flex items-center justify-between py-2"
            >
              {/* Label with indicator and count */}
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 ${config.color} rounded-full`}></div>
                <span className="text-sm font-medium text-gray-900">{config.label}</span>
                <span className="text-xs text-gray-500">({count})</span>
              </div>

              {/* Toggle Switch */}
              <ToggleSwitch
                checked={isVisible}
                onChange={() => toggleConfidenceLevel(level)}
              />
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          <h4 className="text-sm font-semibold text-gray-700">
            Edge Styles
          </h4>
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-3 p-2 bg-gray-50 rounded">
            <div className="w-10 h-1 bg-green-500 rounded-full" />
            <span className="text-gray-700 font-medium">Solid line (High)</span>
          </div>
          <div className="flex items-center gap-3 p-2 bg-gray-50 rounded">
            <div className="w-10 h-0.5 border-t-2 border-dashed border-orange-500" />
            <span className="text-gray-700 font-medium">Dashed line (Medium)</span>
          </div>
          <div className="flex items-center gap-3 p-2 bg-gray-50 rounded">
            <div className="w-10 h-0.5 border-t-2 border-dotted border-gray-400" />
            <span className="text-gray-700 font-medium">Dotted line (Low)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfidenceFilter;
