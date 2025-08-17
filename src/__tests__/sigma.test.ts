import { describe, it, expect } from 'vitest';
import { GrammarParser } from '../grammar-parser.js';
import { MathEvaluator } from '../evaluator.js';

describe('Summation (Sigma) Support', () => {
  const parser = new GrammarParser();
  const evaluator = new MathEvaluator();

  describe('Basic Summation Parsing', () => {
    it('should parse basic summation syntax', () => {
      const expression = 'sigma(i, 1, 5, i)';
      
      const parseResult = parser.parse(expression);
      expect(parseResult.isValid).toBe(true);
      expect(parseResult.ast?.children?.[0]?.type).toBe('SUMMATION');
      expect(parseResult.ast?.children?.[0]?.variable?.value).toBe('i');
    });

    it('should parse summation with complex expressions', () => {
      const expression = 'sigma(k, 0, 10, k^2)';
      
      const parseResult = parser.parse(expression);
      expect(parseResult.isValid).toBe(true);
      expect(parseResult.ast?.children?.[0]?.type).toBe('SUMMATION');
    });

    it('should handle summation with nested expressions', () => {
      const expression = 'sigma(j, 1, n, 2*j + 1)';
      
      const parseResult = parser.parse(expression);
      expect(parseResult.isValid).toBe(true);
    });
  });

  describe('Summation Evaluation', () => {
    it('should evaluate simple summation: sigma(i, 1, 5, i) = 15', () => {
      const expression = 'sigma(i, 1, 5, i)';
      
      const parseResult = parser.parse(expression);
      expect(parseResult.isValid).toBe(true);
      
      const evalResult = evaluator.evaluate(parseResult.ast!);
      expect(evalResult.success).toBe(true);
      expect(evalResult.result).toBe(15); // 1+2+3+4+5 = 15
    });

    it('should evaluate sum of squares: sigma(i, 1, 4, i^2) = 30', () => {
      const expression = 'sigma(i, 1, 4, i^2)';
      
      const parseResult = parser.parse(expression);
      expect(parseResult.isValid).toBe(true);
      
      const evalResult = evaluator.evaluate(parseResult.ast!);
      expect(evalResult.success).toBe(true);
      expect(evalResult.result).toBe(30); // 1+4+9+16 = 30
    });

    it('should evaluate sum with constants: sigma(k, 0, 3, 2*k + 1)', () => {
      const expression = 'sigma(k, 0, 3, 2*k + 1)';
      
      const parseResult = parser.parse(expression);
      expect(parseResult.isValid).toBe(true);
      
      const evalResult = evaluator.evaluate(parseResult.ast!);
      expect(evalResult.success).toBe(true);
      expect(evalResult.result).toBe(16); // 1+3+5+7 = 16
    });

    it('should handle summation with variables', () => {
      // Set variable n
      evaluator.setVariable('n', 5);
      
      const expression = 'sigma(i, 1, n, i)';
      
      const parseResult = parser.parse(expression);
      expect(parseResult.isValid).toBe(true);
      
      const evalResult = evaluator.evaluate(parseResult.ast!);
      expect(evalResult.success).toBe(true);
      expect(evalResult.result).toBe(15); // 1+2+3+4+5 = 15
    });
  });

  describe('Advanced Summation Use Cases', () => {
    it('should handle gradient descent cost function calculation', () => {
      // Set up variables for a simple linear regression cost function
      // Cost = sigma(i, 1, m, (y[i] - (w0 + w1*x[i]))^2)
      // Simplified version: sigma(i, 1, 3, (i - (1 + 0.5*i))^2)
      
      const expression = 'sigma(i, 1, 3, (i - (1 + 0.5*i))^2)';
      
      const parseResult = parser.parse(expression);
      expect(parseResult.isValid).toBe(true);
      
      const evalResult = evaluator.evaluate(parseResult.ast!);
      expect(evalResult.success).toBe(true);
      // Expected: (1-(1+0.5))^2 + (2-(1+1))^2 + (3-(1+1.5))^2 = 0.25 + 0 + 0.25 = 0.5
      expect(evalResult.result).toBeCloseTo(0.5, 6);
    });

    it('should handle nested summations for matrix operations', () => {
      // Simplified matrix multiplication element calculation
      // sigma(k, 1, 2, k * k) simulating dot product
      
      const expression = 'sigma(k, 1, 2, k * k)';
      
      const parseResult = parser.parse(expression);
      expect(parseResult.isValid).toBe(true);
      
      const evalResult = evaluator.evaluate(parseResult.ast!);
      expect(evalResult.success).toBe(true);
      expect(evalResult.result).toBe(5); // 1*1 + 2*2 = 1 + 4 = 5
    });

    it('should handle summation with trigonometric functions', () => {
      const expression = 'sigma(n, 0, 2, sin(n * pi / 2))';
      
      const parseResult = parser.parse(expression);
      expect(parseResult.isValid).toBe(true);
      
      const evalResult = evaluator.evaluate(parseResult.ast!);
      expect(evalResult.success).toBe(true);
      // sin(0) + sin(π/2) + sin(π) = 0 + 1 + 0 = 1
      expect(evalResult.result).toBeCloseTo(1, 6);
    });

    it('should handle summation in complex expressions', () => {
      const expression = '2 * sigma(i, 1, 3, i) + 5';
      
      const parseResult = parser.parse(expression);
      expect(parseResult.isValid).toBe(true);
      
      const evalResult = evaluator.evaluate(parseResult.ast!);
      expect(evalResult.success).toBe(true);
      expect(evalResult.result).toBe(17); // 2 * (1+2+3) + 5 = 2 * 6 + 5 = 17
    });
  });

  describe('Summation Variable Scoping', () => {
    it('should not affect existing variables', () => {
      // Set variable i to some value
      evaluator.setVariable('i', 100);
      
      const expression = 'sigma(i, 1, 3, i)';
      
      const parseResult = parser.parse(expression);
      expect(parseResult.isValid).toBe(true);
      
      const evalResult = evaluator.evaluate(parseResult.ast!);
      expect(evalResult.success).toBe(true);
      expect(evalResult.result).toBe(6); // 1+2+3 = 6
      
      // Check that original variable i is restored
      expect(evaluator.getVariable('i')).toBe(100);
    });

    it('should handle multiple summations with same variable', () => {
      const expression = 'sigma(i, 1, 2, i) + sigma(i, 3, 4, i)';
      
      const parseResult = parser.parse(expression);
      expect(parseResult.isValid).toBe(true);
      
      const evalResult = evaluator.evaluate(parseResult.ast!);
      expect(evalResult.success).toBe(true);
      expect(evalResult.result).toBe(10); // (1+2) + (3+4) = 3 + 7 = 10
    });
  });

  describe('Summation Error Handling', () => {
    it('should reject summation with non-numeric bounds', () => {
      const expression = 'sigma(i, "a", 5, i)';
      
      const parseResult = parser.parse(expression);
      expect(parseResult.isValid).toBe(true);
      
      const evalResult = evaluator.evaluate(parseResult.ast!);
      expect(evalResult.success).toBe(false);
      expect(evalResult.error).toContain('must be numbers');
    });

    it('should reject summation with non-integer bounds', () => {
      const expression = 'sigma(i, 1.5, 5, i)';
      
      const parseResult = parser.parse(expression);
      expect(parseResult.isValid).toBe(true);
      
      const evalResult = evaluator.evaluate(parseResult.ast!);
      expect(evalResult.success).toBe(false);
      expect(evalResult.error).toContain('must be integers');
    });

    it('should reject summation with non-numeric expression result', () => {
      const expression = 'sigma(i, 1, 2, "hello")';
      
      const parseResult = parser.parse(expression);
      expect(parseResult.isValid).toBe(true);
      
      const evalResult = evaluator.evaluate(parseResult.ast!);
      expect(evalResult.success).toBe(false);
      expect(evalResult.error).toContain('must evaluate to a number');
    });

    it('should handle empty summation range', () => {
      const expression = 'sigma(i, 5, 3, i)'; // start > end
      
      const parseResult = parser.parse(expression);
      expect(parseResult.isValid).toBe(true);
      
      const evalResult = evaluator.evaluate(parseResult.ast!);
      expect(evalResult.success).toBe(true);
      expect(evalResult.result).toBe(0); // Empty range should sum to 0
    });
  });

  describe('Regular Sum Function', () => {
    it('should keep regular sum function working for arrays', () => {
      const expression = 'sum(1, 2, 3, 4, 5)';
      
      const parseResult = parser.parse(expression);
      expect(parseResult.isValid).toBe(true);
      
      const evalResult = evaluator.evaluate(parseResult.ast!);
      expect(evalResult.success).toBe(true);
      expect(evalResult.result).toBe(15); // 1+2+3+4+5 = 15
    });
  });

  describe('Mathematical Properties', () => {
    it('should verify sum of first n natural numbers formula', () => {
      // Formula: sigma(i, 1, n, i) = n(n+1)/2
      const n = 10;
      evaluator.setVariable('n', n);
      
      const expression = 'sigma(i, 1, n, i)';
      
      const parseResult = parser.parse(expression);
      expect(parseResult.isValid).toBe(true);
      
      const evalResult = evaluator.evaluate(parseResult.ast!);
      expect(evalResult.success).toBe(true);
      expect(evalResult.result).toBe(n * (n + 1) / 2); // 10*11/2 = 55
    });

    it('should verify sum of first n squares formula', () => {
      // Formula: sigma(i, 1, n, i^2) = n(n+1)(2n+1)/6
      const n = 5;
      evaluator.setVariable('n', n);
      
      const expression = 'sigma(i, 1, n, i^2)';
      
      const parseResult = parser.parse(expression);
      expect(parseResult.isValid).toBe(true);
      
      const evalResult = evaluator.evaluate(parseResult.ast!);
      expect(evalResult.success).toBe(true);
      expect(evalResult.result).toBe(n * (n + 1) * (2 * n + 1) / 6); // 5*6*11/6 = 55
    });
  });
});