import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import pool from './db.js';

const router = Router();

// GET /api/workflows — list all workflows
router.get('/workflows', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, nodes, edges, created_at, updated_at FROM workflows ORDER BY updated_at DESC',
    );
    res.json(rows);
  } catch (err) {
    console.error('GET /workflows error:', err);
    res.status(500).json({ error: 'Failed to fetch workflows' });
  }
});

// GET /api/workflows/:id — get a single workflow
router.get('/workflows/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, nodes, edges, created_at, updated_at FROM workflows WHERE id = $1',
      [req.params.id],
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('GET /workflows/:id error:', err);
    res.status(500).json({ error: 'Failed to fetch workflow' });
  }
});

// POST /api/workflows — create a new workflow
router.post('/workflows', async (req, res) => {
  try {
    const { name, nodes, edges } = req.body;
    const id = uuidv4();
    const { rows } = await pool.query(
      `INSERT INTO workflows (id, name, nodes, edges)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, nodes, edges, created_at, updated_at`,
      [id, name || 'Untitled Workflow', JSON.stringify(nodes || []), JSON.stringify(edges || [])],
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('POST /workflows error:', err);
    res.status(500).json({ error: 'Failed to create workflow' });
  }
});

// PUT /api/workflows/:id — update an existing workflow
router.put('/workflows/:id', async (req, res) => {
  try {
    const { name, nodes, edges } = req.body;
    const { rows } = await pool.query(
      `UPDATE workflows
       SET name = $1, nodes = $2, edges = $3, updated_at = NOW()
       WHERE id = $4
       RETURNING id, name, nodes, edges, created_at, updated_at`,
      [name, JSON.stringify(nodes || []), JSON.stringify(edges || []), req.params.id],
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('PUT /workflows/:id error:', err);
    res.status(500).json({ error: 'Failed to update workflow' });
  }
});

// DELETE /api/workflows/:id — delete a workflow
router.delete('/workflows/:id', async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM workflows WHERE id = $1', [req.params.id]);
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    res.json({ message: 'Workflow deleted' });
  } catch (err) {
    console.error('DELETE /workflows/:id error:', err);
    res.status(500).json({ error: 'Failed to delete workflow' });
  }
});

export default router;
