#!/usr/bin/env node

import { GrammarParser } from '../dist/grammar-parser.js';
import { MathEvaluator } from '../dist/evaluator.js';

const parser = new GrammarParser();
const evaluator = new MathEvaluator();

console.log('🎯 Conditional Logic and Comparisons Demo\n');

// Set up some variables for testing
evaluator.setVariable('a', 5);
evaluator.setVariable('b', 3);
evaluator.setVariable('x', 10);
evaluator.setVariable('y', 10);

// Basic comparison operators
console.log('⚖️  Comparison Operators:');
const comparisonExamples = [
  '5 == 5',                       // true
  '3 != 7',                       // true
  '5 > 3',                        // true
  '2 < 8',                        // true
  '5 >= 5',                       // true
  '3 <= 7',                       // true
  'a > b',                        // true (5 > 3)
  'x == y',                       // true (10 == 10)
  'a + b == 8',                   // true (5 + 3 == 8)
  'pi > 3',                       // true
];

comparisonExamples.forEach((expr, index) => {
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

// Logical operators
console.log('🔗 Logical Operators (AND, OR, NOT):');
const logicalExamples = [
  'true && true',                 // true
  'true && false',                // false
  'true || false',                // true
  'false || false',               // false
  '!true',                        // false
  '!false',                       // true
  '(a > b) && (x == y)',         // true && true = true
  '(a < b) || (x > 5)',          // false || true = true
  '!(a == b)',                    // true (not false)
  '(a > 0) && (b > 0)',          // true && true = true
];

logicalExamples.forEach((expr, index) => {
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

// Conditional (ternary) expressions
console.log('🤔 Conditional (Ternary) Expressions:');
const conditionalExamples = [
  'true ? 1 : 0',                 // 1
  'false ? 1 : 0',                // 0
  '5 > 3 ? "yes" : "no"',         // "yes"
  'a > b ? a : b',                // 5 (max of a and b)
  'x == y ? x * 2 : y * 3',       // 20 (since x == y, returns x * 2)
  'pi > 3 ? floor(pi) : ceil(pi)', // 3 (since pi > 3, returns floor(pi))
  '(a + b) > 7 ? a * b : a + b',  // 8 (since 5 + 3 = 8 > 7, returns a * b = 15)
  '0 ? "never" : "always"',       // "always" (0 is falsy)
  '1 ? "always" : "never"',       // "always" (1 is truthy)
];

conditionalExamples.forEach((expr, index) => {
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

// Complex nested conditionals
console.log('🎭 Nested and Complex Conditionals:');
const nestedExamples = [
  'a > 0 ? (b > 0 ? a + b : a - b) : (b > 0 ? b - a : -(a + b))', // Complex nested
  '(x > 5) && (y > 5) ? max(x, y) : min(x, y)',                    // Logical + conditional
  'abs(a - b) > 1 ? "different" : "similar"',                      // Using function in condition
  '(a^2 + b^2) > 20 ? sqrt(a^2 + b^2) : a^2 + b^2',              // Mathematical condition
];

nestedExamples.forEach((expr, index) => {
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

console.log('📊 Variable Values Used:');
console.log(`   a = ${evaluator.getVariable('a')}`);
console.log(`   b = ${evaluator.getVariable('b')}`);
console.log(`   x = ${evaluator.getVariable('x')}`);
console.log(`   y = ${evaluator.getVariable('y')}`);