import { create } from 'zustand';

export const useGraphStore = create((set) => ({
  // Graph data
  nodes: [],
  edges: [],
  filteredEdges: [],

  // Filter state
  confidenceFilter: {
    HIGH: { visible: true, count: 0 },
    MEDIUM: { visible: false, count: 0 },
    LOW: { visible: false, count: 0 }
  },

  // Selected relationship for modal
  selectedRelationship: null,

  // Actions
  actions: {
    setGraphData: (apiResult) => {
      // This will be populated by graphTransform
      set({ nodes: [], edges: [], filteredEdges: [] });
    },

    toggleConfidenceLevel: (level) => {
      set((state) => {
        const newVisible = !state.confidenceFilter[level].visible;

        // Recalculate filtered edges
        const filteredEdges = state.edges.filter(edge => {
          const edgeLevel = edge.data?.confidenceLevel;
          if (edgeLevel === level) return newVisible;
          return state.confidenceFilter[edgeLevel]?.visible;
        });

        return {
          confidenceFilter: {
            ...state.confidenceFilter,
            [level]: { ...state.confidenceFilter[level], visible: newVisible }
          },
          filteredEdges
        };
      });
    },

    selectRelationship: (relationship) => {
      set({ selectedRelationship: relationship });
    },

    closeRelationshipModal: () => {
      set({ selectedRelationship: null });
    },

    exportFilteredData: () => {
      // Will implement in Phase 7
      return null;
    }
  }
}));
