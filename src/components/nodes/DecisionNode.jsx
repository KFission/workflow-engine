import { Handle, Position } from '@xyflow/react';

export default function DecisionNode({ data }) {
  return (
    <div className="custom-node decision-node">
      <Handle type="target" position={Position.Top} />
      <div className="decision-diamond">
        <div className="node-label">{data.label || 'Decision'}</div>
      </div>
      <Handle type="source" position={Position.Bottom} id="yes" />
      <Handle type="source" position={Position.Right} id="no" />
    </div>
  );
}
