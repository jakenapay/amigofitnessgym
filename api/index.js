import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import membersRouter from './routes/members.js';
import employeesRouter from './routes/employees.js';
import plansRouter from './routes/plans.js';
import paymentsRouter from './routes/payments.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/members',   membersRouter);
app.use('/api/employees', employeesRouter);
app.use('/api/plans',     plansRouter);
app.use('/api/payments',  paymentsRouter);

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
