import { describe, it, expect } from 'vitest';
import { GrammarParser } from '../grammar-parser.js';
import { MathEvaluator } from '../evaluator.js';

describe('Statistical Functions', () => {
  const parser = new GrammarParser();
  const evaluator = new MathEvaluator();

  const testExpression = (expr: string, expected: number, tolerance = 1e-10) => {
    const parseResult = parser.parse(expr);
    expect(parseResult.isValid).toBe(true);
    
    const evalResult = evaluator.evaluate(parseResult.ast!);
    expect(evalResult.success).toBe(true);
    expect(Math.abs(evalResult.result - expected)).toBeLessThan(tolerance);
  };

  describe('min function', () => {
    it('should handle array syntax', () => {
      testExpression('min([10, 5, 8, 3, 12])', 3);
      testExpression('min([1])', 1);
      testExpression('min([-5, -1, -10])', -10);
    });

    it('should handle multiple argument syntax', () => {
      testExpression('min(10, 5, 8, 3, 12)', 3);
      testExpression('min(1)', 1);
      testExpression('min(-5, -1, -10)', -10);
    });

    it('should handle mixed positive and negative numbers', () => {
      testExpression('min([-2, 5, -8, 3])', -8);
    });

    it('should throw error for empty arguments', () => {
      const parseResult = parser.parse('min([])');
      expect(parseResult.isValid).toBe(true);
      
      const evalResult = evaluator.evaluate(parseResult.ast!);
      expect(evalResult.success).toBe(false);
      expect(evalResult.error).toContain('min function requires at least one argument');
    });
  });

  describe('max function', () => {
    it('should handle array syntax', () => {
      testExpression('max([10, 5, 8, 3, 12])', 12);
      testExpression('max([1])', 1);
      testExpression('max([-5, -1, -10])', -1);
    });

    it('should handle multiple argument syntax', () => {
      testExpression('max(10, 5, 8, 3, 12)', 12);
      testExpression('max(1)', 1);
      testExpression('max(-5, -1, -10)', -1);
    });

    it('should handle mixed positive and negative numbers', () => {
      testExpression('max([-2, 5, -8, 3])', 5);
    });

    it('should throw error for empty arguments', () => {
      const parseResult = parser.parse('max([])');
      expect(parseResult.isValid).toBe(true);
      
      const evalResult = evaluator.evaluate(parseResult.ast!);
      expect(evalResult.success).toBe(false);
      expect(evalResult.error).toContain('max function requires at least one argument');
    });
  });

  describe('mean function', () => {
    it('should calculate arithmetic mean correctly', () => {
      testExpression('mean([1, 2, 3, 4, 5])', 3);
      testExpression('mean([10, 20, 30])', 20);
      testExpression('mean([1])', 1);
      testExpression('mean([2, 4, 6, 8])', 5);
    });

    it('should handle negative numbers', () => {
      testExpression('mean([-1, 0, 1])', 0);
      testExpression('mean([-5, -10, -15])', -10);
    });

    it('should handle decimal values', () => {
      testExpression('mean([1.5, 2.5, 3.5])', 2.5);
    });

    it('should throw error for empty arguments', () => {
      const parseResult = parser.parse('mean([])');
      expect(parseResult.isValid).toBe(true);
      
      const evalResult = evaluator.evaluate(parseResult.ast!);
      expect(evalResult.success).toBe(false);
      expect(evalResult.error).toContain('mean function requires at least one argument');
    });
  });

  describe('median function', () => {
    it('should calculate median for odd number of elements', () => {
      testExpression('median([1, 2, 3, 4, 5])', 3);
      testExpression('median([1])', 1);
      testExpression('median([5, 1, 3, 2, 4])', 3); // Should sort first
    });

    it('should calculate median for even number of elements', () => {
      testExpression('median([1, 2, 3, 4])', 2.5);
      testExpression('median([10, 20])', 15);
      testExpression('median([2, 8, 4, 6])', 5); // (4 + 6) / 2
    });

    it('should handle negative numbers', () => {
      testExpression('median([-3, -1, -2])', -2);
      testExpression('median([-4, -2, -6, -8])', -5); // (-4 + -6) / 2
    });

    it('should throw error for empty arguments', () => {
      const parseResult = parser.parse('median([])');
      expect(parseResult.isValid).toBe(true);
      
      const evalResult = evaluator.evaluate(parseResult.ast!);
      expect(evalResult.success).toBe(false);
      expect(evalResult.error).toContain('median function requires at least one argument');
    });
  });

  describe('variance function', () => {
    it('should calculate sample variance correctly', () => {
      testExpression('var([1, 2, 3, 4, 5])', 2.5); // Known value for this dataset
      testExpression('var([10, 10, 10])', 0); // No variation
    });

    it('should handle single value (variance = 0)', () => {
      testExpression('var([5])', 0);
    });

    it('should handle negative numbers', () => {
      testExpression('var([-1, 0, 1])', 1); // variance of [-1, 0, 1]
    });

    it('should throw error for empty arguments', () => {
      const parseResult = parser.parse('var([])');
      expect(parseResult.isValid).toBe(true);
      
      const evalResult = evaluator.evaluate(parseResult.ast!);
      expect(evalResult.success).toBe(false);
      expect(evalResult.error).toContain('variance function requires at least one argument');
    });
  });

  describe('standard deviation function', () => {
    it('should calculate standard deviation correctly', () => {
      testExpression('std([1, 2, 3, 4, 5])', Math.sqrt(2.5));
      testExpression('std([10, 10, 10])', 0); // No variation
    });

    it('should handle single value (std = 0)', () => {
      testExpression('std([5])', 0);
    });

    it('should be square root of variance', () => {
      // Test that std([1, 3, 5])^2 equals var([1, 3, 5])
      const testData = '[1, 3, 5]';
      
      const stdResult = parser.parse(`std(${testData})`);
      const varResult = parser.parse(`var(${testData})`);
      
      expect(stdResult.isValid).toBe(true);
      expect(varResult.isValid).toBe(true);
      
      const stdEval = evaluator.evaluate(stdResult.ast!);
      const varEval = evaluator.evaluate(varResult.ast!);
      
      expect(stdEval.success).toBe(true);
      expect(varEval.success).toBe(true);
      
      const stdSquared = Math.pow(stdEval.result, 2);
      expect(Math.abs(stdSquared - varEval.result)).toBeLessThan(1e-10);
    });

    it('should throw error for empty arguments', () => {
      const parseResult = parser.parse('std([])');
      expect(parseResult.isValid).toBe(true);
      
      const evalResult = evaluator.evaluate(parseResult.ast!);
      expect(evalResult.success).toBe(false);
      expect(evalResult.error).toContain('variance function requires at least one argument');
    });
  });

  describe('gamma function', () => {
    it('should calculate gamma for integer values', () => {
      testExpression('gamma(1)', 1, 1e-6); // gamma(1) = 0! = 1
      testExpression('gamma(2)', 1, 1e-6); // gamma(2) = 1! = 1
      testExpression('gamma(3)', 2, 1e-6); // gamma(3) = 2! = 2
      testExpression('gamma(4)', 6, 1e-6); // gamma(4) = 3! = 6
      testExpression('gamma(5)', 24, 1e-6); // gamma(5) = 4! = 24
    });

    it('should handle fractional values', () => {
      // gamma(0.5) = sqrt(π) ≈ 1.7725
      testExpression('gamma(0.5)', Math.sqrt(Math.PI), 1e-6);
      
      // gamma(1.5) = 0.5 * sqrt(π) ≈ 0.8862
      testExpression('gamma(1.5)', 0.5 * Math.sqrt(Math.PI), 1e-6);
    });

    it('should handle edge cases', () => {
      // gamma(0) should be infinity
      const parseResult = parser.parse('gamma(0)');
      expect(parseResult.isValid).toBe(true);
      
      const evalResult = evaluator.evaluate(parseResult.ast!);
      expect(evalResult.success).toBe(true);
      expect(evalResult.result).toBe(Infinity);
    });

    it('should throw error for non-numeric input', () => {
      const parseResult = parser.parse('gamma("hello")');
      expect(parseResult.isValid).toBe(true);
      
      const evalResult = evaluator.evaluate(parseResult.ast!);
      expect(evalResult.success).toBe(false);
      expect(evalResult.error).toContain('gamma function requires a numeric argument');
    });
  });

  describe('mixed statistical operations', () => {
    it('should work in complex expressions', () => {
      testExpression('mean([1, 2, 3]) + std([1, 2, 3])', 2 + 1); // mean=2, std=1
      testExpression('max([1, 5, 3]) - min([1, 5, 3])', 4); // 5 - 1 = 4
      testExpression('gamma(3) * mean([2, 4])', 2 * 3); // 2 * 3 = 6
    });

    it('should handle nested arrays', () => {
      // This tests the flattening functionality
      testExpression('mean([[1, 2], [3, 4]])', 2.5); // (1+2+3+4)/4 = 2.5
      testExpression('max([[1, 5], [2, 8]])', 8); // max of all flattened values
      testExpression('min([[10, 3], [7, 1]])', 1); // min of all flattened values
      testExpression('sum([[1, 2], [3, 4]])', 10); // sum of all flattened values
    });
  });
});