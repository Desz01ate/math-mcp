import { describe, it, expect } from 'vitest';
import { GrammarParser } from '../grammar-parser.js';
import { MathEvaluator } from '../evaluator.js';
import { PrecisionMath } from '../precision.js';

describe('Precision Handling', () => {
  const parser = new GrammarParser();
  const evaluator = new MathEvaluator();

  describe('Classic JavaScript Floating-Point Issues', () => {
    it('should handle 0.1 + 0.2 = 0.3 exactly', () => {
      const parseResult = parser.parse('0.1 + 0.2');
      expect(parseResult.isValid).toBe(true);
      
      const evalResult = evaluator.evaluate(parseResult.ast!);
      expect(evalResult.success).toBe(true);
      expect(evalResult.result).toBe(0.3);
      expect(evalResult.result).not.toBe(0.30000000000000004); // Native JS result
    });

    it('should handle 0.3 - 0.1 = 0.2 exactly', () => {
      const parseResult = parser.parse('0.3 - 0.1');
      expect(parseResult.isValid).toBe(true);
      
      const evalResult = evaluator.evaluate(parseResult.ast!);
      expect(evalResult.success).toBe(true);
      expect(evalResult.result).toBe(0.2);
      expect(evalResult.result).not.toBe(0.19999999999999998); // Native JS result
    });

    it('should handle 1.4 * 3 = 4.2 exactly', () => {
      const parseResult = parser.parse('1.4 * 3');
      expect(parseResult.isValid).toBe(true);
      
      const evalResult = evaluator.evaluate(parseResult.ast!);
      expect(evalResult.success).toBe(true);
      expect(evalResult.result).toBe(4.2);
      expect(evalResult.result).not.toBe(4.199999999999999); // Native JS result
    });

    it('should handle 0.57 * 100 = 57 exactly', () => {
      const parseResult = parser.parse('0.57 * 100');
      expect(parseResult.isValid).toBe(true);
      
      const evalResult = evaluator.evaluate(parseResult.ast!);
      expect(evalResult.success).toBe(true);
      expect(evalResult.result).toBe(57);
      expect(evalResult.result).not.toBe(56.99999999999999); // Native JS result
    });
  });

  describe('Mathematical Function Precision', () => {
    it('should handle sqrt(2) * sqrt(2) = 2 exactly', () => {
      const parseResult = parser.parse('sqrt(2) * sqrt(2)');
      expect(parseResult.isValid).toBe(true);
      
      const evalResult = evaluator.evaluate(parseResult.ast!);
      expect(evalResult.success).toBe(true);
      expect(evalResult.result).toBe(2);
      expect(evalResult.result).not.toBe(2.0000000000000004); // Native JS result
    });

    it('should handle 1/3 * 3 with high precision', () => {
      const parseResult = parser.parse('1 / 3 * 3');
      expect(parseResult.isValid).toBe(true);
      
      const evalResult = evaluator.evaluate(parseResult.ast!);
      expect(evalResult.success).toBe(true);
      // Should be very close to 1, better than native JS precision
      expect(Math.abs(evalResult.result - 1)).toBeLessThan(1e-15);
    });

    it('should handle trigonometric identities with high precision', () => {
      evaluator.setVariable('x', 0.5);
      
      const expressions = [
        { expr: 'sin(x)^2 + cos(x)^2', expected: 1, description: 'sin²x + cos²x = 1' },
        { expr: 'tan(x)', expected: Math.tan(0.5), description: 'tan(x) precision' },
      ];

      expressions.forEach(({ expr, expected, description }) => {
        const parseResult = parser.parse(expr);
        expect(parseResult.isValid).toBe(true);
        
        const evalResult = evaluator.evaluate(parseResult.ast!);
        expect(evalResult.success).toBe(true);
        expect(Math.abs(evalResult.result - expected)).toBeLessThan(1e-15);
      });
    });
  });

  describe('High-Precision Constants', () => {
    it('should provide high-precision mathematical constants', () => {
      const constants = [
        { name: 'pi', expected: Math.PI },
        { name: 'e', expected: Math.E },
        { name: 'tau', expected: 2 * Math.PI },
        { name: 'phi', expected: (1 + Math.sqrt(5)) / 2 },
      ];

      constants.forEach(({ name, expected }) => {
        const parseResult = parser.parse(name);
        expect(parseResult.isValid).toBe(true);
        
        const evalResult = evaluator.evaluate(parseResult.ast!);
        expect(evalResult.success).toBe(true);
        // Our constants should be at least as precise as native JS constants
        expect(Math.abs(evalResult.result - expected)).toBeLessThan(1e-15);
      });
    });

    it('should handle calculations with pi more precisely', () => {
      const parseResult = parser.parse('sin(pi)');
      expect(parseResult.isValid).toBe(true);
      
      const evalResult = evaluator.evaluate(parseResult.ast!);
      expect(evalResult.success).toBe(true);
      // sin(π) should be very close to 0
      expect(Math.abs(evalResult.result)).toBeLessThan(1e-15);
    });
  });

  describe('Comparison Operations with Precision', () => {
    it('should handle equality comparisons with precision awareness', () => {
      // Set up variables that would fail with native JS precision
      evaluator.setVariable('a', 0.1);
      evaluator.setVariable('b', 0.2);
      evaluator.setVariable('c', 0.3);
      
      const parseResult = parser.parse('a + b == c');
      expect(parseResult.isValid).toBe(true);
      
      const evalResult = evaluator.evaluate(parseResult.ast!);
      expect(evalResult.success).toBe(true);
      expect(evalResult.result).toBe(true); // Should be true with precision handling
    });

    it('should handle inequality comparisons accurately', () => {
      const expressions = [
        { expr: '0.1 + 0.2 < 0.31', expected: true },
        { expr: '0.1 + 0.2 > 0.29', expected: true },
        { expr: '0.1 + 0.2 <= 0.3', expected: true },
        { expr: '0.1 + 0.2 >= 0.3', expected: true },
      ];

      expressions.forEach(({ expr, expected }) => {
        const parseResult = parser.parse(expr);
        expect(parseResult.isValid).toBe(true);
        
        const evalResult = evaluator.evaluate(parseResult.ast!);
        expect(evalResult.success).toBe(true);
        expect(evalResult.result).toBe(expected);
      });
    });
  });

  describe('Array Operations with Precision', () => {
    it('should handle element-wise operations with precision', () => {
      const parseResult = parser.parse('[0.1, 0.2, 0.3] .* [3, 5, 2]');
      expect(parseResult.isValid).toBe(true);
      
      const evalResult = evaluator.evaluate(parseResult.ast!);
      expect(evalResult.success).toBe(true);
      expect(evalResult.result).toEqual([0.3, 1.0, 0.6]);
      // Verify these are exact, not approximations
      expect(evalResult.result[0]).toBe(0.3);
      expect(evalResult.result[1]).toBe(1.0);
      expect(evalResult.result[2]).toBe(0.6);
    });
  });

  describe('Financial Calculations', () => {
    it('should handle currency calculations precisely', () => {
      // Common financial calculation scenarios
      const expressions = [
        { expr: '19.99 + 0.01', expected: 20.00, description: 'Price + tax' },
        { expr: '100.00 - 99.99', expected: 0.01, description: 'Change calculation' },
        { expr: '0.07 * 100', expected: 7, description: 'Percentage calculation' },
        { expr: '1000.00 / 3', expected: 333.3333333333333333, description: 'Division with repeating decimal' },
      ];

      expressions.forEach(({ expr, expected, description }) => {
        const parseResult = parser.parse(expr);
        expect(parseResult.isValid).toBe(true);
        
        const evalResult = evaluator.evaluate(parseResult.ast!);
        expect(evalResult.success).toBe(true);
        
        if (typeof expected === 'number' && Number.isInteger(expected)) {
          expect(evalResult.result).toBe(expected);
        } else {
          expect(Math.abs(evalResult.result - expected)).toBeLessThan(1e-15);
        }
      });
    });
  });

  describe('Scientific Calculations', () => {
    it('should handle very small numbers precisely', () => {
      const parseResult = parser.parse('1e-15 + 1e-16');
      expect(parseResult.isValid).toBe(true);
      
      const evalResult = evaluator.evaluate(parseResult.ast!);
      expect(evalResult.success).toBe(true);
      expect(evalResult.result).toBe(1.1e-15);
    });

    it('should handle very large numbers within safe integer range', () => {
      const parseResult = parser.parse('9007199254740990 + 1');
      expect(parseResult.isValid).toBe(true);
      
      const evalResult = evaluator.evaluate(parseResult.ast!);
      expect(evalResult.success).toBe(true);
      expect(evalResult.result).toBe(9007199254740991);
    });
  });

  describe('PrecisionMath Utility Functions', () => {
    it('should detect precision issues correctly', () => {
      // Use a case that creates a larger precision issue
      const nativeResult = 1.4 * 3; // 4.199999999999999
      const expected = 4.2;
      
      expect(PrecisionMath.hasPrecisionIssue(nativeResult, expected)).toBe(true);
      expect(PrecisionMath.hasPrecisionIssue(0.3, 0.3)).toBe(false);
    });

    it('should provide accurate comparison functions', () => {
      expect(PrecisionMath.equals(0.1 + 0.2, 0.3)).toBe(true);
      expect(PrecisionMath.lessThan(0.1, 0.2)).toBe(true);
      expect(PrecisionMath.greaterThan(0.3, 0.2)).toBe(true);
      expect(PrecisionMath.lessThanOrEqual(0.3, 0.3)).toBe(true);
      expect(PrecisionMath.greaterThanOrEqual(0.3, 0.3)).toBe(true);
    });

    it('should provide high-precision constants', () => {
      expect(typeof PrecisionMath.PI).toBe('number');
      expect(typeof PrecisionMath.E).toBe('number');
      expect(typeof PrecisionMath.TAU).toBe('number');
      expect(typeof PrecisionMath.PHI).toBe('number');
      
      // Constants should be at least as precise as native JS
      expect(Math.abs(PrecisionMath.PI - Math.PI)).toBeLessThan(1e-15);
      expect(Math.abs(PrecisionMath.E - Math.E)).toBeLessThan(1e-15);
    });
  });

  describe('Angle Mode Precision', () => {
    it('should handle degree conversions with high precision', () => {
      const degreesEvaluator = new MathEvaluator({ angleMode: 'degrees' });
      
      const parseResult = parser.parse('sin(90)');
      expect(parseResult.isValid).toBe(true);
      
      const evalResult = degreesEvaluator.evaluate(parseResult.ast!);
      expect(evalResult.success).toBe(true);
      expect(Math.abs(evalResult.result - 1)).toBeLessThan(1e-15);
    });

    it('should handle radian calculations with high precision', () => {
      const parseResult = parser.parse('cos(pi/2)');
      expect(parseResult.isValid).toBe(true);
      
      const evalResult = evaluator.evaluate(parseResult.ast!);
      expect(evalResult.success).toBe(true);
      expect(Math.abs(evalResult.result)).toBeLessThan(1e-15); // Should be very close to 0
    });
  });
});