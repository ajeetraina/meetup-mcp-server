const express = require('express');
const router = express.Router();
const contextController = require('../controllers/contextController');

// Create a new context
router.post('/', contextController.createContext);

// Get a context by ID
router.get('/:id', contextController.getContext);

// Update a context
router.put('/:id', contextController.updateContext);

// Delete a context
router.delete('/:id', contextController.deleteContext);

// List contexts with optional filtering
router.get('/', contextController.listContexts);

module.exports = router;