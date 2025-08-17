#!/usr/bin/env node

import { GrammarParser } from '../dist/grammar-parser.js';
import { MathEvaluator } from '../dist/evaluator.js';

const parser = new GrammarParser();
const evaluator = new MathEvaluator();

console.log('🧮 Basic Mathematical Operations Demo\n');

const basicExamples = [
  // Basic arithmetic
  '2 + 3 * 4',                    // Order of operations: 2 + 12 = 14
  '(2 + 3) * 4',                  // Parentheses: 5 * 4 = 20
  '10 / 2 - 3',                   // Left to right: 5 - 3 = 2
  '2^3 + 1',                      // Exponentiation: 8 + 1 = 9
  '15 % 4',                       // Modulo: 3
  
  // Negative numbers and unary operators
  '-5 + 3',                       // -2
  '-(2 + 3)',                     // -5
  '+7',                           // 7
  
  // Mathematical constants
  'pi',                           // 3.14159...
  'e',                            // 2.71828...
  'tau',                          // 6.28318... (2*pi)
  'phi',                          // 1.618... (golden ratio)
  
  // Using constants in expressions
  '2 * pi',                       // Circumference formula part
  'e^2',                          // e squared
  'sqrt(2) * phi',                // Mixed constants
];

console.log('📊 Basic Arithmetic and Constants:');
basicExamples.forEach((expr, index) => {
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

// Variable assignment and usage
console.log('🔧 Variables and Assignments:');
const variableExamples = [
  'x = 5',                        // Assignment
  'y = 2 * x',                    // Using variable in expression
  'x + y',                        // Using multiple variables
  'radius = 3',                   // More descriptive variable
  'area = pi * radius^2',         // Circle area formula
  'area',                         // Display result
];

variableExamples.forEach((expr, index) => {
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

// Display final variable state
console.log('📋 Current Variables:');
const variables = evaluator.listVariables();
variables.forEach(varName => {
  console.log(`   ${varName} = ${evaluator.getVariable(varName)}`);
});