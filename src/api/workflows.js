const BASE = '/api/workflows';

export async function fetchWorkflows() {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error('Failed to fetch workflows');
  return res.json();
}

export async function fetchWorkflow(id) {
  const res = await fetch(`${BASE}/${id}`);
  if (!res.ok) throw new Error('Failed to fetch workflow');
  return res.json();
}

export async function createWorkflow(data) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create workflow');
  return res.json();
}

export async function updateWorkflow(id, data) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update workflow');
  return res.json();
}

export async function deleteWorkflow(id) {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete workflow');
  return res.json();
}
