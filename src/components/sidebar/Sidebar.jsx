import { nodeTypeList } from '../nodes';

export default function Sidebar() {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="sidebar">
      <h3>Nodes</h3>
      <p className="sidebar-hint">Drag a node onto the canvas</p>
      <div className="node-list">
        {nodeTypeList.map((node) => (
          <div
            key={node.type}
            className={`sidebar-node sidebar-node--${node.type}`}
            onDragStart={(e) => onDragStart(e, node.type)}
            draggable
          >
            {node.label}
          </div>
        ))}
      </div>
    </aside>
  );
}
