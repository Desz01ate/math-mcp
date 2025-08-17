import { describe, it, expect } from 'vitest';
import { GrammarParser } from '../grammar-parser.js';
import { MathEvaluator } from '../evaluator.js';

describe('Parser + Evaluator Integration', () => {
  const parser = new GrammarParser();
  const evaluator = new MathEvaluator();

  describe('End-to-End Expression Evaluation', () => {
    it('should parse and evaluate basic arithmetic', () => {
      const expression = '2 + 3 * 4';
      
      // Parse
      const parseResult = parser.parse(expression);
      expect(parseResult.isValid).toBe(true);
      
      // Evaluate using AST
      const evalResult = evaluator.evaluate(parseResult.ast!);
      expect(evalResult.success).toBe(true);
      expect(evalResult.result).toBe(14);
      
    });

    it('should handle precedence correctly', () => {
      const expressions = [
        { expr: '2 + 3 * 4', expected: 14 },
        { expr: '(2 + 3) * 4', expected: 20 },
        { expr: '2 * 3 ^ 2', expected: 18 },
        { expr: '(2 * 3) ^ 2', expected: 36 },
        { expr: '2 ^ 3 ^ 2', expected: 512 }, // Right associative: 2^(3^2) = 2^9
      ];

      expressions.forEach(({ expr, expected }) => {
        const parseResult = parser.parse(expr);
        expect(parseResult.isValid).toBe(true);
        
        const evalResult = evaluator.evaluate(parseResult.ast!);
        expect(evalResult.success).toBe(true);
        expect(evalResult.result).toBe(expected);
      });
    });

    it('should parse and evaluate function calls', () => {
      const expressions = [
        { expr: 'sqrt(16)', expected: 4 },
        { expr: 'abs(-5)', expected: 5 },
        { expr: 'min(3, 1, 4)', expected: 1 },
        { expr: 'max(3, 1, 4)', expected: 4 },
        { expr: 'factorial(5)', expected: 120 },
      ];

      expressions.forEach(({ expr, expected }) => {
        const parseResult = parser.parse(expr);
        expect(parseResult.isValid).toBe(true);
        
        const evalResult = evaluator.evaluate(parseResult.ast!);
        expect(evalResult.success).toBe(true);
        expect(evalResult.result).toBe(expected);
      });
    });

    it('should handle trigonometric functions with constants', () => {
      const expressions = [
        { expr: 'sin(pi/2)', expected: 1 },
        { expr: 'cos(0)', expected: 1 },
        { expr: 'log(e)', expected: 1 },
      ];

      expressions.forEach(({ expr, expected }) => {
        const parseResult = parser.parse(expr);
        expect(parseResult.isValid).toBe(true);
        
        const evalResult = evaluator.evaluate(parseResult.ast!);
        expect(evalResult.success).toBe(true);
        expect(Math.abs(evalResult.result - expected)).toBeLessThan(1e-10);
      });
    });

    it('should handle unary operations', () => {
      const expressions = [
        { expr: '-5', expected: -5 },
        { expr: '+3', expected: 3 },
        { expr: '-(2 + 3)', expected: -5 },
        { expr: 'not true', expected: false },
        { expr: '!false', expected: true },
      ];

      expressions.forEach(({ expr, expected }) => {
        const parseResult = parser.parse(expr);
        expect(parseResult.isValid).toBe(true);
        
        const evalResult = evaluator.evaluate(parseResult.ast!);
        expect(evalResult.success).toBe(true);
        expect(evalResult.result).toBe(expected);
      });
    });

    it('should handle arrays', () => {
      const parseResult = parser.parse('[1, 2, 3, 4]');
      expect(parseResult.isValid).toBe(true);
      
      const evalResult = evaluator.evaluate(parseResult.ast!);
      expect(evalResult.success).toBe(true);
      expect(evalResult.result).toEqual([1, 2, 3, 4]);
    });

    it('should handle nested expressions', () => {
      const expression = 'sqrt(sin(pi/2)^2 + cos(0)^2)';
      
      const parseResult = parser.parse(expression);
      expect(parseResult.isValid).toBe(true);
      
      const evalResult = evaluator.evaluate(parseResult.ast!);
      expect(evalResult.success).toBe(true);
      expect(Math.abs(evalResult.result - Math.sqrt(2))).toBeLessThan(1e-10);
    });
  });

  describe('Variable Management', () => {
    it('should handle variable assignments and usage', () => {
      // Set variable using assignment expression
      const assignResult = parser.parse('x = 5');
      expect(assignResult.isValid).toBe(true);
      
      const assignEval = evaluator.evaluate(assignResult.ast!);
      expect(assignEval.success).toBe(true);
      expect(assignEval.result).toBe(5);
      
      // Use variable in expression
      const useResult = parser.parse('x + 3');
      expect(useResult.isValid).toBe(true);
      
      const useEval = evaluator.evaluate(useResult.ast!);
      expect(useEval.success).toBe(true);
      expect(useEval.result).toBe(8);
    });

    it('should handle multiple statements', () => {
      const multiStatement = 'x = 5; y = 10; x + y';
      
      const parseResult = parser.parse(multiStatement);
      expect(parseResult.isValid).toBe(true);
      expect(parseResult.ast?.children).toHaveLength(3);
      
      // Evaluate each statement
      const statements = parseResult.ast!.children!;
      
      // x = 5
      const result1 = evaluator.evaluate(statements[0]);
      expect(result1.success).toBe(true);
      expect(result1.result).toBe(5);
      
      // y = 10
      const result2 = evaluator.evaluate(statements[1]);
      expect(result2.success).toBe(true);
      expect(result2.result).toBe(10);
      
      // x + y
      const result3 = evaluator.evaluate(statements[2]);
      expect(result3.success).toBe(true);
      expect(result3.result).toBe(15);
    });
  });

  describe('Error Handling Integration', () => {
    it('should detect parse errors before evaluation', () => {
      const invalidExpressions = [
        '2 +',
        'sin(',
        '((2 + 3)',
        '[1, 2,',
      ];

      invalidExpressions.forEach(expr => {
        const parseResult = parser.parse(expr);
        expect(parseResult.isValid).toBe(false);
        expect(parseResult.errors.length).toBeGreaterThan(0);
        
        // Should not attempt evaluation of invalid parse
        expect(parseResult.ast).toBeUndefined();
      });
    });

    it('should handle evaluation errors for valid syntax', () => {
      // These should parse successfully but fail evaluation
      const expressions = [
        'undefined_variable',  // Undefined variable
        'unknown_function()',  // Unknown function
      ];

      expressions.forEach(expr => {
        const parseResult = parser.parse(expr);
        expect(parseResult.isValid).toBe(true);
        
        const evalResult = evaluator.evaluate(parseResult.ast!);
        expect(evalResult.success).toBe(false);
        expect(evalResult.error).toBeDefined();
      });
    });

    it('should handle division by zero', () => {
      const parseResult = parser.parse('5 / 0');
      expect(parseResult.isValid).toBe(true);
      
      const evalResult = evaluator.evaluate(parseResult.ast!);
      expect(evalResult.success).toBe(true);
      expect(evalResult.result).toBe(Infinity);
    });

    it('should handle domain errors in math functions', () => {
      const expressions = [
        'sqrt(-1)',     // Should work (NaN)
        'log(-1)',      // Should work (NaN)
        'asin(2)',      // Should work (NaN)
      ];

      expressions.forEach(expr => {
        const parseResult = parser.parse(expr);
        expect(parseResult.isValid).toBe(true);
        
        const evalResult = evaluator.evaluate(parseResult.ast!);
        expect(evalResult.success).toBe(true);
        expect(isNaN(evalResult.result)).toBe(true);
      });
    });
  });

  describe('Security Integration', () => {

    it('should restrict function access', () => {
      // Try to call a function not in the allowed list
      // @ts-ignore
      evaluator.config.allowedFunctions = ['sqrt']; // Restrict to only sqrt
      
      const parseResult = parser.parse('sin(0)');
      expect(parseResult.isValid).toBe(true);
      
      const evalResult = evaluator.evaluate(parseResult.ast!);
      expect(evalResult.success).toBe(false);
      expect(evalResult.error).toContain('not allowed');
    });
  });

  describe('Complex Real-world Scenarios', () => {
    it('should handle statistical calculation', () => {
      const expression = 'sqrt((1 + 4 + 9 + 16 + 25) / 5)'; // RMS of 1,2,3,4,5
      
      const parseResult = parser.parse(expression);
      expect(parseResult.isValid).toBe(true);
      
      const evalResult = evaluator.evaluate(parseResult.ast!);
      expect(evalResult.success).toBe(true);
      expect(Math.abs(evalResult.result - Math.sqrt(11))).toBeLessThan(1e-10);
    });

    it('should handle physics formula', () => {
      // Set variables first
      evaluator.setVariable('m', 2);  // mass
      evaluator.setVariable('v', 10); // velocity
      
      const expression = '0.5 * m * v^2'; // Kinetic energy
      
      const parseResult = parser.parse(expression);
      expect(parseResult.isValid).toBe(true);
      
      const evalResult = evaluator.evaluate(parseResult.ast!);
      expect(evalResult.success).toBe(true);
      expect(evalResult.result).toBe(100);
    });

    it('should handle unit calculations', () => {
      const expression = '2.5 * cm';
      
      const parseResult = parser.parse(expression);
      expect(parseResult.isValid).toBe(true);
      
      const evalResult = evaluator.evaluate(parseResult.ast!);
      expect(evalResult.success).toBe(true);
      expect(evalResult.result).toBe('2.5 cm');
    });

    it('should handle range operations', () => {
      const expression = '1:5';
      
      const parseResult = parser.parse(expression);
      expect(parseResult.isValid).toBe(true);
      
      const evalResult = evaluator.evaluate(parseResult.ast!);
      expect(evalResult.success).toBe(true);
      expect(evalResult.result).toEqual([1, 2, 3, 4, 5]);
    });

    it('should handle conditional expressions', () => {
      evaluator.setVariable('x', 5);
      
      const expression = 'x > 0 ? sqrt(x) : 0';
      
      const parseResult = parser.parse(expression);
      expect(parseResult.isValid).toBe(true);
      
      const evalResult = evaluator.evaluate(parseResult.ast!);
      expect(evalResult.success).toBe(true);
      expect(evalResult.result).toBe(Math.sqrt(5));
    });
  });

  describe('Grammar Compliance', () => {
    it('should accept all grammar-compliant expressions', () => {
      const grammarCompliantExpressions = [
        // Basic arithmetic
        '2 + 3 - 4 * 5 / 6 % 7 ^ 8',
        
        // Element-wise operations
        'a .* b ./ c .% d .^ e',
        
        // Logical operations
        'true and false or not x',
        'x && y || !z',
        
        // Comparisons
        'x == y != z < a <= b > c >= d',
        
        // Functions
        'sin(cos(tan(x)))',
        'min(max(1, 2), abs(-3))',
        
        // Arrays
        '[1, [2, 3], 4]',
        
        // Assignments
        'x = y = z = 42',
        
        // Conditionals
        'a ? b ? c : d : e',
        
        // Units
        '(2 + 3) * kg / m^2',
        
        // Ranges
        '1:2:10',
        
        // Mixed complex expression
        'result = sin(pi/4) > 0.5 ? sqrt(x^2 + y^2) : log(abs(z))',
      ];

      grammarCompliantExpressions.forEach(expr => {
        const parseResult = parser.parse(expr);
        expect(parseResult.isValid).toBe(true);
        expect(parseResult.errors).toHaveLength(0);
      });
    });

    it('should reject grammar-non-compliant expressions', () => {
      const nonCompliantExpressions = [
        '2 + + 3',        // Double operator
        'sin cos(x)',     // Missing parentheses
        'x = = 5',        // Double assignment
        '[1 2 3]',        // Missing commas
        'if x then y',    // Non-grammar constructs
        '2 ** 3',         // Wrong power operator
        'x += 1',         // Compound assignment not in grammar
      ];

      nonCompliantExpressions.forEach(expr => {
        const parseResult = parser.parse(expr);
        expect(parseResult.isValid).toBe(false);
        expect(parseResult.errors.length).toBeGreaterThan(0);
      });
    });
  });
});