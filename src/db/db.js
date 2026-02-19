import Dexie from 'dexie';

export const db = new Dexie('WorkflowEngineDB');

db.version(1).stores({
  workflows: 'id, name, createdAt, updatedAt',
});
