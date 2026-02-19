import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WorkflowList from './pages/WorkflowList';
import WorkflowEditor from './pages/WorkflowEditor';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WorkflowList />} />
        <Route path="/editor" element={<WorkflowEditor />} />
        <Route path="/editor/:id" element={<WorkflowEditor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
