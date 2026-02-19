import { Handle, Position } from '@xyflow/react';

export default function TaskNode({ data }) {
  return (
    <div className="custom-node task-node">
      <Handle type="target" position={Position.Top} />
      <div className="node-label">{data.label || 'Task'}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
