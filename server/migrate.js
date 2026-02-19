import pool from './db.js';

export async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS workflows (
      id UUID PRIMARY KEY,
      name VARCHAR(255) NOT NULL DEFAULT 'Untitled Workflow',
      nodes JSONB NOT NULL DEFAULT '[]'::jsonb,
      edges JSONB NOT NULL DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  console.log('Database migration complete.');
}
