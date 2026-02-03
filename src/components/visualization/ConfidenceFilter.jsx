import { useGraphStore } from '../../stores/graphStore.js';

const ConfidenceFilter = () => {
  const confidenceFilter = useGraphStore(state => state.confidenceFilter);
  const toggleConfidenceLevel = useGraphStore(state => state.actions.toggleConfidenceLevel);

  const getLevelStyles = (level, isVisible) => {
    switch (level) {
      case 'HIGH':
        return isVisible
          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 shadow-sm shadow-green-100'
          : 'bg-white border-green-200 hover:border-green-300';
      case 'MEDIUM':
        return isVisible
          ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-300 shadow-sm shadow-orange-100'
          : 'bg-white border-orange-200 hover:border-orange-300';
      case 'LOW':
        return isVisible
          ? 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-300 shadow-sm'
          : 'bg-white border-gray-200 hover:border-gray-300';
      default:
        return 'bg-white border-gray-200';
    }
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case 'HIGH':
        return (
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      case 'MEDIUM':
        return (
          <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'LOW':
        return (
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getLevelTextColor = (level) => {
    switch (level) {
      case 'HIGH':
        return 'text-green-700';
      case 'MEDIUM':
        return 'text-orange-700';
      case 'LOW':
        return 'text-gray-700';
      default:
        return 'text-gray-700';
    }
  };

  const totalCount = confidenceFilter.HIGH.count + confidenceFilter.MEDIUM.count + confidenceFilter.LOW.count;

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-5 shadow-sm">
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

      <div className="space-y-3">
        {['HIGH', 'MEDIUM', 'LOW'].map((level) => {
          const filter = confidenceFilter[level];
          const isVisible = filter.visible;
          const count = filter.count;

          return (
            <button
              key={level}
              onClick={() => toggleConfidenceLevel(level)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-md ${getLevelStyles(level, isVisible)} ${isVisible ? 'scale-[1.02]' : 'hover:scale-[1.01]'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isVisible ? 'bg-white shadow-sm' : 'bg-gray-50'}`}>
                  {getLevelIcon(level)}
                </div>
                <div className="text-left">
                  <p className={`font-semibold text-sm ${getLevelTextColor(level)}`}>
                    {level}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {isVisible ? 'Visible' : 'Hidden'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`text-xl font-bold ${getLevelTextColor(level)}`}>
                  {count}
                </span>
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-transform ${isVisible ? 'bg-white rotate-0' : 'bg-gray-100 rotate-90'}`}>
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isVisible ? "M19 9l-7 7-7-7" : "M9 5l7 7-7 7"} />
                  </svg>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-5 border-t border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          <h4 className="text-sm font-semibold text-gray-700">
            Edge Styles
          </h4>
        </div>
        <div className="space-y-2.5 text-xs">
          <div className="flex items-center gap-3 p-2 bg-white rounded-lg">
            <div className="w-10 h-1 bg-green-500 rounded-full" />
            <span className="text-gray-700 font-medium">Solid line</span>
          </div>
          <div className="flex items-center gap-3 p-2 bg-white rounded-lg">
            <div className="w-10 h-0.5 border-t-2 border-dashed border-orange-500" />
            <span className="text-gray-700 font-medium">Dashed line</span>
          </div>
          <div className="flex items-center gap-3 p-2 bg-white rounded-lg">
            <div className="w-10 h-0.5 border-t-2 border-dotted border-gray-400" />
            <span className="text-gray-700 font-medium">Dotted line</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfidenceFilter;
