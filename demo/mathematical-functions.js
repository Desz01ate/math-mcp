#!/usr/bin/env node

import { GrammarParser } from '../dist/grammar-parser.js';
import { MathEvaluator } from '../dist/evaluator.js';

const parser = new GrammarParser();
const evaluator = new MathEvaluator();

console.log('📐 Mathematical Functions Demo\n');

// Trigonometric functions
console.log('🌊 Trigonometric Functions:');
const trigExamples = [
  'sin(0)',                       // 0
  'cos(0)',                       // 1
  'tan(pi/4)',                    // 1
  'sin(pi/2)',                    // 1
  'cos(pi)',                      // -1
  'asin(1)',                      // π/2
  'acos(0)',                      // π/2
  'atan(1)',                      // π/4
  'atan2(1, 1)',                  // π/4 (two-argument arctangent)
];

trigExamples.forEach((expr, index) => {
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

// Hyperbolic functions
console.log('📈 Hyperbolic Functions:');
const hyperbolicExamples = [
  'sinh(0)',                      // 0
  'cosh(0)',                      // 1
  'tanh(0)',                      // 0
  'sinh(1)',                      // Hyperbolic sine of 1
  'cosh(1)',                      // Hyperbolic cosine of 1
  'asinh(0)',                     // 0
  'acosh(1)',                     // 0
  'atanh(0)',                     // 0
];

hyperbolicExamples.forEach((expr, index) => {
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

// Logarithmic and exponential functions
console.log('📊 Logarithmic and Exponential Functions:');
const logExpExamples = [
  'exp(0)',                       // 1
  'exp(1)',                       // e
  'log(e)',                       // 1 (natural log)
  'log10(100)',                   // 2 (base-10 log)
  'log2(8)',                      // 3 (base-2 log)
  'sqrt(16)',                     // 4
  'cbrt(27)',                     // 3 (cube root)
  'exp(log(5))',                  // 5 (identity)
  'log(exp(3))',                  // 3 (identity)
  'expm1(0)',                     // 0 (exp(x) - 1, more accurate for small x)
  'log1p(0)',                     // 0 (log(1 + x), more accurate for small x)
];

logExpExamples.forEach((expr, index) => {
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

// Rounding and utility functions
console.log('🔧 Rounding and Utility Functions:');
const utilityExamples = [
  'abs(-5.7)',                    // 5.7
  'sign(-3)',                     // -1
  'sign(0)',                      // 0
  'sign(4)',                      // 1
  'floor(3.9)',                   // 3
  'ceil(3.1)',                    // 4
  'round(3.7)',                   // 4
  'round(3.2)',                   // 3
  'min(1, 5, 3, -2)',            // -2
  'max(1, 5, 3, -2)',            // 5
  'factorial(5)',                 // 120
  'factorial(0)',                 // 1
];

utilityExamples.forEach((expr, index) => {
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

// Complex expressions combining multiple functions
console.log('🌟 Complex Function Combinations:');
const complexExamples = [
  'sqrt(sin(pi/2)^2 + cos(pi/2)^2)',  // Should equal 1 (Pythagorean identity)
  'log(exp(2) * exp(3))',              // Should equal 5 (log properties)
  'abs(sin(3*pi/2))',                  // Should equal 1
  'round(100 * sin(pi/6))',            // Should be 50 (sin(30°) = 0.5)
  'factorial(floor(e))',               // factorial(2) = 2
  'max(abs(-7), sqrt(25), ceil(pi))',  // max(7, 5, 4) = 7
  'min(cos(0), sin(pi/2), tan(0))',    // min(1, 1, 0) = 0
];

complexExamples.forEach((expr, index) => {
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