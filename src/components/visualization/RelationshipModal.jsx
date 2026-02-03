import { useGraphStore } from '../../stores/graphStore.js';
import Button from '../common/Button.jsx';

const RelationshipModal = () => {
  const selectedRelationship = useGraphStore(state => state.selectedRelationship);
  const closeModal = useGraphStore(state => state.actions.closeRelationshipModal);

  if (!selectedRelationship) return null;

  const rel = selectedRelationship;
  const insights = rel.business_insights || {};

  const getConfidenceBadgeColor = (level) => {
    switch (level) {
      case 'HIGH':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'MEDIUM':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'LOW':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
        onClick={closeModal}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Relationship Details
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {rel.relationship_id || 'N/A'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getConfidenceBadgeColor(rel.confidence_level)}`}>
                {rel.confidence_level} Confidence
              </span>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6 space-y-6">
            {/* Connection Details */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Connection Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Source</p>
                  <p className="font-medium text-gray-900">{rel.source?.file}</p>
                  <p className="text-sm text-gray-600">→ {rel.source?.column}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Target</p>
                  <p className="font-medium text-gray-900">{rel.target?.file}</p>
                  <p className="text-sm text-gray-600">→ {rel.target?.column}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-300">
                <p className="text-sm">
                  <span className="text-gray-500">Type:</span>{' '}
                  <span className="font-medium text-gray-900">{rel.relationship_type || 'N/A'}</span>
                </p>
                <p className="text-sm mt-1">
                  <span className="text-gray-500">Confidence Score:</span>{' '}
                  <span className="font-medium text-gray-900">{rel.confidence_score || 0}%</span>
                </p>
              </div>
            </div>

            {/* Statistics */}
            {rel.statistics && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">📊 Statistics</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {rel.statistics.value_overlap_percent !== undefined && (
                    <div>
                      <p className="text-gray-600">Value Overlap</p>
                      <p className="text-xl font-bold text-blue-900">{rel.statistics.value_overlap_percent}%</p>
                    </div>
                  )}
                  {rel.statistics.orphans_in_source !== undefined && (
                    <div>
                      <p className="text-gray-600">Orphan Records</p>
                      <p className="text-xl font-bold text-blue-900">{rel.statistics.orphans_in_source}</p>
                    </div>
                  )}
                </div>
                {/* Data quality warnings from statistics */}
                {rel.statistics.data_quality_warnings && rel.statistics.data_quality_warnings.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-blue-300">
                    <p className="text-xs font-semibold text-orange-700 mb-2">⚠️ Data Quality Warnings</p>
                    {rel.statistics.data_quality_warnings.map((warning, idx) => (
                      <p key={idx} className="text-xs text-orange-800 mb-1">• {warning}</p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Business Insights Cards */}
            {insights.relationship_validity && (
              <div className="bg-white rounded-lg p-4 border-2 border-green-200">
                <h3 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  {insights.relationship_validity.is_valid ? '✅' : '❌'} Relationship Validity
                </h3>
                <p className="text-sm text-gray-700">
                  {insights.relationship_validity.explanation || 'N/A'}
                </p>
              </div>
            )}

            {insights.what_story_it_tells && (
              <div className="bg-white rounded-lg p-4 border-2 border-purple-200">
                <h3 className="text-base font-semibold text-gray-900 mb-2">📖 What This Tells You</h3>
                <p className="text-sm text-gray-700">{insights.what_story_it_tells}</p>
              </div>
            )}

            {insights.decision_making_value && (
              <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                <h3 className="text-base font-semibold text-gray-900 mb-2">🎯 Actions You Can Take</h3>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Can decision makers act?</strong>{' '}
                  {insights.decision_making_value.can_decision_makers_act ? 'Yes' : 'No'}
                </p>
                {insights.decision_making_value.specific_actions_enabled && insights.decision_making_value.specific_actions_enabled.length > 0 && (
                  <ul className="text-sm text-gray-700 space-y-1 ml-4">
                    {insights.decision_making_value.specific_actions_enabled.map((action, idx) => (
                      <li key={idx}>✓ {action}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {insights.critical_insights_revealed && insights.critical_insights_revealed.length > 0 && (
              <div className="bg-white rounded-lg p-4 border-2 border-yellow-200">
                <h3 className="text-base font-semibold text-gray-900 mb-2">💡 Key Insights Revealed</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  {insights.critical_insights_revealed.map((insight, idx) => (
                    <li key={idx}>• {insight}</li>
                  ))}
                </ul>
              </div>
            )}

            {insights.answerable_questions && insights.answerable_questions.length > 0 && (
              <div className="bg-white rounded-lg p-4 border-2 border-indigo-200">
                <h3 className="text-base font-semibold text-gray-900 mb-2">❓ Questions You Can Now Answer</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  {insights.answerable_questions.map((question, idx) => (
                    <li key={idx}>• {question}</li>
                  ))}
                </ul>
              </div>
            )}

            {insights.is_relationship_helpful && (
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 border-2 border-orange-200">
                <h3 className="text-base font-semibold text-gray-900 mb-2">⭐ Relationship Rating</h3>
                <p className="text-lg font-bold text-orange-700 mb-2">{insights.is_relationship_helpful}</p>
                {insights.helpfulness_reason && (
                  <p className="text-sm text-gray-700">{insights.helpfulness_reason}</p>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
            <Button variant="ghost" onClick={closeModal}>
              Close
            </Button>
            <Button variant="primary" onClick={closeModal}>
              View in Graph
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelationshipModal;
