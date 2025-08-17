#!/usr/bin/env node

import { GrammarParser } from '../dist/grammar-parser.js';
import { MathEvaluator } from '../dist/evaluator.js';

const parser = new GrammarParser();
const evaluator = new MathEvaluator();

console.log('📊 Statistics and Probability Demo\n');

// Set up sample data sets using variables
console.log('🔢 Setting up sample datasets:');

// Dataset 1: Test scores
evaluator.setVariable('score1', 85);
evaluator.setVariable('score2', 92);
evaluator.setVariable('score3', 78);
evaluator.setVariable('score4', 95);
evaluator.setVariable('score5', 88);
evaluator.setVariable('n_scores', 5);

console.log('Dataset 1 - Test Scores: [85, 92, 78, 95, 88]');

// Dataset 2: Heights (in cm)
evaluator.setVariable('h1', 175);
evaluator.setVariable('h2', 168);
evaluator.setVariable('h3', 182);
evaluator.setVariable('h4', 171);
evaluator.setVariable('h5', 179);
evaluator.setVariable('h6', 165);
evaluator.setVariable('n_heights', 6);

console.log('Dataset 2 - Heights: [175, 168, 182, 171, 179, 165] cm\n');

// Basic sum and count operations
console.log('➕ Basic Aggregations:');
const aggregationExamples = [
  // Test scores sum and average
  'sum(score1, score2, score3, score4, score5)',        // Total of scores
  'sum(score1, score2, score3, score4, score5) / n_scores', // Average score
  
  // Heights sum and average
  'sum(h1, h2, h3, h4, h5, h6)',                        // Total height
  'sum(h1, h2, h3, h4, h5, h6) / n_heights',           // Average height
  
  // Min and max
  'min(score1, score2, score3, score4, score5)',        // Minimum score
  'max(score1, score2, score3, score4, score5)',        // Maximum score
  'min(h1, h2, h3, h4, h5, h6)',                       // Minimum height
  'max(h1, h2, h3, h4, h5, h6)',                       // Maximum height
  
  // Range calculations
  'max(score1, score2, score3, score4, score5) - min(score1, score2, score3, score4, score5)', // Score range
  'max(h1, h2, h3, h4, h5, h6) - min(h1, h2, h3, h4, h5, h6)',                                 // Height range
];

aggregationExamples.forEach((expr, index) => {
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

// Store calculated means for variance calculations
evaluator.setVariable('mean_scores', (85 + 92 + 78 + 95 + 88) / 5);
evaluator.setVariable('mean_heights', (175 + 168 + 182 + 171 + 179 + 165) / 6);

// Variance and standard deviation calculations (manual implementation)
console.log('📐 Variance and Standard Deviation:');
const varianceExamples = [
  // Calculate mean first (already done above)
  'mean_scores',  // Display calculated mean
  'mean_heights', // Display calculated mean
  
  // Variance for test scores: sum((xi - mean)^2) / n
  '((score1 - mean_scores)^2 + (score2 - mean_scores)^2 + (score3 - mean_scores)^2 + (score4 - mean_scores)^2 + (score5 - mean_scores)^2) / n_scores',
  
  // Store variance for standard deviation calculation
  'variance_scores = ((score1 - mean_scores)^2 + (score2 - mean_scores)^2 + (score3 - mean_scores)^2 + (score4 - mean_scores)^2 + (score5 - mean_scores)^2) / n_scores',
  
  // Standard deviation for scores
  'sqrt(variance_scores)',
  
  // Variance for heights
  '((h1 - mean_heights)^2 + (h2 - mean_heights)^2 + (h3 - mean_heights)^2 + (h4 - mean_heights)^2 + (h5 - mean_heights)^2 + (h6 - mean_heights)^2) / n_heights',
  
  // Store variance for heights
  'variance_heights = ((h1 - mean_heights)^2 + (h2 - mean_heights)^2 + (h3 - mean_heights)^2 + (h4 - mean_heights)^2 + (h5 - mean_heights)^2 + (h6 - mean_heights)^2) / n_heights',
  
  // Standard deviation for heights
  'sqrt(variance_heights)',
];

varianceExamples.forEach((expr, index) => {
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

// Probability calculations
console.log('🎲 Basic Probability Calculations:');

// Set up probability scenario variables
evaluator.setVariable('total_students', 100);
evaluator.setVariable('passed_students', 75);
evaluator.setVariable('female_students', 60);
evaluator.setVariable('male_students', 40);
evaluator.setVariable('female_passed', 48);
evaluator.setVariable('male_passed', 27);

console.log('Scenario: 100 students, 75 passed, 60 female, 40 male, 48 female passed, 27 male passed\n');

const probabilityExamples = [
  // Basic probabilities
  'passed_students / total_students',                    // P(passed)
  'female_students / total_students',                    // P(female)
  'male_students / total_students',                      // P(male)
  
  // Conditional probabilities
  'female_passed / female_students',                     // P(passed | female)
  'male_passed / male_students',                         // P(passed | male)
  'female_passed / passed_students',                     // P(female | passed)
  
  // Joint probabilities
  'female_passed / total_students',                      // P(female AND passed)
  'male_passed / total_students',                        // P(male AND passed)
  
  // Complement probabilities
  '1 - (passed_students / total_students)',              // P(failed)
  '1 - (female_students / total_students)',              // P(male) - alternative calculation
];

probabilityExamples.forEach((expr, index) => {
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

// Combinatorics
console.log('🔄 Combinatorics:');
const combinatoricsExamples = [
  // Factorials
  'factorial(3)',                          // 3! = 6
  'factorial(5)',                          // 5! = 120
  'factorial(0)',                          // 0! = 1 (by definition)
  
  // Permutations: P(n,r) = n! / (n-r)!
  'factorial(5) / factorial(5-3)',         // P(5,3) = 5!/(5-3)! = 60
  'factorial(7) / factorial(7-2)',         // P(7,2) = 7!/(7-2)! = 42
  
  // Combinations: C(n,r) = n! / (r! * (n-r)!)
  'factorial(5) / (factorial(3) * factorial(5-3))', // C(5,3) = 5!/(3!*2!) = 10
  'factorial(10) / (factorial(3) * factorial(10-3))', // C(10,3) = 10!/(3!*7!) = 120
  
  // Binomial coefficient examples
  'factorial(4) / (factorial(2) * factorial(4-2))', // C(4,2) = 6 (ways to choose 2 from 4)
];

combinatoricsExamples.forEach((expr, index) => {
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

// Statistical summaries
console.log('📋 Current Statistical Variables:');
const statVars = ['mean_scores', 'mean_heights', 'variance_scores', 'variance_heights'];
statVars.forEach(varName => {
  const value = evaluator.getVariable(varName);
  if (value !== undefined) {
    console.log(`   ${varName} = ${value}`);
  }
});