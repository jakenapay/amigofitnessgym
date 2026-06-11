import { Router } from 'express';
import pool from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  const deleted = req.query.deleted === '1' ? 1 : 0;
  const [rows] = await pool.query(
    'SELECT * FROM employees WHERE is_deleted = ? ORDER BY name ASC',
    [deleted]
  );
  res.json(rows);
});

router.get('/:id', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM employees WHERE id = ?', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

router.post('/', async (req, res) => {
  const { name, role, branch, contact, hired, salary, status } = req.body;
  const [result] = await pool.query(
    'INSERT INTO employees (name, role, branch, contact, hire_date, salary, status) VALUES (?,?,?,?,?,?,?)',
    [name, role, branch, contact, hired, salary, status ?? 'Active']
  );
  res.status(201).json({ id: result.insertId });
});

router.put('/:id', async (req, res) => {
  const { name, role, branch, contact, hired, salary, status } = req.body;
  await pool.query(
    'UPDATE employees SET name=?, role=?, branch=?, contact=?, hire_date=?, salary=?, status=? WHERE id=?',
    [name, role, branch, contact, hired, salary, status, req.params.id]
  );
  res.json({ ok: true });
});

router.delete('/:id', async (req, res) => {
  await pool.query(
    'UPDATE employees SET is_deleted=1, deleted_at=NOW() WHERE id=?',
    [req.params.id]
  );
  res.json({ ok: true });
});

router.put('/:id/restore', async (req, res) => {
  await pool.query(
    'UPDATE employees SET is_deleted=0, deleted_at=NULL WHERE id=?',
    [req.params.id]
  );
  res.json({ ok: true });
});

export default router;
