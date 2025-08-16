import { describe, it, expect } from 'vitest';
import { GrammarParser } from '../grammar-parser.js';
import { MathEvaluator } from '../evaluator.js';

describe('Element-wise and Postfix Operators', () => {
  const parser = new GrammarParser();
  const evaluator = new MathEvaluator();

  describe('Element-wise operators', () => {
    it('should handle element-wise multiplication', () => {
      const expressions = [
        { expr: '[1, 2, 3] .* [4, 5, 6]', expected: [4, 10, 18] },
        { expr: '[2, 4] .* [3, 5]', expected: [6, 20] },
        { expr: '[1] .* [7]', expected: [7] },
      ];

      expressions.forEach(({ expr, expected }) => {
        const parseResult = parser.parse(expr);
        expect(parseResult.isValid).toBe(true);
        
        const evalResult = evaluator.evaluateAST(parseResult.ast!);
        expect(evalResult.success).toBe(true);
        expect(evalResult.result).toEqual(expected);
      });
    });

    it('should handle element-wise division', () => {
      const expressions = [
        { expr: '[8, 10, 12] ./ [2, 5, 3]', expected: [4, 2, 4] },
        { expr: '[1, 2, 3] ./ [4, 5, 6]', expected: [0.25, 0.4, 0.5] },
      ];

      expressions.forEach(({ expr, expected }) => {
        const parseResult = parser.parse(expr);
        expect(parseResult.isValid).toBe(true);
        
        const evalResult = evaluator.evaluateAST(parseResult.ast!);
        expect(evalResult.success).toBe(true);
        expect(evalResult.result).toEqual(expected);
      });
    });

    it('should handle element-wise power', () => {
      const expressions = [
        { expr: '[1, 2, 3] .^ [2, 2, 2]', expected: [1, 4, 9] },
        { expr: '[2, 3, 4] .^ [1, 2, 3]', expected: [2, 9, 64] },
      ];

      expressions.forEach(({ expr, expected }) => {
        const parseResult = parser.parse(expr);
        expect(parseResult.isValid).toBe(true);
        
        const evalResult = evaluator.evaluateAST(parseResult.ast!);
        expect(evalResult.success).toBe(true);
        expect(evalResult.result).toEqual(expected);
      });
    });

    it('should handle element-wise modulo', () => {
      const expressions = [
        { expr: '[5, 7, 9] .% [2, 3, 4]', expected: [1, 1, 1] },
        { expr: '[10, 15, 20] .% [3, 4, 6]', expected: [1, 3, 2] },
      ];

      expressions.forEach(({ expr, expected }) => {
        const parseResult = parser.parse(expr);
        expect(parseResult.isValid).toBe(true);
        
        const evalResult = evaluator.evaluateAST(parseResult.ast!);
        expect(evalResult.success).toBe(true);
        expect(evalResult.result).toEqual(expected);
      });
    });

    it('should handle array-scalar element-wise operations', () => {
      const expressions = [
        { expr: '[1, 2, 3] .* 2', expected: [2, 4, 6] },
        { expr: '[10, 20, 30] ./ 5', expected: [2, 4, 6] },
        { expr: '[1, 2, 3] .^ 2', expected: [1, 4, 9] },
        { expr: '[7, 8, 9] .% 3', expected: [1, 2, 0] },
      ];

      expressions.forEach(({ expr, expected }) => {
        const parseResult = parser.parse(expr);
        expect(parseResult.isValid).toBe(true);
        
        const evalResult = evaluator.evaluateAST(parseResult.ast!);
        expect(evalResult.success).toBe(true);
        expect(evalResult.result).toEqual(expected);
      });
    });

    it('should handle scalar-array element-wise operations', () => {
      const expressions = [
        { expr: '2 .* [1, 2, 3]', expected: [2, 4, 6] },
        { expr: '10 ./ [2, 5, 10]', expected: [5, 2, 1] },
        { expr: '2 .^ [1, 2, 3]', expected: [2, 4, 8] },
      ];

      expressions.forEach(({ expr, expected }) => {
        const parseResult = parser.parse(expr);
        expect(parseResult.isValid).toBe(true);
        
        const evalResult = evaluator.evaluateAST(parseResult.ast!);
        expect(evalResult.success).toBe(true);
        expect(evalResult.result).toEqual(expected);
      });
    });

    it('should handle scalar-scalar element-wise operations', () => {
      const expressions = [
        { expr: '5 .* 3', expected: 15 },
        { expr: '8 ./ 2', expected: 4 },
        { expr: '3 .^ 2', expected: 9 },
        { expr: '7 .% 3', expected: 1 },
      ];

      expressions.forEach(({ expr, expected }) => {
        const parseResult = parser.parse(expr);
        expect(parseResult.isValid).toBe(true);
        
        const evalResult = evaluator.evaluateAST(parseResult.ast!);
        expect(evalResult.success).toBe(true);
        expect(evalResult.result).toBe(expected);
      });
    });

    it('should throw error for mismatched array lengths', () => {
      const expressions = [
        '[1, 2] .* [4, 5, 6]',
        '[1, 2, 3, 4] ./ [2, 3]',
        '[1] .^ [2, 3]',
      ];

      expressions.forEach((expr) => {
        const parseResult = parser.parse(expr);
        expect(parseResult.isValid).toBe(true);
        
        const evalResult = evaluator.evaluateAST(parseResult.ast!);
        expect(evalResult.success).toBe(false);
        expect(evalResult.error).toContain('Array length mismatch');
      });
    });
  });

  describe('Regular array operations', () => {
    it('should handle regular array arithmetic', () => {
      const expressions = [
        { expr: '[1, 2, 3] + [4, 5, 6]', expected: [5, 7, 9] },
        { expr: '[10, 20, 30] - [1, 2, 3]', expected: [9, 18, 27] },
        { expr: '[1, 2, 3] * [2, 3, 4]', expected: [2, 6, 12] },
        { expr: '[8, 9, 12] / [2, 3, 4]', expected: [4, 3, 3] },
        { expr: '[7, 8, 9] % [3, 3, 4]', expected: [1, 2, 1] },
        { expr: '[2, 3, 4] ^ [1, 2, 2]', expected: [2, 9, 16] },
      ];

      expressions.forEach(({ expr, expected }) => {
        const parseResult = parser.parse(expr);
        expect(parseResult.isValid).toBe(true);
        
        const evalResult = evaluator.evaluateAST(parseResult.ast!);
        expect(evalResult.success).toBe(true);
        expect(evalResult.result).toEqual(expected);
      });
    });

    it('should handle array-scalar regular operations', () => {
      const expressions = [
        { expr: '[1, 2, 3] + 5', expected: [6, 7, 8] },
        { expr: '[10, 20, 30] - 5', expected: [5, 15, 25] },
        { expr: '[1, 2, 3] * 2', expected: [2, 4, 6] },
        { expr: '[8, 12, 16] / 4', expected: [2, 3, 4] },
        { expr: '[7, 8, 9] % 3', expected: [1, 2, 0] },
        { expr: '[2, 3, 4] ^ 2', expected: [4, 9, 16] },
      ];

      expressions.forEach(({ expr, expected }) => {
        const parseResult = parser.parse(expr);
        expect(parseResult.isValid).toBe(true);
        
        const evalResult = evaluator.evaluateAST(parseResult.ast!);
        expect(evalResult.success).toBe(true);
        expect(evalResult.result).toEqual(expected);
      });
    });
  });

  describe('Factorial postfix operator', () => {
    it('should handle basic factorial operations', () => {
      const expressions = [
        { expr: '0!', expected: 1 },
        { expr: '1!', expected: 1 },
        { expr: '5!', expected: 120 },
        { expr: '4!', expected: 24 },
        { expr: '6!', expected: 720 },
      ];

      expressions.forEach(({ expr, expected }) => {
        const parseResult = parser.parse(expr);
        expect(parseResult.isValid).toBe(true);
        
        const evalResult = evaluator.evaluateAST(parseResult.ast!);
        expect(evalResult.success).toBe(true);
        expect(evalResult.result).toBe(expected);
      });
    });

    it('should handle factorial in expressions', () => {
      const expressions = [
        { expr: '3! + 2!', expected: 8 },  // 6 + 2
        { expr: '5! / 4!', expected: 5 },  // 120 / 24
        { expr: '(3 + 2)!', expected: 120 }, // 5!
        { expr: '3! * 2!', expected: 12 }, // 6 * 2
      ];

      expressions.forEach(({ expr, expected }) => {
        const parseResult = parser.parse(expr);
        expect(parseResult.isValid).toBe(true);
        
        const evalResult = evaluator.evaluateAST(parseResult.ast!);
        expect(evalResult.success).toBe(true);
        expect(evalResult.result).toBe(expected);
      });
    });

    it('should handle prefix NOT operator', () => {
      const expressions = [
        { expr: '!true', expected: false },
        { expr: '!false', expected: true },
        { expr: '!(1 == 1)', expected: false },
        { expr: '!(1 == 2)', expected: true },
      ];

      expressions.forEach(({ expr, expected }) => {
        const parseResult = parser.parse(expr);
        expect(parseResult.isValid).toBe(true);
        
        const evalResult = evaluator.evaluateAST(parseResult.ast!);
        expect(evalResult.success).toBe(true);
        expect(evalResult.result).toBe(expected);
      });
    });

    it('should throw error for invalid factorial inputs', () => {
      const expressions = [
        '(-1)!',    // negative number
        '3.5!',     // non-integer
      ];

      expressions.forEach((expr) => {
        const parseResult = parser.parse(expr);
        expect(parseResult.isValid).toBe(true);
        
        const evalResult = evaluator.evaluateAST(parseResult.ast!);
        expect(evalResult.success).toBe(false);
        expect(evalResult.error).toContain('Factorial requires a non-negative integer');
      });
    });
  });

  describe('Mixed operations', () => {
    it('should handle combinations of element-wise and regular operations', () => {
      const expressions = [
        { expr: '[1, 2] * [3, 4] + [5, 6]', expected: [8, 14] }, // [3,8] + [5,6] = [8,14]
        { expr: '[1, 2] .* [3, 4] + [5, 6]', expected: [8, 14] }, // [3,8] + [5,6] = [8,14]
        { expr: '2! * [1, 2, 3]', expected: [2, 4, 6] }, // 2 * [1,2,3]
        { expr: '3! + [1, 2, 3]', expected: [7, 8, 9] }, // 6 + [1,2,3] = [7,8,9]
      ];

      expressions.forEach(({ expr, expected }) => {
        const parseResult = parser.parse(expr);
        expect(parseResult.isValid).toBe(true);
        
        const evalResult = evaluator.evaluateAST(parseResult.ast!);
        expect(evalResult.success).toBe(true);
        expect(evalResult.result).toEqual(expected);
      });
    });
  });
});