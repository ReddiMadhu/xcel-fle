import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const StageProgress = ({ progress, stage, status }) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (status === 'running' || status === 'pending') {
      const startTime = Date.now();
      const interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [status]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStageMessage = (stageName) => {
    const messages = {
      loading_files: 'Reading Excel files and validating structure...',
      profiling_data: 'Analyzing column patterns and data types...',
      detecting_relationships: 'Finding potential matches across columns...',
      llm_validation: 'Asking AI to validate relationships...',
      business_validation: 'Evaluating business insights for discovered relationships...',
      generating_report: 'Preparing your analysis report...'
    };
    return messages[stageName] || 'Processing...';
  };

  const getStageIcon = (stageName) => {
    const icons = {
      loading_files: '📂',
      profiling_data: '🔍',
      detecting_relationships: '🔗',
      llm_validation: '🤖',
      business_validation: '📊',
      generating_report: '📝'
    };
    return icons[stageName] || '⚙️';
  };

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
      {/* Circular Progress */}
      <div className="relative">
        <svg className="transform -rotate-90" width="180" height="180">
          {/* Background circle */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="12"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            stroke="url(#gradient)"
            strokeWidth="12"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-gray-900">{Math.round(progress)}%</span>
          <span className="text-xs text-gray-500 mt-1">{formatTime(elapsedTime)} elapsed</span>
        </div>
      </div>

      {/* Stage information */}
      <div className="mt-8 text-center max-w-md">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-2xl">{getStageIcon(stage)}</span>
          <h3 className="text-lg font-semibold text-gray-900 capitalize">
            {stage?.replace(/_/g, ' ') || 'Processing'}
          </h3>
        </div>
        <p className="text-gray-600">
          {getStageMessage(stage)}
        </p>
      </div>

      {/* Processing stages indicator */}
      <div className="mt-8 w-full max-w-lg">
        <div className="flex justify-between items-center">
          {['loading_files', 'profiling_data', 'detecting_relationships', 'llm_validation', 'business_validation', 'generating_report'].map((stageName, index) => {
            const isActive = stageName === stage;
            const isPassed = getStageOrder(stage) > getStageOrder(stageName);

            return (
              <div key={stageName} className="flex-1 flex items-center">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      isPassed
                        ? 'bg-green-500'
                        : isActive
                        ? 'bg-primary-600 animate-pulse'
                        : 'bg-gray-300'
                    }`}
                  />
                </div>
                {index < 5 && (
                  <div
                    className={`h-0.5 flex-1 transition-all duration-300 ${
                      isPassed ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const getStageOrder = (stageName) => {
  const order = {
    loading_files: 1,
    profiling_data: 2,
    detecting_relationships: 3,
    llm_validation: 4,
    business_validation: 5,
    generating_report: 6
  };
  return order[stageName] || 0;
};

StageProgress.propTypes = {
  progress: PropTypes.number.isRequired,
  stage: PropTypes.string,
  status: PropTypes.string
};

export default StageProgress;
