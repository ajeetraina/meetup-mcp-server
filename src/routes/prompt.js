const express = require('express');
const router = express.Router();
const promptController = require('../controllers/promptController');

// Process a prompt with context
router.post('/', promptController.processPrompt);

// Get prompt templates
router.get('/templates', promptController.getTemplates);

// Create a prompt template
router.post('/templates', promptController.createTemplate);

module.exports = router;