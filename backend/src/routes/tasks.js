const router = require('express').Router();
const { pool } = require('../db');

// GET /api/tasks
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, title, description, status, created_at FROM tasks ORDER BY created_at DESC LIMIT 100'
    );
    res.json(rows);
  } catch (e) { next(e); }
});

// GET /api/tasks/:id
router.get('/:id', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, title, description, status, created_at FROM tasks WHERE id = :id',
      { id: Number(req.params.id) }
    );
    if (!rows.length) return res.status(404).json({ error: 'not_found' });
    res.json(rows[0]);
  } catch (e) { next(e); }
});

// POST /api/tasks
router.post('/', async (req, res, next) => {
  try {
    const { title, description } = req.body || {};
    if (!title || !description) return res.status(400).json({ error: 'missing_fields' });

    const [r] = await pool.query(
      'INSERT INTO tasks (title, description) VALUES (:title, :description)',
      { title, description }
    );
    res.status(201).json({ id: r.insertId, title, description, status: 'open' });
  } catch (e) { next(e); }
});

// PATCH /api/tasks/:id
router.patch('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { title, description, status } = req.body || {};
    const fields = []; const params = { id };
    if (title !== undefined) { fields.push('title = :title'); params.title = title; }
    if (description !== undefined) { fields.push('description = :description'); params.description = description; }
    if (status !== undefined) { fields.push('status = :status'); params.status = status; }
    if (!fields.length) return res.status(400).json({ error: 'nothing_to_update' });

    await pool.query(`UPDATE tasks SET ${fields.join(', ')} WHERE id = :id`, params);
    const [rows] = await pool.query('SELECT id, title, description, status, created_at FROM tasks WHERE id = :id', { id });
    if (!rows.length) return res.status(404).json({ error: 'not_found' });
    res.json(rows[0]);
  } catch (e) { next(e); }
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const [r] = await pool.query('DELETE FROM tasks WHERE id = :id', { id });
    if (!r.affectedRows) return res.status(404).json({ error: 'not_found' });
    res.status(204).end();
  } catch (e) { next(e); }
});

module.exports = router;
