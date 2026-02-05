import { useState } from 'react';
import { useGraphStore } from '../../stores/graphStore.js';
import Button from '../common/Button.jsx';
import {
  CheckCircle2,
  XCircle,
  BookOpen,
  Target,
  Lightbulb,
  HelpCircle,
  Star,
  BarChart3,
  Info,
  X,
  AlertTriangle,
  Check,
  Circle
} from 'lucide-react';

// Tooltip Component
const Tooltip = ({ children, content }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute z-50 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg -top-2 left-full ml-2 transform -translate-y-1/2">
          <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 -left-1 top-1/2 -translate-y-1/2" />
          {content}
        </div>
      )}
    </div>
  );
};

const RelationshipModal = () => {
  const selectedRelationship = useGraphStore(state => state.selectedRelationship);
  const closeModal = useGraphStore(state => state.actions.closeRelationshipModal);
  const [showConfidencePopup, setShowConfidencePopup] = useState(false);

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

  const definitions = {
    confidenceScore: (
      <div className="space-y-3">
        <p>A rule-based numeric value (0–100) that indicates how certain the system is about this relationship.</p>

        <div>
          <p className="font-semibold mb-2">Key Factors:</p>
          <ul className="list-disc ml-4 space-y-1">
            <li><strong>Value overlap</strong> - Primary metric measuring how many values match between columns</li>
            <li><strong>Uniqueness</strong> - Whether columns show PK-FK patterns (one side is unique)</li>
            <li><strong>Name similarity</strong> - How similar the column names are</li>
            <li><strong>Data quality</strong> - Null percentages and orphan records</li>
          </ul>
        </div>

        <div>
          <p className="font-semibold mb-2">Confidence Levels:</p>
          <ul className="ml-4 space-y-1 text-sm">
            <li><strong>HIGH (90-95):</strong> Strong match with ≥80% overlap</li>
            <li><strong>MEDIUM (60-75):</strong> Moderate match with ≥60% overlap</li>
            <li><strong>LOW (40-59):</strong> Weak match with ≥40% overlap</li>
          </ul>
        </div>
      </div>
    ),
    valueOverlap: "Value Overlap shows the percentage of values that exist in both the source and target columns. A high overlap percentage suggests a strong data relationship.",
    orphanRecords: "Orphan Records are entries in the source file that don't have matching values in the target file. This could indicate data quality issues or incomplete relationships."
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
                <X className="w-6 h-6 text-gray-500" />
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
                  <button
                    onClick={() => setShowConfidencePopup(true)}
                    className="font-medium text-blue-600 hover:text-blue-800 underline cursor-pointer"
                  >
                    {rel.confidence_score || 0}%
                  </button>
                </p>
              </div>
            </div>

            {/* Statistics */}
            {rel.statistics && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" /> Statistics
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {rel.statistics.value_overlap_percent !== undefined && (
                    <div>
                      <p className="text-gray-600 flex items-center gap-1">
                        Value Overlap
                        <Tooltip content={definitions.valueOverlap}>
                          <Info className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                        </Tooltip>
                      </p>
                      <p className="text-xl font-bold text-blue-900">{rel.statistics.value_overlap_percent}%</p>
                    </div>
                  )}
                  {rel.statistics.orphans_in_source !== undefined && (
                    <div>
                      <p className="text-gray-600 flex items-center gap-1">
                        Orphan Records
                        <Tooltip content={definitions.orphanRecords}>
                          <Info className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                        </Tooltip>
                      </p>
                      <p className="text-xl font-bold text-blue-900">{rel.statistics.orphans_in_source}</p>
                    </div>
                  )}
                </div>
                {/* Data quality warnings from statistics */}
                {rel.statistics.data_quality_warnings && rel.statistics.data_quality_warnings.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-blue-300">
                    <p className="text-xs font-semibold text-orange-700 mb-2 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" /> Data Quality Warnings
                    </p>
                    {rel.statistics.data_quality_warnings.map((warning, idx) => (
                      <p key={idx} className="text-xs text-orange-800 mb-1 flex items-start gap-1">
                        <Circle className="w-2 h-2 fill-orange-800 mt-1 flex-shrink-0" />
                        <span>{warning}</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Business Insights Cards */}
            {insights.relationship_validity && (
              <div className="bg-white rounded-lg p-4 border-2 border-green-200">
                <h3 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  {insights.relationship_validity.is_valid ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}{' '}
                  Relationship Validity
                </h3>
                <p className="text-sm text-gray-700">
                  {insights.relationship_validity.explanation || 'N/A'}
                </p>
              </div>
            )}

            {insights.what_story_it_tells && (
              <div className="bg-white rounded-lg p-4 border-2 border-purple-200">
                <h3 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-600" /> Business Significance
                </h3>
                <p className="text-sm text-gray-700">{insights.what_story_it_tells}</p>
              </div>
            )}

            {insights.decision_making_value && (
              <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                <h3 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" /> Decision Enablement
                </h3>
                {insights.decision_making_value.specific_actions_enabled && insights.decision_making_value.specific_actions_enabled.length > 0 && (
                  <ul className="text-sm text-gray-700 space-y-1">
                    {insights.decision_making_value.specific_actions_enabled.map((action, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {insights.critical_insights_revealed && insights.critical_insights_revealed.length > 0 && (
              <div className="bg-white rounded-lg p-4 border-2 border-yellow-200">
                <h3 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-600" /> Actionable Insights
                </h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  {insights.critical_insights_revealed.map((insight, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Circle className="w-2 h-2 fill-gray-700 mt-1.5 flex-shrink-0" />
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {insights.answerable_questions && insights.answerable_questions.length > 0 && (
              <div className="bg-white rounded-lg p-4 border-2 border-indigo-200">
                <h3 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-indigo-600" /> Business Questions Answered
                </h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  {insights.answerable_questions.map((question, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Circle className="w-2 h-2 fill-gray-700 mt-1.5 flex-shrink-0" />
                      <span>{question}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {insights.is_relationship_helpful && (
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 border-2 border-orange-200">
                <h3 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Star className="w-5 h-5 text-orange-600" /> Relationship Rating
                </h3>
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

      {/* Confidence Score Popup */}
      {showConfidencePopup && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowConfidencePopup(false)}
          />
          <div className="relative bg-white rounded-lg shadow-xl p-6 max-w-lg w-full">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Confidence Score</h3>
              <button
                onClick={() => setShowConfidencePopup(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="text-sm text-gray-700">
              {definitions.confidenceScore}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RelationshipModal;
