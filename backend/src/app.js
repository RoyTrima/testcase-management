import express from 'express';
import cors from 'cors';
import testcaseRoutes from './routes/testcaseRoutes.js';

const app = express();

// ➜ Tambahkan ini
app.use(cors());
app.use(express.json());

app.use('/api/testcases', testcaseRoutes);

export default app;
