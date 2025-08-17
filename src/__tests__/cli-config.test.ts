import { describe, it, expect } from 'vitest';
import { MathMCPServer } from '../server.js';
import { MathServerConfig, DEFAULT_ALLOWED_FUNCTIONS, AngleMode } from '../types.js';
import { GrammarParser } from '../grammar-parser.js';

describe('CLI Configuration', () => {
  it('should use default configuration when no config provided', () => {
    const server = new MathMCPServer();
    
    // Test that configuration is properly initialized with defaults
    const evaluator = (server as any).evaluator;
    expect(evaluator.listFunctions()).toEqual([...DEFAULT_ALLOWED_FUNCTIONS]);
  });

  it('should apply custom maxExpressionLength configuration', () => {
    const config: Partial<MathServerConfig> = {
      maxExpressionLength: 500
    };
    
    const server = new MathMCPServer(config);
    
    // Test that configuration is properly stored
    const evaluator = (server as any).evaluator;
    expect(evaluator.config.maxExpressionLength).toBe(500);
  });

  it('should apply custom allowedFunctions configuration', () => {
    const config: Partial<MathServerConfig> = {
      allowedFunctions: ['sqrt'] // Only allow sqrt
    };
    
    const server = new MathMCPServer(config);
    const evaluator = (server as any).evaluator;
    
    // Test that configuration is stored correctly
    expect(evaluator.listFunctions()).toEqual(['sqrt']);
    
    // Test function restrictions are enforced in AST evaluation
    const parser = new GrammarParser();
    const parseResult = parser.parse('sqrt(4)');
    const sqrtResult = evaluator.evaluateAST(parseResult.ast);
    expect(sqrtResult.success).toBe(true);
    expect(sqrtResult.result).toBe(2);
    
    // Test that restricted function fails
    const sinParseResult = parser.parse('sin(0)');
    const sinResult = evaluator.evaluateAST(sinParseResult.ast);
    expect(sinResult.success).toBe(false);
    expect(sinResult.error).toContain('not allowed');
  });

  it('should apply custom timeoutMs configuration', () => {
    const config: Partial<MathServerConfig> = {
      timeoutMs: 1000 // Very short timeout
    };
    
    const server = new MathMCPServer(config);
    
    // Test that configuration is properly stored
    const evaluator = (server as any).evaluator;
    expect(evaluator.config.timeoutMs).toBe(1000);
  });

  it('should merge partial configuration with defaults', () => {
    const config: Partial<MathServerConfig> = {
      maxExpressionLength: 2000, // Custom value
      // timeoutMs not specified, should use default
    };
    
    const server = new MathMCPServer(config);
    
    // Test that configuration is properly merged
    const evaluator = (server as any).evaluator;
    expect(evaluator.config.maxExpressionLength).toBe(2000);
    expect(evaluator.config.timeoutMs).toBe(5000); // Should use default
  });

  it('should validate that default allowed functions are properly defined', () => {
    // Test that the default functions list contains expected core functions
    expect(DEFAULT_ALLOWED_FUNCTIONS).toContain('sqrt');
    expect(DEFAULT_ALLOWED_FUNCTIONS).toContain('sin');
    expect(DEFAULT_ALLOWED_FUNCTIONS).toContain('cos');
    expect(DEFAULT_ALLOWED_FUNCTIONS).toContain('log');
    
    // Test that it's a proper array with no duplicates
    const uniqueFunctions = [...new Set(DEFAULT_ALLOWED_FUNCTIONS)];
    expect(uniqueFunctions).toHaveLength(DEFAULT_ALLOWED_FUNCTIONS.length);
    
    // Test that all functions are strings
    DEFAULT_ALLOWED_FUNCTIONS.forEach(func => {
      expect(typeof func).toBe('string');
      expect(func.length).toBeGreaterThan(0);
    });
  });

  it('should use default allowed functions when none specified', () => {
    const server = new MathMCPServer();
    const evaluator = (server as any).evaluator;
    
    // Should use all default functions
    expect(evaluator.listFunctions()).toEqual([...DEFAULT_ALLOWED_FUNCTIONS]);
  });

  describe('Angle Mode Configuration', () => {
    const parser = new GrammarParser();

    it('should default to radians mode when no angle mode specified', () => {
      const server = new MathMCPServer();
      const evaluator = (server as any).evaluator;
      
      const parseResult = parser.parse('sin(pi/2)');
      const evalResult = evaluator.evaluateAST(parseResult.ast);
      
      expect(evalResult.success).toBe(true);
      expect(evalResult.result).toBeCloseTo(1, 10);
    });

    it('should apply radians angle mode configuration', () => {
      const config: Partial<MathServerConfig> = {
        angleMode: 'radians' as AngleMode
      };
      
      const server = new MathMCPServer(config);
      const evaluator = (server as any).evaluator;
      
      const parseResult = parser.parse('sin(pi/2)');
      const evalResult = evaluator.evaluateAST(parseResult.ast);
      
      expect(evalResult.success).toBe(true);
      expect(evalResult.result).toBeCloseTo(1, 10);
    });

    it('should apply degrees angle mode configuration', () => {
      const config: Partial<MathServerConfig> = {
        angleMode: 'degrees' as AngleMode
      };
      
      const server = new MathMCPServer(config);
      const evaluator = (server as any).evaluator;
      
      // Test sin(90) = 1 in degrees mode
      const parseResult = parser.parse('sin(90)');
      const evalResult = evaluator.evaluateAST(parseResult.ast);
      
      expect(evalResult.success).toBe(true);
      expect(evalResult.result).toBeCloseTo(1, 10);
    });

    it('should return inverse trig results in the configured angle mode', () => {
      const degreesConfig: Partial<MathServerConfig> = {
        angleMode: 'degrees' as AngleMode
      };
      
      const server = new MathMCPServer(degreesConfig);
      const evaluator = (server as any).evaluator;
      
      // Test asin(1) = 90 degrees
      const parseResult = parser.parse('asin(1)');
      const evalResult = evaluator.evaluateAST(parseResult.ast);
      
      expect(evalResult.success).toBe(true);
      expect(evalResult.result).toBeCloseTo(90, 10);
    });

    it('should not affect non-trigonometric functions', () => {
      const config: Partial<MathServerConfig> = {
        angleMode: 'degrees' as AngleMode
      };
      
      const server = new MathMCPServer(config);
      const evaluator = (server as any).evaluator;
      
      // Test that non-trig functions work normally
      const testCases = [
        { expr: 'sqrt(4)', expected: 2 },
        { expr: 'log(e)', expected: 1 },
        { expr: 'abs(-5)', expected: 5 },
        { expr: 'sinh(0)', expected: 0 }, // Hyperbolic functions should not be affected
      ];

      testCases.forEach(({ expr, expected }) => {
        const parseResult = parser.parse(expr);
        const evalResult = evaluator.evaluateAST(parseResult.ast);
        
        expect(evalResult.success).toBe(true);
        expect(evalResult.result).toBeCloseTo(expected, 10);
      });
    });
  });
});