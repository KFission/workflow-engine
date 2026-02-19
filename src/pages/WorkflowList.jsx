import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWorkflows, deleteWorkflow } from '../api/workflows';

export default function WorkflowList() {
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState(undefined);

  useEffect(() => {
    fetchWorkflows().then(setWorkflows);
  }, []);

  const onDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Delete this workflow?')) {
      await deleteWorkflow(id);
      setWorkflows((prev) => prev.filter((wf) => wf.id !== id));
    }
  };

  return (
    <div className="workflow-list-page">
      <div className="workflow-list-header">
        <h1>Workflow Engine</h1>
        <button className="btn-primary" onClick={() => navigate('/editor')}>
          + New Workflow
        </button>
      </div>
      <div className="workflow-grid">
        {workflows === undefined && <p>Loading...</p>}
        {workflows && workflows.length === 0 && (
          <div className="empty-state">
            <p>No workflows yet. Create one to get started.</p>
          </div>
        )}
        {workflows &&
          workflows.map((wf) => (
            <div
              key={wf.id}
              className="workflow-card"
              onClick={() => navigate(`/editor/${wf.id}`)}
            >
              <h3>{wf.name}</h3>
              <div className="workflow-card-meta">
                <span>{(wf.nodes || []).length} nodes</span>
                <span>{(wf.edges || []).length} edges</span>
              </div>
              <div className="workflow-card-date">
                Updated: {new Date(wf.updated_at).toLocaleString()}
              </div>
              <button
                className="workflow-card-delete"
                onClick={(e) => onDelete(wf.id, e)}
              >
                Delete
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
