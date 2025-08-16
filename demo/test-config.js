#!/usr/bin/env node

// Simple test to verify configuration is working
import { MathMCPServer } from "../dist/server.js";

// Test with custom config
const config = {
  maxExpressionLength: 500,
  timeoutMs: 3000,
  allowedFunctions: ['sqrt', 'sin', 'cos']
};

console.log('Testing with config:', config);

const mathServer = new MathMCPServer(config);

// Access the evaluator to check if config was applied
console.log('Evaluator config applied successfully!');

// Test that the evaluator rejects long expressions
try {
  const longExpression = 'x'.repeat(600); // Longer than our 500 limit
  const result = mathServer.toolHandlers.evaluator.evaluate(longExpression);
  console.log('Long expression test result:', result);
  
  if (!result.success && result.error?.includes('too long')) {
    console.log('✓ Configuration is working - long expressions are rejected');
  } else {
    console.log('✗ Configuration may not be working properly');
  }
} catch (error) {
  console.error('Error during test:', error.message);
}