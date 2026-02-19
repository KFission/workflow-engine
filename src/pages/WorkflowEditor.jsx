import { useState, useCallback, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { nodeTypes } from '../components/nodes';
import Sidebar from '../components/sidebar/Sidebar';
import Toolbar from '../components/toolbar/Toolbar';
import { db } from '../db/db';
import { v4 as uuidv4 } from 'uuid';

let nodeId = 0;
const getNodeId = () => `node_${nodeId++}`;

function WorkflowEditorInner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [workflowName, setWorkflowName] = useState('Untitled Workflow');
  const [workflowId, setWorkflowId] = useState(null);

  useEffect(() => {
    if (id) {
      db.workflows.get(id).then((workflow) => {
        if (workflow) {
          setWorkflowId(workflow.id);
          setWorkflowName(workflow.name);
          setNodes(workflow.nodes || []);
          setEdges(workflow.edges || []);
          // Ensure nodeId counter is higher than any existing node
          const maxId = (workflow.nodes || []).reduce((max, n) => {
            const num = parseInt(n.id.replace('node_', ''), 10);
            return isNaN(num) ? max : Math.max(max, num);
          }, 0);
          nodeId = maxId + 1;
        }
      });
    }
  }, [id, setNodes, setEdges]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges],
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type || !reactFlowInstance) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: getNodeId(),
        type,
        position,
        data: { label: type.charAt(0).toUpperCase() + type.slice(1) },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes],
  );

  const onSave = useCallback(async () => {
    const now = new Date().toISOString();
    const wfId = workflowId || uuidv4();

    const workflow = {
      id: wfId,
      name: workflowName,
      nodes,
      edges,
      updatedAt: now,
    };

    if (!workflowId) {
      workflow.createdAt = now;
    }

    await db.workflows.put(workflow);
    setWorkflowId(wfId);

    if (!id) {
      navigate(`/editor/${wfId}`, { replace: true });
    }
  }, [workflowId, workflowName, nodes, edges, id, navigate]);

  const onClear = useCallback(() => {
    setNodes([]);
    setEdges([]);
  }, [setNodes, setEdges]);

  const onExport = useCallback(() => {
    const data = JSON.stringify({ name: workflowName, nodes, edges }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workflowName.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [workflowName, nodes, edges]);

  return (
    <div className="workflow-editor">
      <Toolbar
        workflowName={workflowName}
        onNameChange={setWorkflowName}
        onSave={onSave}
        onClear={onClear}
        onExport={onExport}
      />
      <div className="editor-content">
        <Sidebar />
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
            deleteKeyCode={['Backspace', 'Delete']}
          >
            <Controls />
            <MiniMap />
            <Background gap={16} size={1} />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}

export default function WorkflowEditor() {
  return (
    <ReactFlowProvider>
      <WorkflowEditorInner />
    </ReactFlowProvider>
  );
}
