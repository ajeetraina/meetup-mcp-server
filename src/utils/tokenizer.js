/**
 * Utility for tokenizing text and managing token counts
 * In a real implementation, this would use a proper tokenizer
 */

/**
 * Get the token count of a string (approximation)
 * @param {string} text - The text to tokenize
 * @returns {number} - Approximate token count
 */
function getTokenCount(text) {
  // This is a very rough approximation
  // In a real implementation, you would use the actual tokenizer for the model
  return Math.ceil(text.length / 4);
}

/**
 * Truncate text to fit within a token limit
 * @param {string} text - The text to truncate
 * @param {number} maxTokens - The maximum number of tokens allowed
 * @returns {string} - The truncated text
 */
function truncateToTokenLimit(text, maxTokens) {
  // This is a very rough implementation
  // In a real implementation, you would use the actual tokenizer for the model
  const estimatedTokens = getTokenCount(text);
  
  if (estimatedTokens <= maxTokens) {
    return text;
  }
  
  // Rough approximation of where to cut off
  const cutoffPoint = Math.floor((maxTokens / estimatedTokens) * text.length);
  return text.substring(0, cutoffPoint);
}

module.exports = {
  getTokenCount,
  truncateToTokenLimit,
};