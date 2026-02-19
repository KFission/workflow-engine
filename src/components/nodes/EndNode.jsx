import { Handle, Position } from '@xyflow/react';

export default function EndNode({ data }) {
  return (
    <div className="custom-node end-node">
      <Handle type="target" position={Position.Top} />
      <div className="node-label">{data.label || 'End'}</div>
    </div>
  );
}
