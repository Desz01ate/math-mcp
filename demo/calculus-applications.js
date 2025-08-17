#!/usr/bin/env node

import { GrammarParser } from '../dist/grammar-parser.js';
import { MathEvaluator } from '../dist/evaluator.js';

const parser = new GrammarParser();
const evaluator = new MathEvaluator();

console.log('∫ Calculus Applications Demo\n');

// Numerical approximation of derivatives using finite differences
console.log('📈 Numerical Derivatives (using finite differences):');

// Set up function values for f(x) = x^2 at various points
console.log('Function: f(x) = x²\n');

// Calculate f(x) values
evaluator.setVariable('h', 0.001);  // Small step size
evaluator.setVariable('x', 2);      // Point where we want derivative

const derivativeExamples = [
  // Function values around x = 2
  'f_2 = x^2',                              // f(2) = 4
  'x_plus_h = x + h',                       // x + h
  'f_2_plus_h = (x + h)^2',                 // f(2 + h)
  'x_minus_h = x - h',                      // x - h  
  'f_2_minus_h = (x - h)^2',                // f(2 - h)
  
  // Forward difference: f'(x) ≈ (f(x+h) - f(x)) / h
  'forward_diff = (f_2_plus_h - f_2) / h',
  
  // Backward difference: f'(x) ≈ (f(x) - f(x-h)) / h
  'backward_diff = (f_2 - f_2_minus_h) / h',
  
  // Central difference: f'(x) ≈ (f(x+h) - f(x-h)) / (2h)
  'central_diff = (f_2_plus_h - f_2_minus_h) / (2 * h)',
];

