const logger = require('../utils/logger');
// Since we need to reference io in a context that's loaded before server.js
// this requires a different approach in a real implementation
//const { io } = require('../server');

// Mock database for contexts
let contexts = {};

/**
 * Create a new context
 */
const createContext = async (req, res) => {
  try {
    const { initialContext, metadata } = req.body;
    
    if (!initialContext) {
      return res.status(400).json({ error: 'Initial context is required' });
    }
    
    const contextId = generateId();
    const ttl = parseInt(process.env.DEFAULT_CONTEXT_TTL) || 3600000; // 1 hour default
    
    const context = {
      id: contextId,
      context: initialContext,
      metadata: metadata || {},
      history: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt: new Date(Date.now() + ttl),
    };
    
    contexts[contextId] = context;
    
    logger.info(`Context created: ${contextId}`);
    return res.status(201).json(context);
  } catch (error) {
    logger.error(`Error creating context: ${error.message}`);
    return res.status(500).json({ error: 'Failed to create context' });
  }
};

/**
 * Get a context by ID
 */
const getContext = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!contexts[id]) {
      return res.status(404).json({ error: 'Context not found' });
    }
    
    return res.status(200).json(contexts[id]);
  } catch (error) {
    logger.error(`Error getting context: ${error.message}`);
    return res.status(500).json({ error: 'Failed to get context' });
  }
};

/**
 * Update a context
 */
const updateContext = async (req, res) => {
  try {
    const { id } = req.params;
    const { context, metadata } = req.body;
    
    if (!contexts[id]) {
      return res.status(404).json({ error: 'Context not found' });
    }
    
    if (context) {
      contexts[id].context = context;
    }
    
    if (metadata) {
      contexts[id].metadata = { ...contexts[id].metadata, ...metadata };
    }
    
    contexts[id].updatedAt = new Date();
    
    // In a real implementation, this would notify subscribers through Socket.IO
    // io.to(`context:${id}`).emit('contextUpdated', contexts[id]);
    
    logger.info(`Context updated: ${id}`);
    return res.status(200).json(contexts[id]);
  } catch (error) {
    logger.error(`Error updating context: ${error.message}`);
    return res.status(500).json({ error: 'Failed to update context' });
  }
};

/**
 * Delete a context
 */
const deleteContext = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!contexts[id]) {
      return res.status(404).json({ error: 'Context not found' });
    }
    
    delete contexts[id];
    
    // In a real implementation, this would notify subscribers through Socket.IO
    // io.to(`context:${id}`).emit('contextDeleted', { id });
    
    logger.info(`Context deleted: ${id}`);
    return res.status(204).send();
  } catch (error) {
    logger.error(`Error deleting context: ${error.message}`);
    return res.status(500).json({ error: 'Failed to delete context' });
  }
};

/**
 * List contexts with optional filtering
 */
const listContexts = async (req, res) => {
  try {
    const { metadata } = req.query;
    
    let filteredContexts = Object.values(contexts);
    
    if (metadata) {
      try {
        const metadataFilter = JSON.parse(metadata);
        filteredContexts = filteredContexts.filter(context => {
          return Object.entries(metadataFilter).every(([key, value]) => {
            return context.metadata[key] === value;
          });
        });
      } catch (e) {
        return res.status(400).json({ error: 'Invalid metadata filter format' });
      }
    }
    
    return res.status(200).json(filteredContexts);
  } catch (error) {
    logger.error(`Error listing contexts: ${error.message}`);
    return res.status(500).json({ error: 'Failed to list contexts' });
  }
};

// Helper function to generate a unique ID
function generateId() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

module.exports = {
  createContext,
  getContext,
  updateContext,
  deleteContext,
  listContexts,
  contexts, // Exposing for demo purposes only
};