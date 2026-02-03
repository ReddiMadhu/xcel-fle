/**
 * Transform API response to ReactFlow-compatible graph format
 * Creates nested nodes (files contain columns) and edges for relationships
 */

export const transformToReactFlow = (apiResult) => {
  const nodes = [];
  const edges = [];

  if (!apiResult || !apiResult.result || !apiResult.result.files) {
    return { nodes, edges };
  }

  const files = apiResult.result.files;
  const relationships = apiResult.result.relationships || [];

  // Step 1: Create file nodes (parent containers)
  files.forEach((file, fileIndex) => {
    const fileNode = {
      id: `file-${fileIndex}`,
      type: 'fileNode',
      data: {
        label: file.file_name,
        sheet: file.sheet_name,
        rowCount: file.row_count,
        columnCount: file.column_count,
        columns: file.columns || []
      },
      position: { x: fileIndex * 400, y: 0 },
      style: {
        width: 320,
        backgroundColor: '#f0f4f8',
        border: '2px solid #3b82f6',
        borderRadius: '8px',
        padding: '16px'
      }
    };
    nodes.push(fileNode);

    // Step 2: Create column nodes (children of file node)
    if (file.columns && Array.isArray(file.columns)) {
      file.columns.forEach((column, colIndex) => {
        // Support both column_name (fixed backend) and name (legacy)
        const columnName = column.column_name || column.name;

        const columnNode = {
          id: `file-${fileIndex}-col-${colIndex}`,
          type: 'columnNode',
          data: {
            label: columnName,
            dataType: column.data_type || 'unknown',
            isPrimaryKey: column.is_primary_key || false,
            isForeignKey: column.is_foreign_key || false,
            fileIndex,
            colIndex
          },
          parentNode: `file-${fileIndex}`,
          extent: 'parent',
          position: { x: 10, y: 70 + (colIndex * 45) },
          style: {
            width: 280,
            backgroundColor: column.is_primary_key ? '#fef3c7' : '#e0e7ff',
            border: '1px solid #94a3b8',
            borderRadius: '6px'
          }
        };
        nodes.push(columnNode);
      });
    }
  });

  // Step 3: Create edges from relationships
  relationships.forEach((rel, relIndex) => {
    // Find source and target file indices
    const sourceFileIndex = files.findIndex(f => f.file_name === rel.source?.file);
    const targetFileIndex = files.findIndex(f => f.file_name === rel.target?.file);

    if (sourceFileIndex === -1 || targetFileIndex === -1) {
      console.warn('File not found for relationship:', rel);
      return;
    }

    // Find column indices
    const sourceFile = files[sourceFileIndex];
    const targetFile = files[targetFileIndex];

    const sourceColIndex = sourceFile.columns?.findIndex(
      c => (c.column_name || c.name) === rel.source?.column
    );
    const targetColIndex = targetFile.columns?.findIndex(
      c => (c.column_name || c.name) === rel.target?.column
    );

    if (sourceColIndex === -1 || targetColIndex === -1) {
      console.warn('Column not found for relationship:', rel);
      return;
    }

    const edge = {
      id: `edge-${relIndex}`,
      source: `file-${sourceFileIndex}-col-${sourceColIndex}`,
      target: `file-${targetFileIndex}-col-${targetColIndex}`,
      type: 'smoothstep',
      animated: rel.confidence_level === 'HIGH',
      label: `${rel.source.column} → ${rel.target.column}`,
      data: {
        relationship: rel,
        confidenceLevel: rel.confidence_level || 'MEDIUM'
      },
      style: getEdgeStyle(rel.confidence_level),
      markerEnd: {
        type: 'arrowclosed',
        color: getEdgeColor(rel.confidence_level)
      }
    };
    edges.push(edge);
  });

  return { nodes, edges };
};

const getEdgeStyle = (confidenceLevel) => {
  switch (confidenceLevel) {
    case 'HIGH':
      return { stroke: '#10b981', strokeWidth: 3 };
    case 'MEDIUM':
      return { stroke: '#f59e0b', strokeWidth: 2, strokeDasharray: '5,5' };
    case 'LOW':
      return { stroke: '#9ca3af', strokeWidth: 1, strokeDasharray: '2,2' };
    default:
      return { stroke: '#6b7280', strokeWidth: 1 };
  }
};

const getEdgeColor = (confidenceLevel) => {
  switch (confidenceLevel) {
    case 'HIGH': return '#10b981';
    case 'MEDIUM': return '#f59e0b';
    case 'LOW': return '#9ca3af';
    default: return '#6b7280';
  }
};

/**
 * Count relationships by confidence level
 */
export const countByConfidence = (edges) => {
  return edges.reduce((acc, edge) => {
    const level = edge.data?.confidenceLevel || 'MEDIUM';
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, { HIGH: 0, MEDIUM: 0, LOW: 0 });
};