console.log('Calculating derivative of f(x) = x² at x = 2 (analytical answer should be 4):');
derivativeExamples.forEach((expr, index) => {
  console.log(`${index + 1}. ${expr}`);
  
  try {
    const parseResult = parser.parse(expr);
    if (parseResult.isValid) {
      const evalResult = evaluator.evaluate(parseResult.ast);
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

// Numerical integration using trapezoidal rule
console.log('∫ Numerical Integration (Trapezoidal Rule):');
console.log('Integrating f(x) = x² from 0 to 2\n');

// Set up integration parameters
evaluator.setVariable('a', 0);      // Lower bound
evaluator.setVariable('b', 2);      // Upper bound
evaluator.setVariable('n', 4);      // Number of intervals
evaluator.setVariable('delta_x', (2 - 0) / 4);  // Width of each interval

const integrationExamples = [
  // Calculate interval width
  'delta_x = (b - a) / n',
  
  // Calculate x values at interval boundaries
  'x0 = a',                                    // x₀ = 0
  'x1 = a + delta_x',                          // x₁ = 0.5
  'x2 = a + 2 * delta_x',                      // x₂ = 1.0
  'x3 = a + 3 * delta_x',                      // x₃ = 1.5
  'x4 = b',                                    // x₄ = 2.0
  
  // Calculate function values f(x) = x²
  'f0 = x0^2',                                 // f(0) = 0
  'f1 = x1^2',                                 // f(0.5) = 0.25
  'f2 = x2^2',                                 // f(1.0) = 1
  'f3 = x3^2',                                 // f(1.5) = 2.25
  'f4 = x4^2',                                 // f(2.0) = 4
  
  // Trapezoidal rule: ∫f(x)dx ≈ (Δx/2) * [f(x₀) + 2f(x₁) + 2f(x₂) + 2f(x₃) + f(x₄)]
  'integral_approx = (delta_x / 2) * (f0 + 2*f1 + 2*f2 + 2*f3 + f4)',
];

console.log('Using trapezoidal rule with 4 intervals (analytical answer should be 8/3 ≈ 2.667):');
integrationExamples.forEach((expr, index) => {
  console.log(`${index + 1}. ${expr}`);
  
  try {
    const parseResult = parser.parse(expr);
    if (parseResult.isValid) {
      const evalResult = evaluator.evaluate(parseResult.ast);
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

// Limits and continuity examples
console.log('🎯 Limit Calculations:');
console.log('Calculating lim(x→0) sin(x)/x using small values:\n');

// Set up small values approaching 0
evaluator.setVariable('x1', 0.1);
evaluator.setVariable('x2', 0.01);
evaluator.setVariable('x3', 0.001);
evaluator.setVariable('x4', 0.0001);

const limitExamples = [
  // Calculate sin(x)/x for decreasing values of x
  'sin(x1) / x1',                           // sin(0.1)/0.1
  'sin(x2) / x2',                           // sin(0.01)/0.01
  'sin(x3) / x3',                           // sin(0.001)/0.001
  'sin(x4) / x4',                           // sin(0.0001)/0.0001
  
  // L'Hôpital's rule verification: lim(x→0) sin(x)/x = lim(x→0) cos(x)/1 = 1
  'cos(x1)',                                // cos(0.1) ≈ 0.995
  'cos(x2)',                                // cos(0.01) ≈ 0.99995
  'cos(x3)',                                // cos(0.001) ≈ 0.9999995
  'cos(x4)',                                // cos(0.0001) ≈ 0.999999995
];

console.log('As x approaches 0, sin(x)/x should approach 1:');
limitExamples.forEach((expr, index) => {
  console.log(`${index + 1}. ${expr}`);
  
  try {
    const parseResult = parser.parse(expr);
    if (parseResult.isValid) {
      const evalResult = evaluator.evaluate(parseResult.ast);
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

// Series and summation applications
console.log('∑ Series Approximations:');

console.log('Taylor Series Approximations:\n');
console.log('1. e^x ≈ 1 + x + x²/2! + x³/3! + x⁴/4! + ... (at x = 1)');

// Set up for Taylor series of e^x at x = 1
evaluator.setVariable('x_val', 1);

const seriesExamples = [
  // Individual terms of Taylor series for e^x at x = 1
  '1',                                      // First term
  'x_val',                                  // Second term: x
  'x_val^2 / factorial(2)',                 // Third term: x²/2!
  'x_val^3 / factorial(3)',                 // Fourth term: x³/3!
  'x_val^4 / factorial(4)',                 // Fifth term: x⁴/4!
  
  // Partial sums
  'taylor_1 = 1',
  'taylor_2 = taylor_1 + x_val',
  'taylor_3 = taylor_2 + x_val^2 / factorial(2)',
  'taylor_4 = taylor_3 + x_val^3 / factorial(3)',
  'taylor_5 = taylor_4 + x_val^4 / factorial(4)',
  
  // Compare with actual e^1
  'exp(x_val)',                             // Actual value of e
  
  // Error analysis
  'abs(exp(x_val) - taylor_5)',             // Error with 5-term approximation
];

seriesExamples.forEach((expr, index) => {
  console.log(`${index + 1}. ${expr}`);
  
  try {
    const parseResult = parser.parse(expr);
    if (parseResult.isValid) {
      const evalResult = evaluator.evaluate(parseResult.ast);
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

// Using sigma notation for series
console.log('2. Using Sigma Notation for Geometric Series:');
console.log('Sum of 1/2^n for n = 0 to 5 (should approach 2)\n');

const sigmaSeriesExamples = [
  // Geometric series: ∑(n=0 to ∞) (1/2)^n = 2
  // Let's calculate partial sums using sigma notation
  'sigma(n, 0, 0, 1/(2^n))',               // First term: (1/2)⁰ = 1
  'sigma(n, 0, 1, 1/(2^n))',               // Sum of first 2 terms
  'sigma(n, 0, 2, 1/(2^n))',               // Sum of first 3 terms
  'sigma(n, 0, 3, 1/(2^n))',               // Sum of first 4 terms
  'sigma(n, 0, 4, 1/(2^n))',               // Sum of first 5 terms
  'sigma(n, 0, 5, 1/(2^n))',               // Sum of first 6 terms
  
  // Theoretical limit
  '2',                                     // Theoretical sum to infinity
  
  // Error from theoretical value
  '2 - sigma(n, 0, 5, 1/(2^n))',          // How close we are to the limit
];

sigmaSeriesExamples.forEach((expr, index) => {
  console.log(`${index + 1}. ${expr}`);
  
  try {
    const parseResult = parser.parse(expr);
    if (parseResult.isValid) {
      const evalResult = evaluator.evaluate(parseResult.ast);
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