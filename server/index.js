import express from 'express';
import cors from 'cors';
import { migrate } from './migrate.js';
import workflowRoutes from './routes.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api', workflowRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

migrate()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to run migrations:', err);
    process.exit(1);
  });
