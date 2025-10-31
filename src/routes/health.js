const router = require('express').Router();
router.get('/', (req, res) => res.json({ ok: true, service: 'atp-backend', ts: Date.now() }));
module.exports = router;
