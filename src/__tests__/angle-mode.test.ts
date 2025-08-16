import { describe, it, expect } from 'vitest';
import { MathEvaluator } from '../evaluator.js';
import { GrammarParser } from '../grammar-parser.js';

describe('Angle Mode Configuration', () => {
  const parser = new GrammarParser();

  describe('Radians Mode (default)', () => {
    const evaluator = new MathEvaluator({ angleMode: 'radians' });

    it('should work with trigonometric functions in radians', () => {
      const testCases = [
        { expr: 'sin(0)', expected: 0 },
        { expr: 'cos(0)', expected: 1 },
        { expr: 'sin(pi/2)', expected: 1 },
        { expr: 'cos(pi)', expected: -1 },
        { expr: 'tan(pi/4)', expected: 1 },
      ];

      testCases.forEach(({ expr, expected }) => {
        const parseResult = parser.parse(expr);
        expect(parseResult.isValid).toBe(true);
        
        const evalResult = evaluator.evaluateAST(parseResult.ast!);
        expect(evalResult.success).toBe(true);
        expect(evalResult.result).toBeCloseTo(expected, 10);
      });
    });

    it('should return results in radians for inverse trigonometric functions', () => {
      const testCases = [
        { expr: 'asin(1)', expected: Math.PI / 2 },
        { expr: 'acos(0)', expected: Math.PI / 2 },
        { expr: 'atan(1)', expected: Math.PI / 4 },
        { expr: 'atan2(1, 1)', expected: Math.PI / 4 },
      ];

      testCases.forEach(({ expr, expected }) => {
        const parseResult = parser.parse(expr);
        expect(parseResult.isValid).toBe(true);
        
        const evalResult = evaluator.evaluateAST(parseResult.ast!);
        expect(evalResult.success).toBe(true);
        expect(evalResult.result).toBeCloseTo(expected, 10);
      });
    });
  });

  describe('Degrees Mode', () => {
    const evaluator = new MathEvaluator({ angleMode: 'degrees' });

    it('should work with trigonometric functions in degrees', () => {
      const testCases = [
        { expr: 'sin(0)', expected: 0 },
        { expr: 'cos(0)', expected: 1 },
        { expr: 'sin(90)', expected: 1 },
        { expr: 'cos(180)', expected: -1 },
        { expr: 'tan(45)', expected: 1 },
        { expr: 'sin(30)', expected: 0.5 },
        { expr: 'cos(60)', expected: 0.5 },
      ];

      testCases.forEach(({ expr, expected }) => {
        const parseResult = parser.parse(expr);
        expect(parseResult.isValid).toBe(true);
        
        const evalResult = evaluator.evaluateAST(parseResult.ast!);
        expect(evalResult.success).toBe(true);
        expect(evalResult.result).toBeCloseTo(expected, 10);
      });
    });

    it('should return results in degrees for inverse trigonometric functions', () => {
      const testCases = [
        { expr: 'asin(1)', expected: 90 },
        { expr: 'acos(0)', expected: 90 },
        { expr: 'atan(1)', expected: 45 },
        { expr: 'atan2(1, 1)', expected: 45 },
        { expr: 'asin(0.5)', expected: 30 },
        { expr: 'acos(0.5)', expected: 60 },
      ];

      testCases.forEach(({ expr, expected }) => {
        const parseResult = parser.parse(expr);
        expect(parseResult.isValid).toBe(true);
        
        const evalResult = evaluator.evaluateAST(parseResult.ast!);
        expect(evalResult.success).toBe(true);
        expect(evalResult.result).toBeCloseTo(expected, 10);
      });
    });
  });

  describe('Hyperbolic Functions', () => {
    it('should not be affected by angle mode (radians evaluator)', () => {
      const evaluator = new MathEvaluator({ angleMode: 'radians' });
      
      const testCases = [
        { expr: 'sinh(0)', expected: 0 },
        { expr: 'cosh(0)', expected: 1 },
        { expr: 'tanh(0)', expected: 0 },
        { expr: 'asinh(0)', expected: 0 },
        { expr: 'acosh(1)', expected: 0 },
        { expr: 'atanh(0)', expected: 0 },
      ];

      testCases.forEach(({ expr, expected }) => {
        const parseResult = parser.parse(expr);
        expect(parseResult.isValid).toBe(true);
        
        const evalResult = evaluator.evaluateAST(parseResult.ast!);
        expect(evalResult.success).toBe(true);
        expect(evalResult.result).toBeCloseTo(expected, 10);
      });
    });

    it('should not be affected by angle mode (degrees evaluator)', () => {
      const evaluator = new MathEvaluator({ angleMode: 'degrees' });
      
      const testCases = [
        { expr: 'sinh(0)', expected: 0 },
        { expr: 'cosh(0)', expected: 1 },
        { expr: 'tanh(0)', expected: 0 },
        { expr: 'asinh(0)', expected: 0 },
        { expr: 'acosh(1)', expected: 0 },
        { expr: 'atanh(0)', expected: 0 },
      ];

      testCases.forEach(({ expr, expected }) => {
        const parseResult = parser.parse(expr);
        expect(parseResult.isValid).toBe(true);
        
        const evalResult = evaluator.evaluateAST(parseResult.ast!);
        expect(evalResult.success).toBe(true);
        expect(evalResult.result).toBeCloseTo(expected, 10);
      });
    });
  });

  describe('Complex Expressions', () => {
    it('should work with complex trigonometric expressions in degrees', () => {
      const evaluator = new MathEvaluator({ angleMode: 'degrees' });
      
      const testCases = [
        { expr: 'sin(90) + cos(0)', expected: 2 },
        { expr: 'sin(30) * 2', expected: 1 },
        { expr: 'sqrt(sin(90)^2 + cos(90)^2)', expected: 1 }, // Pythagorean identity
        { expr: 'atan(tan(45))', expected: 45 }, // Should be identity
      ];

      testCases.forEach(({ expr, expected }) => {
        const parseResult = parser.parse(expr);
        expect(parseResult.isValid).toBe(true);
        
        const evalResult = evaluator.evaluateAST(parseResult.ast!);
        expect(evalResult.success).toBe(true);
        expect(evalResult.result).toBeCloseTo(expected, 10);
      });
    });

    it('should work with complex trigonometric expressions in radians', () => {
      const evaluator = new MathEvaluator({ angleMode: 'radians' });
      
      const testCases = [
        { expr: 'sin(pi/2) + cos(0)', expected: 2 },
        { expr: 'sin(pi/6) * 2', expected: 1 },
        { expr: 'sqrt(sin(pi/2)^2 + cos(pi/2)^2)', expected: 1 }, // Pythagorean identity
        { expr: 'atan(tan(pi/4))', expected: Math.PI / 4 }, // Should be identity
      ];

      testCases.forEach(({ expr, expected }) => {
        const parseResult = parser.parse(expr);
        expect(parseResult.isValid).toBe(true);
        
        const evalResult = evaluator.evaluateAST(parseResult.ast!);
        expect(evalResult.success).toBe(true);
        expect(evalResult.result).toBeCloseTo(expected, 10);
      });
    });
  });

  describe('Default Configuration', () => {
    it('should default to radians mode when no angle mode is specified', () => {
      const evaluator = new MathEvaluator();
      
      const parseResult = parser.parse('sin(pi/2)');
      expect(parseResult.isValid).toBe(true);
      
      const evalResult = evaluator.evaluateAST(parseResult.ast!);
      expect(evalResult.success).toBe(true);
      expect(evalResult.result).toBeCloseTo(1, 10);
    });
  });
});