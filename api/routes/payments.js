import { Router } from 'express';
import pool from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  const [rows] = await pool.query(
    'SELECT * FROM payments WHERE is_deleted = 0 ORDER BY payment_date DESC'
  );
  res.json(rows);
});

router.get('/:id', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM payments WHERE id = ?', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

router.post('/', async (req, res) => {
  const { member_id, member, plan, amount, method, date, or_no } = req.body;
  const [result] = await pool.query(
    'INSERT INTO payments (member_id, member_name, plan, amount, method, payment_date, or_number) VALUES (?,?,?,?,?,?,?)',
    [member_id ?? null, member, plan, amount, method, date, or_no ?? null]
  );
  res.status(201).json({ id: result.insertId });
});

router.put('/:id', async (req, res) => {
  const { member, plan, amount, method, date, or_no } = req.body;
  await pool.query(
    'UPDATE payments SET member_name=?, plan=?, amount=?, method=?, payment_date=?, or_number=? WHERE id=?',
    [member, plan, amount, method, date, or_no, req.params.id]
  );
  res.json({ ok: true });
});

router.delete('/:id', async (req, res) => {
  await pool.query(
    'UPDATE payments SET is_deleted=1, deleted_at=NOW() WHERE id=?',
    [req.params.id]
  );
  res.json({ ok: true });
});

export default router;
