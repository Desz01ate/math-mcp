#!/usr/bin/env node

import { GrammarParser } from '../dist/grammar-parser.js';
import { MathEvaluator } from '../dist/evaluator.js';

const parser = new GrammarParser();
const evaluator = new MathEvaluator();

console.log('🚀 Advanced Features and Edge Cases Demo\n');

// Complex nested summations
console.log('🔢 Complex Nested Summations:');
const nestedSummationExamples = [
  // Double summation: ∑∑ i*j
  'sigma(i, 1, 3, sigma(j, 1, 2, i*j))',              // ∑(i=1,3)∑(j=1,2) i*j
  'sigma(i, 1, 2, sigma(j, i, 3, i + j))',            // Variable bounds: j from i to 3
  
  // Summation with conditionals
  'sigma(i, 1, 5, i * (i % 2 == 0 ? 1 : 0))',        // Sum only even numbers
  'sigma(n, 1, 10, n > 5 ? n^2 : 0)',                 // Sum squares of numbers > 5
  
  // Mathematical series
  'sigma(k, 1, 5, 1/k)',                              // Harmonic series (partial)
  'sigma(n, 0, 4, (-1)^n / factorial(2*n))',          // Cosine Taylor series terms
  'sigma(i, 1, 4, i / (i + 1))',                      // Rational function series
];

nestedSummationExamples.forEach((expr, index) => {
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

// Complex conditional expressions
console.log('🎭 Complex Conditional Logic:');
const complexConditionalExamples = [
  // Nested ternary operators
  'x = 5',
  'x > 0 ? (x > 10 ? "large" : (x > 5 ? "medium" : "small")) : "negative"',
  
  // Mathematical conditionals
  'y = -3',
  'abs(y) > 2 ? (y > 0 ? sqrt(y) : sqrt(-y)) : y^2',
  
  // Complex logical expressions
  'a = 8',
  'b = 12',
  '(a > 5 && b > 10) ? max(a, b) : (a < 5 || b < 10) ? min(a, b) : (a + b) / 2',
  
  // Piecewise functions
  't = 1.5',
  't < 1 ? t^2 : (t < 2 ? 2*t - 1 : t^3 - 3*t + 2)',
  
  // Sign function implementation
  'val = -7.5',
  'val > 0 ? 1 : (val < 0 ? -1 : 0)',
];

complexConditionalExamples.forEach((expr, index) => {
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

// Advanced mathematical applications
console.log('🧮 Advanced Mathematical Applications:');

// Newton's method for square root
console.log('Newton\'s Method for Square Root (finding √2):');
evaluator.setVariable('target', 2);
evaluator.setVariable('x0', 1);    // Initial guess

const newtonMethodExamples = [
  // Newton's method: x₁ = x₀ - f(x₀)/f'(x₀)
  // For f(x) = x² - target, f'(x) = 2x
  // x₁ = x₀ - (x₀² - target)/(2*x₀) = (x₀ + target/x₀)/2
  
  'x1 = (x0 + target/x0) / 2',               // First iteration
  'error1 = abs(x1^2 - target)',             // Error check
  
  'x2 = (x1 + target/x1) / 2',               // Second iteration  
  'error2 = abs(x2^2 - target)',             // Error check
  
  'x3 = (x2 + target/x2) / 2',               // Third iteration
  'error3 = abs(x3^2 - target)',             // Error check
  
  // Compare with built-in
  'sqrt(target)',                            // Actual square root
  'abs(x3 - sqrt(target))',                  // Final error
];

newtonMethodExamples.forEach((expr, index) => {
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

// Recursive-like calculations using variables
console.log('📊 Fibonacci-like Sequence:');
const fibonacciExamples = [
  'fib0 = 0',
  'fib1 = 1', 
  'fib2 = fib1 + fib0',
  'fib3 = fib2 + fib1',
  'fib4 = fib3 + fib2',
  'fib5 = fib4 + fib3',
  'fib6 = fib5 + fib4',
  'fib7 = fib6 + fib5',
  
  // Fibonacci ratios (approaching golden ratio)
  'fib7 / fib6',                             // Should approach φ
  'phi',                                     // Golden ratio constant
  'abs(fib7/fib6 - phi)',                    // Error from golden ratio
];

fibonacciExamples.forEach((expr, index) => {
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

// Edge cases and error handling
console.log('⚠️  Edge Cases and Error Handling:');
const edgeCaseExamples = [
  // Large numbers
  'factorial(10)',                           // Should work
  // 'factorial(20)',                        // Might be very large
  
  // Division by zero handling
  '1 / 1',                                   // Normal division
  // Note: '1 / 0' would cause an error, so we'll use conditional
  '1 / (1 > 0 ? 1 : 0)',                    // Conditional to avoid division by zero
  
  // Very small numbers
  'sin(0.000001)',                           // Very small input
  '1 / 1000000',                             // Very small result
  
  // Boundary conditions for trig functions
  'sin(pi)',                                 // Should be ~0 (but might have floating point error)
  'cos(pi/2)',                               // Should be ~0
  'tan(0)',                                  // Should be 0
  
  // Large exponents
  '2^10',                                    // 1024
  '2^20',                                    // ~1 million
  
  // Negative bases with fractional exponents (should work for integer-like fractions)
  '(-1)^2',                                  // 1
  '(-2)^3',                                  // -8
  
  // Special mathematical values
  'log(1)',                                  // Should be 0
  'exp(0)',                                  // Should be 1
  'sqrt(0)',                                 // Should be 0
  'abs(0)',                                  // Should be 0
];

edgeCaseExamples.forEach((expr, index) => {
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

// Performance stress test with summations
console.log('🏃‍♂️ Performance Test:');
const performanceExamples = [
  'sigma(i, 1, 100, 1)',                     // Simple sum to 100
  'sigma(k, 1, 50, k^2)',                    // Sum of squares
  // 'sigma(n, 1, 1000, 1/n)',              // Harmonic series (might be slow)
];

console.log('Testing performance with larger summations:');
performanceExamples.forEach((expr, index) => {
  console.log(`${index + 1}. ${expr}`);
  
  const startTime = Date.now();
  try {
    const parseResult = parser.parse(expr);
    if (parseResult.isValid) {
      const evalResult = evaluator.evaluateAST(parseResult.ast);
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      if (evalResult.success) {
        console.log(`   ✅ Result: ${evalResult.result} (${duration}ms)`);
      } else {
        console.log(`   ❌ Error: ${evalResult.error} (${duration}ms)`);
      }
    } else {
      const endTime = Date.now();
      const duration = endTime - startTime;
      console.log(`   ❌ Parse Error: ${parseResult.errors.map(e => e.message).join(', ')} (${duration}ms)`);
    }
  } catch (error) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(`   ❌ Error: ${error.message} (${duration}ms)`);
  }
  console.log('');
});