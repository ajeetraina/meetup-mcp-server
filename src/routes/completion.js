const express = require('express');
const router = express.Router();
const completionController = require('../controllers/completionController');

// Get a completion with managed context
router.post('/', completionController.getCompletion);

// Stream a completion with managed context
router.post('/stream', completionController.streamCompletion);

module.exports = router;