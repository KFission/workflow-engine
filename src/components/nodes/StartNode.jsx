import { Handle, Position } from '@xyflow/react';

export default function StartNode({ data }) {
  return (
    <div className="custom-node start-node">
      <div className="node-label">{data.label || 'Start'}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
