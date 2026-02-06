import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useJobStore } from '../stores/jobStore.js';
import { useGraphStore } from '../stores/graphStore.js';
import { useUIStore } from '../stores/uiStore.js';
import { jobsApi } from '../services/jobsApi.js';
import { transformToReactFlow, countByConfidence } from '../utils/graphTransform.js';
import GraphCanvas from '../components/visualization/GraphCanvas.jsx';
import ConfidenceFilter from '../components/visualization/ConfidenceFilter.jsx';
import RelationshipModal from '../components/visualization/RelationshipModal.jsx';
import ExportPanel from '../components/export/ExportPanel.jsx';
import Button from '../components/common/Button.jsx';
import Spinner from '../components/common/Spinner.jsx';

const ResultsPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const currentJob = useJobStore(state => state.currentJob);
  const setResult = useJobStore(state => state.actions.setResult);
  const showToast = useUIStore(state => state.actions.showToast);

  const nodes = useGraphStore(state => state.nodes);
  const edges = useGraphStore(state => state.edges);
  const confidenceFilter = useGraphStore(state => state.confidenceFilter);

  // Fetch job result
  useEffect(() => {
    const fetchResult = async () => {
      try {
        const data = await jobsApi.getJobResult(jobId);

        if (data.status !== 'completed') {
          // Job not complete yet, redirect to processing
          navigate(`/jobs/${jobId}/processing`);
          return;
        }

        // Store result
        setResult(data.result);

        // Transform to ReactFlow format
        const { nodes: graphNodes, edges: graphEdges } = transformToReactFlow(data);

        // Count edges by confidence
        const counts = countByConfidence(graphEdges);

        // Set graph data in store - All confidence levels visible by default
        useGraphStore.setState({
          nodes: graphNodes,
          edges: graphEdges,
          filteredEdges: graphEdges, // Show all edges by default
          confidenceFilter: {
            HIGH: { visible: true, count: counts.HIGH || 0 },
            MEDIUM: { visible: true, count: counts.MEDIUM || 0 },
            LOW: { visible: true, count: counts.LOW || 0 }
          }
        });

        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch result:', error);
        showToast('Failed to load analysis results', 'error');
        setLoading(false);
      }
    };

    fetchResult();
  }, [jobId, navigate, setResult, showToast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="xl" />
          <p className="text-gray-600 mt-4">Loading results...</p>
        </div>
      </div>
    );
  }

  const totalRelationships = (confidenceFilter.HIGH?.count || 0) +
    (confidenceFilter.MEDIUM?.count || 0) +
    (confidenceFilter.LOW?.count || 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-white via-white to-gray-50 border-b border-gray-200 shadow-sm px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                Analysis Results
              </h1>
              <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span className="font-mono text-xs">{jobId}</span>
                </div>
                {currentJob?.file_count && (
                  <>
                    <span className="text-gray-400">•</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span>{currentJob.file_count} files</span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-semibold text-gray-900">{totalRelationships} relationships</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ExportPanel />
              <Button
                variant="secondary"
                size="md"
                onClick={() => navigate('/upload')}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Analysis
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar: Filter */}
          <div className="lg:col-span-1 space-y-6">
            <ConfidenceFilter />

            {/* Summary Card */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Analysis Summary
                </h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                  <span className="text-gray-600">Total Files</span>
                  <span className="font-bold text-gray-900">{currentJob?.file_count || 0}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                  <span className="text-gray-600">Relationships</span>
                  <span className="font-bold text-primary-600">{totalRelationships}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <span className="text-green-700 font-medium">High Confidence</span>
                  <span className="font-bold text-green-600">{confidenceFilter.HIGH?.count || 0}</span>
                </div>
              </div>
            </div>

            {/* Help Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-sm font-semibold text-blue-900">
                  How to Use
                </h4>
              </div>
              <ul className="text-xs text-blue-800 space-y-2">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Click edges to see details</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Drag to pan the graph</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Scroll to zoom in/out</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Toggle confidence levels</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Main: Graph Canvas */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-md">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Relationship Diagram
                  </h2>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 text-xs font-medium">
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 rounded-lg border border-green-200">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-green-700">High</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="w-2 h-2 rounded-full bg-orange-500" />
                      <span className="text-orange-700">Medium</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="w-2 h-2 rounded-full bg-gray-400" />
                      <span className="text-gray-700">Low</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Graph Container */}
              <div className="h-[700px] w-full bg-gradient-to-br from-gray-50 to-white">
                <GraphCanvas />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Relationship Modal */}
      <RelationshipModal />
    </div>
  );
};

export default ResultsPage;
