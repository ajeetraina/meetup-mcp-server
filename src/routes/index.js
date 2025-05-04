const express = require('express');
const router = express.Router();

const contextRoutes = require('./context');
const promptRoutes = require('./prompt');
const completionRoutes = require('./completion');

router.use('/context', contextRoutes);
router.use('/prompt', promptRoutes);
router.use('/completion', completionRoutes);

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

module.exports = router;