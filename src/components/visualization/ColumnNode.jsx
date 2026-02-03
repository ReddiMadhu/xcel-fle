import { Handle, Position } from 'reactflow';
import PropTypes from 'prop-types';

const ColumnNode = ({ data }) => {
  const getTypeIcon = (dataType) => {
    const type = dataType?.toLowerCase() || 'unknown';
    switch (type) {
      case 'string':
      case 'text':
      case 'varchar':
        return '📝';
      case 'number':
      case 'int':
      case 'integer':
      case 'float':
      case 'decimal':
        return '🔢';
      case 'date':
      case 'datetime':
      case 'timestamp':
        return '📅';
      case 'boolean':
      case 'bool':
        return '✓';
      default:
        return '•';
    }
  };

  return (
    <div className="column-node flex items-center gap-2 px-3 py-2 group hover:shadow-md transition-shadow">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-primary-500 border-2 border-white"
        style={{ left: -6 }}
      />

      <span className="text-sm flex-shrink-0">{getTypeIcon(data.dataType)}</span>

      <span className="text-sm font-medium text-gray-900 flex-1 truncate" title={data.label}>
        {data.label}
      </span>

      {data.isPrimaryKey && (
        <span className="text-xs px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded font-medium">
          PK
        </span>
      )}
      {data.isForeignKey && (
        <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded font-medium">
          FK
        </span>
      )}

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-primary-500 border-2 border-white"
        style={{ right: -6 }}
      />
    </div>
  );
};

ColumnNode.propTypes = {
  data: PropTypes.shape({
    label: PropTypes.string.isRequired,
    dataType: PropTypes.string,
    isPrimaryKey: PropTypes.bool,
    isForeignKey: PropTypes.bool
  }).isRequired
};

export default ColumnNode;
