const logger = require('../utils/logger');

// Mock database for prompt templates
let promptTemplates = {
  'default': {
    id: 'default',
    name: 'Default Template',
    template: '{{context}}\n\nHuman: {{prompt}}\n\nAssistant:',
    description: 'Default prompt template for general use',
    createdAt: new Date(),
  },
  'chat': {
    id: 'chat',
    name: 'Chat Template',
    template: '{{context}}\n\n{{history}}\n\nHuman: {{prompt}}\n\nAssistant:',
    description: 'Template for chat-based interactions with history',
    createdAt: new Date(),
  },
};

/**
 * Process a prompt with context
 */
const processPrompt = async (req, res) => {
  try {
    const { prompt, contextId, templateId = 'default' } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    // Get the context if contextId is provided
    let context = { context: '', history: [] };
    if (contextId) {
      // This would typically be a database lookup
      const contextController = require('./contextController');
      if (!contextController.contexts[contextId]) {
        return res.status(404).json({ error: 'Context not found' });
      }
      context = contextController.contexts[contextId];
    }
    
    // Get the template
    const template = promptTemplates[templateId];
    if (!template) {
      return res.status(404).json({ error: 'Prompt template not found' });
    }
    
    // Process the template with the context and prompt
    const processedPrompt = processTemplate(template.template, {
      context: context.context,
      history: formatHistory(context.history),
      prompt,
    });
    
    return res.status(200).json({
      processedPrompt,
      templateId,
      contextId,
    });
  } catch (error) {
    logger.error(`Error processing prompt: ${error.message}`);
    return res.status(500).json({ error: 'Failed to process prompt' });
  }
};

/**
 * Get available prompt templates
 */
const getTemplates = async (req, res) => {
  try {
    return res.status(200).json(Object.values(promptTemplates));
  } catch (error) {
    logger.error(`Error getting templates: ${error.message}`);
    return res.status(500).json({ error: 'Failed to get templates' });
  }
};

/**
 * Create a new prompt template
 */
const createTemplate = async (req, res) => {
  try {
    const { name, template, description } = req.body;
    
    if (!name || !template) {
      return res.status(400).json({ error: 'Name and template are required' });
    }
    
    const id = name.toLowerCase().replace(/\s+/g, '-');
    
    if (promptTemplates[id]) {
      return res.status(409).json({ error: 'Template with this name already exists' });
    }
    
    const newTemplate = {
      id,
      name,
      template,
      description: description || '',
      createdAt: new Date(),
    };
    
    promptTemplates[id] = newTemplate;
    
    logger.info(`Prompt template created: ${id}`);
    return res.status(201).json(newTemplate);
  } catch (error) {
    logger.error(`Error creating template: ${error.message}`);
    return res.status(500).json({ error: 'Failed to create template' });
  }
};

/**
 * Helper function to process a template with variables
 */
function processTemplate(template, variables) {
  let result = template;
  
  // Replace each variable in the template
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    result = result.replace(regex, value || '');
  });
  
  return result;
}

/**
 * Helper function to format conversation history
 */
function formatHistory(history) {
  if (!history || history.length === 0) {
    return '';
  }
  
  return history.map(entry => {
    return `${entry.role}: ${entry.content}`;
  }).join('\n\n');
}

module.exports = {
  processPrompt,
  getTemplates,
  createTemplate,
  promptTemplates, // Exposing for demo purposes only
};