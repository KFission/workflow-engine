import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from './db.js';

const router = Router();

function parseWorkflow(row) {
  return {
    ...row,
    nodes: JSON.parse(row.nodes),
    edges: JSON.parse(row.edges),
  };
}

// GET /api/workflows — list all workflows
router.get('/workflows', (req, res) => {
  try {
    const rows = db
      .prepare('SELECT id, name, nodes, edges, created_at, updated_at FROM workflows ORDER BY updated_at DESC')
      .all();
    res.json(rows.map(parseWorkflow));
  } catch (err) {
    console.error('GET /workflows error:', err);
    res.status(500).json({ error: 'Failed to fetch workflows' });
  }
});

// GET /api/workflows/:id — get a single workflow
router.get('/workflows/:id', (req, res) => {
  try {
    const row = db
      .prepare('SELECT id, name, nodes, edges, created_at, updated_at FROM workflows WHERE id = ?')
      .get(req.params.id);
    if (!row) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    res.json(parseWorkflow(row));
  } catch (err) {
    console.error('GET /workflows/:id error:', err);
    res.status(500).json({ error: 'Failed to fetch workflow' });
  }
});

// POST /api/workflows — create a new workflow
router.post('/workflows', (req, res) => {
  try {
    const { name, nodes, edges } = req.body;
    const id = uuidv4();
    const now = new Date().toISOString();

    db.prepare(
      `INSERT INTO workflows (id, name, nodes, edges, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
    ).run(id, name || 'Untitled Workflow', JSON.stringify(nodes || []), JSON.stringify(edges || []), now, now);

    const row = db.prepare('SELECT * FROM workflows WHERE id = ?').get(id);
    res.status(201).json(parseWorkflow(row));
  } catch (err) {
    console.error('POST /workflows error:', err);
    res.status(500).json({ error: 'Failed to create workflow' });
  }
});

// PUT /api/workflows/:id — update an existing workflow
router.put('/workflows/:id', (req, res) => {
  try {
    const { name, nodes, edges } = req.body;
    const now = new Date().toISOString();

    const result = db.prepare(
      `UPDATE workflows SET name = ?, nodes = ?, edges = ?, updated_at = ? WHERE id = ?`,
    ).run(name, JSON.stringify(nodes || []), JSON.stringify(edges || []), now, req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Workflow not found' });
    }

    const row = db.prepare('SELECT * FROM workflows WHERE id = ?').get(req.params.id);
    res.json(parseWorkflow(row));
  } catch (err) {
    console.error('PUT /workflows/:id error:', err);
    res.status(500).json({ error: 'Failed to update workflow' });
  }
});

// DELETE /api/workflows/:id — delete a workflow
router.delete('/workflows/:id', (req, res) => {
  try {
    const result = db.prepare('DELETE FROM workflows WHERE id = ?').run(req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    res.json({ message: 'Workflow deleted' });
  } catch (err) {
    console.error('DELETE /workflows/:id error:', err);
    res.status(500).json({ error: 'Failed to delete workflow' });
  }
});

export default router;
