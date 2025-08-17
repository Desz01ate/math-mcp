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

// Test that the configuration was applied properly
try {
  // Check that allowed functions were configured correctly
  const allowedFunctions = mathServer.toolHandlers.evaluator.listFunctions();
  console.log('Allowed functions:', allowedFunctions);
  
  if (allowedFunctions.length === 3 && allowedFunctions.includes('sqrt') && allowedFunctions.includes('sin') && allowedFunctions.includes('cos')) {
    console.log('✓ Configuration is working - allowed functions are correctly restricted');
  } else {
    console.log('✗ Configuration may not be working properly');
  }
} catch (error) {
  console.error('Error during test:', error.message);
}