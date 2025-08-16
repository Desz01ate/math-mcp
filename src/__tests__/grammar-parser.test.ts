import { describe, it, expect } from 'vitest';
import { GrammarParser } from '../grammar-parser.js';
import { ASTNodeType } from '../types.js';

describe('GrammarParser', () => {
  describe('Basic Expressions', () => {
    it('should parse numbers', () => {
      const parser = new GrammarParser();
      const result = parser.parse('42');
      
      expect(result.isValid).toBe(true);
      expect(result.ast?.children?.[0]).toMatchObject({
        type: ASTNodeType.NUMBER,
        value: 42
      });
    });

    it('should parse strings', () => {
      const parser = new GrammarParser();
      const result = parser.parse('"hello world"');
      
      expect(result.isValid).toBe(true);
      expect(result.ast?.children?.[0]).toMatchObject({
        type: ASTNodeType.STRING,
        value: 'hello world'
      });
    });

    it('should parse identifiers', () => {
      const parser = new GrammarParser();
      const result = parser.parse('variable');
      
      expect(result.isValid).toBe(true);
      expect(result.ast?.children?.[0]).toMatchObject({
        type: ASTNodeType.IDENTIFIER,
        value: 'variable'
      });
    });
  });

  describe('Arithmetic Operations', () => {
    it('should parse addition', () => {
      const parser = new GrammarParser();
      const result = parser.parse('2 + 3');
      
      expect(result.isValid).toBe(true);
      const expr = result.ast?.children?.[0];
      expect(expr).toMatchObject({
        type: ASTNodeType.BINARY_OP,
        operator: '+',
        left: { type: ASTNodeType.NUMBER, value: 2 },
        right: { type: ASTNodeType.NUMBER, value: 3 }
      });
    });

    it('should parse subtraction', () => {
      const parser = new GrammarParser();
      const result = parser.parse('5 - 2');
      
      expect(result.isValid).toBe(true);
      const expr = result.ast?.children?.[0];
      expect(expr).toMatchObject({
        type: ASTNodeType.BINARY_OP,
        operator: '-'
      });
    });

    it('should parse multiplication', () => {
      const parser = new GrammarParser();
      const result = parser.parse('3 * 4');
      
      expect(result.isValid).toBe(true);
      const expr = result.ast?.children?.[0];
      expect(expr).toMatchObject({
        type: ASTNodeType.BINARY_OP,
        operator: '*'
      });
    });

    it('should parse division', () => {
      const parser = new GrammarParser();
      const result = parser.parse('8 / 2');
      
      expect(result.isValid).toBe(true);
      const expr = result.ast?.children?.[0];
      expect(expr).toMatchObject({
        type: ASTNodeType.BINARY_OP,
        operator: '/'
      });
    });

    it('should parse exponentiation', () => {
      const parser = new GrammarParser();
      const result = parser.parse('2 ^ 3');
      
      expect(result.isValid).toBe(true);
      const expr = result.ast?.children?.[0];
      expect(expr).toMatchObject({
        type: ASTNodeType.BINARY_OP,
        operator: '^'
      });
    });
  });

  describe('Operator Precedence', () => {
    it('should handle multiplication before addition', () => {
      const parser = new GrammarParser();
      const result = parser.parse('2 + 3 * 4');
      
      expect(result.isValid).toBe(true);
      const expr = result.ast?.children?.[0];
      
      // Should be parsed as 2 + (3 * 4)
      expect(expr).toMatchObject({
        type: ASTNodeType.BINARY_OP,
        operator: '+',
        left: { type: ASTNodeType.NUMBER, value: 2 },
        right: {
          type: ASTNodeType.BINARY_OP,
          operator: '*',
          left: { type: ASTNodeType.NUMBER, value: 3 },
          right: { type: ASTNodeType.NUMBER, value: 4 }
        }
      });
    });

    it('should handle exponentiation before multiplication', () => {
      const parser = new GrammarParser();
      const result = parser.parse('2 * 3 ^ 4');
      
      expect(result.isValid).toBe(true);
      const expr = result.ast?.children?.[0];
      
      // Should be parsed as 2 * (3 ^ 4)
      expect(expr).toMatchObject({
        type: ASTNodeType.BINARY_OP,
        operator: '*',
        left: { type: ASTNodeType.NUMBER, value: 2 },
        right: {
          type: ASTNodeType.BINARY_OP,
          operator: '^',
          left: { type: ASTNodeType.NUMBER, value: 3 },
          right: { type: ASTNodeType.NUMBER, value: 4 }
        }
      });
    });

    it('should handle right-associative exponentiation', () => {
      const parser = new GrammarParser();
      const result = parser.parse('2 ^ 3 ^ 4');
      
      expect(result.isValid).toBe(true);
      const expr = result.ast?.children?.[0];
      
      // Should be parsed as 2 ^ (3 ^ 4) - right associative
      expect(expr).toMatchObject({
        type: ASTNodeType.BINARY_OP,
        operator: '^',
        left: { type: ASTNodeType.NUMBER, value: 2 },
        right: {
          type: ASTNodeType.BINARY_OP,
          operator: '^',
          left: { type: ASTNodeType.NUMBER, value: 3 },
          right: { type: ASTNodeType.NUMBER, value: 4 }
        }
      });
    });
  });

  describe('Parentheses', () => {
    it('should parse parenthesized expressions', () => {
      const parser = new GrammarParser();
      const result = parser.parse('(2 + 3) * 4');
      
      expect(result.isValid).toBe(true);
      const expr = result.ast?.children?.[0];
      
      // Should be parsed as (2 + 3) * 4
      expect(expr).toMatchObject({
        type: ASTNodeType.BINARY_OP,
        operator: '*',
        left: {
          type: ASTNodeType.BINARY_OP,
          operator: '+',
          left: { type: ASTNodeType.NUMBER, value: 2 },
          right: { type: ASTNodeType.NUMBER, value: 3 }
        },
        right: { type: ASTNodeType.NUMBER, value: 4 }
      });
    });

    it('should handle nested parentheses', () => {
      const parser = new GrammarParser();
      const result = parser.parse('((2 + 3) * 4)');
      
      expect(result.isValid).toBe(true);
      expect(result.ast?.children?.[0]).toMatchObject({
        type: ASTNodeType.BINARY_OP,
        operator: '*'
      });
    });
  });

  describe('Unary Operations', () => {
    it('should parse unary plus', () => {
      const parser = new GrammarParser();
      const result = parser.parse('+5');
      
      expect(result.isValid).toBe(true);
      const expr = result.ast?.children?.[0];
      expect(expr).toMatchObject({
        type: ASTNodeType.UNARY_OP,
        operator: '+',
        operand: { type: ASTNodeType.NUMBER, value: 5 }
      });
    });

    it('should parse unary minus', () => {
      const parser = new GrammarParser();
      const result = parser.parse('-5');
      
      expect(result.isValid).toBe(true);
      const expr = result.ast?.children?.[0];
      expect(expr).toMatchObject({
        type: ASTNodeType.UNARY_OP,
        operator: '-',
        operand: { type: ASTNodeType.NUMBER, value: 5 }
      });
    });

    it('should parse logical not', () => {
      const parser = new GrammarParser();
      const result = parser.parse('not true');
      
      expect(result.isValid).toBe(true);
      const expr = result.ast?.children?.[0];
      expect(expr).toMatchObject({
        type: ASTNodeType.UNARY_OP,
        operator: 'not'
      });
    });
  });

  describe('Function Calls', () => {
    it('should parse function calls with no arguments', () => {
      const parser = new GrammarParser();
      const result = parser.parse('random()');
      
      expect(result.isValid).toBe(true);
      const expr = result.ast?.children?.[0];
      expect(expr).toMatchObject({
        type: ASTNodeType.FUNCTION_CALL,
        callee: { type: ASTNodeType.IDENTIFIER, value: 'random' },
        arguments: []
      });
    });

    it('should parse function calls with one argument', () => {
      const parser = new GrammarParser();
      const result = parser.parse('sin(x)');
      
      expect(result.isValid).toBe(true);
      const expr = result.ast?.children?.[0];
      expect(expr).toMatchObject({
        type: ASTNodeType.FUNCTION_CALL,
        callee: { type: ASTNodeType.IDENTIFIER, value: 'sin' },
        arguments: [{ type: ASTNodeType.IDENTIFIER, value: 'x' }]
      });
    });

    it('should parse function calls with multiple arguments', () => {
      const parser = new GrammarParser();
      const result = parser.parse('pow(2, 3)');
      
      expect(result.isValid).toBe(true);
      const expr = result.ast?.children?.[0];
      expect(expr).toMatchObject({
        type: ASTNodeType.FUNCTION_CALL,
        callee: { type: ASTNodeType.IDENTIFIER, value: 'pow' },
        arguments: [
          { type: ASTNodeType.NUMBER, value: 2 },
          { type: ASTNodeType.NUMBER, value: 3 }
        ]
      });
    });

    it('should parse nested function calls', () => {
      const parser = new GrammarParser();
      const result = parser.parse('sin(cos(x))');
      
      expect(result.isValid).toBe(true);
      const expr = result.ast?.children?.[0];
      expect(expr).toMatchObject({
        type: ASTNodeType.FUNCTION_CALL,
        callee: { type: ASTNodeType.IDENTIFIER, value: 'sin' },
        arguments: [{
          type: ASTNodeType.FUNCTION_CALL,
          callee: { type: ASTNodeType.IDENTIFIER, value: 'cos' }
        }]
      });
    });
  });

  describe('Arrays', () => {
    it('should parse empty arrays', () => {
      const parser = new GrammarParser();
      const result = parser.parse('[]');
      
      expect(result.isValid).toBe(true);
      const expr = result.ast?.children?.[0];
      expect(expr).toMatchObject({
        type: ASTNodeType.ARRAY,
        elements: []
      });
    });

    it('should parse arrays with elements', () => {
      const parser = new GrammarParser();
      const result = parser.parse('[1, 2, 3]');
      
      expect(result.isValid).toBe(true);
      const expr = result.ast?.children?.[0];
      expect(expr).toMatchObject({
        type: ASTNodeType.ARRAY,
        elements: [
          { type: ASTNodeType.NUMBER, value: 1 },
          { type: ASTNodeType.NUMBER, value: 2 },
          { type: ASTNodeType.NUMBER, value: 3 }
        ]
      });
    });

    it('should parse arrays with expressions', () => {
      const parser = new GrammarParser();
      const result = parser.parse('[1 + 2, sin(x), "hello"]');
      
      expect(result.isValid).toBe(true);
      const expr = result.ast?.children?.[0];
      expect(expr?.type).toBe(ASTNodeType.ARRAY);
      expect(expr?.elements).toHaveLength(3);
      expect(expr?.elements?.[0]?.type).toBe(ASTNodeType.BINARY_OP);
      expect(expr?.elements?.[1]?.type).toBe(ASTNodeType.FUNCTION_CALL);
      expect(expr?.elements?.[2]?.type).toBe(ASTNodeType.STRING);
    });
  });

  describe('Objects', () => {
    it('should parse empty objects', () => {
      const parser = new GrammarParser();
      const result = parser.parse('{}');
      
      expect(result.isValid).toBe(true);
      const expr = result.ast?.children?.[0];
      expect(expr).toMatchObject({
        type: ASTNodeType.OBJECT,
        properties: []
      });
    });

    it('should parse objects with properties', () => {
      const parser = new GrammarParser();
      const result = parser.parse('{x: 1, y: 2}');
      
      expect(result.isValid).toBe(true);
      const expr = result.ast?.children?.[0];
      expect(expr).toMatchObject({
        type: ASTNodeType.OBJECT,
        properties: [
          {
            key: { type: ASTNodeType.IDENTIFIER, value: 'x' },
            value: { type: ASTNodeType.NUMBER, value: 1 }
          },
          {
            key: { type: ASTNodeType.IDENTIFIER, value: 'y' },
            value: { type: ASTNodeType.NUMBER, value: 2 }
          }
        ]
      });
    });
  });

  describe('Comparison Operations', () => {
    it('should parse equality comparisons', () => {
      const comparisonTests = [
        { input: 'x == y', operator: '==' },
        { input: 'x != y', operator: '!=' },
        { input: 'x < y', operator: '<' },
        { input: 'x <= y', operator: '<=' },
        { input: 'x > y', operator: '>' },
        { input: 'x >= y', operator: '>=' }
      ];

      comparisonTests.forEach(({ input, operator }) => {
        const parser = new GrammarParser();
        const result = parser.parse(input);
        
        expect(result.isValid).toBe(true);
        const expr = result.ast?.children?.[0];
        expect(expr).toMatchObject({
          type: ASTNodeType.BINARY_OP,
          operator
        });
      });
    });
  });

  describe('Logical Operations', () => {
    it('should parse logical AND', () => {
      const parser = new GrammarParser();
      const result = parser.parse('x and y');
      
      expect(result.isValid).toBe(true);
      const expr = result.ast?.children?.[0];
      expect(expr).toMatchObject({
        type: ASTNodeType.BINARY_OP,
        operator: 'and'
      });
    });

    it('should parse logical OR', () => {
      const parser = new GrammarParser();
      const result = parser.parse('x || y');
      
      expect(result.isValid).toBe(true);
      const expr = result.ast?.children?.[0];
      expect(expr).toMatchObject({
        type: ASTNodeType.BINARY_OP,
        operator: '||'
      });
    });
  });

  describe('Conditional Expressions', () => {
    it('should parse ternary operator', () => {
      const parser = new GrammarParser();
      const result = parser.parse('x > 0 ? x : -x');
      
      expect(result.isValid).toBe(true);
      const expr = result.ast?.children?.[0];
      expect(expr).toMatchObject({
        type: ASTNodeType.CONDITIONAL,
        condition: {
          type: ASTNodeType.BINARY_OP,
          operator: '>'
        },
        consequent: { type: ASTNodeType.IDENTIFIER, value: 'x' },
        alternate: {
          type: ASTNodeType.UNARY_OP,
          operator: '-'
        }
      });
    });
  });

  describe('Assignments', () => {
    it('should parse simple assignment', () => {
      const parser = new GrammarParser();
      const result = parser.parse('x = 5');
      
      expect(result.isValid).toBe(true);
      const stmt = result.ast?.children?.[0];
      expect(stmt).toMatchObject({
        type: ASTNodeType.ASSIGNMENT,
        left: { type: ASTNodeType.IDENTIFIER, value: 'x' },
        right: { type: ASTNodeType.NUMBER, value: 5 }
      });
    });

    it('should parse assignment with expression', () => {
      const parser = new GrammarParser();
      const result = parser.parse('result = 2 + 3 * 4');
      
      expect(result.isValid).toBe(true);
      const stmt = result.ast?.children?.[0];
      expect(stmt?.type).toBe(ASTNodeType.ASSIGNMENT);
      expect(stmt?.left).toMatchObject({
        type: ASTNodeType.IDENTIFIER,
        value: 'result'
      });
      expect(stmt?.right?.type).toBe(ASTNodeType.BINARY_OP);
    });
  });

  describe('Multiple Statements', () => {
    it('should parse statements separated by semicolons', () => {
      const parser = new GrammarParser();
      const result = parser.parse('x = 5; y = 10; x + y');
      
      expect(result.isValid).toBe(true);
      expect(result.ast?.children).toHaveLength(3);
      expect(result.ast?.children?.[0]?.type).toBe(ASTNodeType.ASSIGNMENT);
      expect(result.ast?.children?.[1]?.type).toBe(ASTNodeType.ASSIGNMENT);
      expect(result.ast?.children?.[2]?.type).toBe(ASTNodeType.BINARY_OP);
    });

    it('should parse statements separated by newlines', () => {
      const parser = new GrammarParser();
      const result = parser.parse('x = 5\ny = 10\nx + y');
      
      expect(result.isValid).toBe(true);
      expect(result.ast?.children).toHaveLength(3);
    });
  });

  describe('Element-wise Operations', () => {
    it('should parse element-wise multiplication', () => {
      const parser = new GrammarParser();
      const result = parser.parse('a .* b');
      
      expect(result.isValid).toBe(true);
      const expr = result.ast?.children?.[0];
      expect(expr).toMatchObject({
        type: ASTNodeType.BINARY_OP,
        operator: '.*'
      });
    });

    it('should parse element-wise power', () => {
      const parser = new GrammarParser();
      const result = parser.parse('a .^ b');
      
      expect(result.isValid).toBe(true);
      const expr = result.ast?.children?.[0];
      expect(expr).toMatchObject({
        type: ASTNodeType.BINARY_OP,
        operator: '.^'
      });
    });
  });

  describe('Error Cases', () => {
    it('should handle syntax errors gracefully', () => {
      const errorCases = [
        '2 +',           // Incomplete expression
        '((2 + 3)',      // Unmatched parentheses
        'x = = 5',       // Double assignment
        'sin(',          // Incomplete function call
        '[1, 2,',        // Incomplete array
        '{x:}',          // Incomplete object
      ];

      errorCases.forEach(input => {
        const parser = new GrammarParser();
        const result = parser.parse(input);
        
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });

    it('should provide meaningful error messages', () => {
      const parser = new GrammarParser();
      const result = parser.parse('2 +');
      
      expect(result.isValid).toBe(false);
      expect(result.errors[0].message).toContain('Expected');
    });

    it('should track error positions', () => {
      const parser = new GrammarParser();
      const result = parser.parse('x = 5;\ny = ');
      
      expect(result.isValid).toBe(false);
      expect(result.errors[0].line).toBeGreaterThan(1);
    });
  });

  describe('Complex Real-world Expressions', () => {
    it('should parse mathematical formula', () => {
      const parser = new GrammarParser();
      const result = parser.parse('sqrt(x^2 + y^2)');
      
      expect(result.isValid).toBe(true);
      const expr = result.ast?.children?.[0];
      expect(expr?.type).toBe(ASTNodeType.FUNCTION_CALL);
      expect(expr?.callee).toMatchObject({
        type: ASTNodeType.IDENTIFIER,
        value: 'sqrt'
      });
    });

    it('should parse statistical expression', () => {
      const parser = new GrammarParser();
      const result = parser.parse('mean([1, 2, 3, 4, 5])');
      
      expect(result.isValid).toBe(true);
      const expr = result.ast?.children?.[0];
      expect(expr).toMatchObject({
        type: ASTNodeType.FUNCTION_CALL,
        callee: { type: ASTNodeType.IDENTIFIER, value: 'mean' },
        arguments: [{
          type: ASTNodeType.ARRAY,
          elements: expect.arrayContaining([
            expect.objectContaining({ type: ASTNodeType.NUMBER })
          ])
        }]
      });
    });

    it('should parse complex conditional', () => {
      const parser = new GrammarParser();
      const result = parser.parse('x > 0 and y > 0 ? sqrt(x * y) : 0');
      
      expect(result.isValid).toBe(true);
      const expr = result.ast?.children?.[0];
      expect(expr?.type).toBe(ASTNodeType.CONDITIONAL);
    });

    it('should parse matrix-like expression', () => {
      const parser = new GrammarParser();
      const result = parser.parse('[[1, 2], [3, 4]]');
      
      expect(result.isValid).toBe(true);
      const expr = result.ast?.children?.[0];
      expect(expr?.type).toBe(ASTNodeType.ARRAY);
      expect(expr?.elements?.[0]?.type).toBe(ASTNodeType.ARRAY);
    });
  });
});