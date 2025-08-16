import { describe, it, expect } from 'vitest';
import { Tokenizer } from '../tokenizer.js';
import { TokenType } from '../types.js';

describe('Tokenizer', () => {
  describe('Numbers', () => {
    it('should tokenize integers', () => {
      const tokenizer = new Tokenizer('42');
      const tokens = tokenizer.tokenize();
      
      expect(tokens).toHaveLength(2); // Number + EOF
      expect(tokens[0]).toMatchObject({
        type: TokenType.NUMBER,
        value: '42',
        line: 1,
        column: 1
      });
    });

    it('should tokenize decimals', () => {
      const tokenizer = new Tokenizer('3.14159');
      const tokens = tokenizer.tokenize();
      
      expect(tokens[0]).toMatchObject({
        type: TokenType.NUMBER,
        value: '3.14159'
      });
    });

    it('should tokenize scientific notation', () => {
      const testCases = ['1e5', '2.5E-3', '6.022e23', '1E+10'];
      
      testCases.forEach(input => {
        const tokenizer = new Tokenizer(input);
        const tokens = tokenizer.tokenize();
        
        expect(tokens[0]).toMatchObject({
          type: TokenType.NUMBER,
          value: input
        });
      });
    });
  });

  describe('Identifiers and Keywords', () => {
    it('should tokenize identifiers', () => {
      const tokenizer = new Tokenizer('variable_name');
      const tokens = tokenizer.tokenize();
      
      expect(tokens[0]).toMatchObject({
        type: TokenType.IDENTIFIER,
        value: 'variable_name'
      });
    });

    it('should tokenize keywords', () => {
      const keywordTests = [
        { input: 'and', expected: TokenType.AND },
        { input: 'or', expected: TokenType.OR },
        { input: 'not', expected: TokenType.NOT }
      ];

      keywordTests.forEach(({ input, expected }) => {
        const tokenizer = new Tokenizer(input);
        const tokens = tokenizer.tokenize();
        
        expect(tokens[0]).toMatchObject({
          type: expected,
          value: input
        });
      });
    });

    it('should handle mixed alphanumeric identifiers', () => {
      const tokenizer = new Tokenizer('var123_test');
      const tokens = tokenizer.tokenize();
      
      expect(tokens[0]).toMatchObject({
        type: TokenType.IDENTIFIER,
        value: 'var123_test'
      });
    });
  });

  describe('Strings', () => {
    it('should tokenize double-quoted strings', () => {
      const tokenizer = new Tokenizer('"hello world"');
      const tokens = tokenizer.tokenize();
      
      expect(tokens[0]).toMatchObject({
        type: TokenType.STRING,
        value: 'hello world'
      });
    });

    it('should tokenize single-quoted strings', () => {
      const tokenizer = new Tokenizer("'test string'");
      const tokens = tokenizer.tokenize();
      
      expect(tokens[0]).toMatchObject({
        type: TokenType.STRING,
        value: 'test string'
      });
    });

    it('should handle escape sequences', () => {
      const escapeTests = [
        { input: '"hello\\nworld"', expected: 'hello\nworld' },
        { input: '"tab\\there"', expected: 'tab\there' },
        { input: '"quote\\\"test"', expected: 'quote"test' },
        { input: "'single\\'quote'", expected: "single'quote" }
      ];

      escapeTests.forEach(({ input, expected }) => {
        const tokenizer = new Tokenizer(input);
        const tokens = tokenizer.tokenize();
        
        expect(tokens[0]).toMatchObject({
          type: TokenType.STRING,
          value: expected
        });
      });
    });
  });

  describe('Operators', () => {
    it('should tokenize arithmetic operators', () => {
      const operatorTests = [
        { input: '+', expected: TokenType.PLUS },
        { input: '-', expected: TokenType.MINUS },
        { input: '*', expected: TokenType.MULTIPLY },
        { input: '/', expected: TokenType.DIVIDE },
        { input: '%', expected: TokenType.MODULO },
        { input: '^', expected: TokenType.POWER }
      ];

      operatorTests.forEach(({ input, expected }) => {
        const tokenizer = new Tokenizer(input);
        const tokens = tokenizer.tokenize();
        
        expect(tokens[0]).toMatchObject({
          type: expected,
          value: input
        });
      });
    });

    it('should tokenize element-wise operators', () => {
      const operatorTests = [
        { input: '.*', expected: TokenType.ELEMENT_MULTIPLY },
        { input: './', expected: TokenType.ELEMENT_DIVIDE },
        { input: '.%', expected: TokenType.ELEMENT_MODULO },
        { input: '.^', expected: TokenType.ELEMENT_POWER }
      ];

      operatorTests.forEach(({ input, expected }) => {
        const tokenizer = new Tokenizer(input);
        const tokens = tokenizer.tokenize();
        
        expect(tokens[0]).toMatchObject({
          type: expected,
          value: input
        });
      });
    });

    it('should tokenize comparison operators', () => {
      const operatorTests = [
        { input: '==', expected: TokenType.EQUALS },
        { input: '!=', expected: TokenType.NOT_EQUALS },
        { input: '<', expected: TokenType.LESS_THAN },
        { input: '<=', expected: TokenType.LESS_EQUAL },
        { input: '>', expected: TokenType.GREATER_THAN },
        { input: '>=', expected: TokenType.GREATER_EQUAL }
      ];

      operatorTests.forEach(({ input, expected }) => {
        const tokenizer = new Tokenizer(input);
        const tokens = tokenizer.tokenize();
        
        expect(tokens[0]).toMatchObject({
          type: expected,
          value: input
        });
      });
    });

    it('should tokenize logical operators', () => {
      const operatorTests = [
        { input: '&&', expected: TokenType.LOGICAL_AND },
        { input: '||', expected: TokenType.LOGICAL_OR }
      ];

      operatorTests.forEach(({ input, expected }) => {
        const tokenizer = new Tokenizer(input);
        const tokens = tokenizer.tokenize();
        
        expect(tokens[0]).toMatchObject({
          type: expected,
          value: input
        });
      });
    });
  });

  describe('Punctuation', () => {
    it('should tokenize parentheses and brackets', () => {
      const punctuationTests = [
        { input: '(', expected: TokenType.LEFT_PAREN },
        { input: ')', expected: TokenType.RIGHT_PAREN },
        { input: '[', expected: TokenType.LEFT_BRACKET },
        { input: ']', expected: TokenType.RIGHT_BRACKET },
        { input: '{', expected: TokenType.LEFT_BRACE },
        { input: '}', expected: TokenType.RIGHT_BRACE }
      ];

      punctuationTests.forEach(({ input, expected }) => {
        const tokenizer = new Tokenizer(input);
        const tokens = tokenizer.tokenize();
        
        expect(tokens[0]).toMatchObject({
          type: expected,
          value: input
        });
      });
    });

    it('should tokenize special characters', () => {
      const punctuationTests = [
        { input: '.', expected: TokenType.DOT },
        { input: ',', expected: TokenType.COMMA },
        { input: ':', expected: TokenType.COLON },
        { input: ';', expected: TokenType.SEMICOLON },
        { input: '?', expected: TokenType.QUESTION },
        { input: '=', expected: TokenType.ASSIGN },
        { input: '!', expected: TokenType.FACTORIAL },
        { input: "'", expected: TokenType.TRANSPOSE }
      ];

      punctuationTests.forEach(({ input, expected }) => {
        const tokenizer = new Tokenizer(input);
        const tokens = tokenizer.tokenize();
        
        expect(tokens[0]).toMatchObject({
          type: expected,
          value: input
        });
      });
    });
  });

  describe('Whitespace and Newlines', () => {
    it('should handle newlines', () => {
      const tokenizer = new Tokenizer('a\nb');
      const tokens = tokenizer.tokenize();
      
      expect(tokens).toHaveLength(4); // a, newline, b, EOF
      expect(tokens[0].type).toBe(TokenType.IDENTIFIER);
      expect(tokens[1].type).toBe(TokenType.NEWLINE);
      expect(tokens[2].type).toBe(TokenType.IDENTIFIER);
    });

    it('should skip whitespace but not newlines', () => {
      const tokenizer = new Tokenizer('a   b\t\tc');
      const tokens = tokenizer.tokenize();
      
      // Should only have identifiers and EOF (whitespace filtered out)
      const nonWhitespaceTokens = tokens.filter(t => t.type !== TokenType.WHITESPACE);
      expect(nonWhitespaceTokens).toHaveLength(4); // a, b, c, EOF
    });
  });

  describe('Complex Expressions', () => {
    it('should tokenize arithmetic expression', () => {
      const tokenizer = new Tokenizer('2 + 3 * 4');
      const tokens = tokenizer.tokenize();
      
      const expectedTypes = [
        TokenType.NUMBER,     // 2
        TokenType.PLUS,       // +
        TokenType.NUMBER,     // 3
        TokenType.MULTIPLY,   // *
        TokenType.NUMBER,     // 4
        TokenType.EOF
      ];

      expect(tokens.map(t => t.type)).toEqual(expectedTypes);
    });

    it('should tokenize function call', () => {
      const tokenizer = new Tokenizer('sin(pi/2)');
      const tokens = tokenizer.tokenize();
      
      const expectedTypes = [
        TokenType.IDENTIFIER,   // sin
        TokenType.LEFT_PAREN,   // (
        TokenType.IDENTIFIER,   // pi
        TokenType.DIVIDE,       // /
        TokenType.NUMBER,       // 2
        TokenType.RIGHT_PAREN,  // )
        TokenType.EOF
      ];

      expect(tokens.map(t => t.type)).toEqual(expectedTypes);
    });

    it('should tokenize assignment with array', () => {
      const tokenizer = new Tokenizer('arr = [1, 2, 3]');
      const tokens = tokenizer.tokenize();
      
      const expectedTypes = [
        TokenType.IDENTIFIER,     // arr
        TokenType.ASSIGN,         // =
        TokenType.LEFT_BRACKET,   // [
        TokenType.NUMBER,         // 1
        TokenType.COMMA,          // ,
        TokenType.NUMBER,         // 2
        TokenType.COMMA,          // ,
        TokenType.NUMBER,         // 3
        TokenType.RIGHT_BRACKET,  // ]
        TokenType.EOF
      ];

      expect(tokens.map(t => t.type)).toEqual(expectedTypes);
    });

    it('should tokenize conditional expression', () => {
      const tokenizer = new Tokenizer('x > 0 ? x : -x');
      const tokens = tokenizer.tokenize();
      
      const expectedTypes = [
        TokenType.IDENTIFIER,      // x
        TokenType.GREATER_THAN,    // >
        TokenType.NUMBER,          // 0
        TokenType.QUESTION,        // ?
        TokenType.IDENTIFIER,      // x
        TokenType.COLON,           // :
        TokenType.MINUS,           // -
        TokenType.IDENTIFIER,      // x
        TokenType.EOF
      ];

      expect(tokens.map(t => t.type)).toEqual(expectedTypes);
    });
  });

  describe('Error Handling', () => {
    it('should throw error for unexpected characters', () => {
      const tokenizer = new Tokenizer('2 + $invalid');
      
      expect(() => tokenizer.tokenize()).toThrow('Unexpected character');
    });

    it('should handle unterminated strings gracefully', () => {
      const tokenizer = new Tokenizer('"unterminated string');
      const tokens = tokenizer.tokenize();
      
      // Should still create a string token, just without closing quote
      expect(tokens[0].type).toBe(TokenType.STRING);
      expect(tokens[0].value).toBe('unterminated string');
    });
  });

  describe('Line and Column Tracking', () => {
    it('should track line and column positions', () => {
      const tokenizer = new Tokenizer('a\nb\n  c');
      const tokens = tokenizer.tokenize();
      
      // Find identifier tokens
      const identifiers = tokens.filter(t => t.type === TokenType.IDENTIFIER);
      
      expect(identifiers[0]).toMatchObject({ value: 'a', line: 1, column: 1 });
      expect(identifiers[1]).toMatchObject({ value: 'b', line: 2, column: 1 });
      expect(identifiers[2]).toMatchObject({ value: 'c', line: 3, column: 3 });
    });

    it('should handle multi-character tokens correctly', () => {
      const tokenizer = new Tokenizer('>=');
      const tokens = tokenizer.tokenize();
      
      expect(tokens[0]).toMatchObject({
        type: TokenType.GREATER_EQUAL,
        value: '>=',
        line: 1,
        column: 1
      });
    });
  });
});
