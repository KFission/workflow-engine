import { useNavigate } from 'react-router-dom';

export default function Toolbar({ workflowName, onNameChange, onSave, onClear, onExport }) {
  const navigate = useNavigate();

  return (
    <div className="toolbar">
      <button className="toolbar-btn" onClick={() => navigate('/')}>
        All Workflows
      </button>
      <input
        className="toolbar-name-input"
        type="text"
        value={workflowName}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Workflow name"
      />
      <div className="toolbar-actions">
        <button className="toolbar-btn toolbar-btn--save" onClick={onSave}>
          Save
        </button>
        <button className="toolbar-btn" onClick={onExport}>
          Export JSON
        </button>
        <button className="toolbar-btn toolbar-btn--danger" onClick={onClear}>
          Clear
        </button>
      </div>
    </div>
  );
}
