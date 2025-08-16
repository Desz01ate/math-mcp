#!/usr/bin/env node

import { GrammarParser } from '../dist/grammar-parser.js';
import { MathEvaluator } from '../dist/evaluator.js';

const parser = new GrammarParser();
const evaluator = new MathEvaluator();

// Test examples for summation functionality
const examples = [
  'sigma(i, 1, 5, i)',                        // Basic sigma: 1+2+3+4+5 = 15
  'sigma(k, 1, 4, k^2)',                      // Sum of squares: 1+4+9+16 = 30
  'sigma(n, 0, 3, 2*n + 1)',                  // Odd numbers: 1+3+5+7 = 16
  '2 * sigma(i, 1, 3, i) + 5',                // Complex expression: 2*(1+2+3)+5 = 17
  'sigma(i, 1, 3, sigma(j, 1, 2, i*j))',      // Nested summation
  'sigma(x, 0, 2, sin(x * pi / 2))',          // With trig functions
  'sum(1, 2, 3, 4, 5)',                       // Regular sum function
];

console.log('🧮 Testing Summation (Sigma) Functionality\n');

examples.forEach((expr, index) => {
  console.log(`${index + 1}. Expression: ${expr}`);
  
  try {
    // Parse the expression
    const parseResult = parser.parse(expr);
    
    if (!parseResult.isValid) {
      console.log(`   ❌ Parse Error: ${parseResult.errors.map(e => e.message).join(', ')}`);
      return;
    }
    
    // Evaluate the expression
    const evalResult = evaluator.evaluateAST(parseResult.ast);
    
    if (evalResult.success) {
      console.log(`   ✅ Result: ${evalResult.result}`);
    } else {
      console.log(`   ❌ Evaluation Error: ${evalResult.error}`);
    }
    
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
  
  console.log('');
});

// Demonstrate gradient descent cost function
console.log('📈 Gradient Descent Example:');
console.log('Cost function for linear regression: sigma(i, 1, m, (y_i - (w0 + w1*x_i))^2)');

// Set up variables for a more realistic example
console.log('\nSetting up variables:');
evaluator.setVariable('m', 3);     // Number of training examples
evaluator.setVariable('w0', 0.8);  // Bias term (slightly off)
evaluator.setVariable('w1', 0.6);  // Weight for feature x (slightly off)
console.log('m = 3 (training examples)');
console.log('w0 = 0.8 (bias - slightly off from optimal)');
console.log('w1 = 0.6 (weight - slightly off from optimal)');

// Define arrays for x and y values (simplified as individual variables)
evaluator.setVariable('x1', 1);
evaluator.setVariable('x2', 2);
evaluator.setVariable('x3', 3);
evaluator.setVariable('y1', 1.5);  // Target values
evaluator.setVariable('y2', 2);
evaluator.setVariable('y3', 2.5);
console.log('Training data: (x1,y1)=(1,1.5), (x2,y2)=(2,2), (x3,y3)=(3,2.5)');

// More realistic gradient descent cost function using variables
const gradientExpressions = [
  // Individual cost terms
  '(y1 - (w0 + w1*x1))^2',  // Cost for first example
  '(y2 - (w0 + w1*x2))^2',  // Cost for second example
  '(y3 - (w0 + w1*x3))^2',  // Cost for third example
  
  // Total cost using summation with conditional logic
  'sigma(i, 1, m, (i == 1 ? (y1 - (w0 + w1*x1))^2 : (i == 2 ? (y2 - (w0 + w1*x2))^2 : (y3 - (w0 + w1*x3))^2)))',
];

console.log('\nEvaluating cost components:');
gradientExpressions.forEach((expr, index) => {
  console.log(`${index + 1}. ${expr}`);
  
  try {
    const parseResult = parser.parse(expr);
    if (parseResult.isValid) {
      const evalResult = evaluator.evaluateAST(parseResult.ast);
      if (evalResult.success) {
        console.log(`   ✅ Result: ${evalResult.result}`);
      } else {
        console.log(`   ❌ Error: ${evalResult.error}`);
      }
    } else {
      console.log(`   ❌ Parse Error: ${parseResult.errors.map(e => e.message).join(', ')}`);
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
  console.log('');
});

// Calculate mean squared error
console.log('📊 Mean Squared Error Calculation:');
const mseExpr = '(1/(2*m)) * ((y1 - (w0 + w1*x1))^2 + (y2 - (w0 + w1*x2))^2 + (y3 - (w0 + w1*x3))^2)';
console.log(`MSE = ${mseExpr}`);

try {
  const parseResult = parser.parse(mseExpr);
  if (parseResult.isValid) {
    const evalResult = evaluator.evaluateAST(parseResult.ast);
    if (evalResult.success) {
      console.log(`✅ MSE: ${evalResult.result}`);
    }
  }
} catch (error) {
  console.log(`❌ Error: ${error.message}`);
}

// Calculate gradients for gradient descent
console.log('\n🔄 Gradient Calculations:');
const partialDerivatives = [
  // Partial derivative with respect to w0 (bias)
  {
    name: 'dJ/dw0 (gradient w.r.t. bias)',
    expr: '(1/m) * ((y1 - (w0 + w1*x1))*(-1) + (y2 - (w0 + w1*x2))*(-1) + (y3 - (w0 + w1*x3))*(-1))'
  },
  // Partial derivative with respect to w1 (weight)
  {
    name: 'dJ/dw1 (gradient w.r.t. weight)',
    expr: '(1/m) * ((y1 - (w0 + w1*x1))*(-x1) + (y2 - (w0 + w1*x2))*(-x2) + (y3 - (w0 + w1*x3))*(-x3))'
  }
];

partialDerivatives.forEach(({name, expr}) => {
  console.log(`${name}:`);
  console.log(`  ${expr}`);
  
  try {
    const parseResult = parser.parse(expr);
    if (parseResult.isValid) {
      const evalResult = evaluator.evaluateAST(parseResult.ast);
      if (evalResult.success) {
        console.log(`  ✅ Result: ${evalResult.result}`);
      } else {
        console.log(`  ❌ Error: ${evalResult.error}`);
      }
    } else {
      console.log(`  ❌ Parse Error: ${parseResult.errors.map(e => e.message).join(', ')}`);
    }
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
  }
  console.log('');
});