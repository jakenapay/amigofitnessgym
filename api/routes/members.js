import { Router } from 'express';
import pool from '../db.js';

const router = Router();

// GET /api/members  — list (active only, or ?deleted=1 for soft-deleted)
router.get('/', async (req, res) => {
  const deleted = req.query.deleted === '1' ? 1 : 0;
  const [rows] = await pool.query(
    'SELECT * FROM members WHERE is_deleted = ? ORDER BY name ASC',
    [deleted]
  );
  res.json(rows);
});

// GET /api/members/:id
router.get('/:id', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM members WHERE id = ?', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

// POST /api/members
router.post('/', async (req, res) => {
  const { name, contact, plan, branch, start, expiry, status } = req.body;
  const [result] = await pool.query(
    'INSERT INTO members (name, contact, plan, branch, start_date, expiry_date, status) VALUES (?,?,?,?,?,?,?)',
    [name, contact, plan, branch, start, expiry, status ?? 'Active']
  );
  res.status(201).json({ id: result.insertId });
});

// PUT /api/members/:id
router.put('/:id', async (req, res) => {
  const { name, contact, plan, branch, start, expiry, status } = req.body;
  await pool.query(
    'UPDATE members SET name=?, contact=?, plan=?, branch=?, start_date=?, expiry_date=?, status=? WHERE id=?',
    [name, contact, plan, branch, start, expiry, status, req.params.id]
  );
  res.json({ ok: true });
});

// DELETE /api/members/:id  — soft delete
router.delete('/:id', async (req, res) => {
  await pool.query(
    'UPDATE members SET is_deleted=1, deleted_at=NOW() WHERE id=?',
    [req.params.id]
  );
  res.json({ ok: true });
});

// PUT /api/members/:id/restore
router.put('/:id/restore', async (req, res) => {
  await pool.query(
    'UPDATE members SET is_deleted=0, deleted_at=NULL WHERE id=?',
    [req.params.id]
  );
  res.json({ ok: true });
});

export default router;
