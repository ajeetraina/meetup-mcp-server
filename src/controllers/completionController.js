const axios = require('axios');
const logger = require('../utils/logger');

/**
 * Get a completion with managed context
 */
const getCompletion = async (req, res) => {
  try {
    const { prompt, contextId, modelProvider = 'openai', modelId = 'gpt-4' } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    // Get processed prompt with context
    const processedPrompt = await getProcessedPrompt(prompt, contextId);
    
    // Call the appropriate model provider
    const completion = await callModelProvider(modelProvider, modelId, processedPrompt);
    
    // Update context history if contextId was provided
    if (contextId) {
      await updateContextHistory(contextId, prompt, completion);
    }
    
    return res.status(200).json({
      completion,
      contextId,
    });
  } catch (error) {
    logger.error(`Error getting completion: ${error.message}`);
    return res.status(500).json({ error: 'Failed to get completion' });
  }
};

/**
 * Stream a completion with managed context
 */
const streamCompletion = async (req, res) => {
  try {
    const { prompt, contextId, modelProvider = 'openai', modelId = 'gpt-4' } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    // Set up response for streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    // Get processed prompt with context
    const processedPrompt = await getProcessedPrompt(prompt, contextId);
    
    // Placeholder for actual streaming implementation
    // This would typically call a streaming endpoint of the model provider
    res.write('data: ' + JSON.stringify({ type: 'start' }) + '\n\n');
    
    // Simulate streaming with chunks
    const completion = await callModelProvider(modelProvider, modelId, processedPrompt);
    const chunks = completion.split(' ');
    
    for (const chunk of chunks) {
      // Add a small delay to simulate streaming
      await new Promise(resolve => setTimeout(resolve, 50));
      
      res.write('data: ' + JSON.stringify({ 
        type: 'chunk', 
        content: chunk + ' '
      }) + '\n\n');
    }
    
    // Update context history if contextId was provided
    if (contextId) {
      await updateContextHistory(contextId, prompt, completion);
    }
    
    res.write('data: ' + JSON.stringify({ type: 'end' }) + '\n\n');
    res.end();
  } catch (error) {
    logger.error(`Error streaming completion: ${error.message}`);
    res.write('data: ' + JSON.stringify({ 
      type: 'error', 
      error: 'Failed to stream completion'
    }) + '\n\n');
    res.end();
  }
};

/**
 * Helper function to get a processed prompt with context
 */
async function getProcessedPrompt(prompt, contextId) {
  // This would call the prompt controller in a real implementation
  const promptController = require('./promptController');
  
  const response = await promptController.processPrompt({
    body: { prompt, contextId }
  }, {
    status: () => ({ json: data => data })
  });
  
  return response.processedPrompt;
}

/**
 * Helper function to call the appropriate model provider
 */
async function callModelProvider(provider, modelId, prompt) {
  // This is a mock implementation for demonstration purposes
  logger.info(`Calling ${provider} with model ${modelId}`);
  
  // In a real implementation, this would call the actual model provider's API
  switch (provider.toLowerCase()) {
    case 'openai':
      return mockOpenAICompletion(modelId, prompt);
    case 'anthropic':
      return mockAnthropicCompletion(modelId, prompt);
    default:
      throw new Error(`Unsupported model provider: ${provider}`);
  }
}

/**
 * Helper function to update context history
 */
async function updateContextHistory(contextId, prompt, completion) {
  // This would update the context in a real implementation
  const contextController = require('./contextController');
  
  if (!contextController.contexts[contextId]) {
    throw new Error(`Context not found: ${contextId}`);
  }
  
  // Add the prompt and completion to the history
  contextController.contexts[contextId].history.push(
    { role: 'Human', content: prompt },
    { role: 'Assistant', content: completion }
  );
  
  // Update the context
  await contextController.updateContext(
    { params: { id: contextId } },
    { status: () => ({ json: data => data }) }
  );
}

/**
 * Mock OpenAI completion for demonstration purposes
 */
function mockOpenAICompletion(modelId, prompt) {
  // This is just a placeholder for demonstration
  return 'This is a mock response from the OpenAI model. In a real implementation, this would call the OpenAI API.';
}

/**
 * Mock Anthropic completion for demonstration purposes
 */
function mockAnthropicCompletion(modelId, prompt) {
  // This is just a placeholder for demonstration
  return 'This is a mock response from the Anthropic model. In a real implementation, this would call the Anthropic API.';
}

module.exports = {
  getCompletion,
  streamCompletion,
};