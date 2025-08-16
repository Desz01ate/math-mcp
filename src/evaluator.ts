import { evaluate } from 'mathjs';
import { ASTNode, ASTNodeType, EvaluationResult, EvaluationContext, MathServerConfig, DEFAULT_ALLOWED_FUNCTIONS } from './types.js';

export class MathEvaluator {
  private config: MathServerConfig;
  private context: EvaluationContext;

  constructor(config?: Partial<MathServerConfig>) {
    this.config = {
      maxExpressionLength: 1000,
      maxRecursionDepth: 100,
      allowedFunctions: [...DEFAULT_ALLOWED_FUNCTIONS],
      timeoutMs: 5000,
      ...config,
    };

    // Initialize context
    this.context = {
      variables: new Map(),
      functions: new Map(),
      constants: new Map<string, any>([
        ['pi', Math.PI],
        ['e', Math.E],
        ['tau', 2 * Math.PI],
        ['phi', (1 + Math.sqrt(5)) / 2],
        ['true', true],
        ['false', false],
        ['cm', 'cm'],
      ]),
    };
  }

  evaluate(expression: string): EvaluationResult {
    try {
      // Basic security checks
      if (expression.length > this.config.maxExpressionLength) {
        return {
          success: false,
          error: `Expression too long (max ${this.config.maxExpressionLength} characters)`,
        };
      }

      // Check for potentially dangerous patterns
      if (this.containsUnsafePatterns(expression)) {
        return {
          success: false,
          error: 'Expression contains unsafe patterns',
        };
      }

      try {
        // Create scope with variables and constants
        const scope: Record<string, any> = {};
        
        // Add constants
        this.context.constants.forEach((value, key) => {
          scope[key] = value;
        });
        
        // Add variables
        this.context.variables.forEach((value, key) => {
          scope[key] = value;
        });

        // Use mathjs evaluate directly with scope
        const result = evaluate(expression, scope);
        
        return {
          success: true,
          result: this.formatResult(result),
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown evaluation error',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown evaluation error',
      };
    }
  }

  evaluateAST(ast: ASTNode): EvaluationResult {
    try {
      const result = this.evaluateASTNode(ast);
      return {
        success: true,
        result: this.formatResult(result),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown AST evaluation error',
      };
    }
  }

  private evaluateASTNode(node: ASTNode): any {
    switch (node.type) {
      case ASTNodeType.PROGRAM:
        // For program nodes, evaluate all children and return the last result
        if (!node.children || node.children.length === 0) {
          return undefined;
        }
        let result: any;
        for (const child of node.children) {
          result = this.evaluateASTNode(child);
        }
        return result;

      case ASTNodeType.NUMBER:
        return node.value;

      case ASTNodeType.STRING:
        return node.value;

      case ASTNodeType.IDENTIFIER:
        const varName = node.value as string;
        if (this.context.constants.has(varName)) {
          return this.context.constants.get(varName);
        }
        if (this.context.variables.has(varName)) {
          return this.context.variables.get(varName);
        }
        throw new Error(`Undefined variable: ${varName}`);

      case ASTNodeType.BINARY_OP:
        return this.evaluateBinaryOp(node);

      case ASTNodeType.UNARY_OP:
        return this.evaluateUnaryOp(node);

      case ASTNodeType.POSTFIX_OP:
        return this.evaluatePostfixOp(node);

      case ASTNodeType.FUNCTION_CALL:
        return this.evaluateFunctionCall(node);

      case ASTNodeType.ARRAY:
        return node.elements?.map(element => this.evaluateASTNode(element)) || [];

      case ASTNodeType.CONDITIONAL:
        const condition = this.evaluateASTNode(node.condition!);
        return condition ? 
          this.evaluateASTNode(node.consequent!) : 
          this.evaluateASTNode(node.alternate!);

      case ASTNodeType.ASSIGNMENT:
        const value = this.evaluateASTNode(node.right!);
        const lvalue = node.left!;
        if (lvalue.type === ASTNodeType.IDENTIFIER) {
          this.context.variables.set(lvalue.value as string, value);
        }
        return value;

      case ASTNodeType.UNIT_VALUE:
        const numValue = this.evaluateASTNode(node.operand!);
        const unitStr = node.unit!;
        return `${numValue} ${unitStr}`;

      case ASTNodeType.RANGE:
        const start = this.evaluateASTNode(node.start!);
        const end = this.evaluateASTNode(node.end!);
        const step = node.step ? this.evaluateASTNode(node.step) : 1;
        // Simple range implementation
        const range = [];
        for (let i = start; i <= end; i += step) {
          range.push(i);
        }
        return range;

      case ASTNodeType.SUMMATION:
        return this.evaluateSummation(node);

      default:
        throw new Error(`Unsupported AST node type: ${node.type}`);
    }
  }

  private evaluateBinaryOp(node: ASTNode): any {
    const left = this.evaluateASTNode(node.left!);
    const right = this.evaluateASTNode(node.right!);

    switch (node.operator) {
      case '*':
        // Handle simple unit formatting when multiplying by known unit string
        if (typeof left === 'number' && typeof right === 'string') return `${left} ${right}`;
        if (typeof left === 'string' && typeof right === 'number') return `${right} ${left}`;
        return left * right;
      case '+': return left + right;
      case '-': return left - right;
      case '/': return left / right;
      case '%': return left % right;
      case '^': return Math.pow(left, right);
      case '==': return left === right;
      case '!=': return left !== right;
      case '<': return left < right;
      case '<=': return left <= right;
      case '>': return left > right;
      case '>=': return left >= right;
      case 'and':
      case '&&': return left && right;
      case 'or':
      case '||': return left || right;
      default:
        throw new Error(`Unsupported binary operator: ${node.operator}`);
    }
  }

  private evaluateUnaryOp(node: ASTNode): any {
    const operand = this.evaluateASTNode(node.operand!);

    switch (node.operator) {
      case '+': return +operand;
      case '-': return -operand;
      case 'not':
      case '!': return !operand;
      default:
        throw new Error(`Unsupported unary operator: ${node.operator}`);
    }
  }

  private evaluatePostfixOp(node: ASTNode): any {
    const operand = this.evaluateASTNode(node.operand!);

    switch (node.operator) {
      case '!': 
        // Factorial operator
        if (typeof operand !== 'number' || operand < 0 || !Number.isInteger(operand)) {
          throw new Error('Factorial requires a non-negative integer');
        }
        return this.factorial(operand);
      case "'":
        // Transpose operator (for future matrix support)
        throw new Error('Transpose operator not yet implemented');
      default:
        throw new Error(`Unsupported postfix operator: ${node.operator}`);
    }
  }

  private evaluateFunctionCall(node: ASTNode): any {
    const funcName = (node.callee as any).value as string;
    const args = node.arguments?.map(arg => this.evaluateASTNode(arg)) || [];

    // Check if function is allowed
    if (!this.config.allowedFunctions.includes(funcName)) {
      throw new Error(`Function not allowed: ${funcName}`);
    }

    // Handle built-in mathematical functions
    switch (funcName) {
      case 'sqrt': return Math.sqrt(args[0]);
      case 'cbrt': return Math.cbrt(args[0]);
      case 'abs': return Math.abs(args[0]);
      case 'sign': return Math.sign(args[0]);
      case 'ceil': return Math.ceil(args[0]);
      case 'floor': return Math.floor(args[0]);
      case 'round': return Math.round(args[0]);
      case 'sin': return Math.sin(args[0]);
      case 'cos': return Math.cos(args[0]);
      case 'tan': return Math.tan(args[0]);
      case 'asin': return Math.asin(args[0]);
      case 'acos': return Math.acos(args[0]);
      case 'atan': return Math.atan(args[0]);
      case 'atan2': return Math.atan2(args[0], args[1]);
      case 'sinh': return Math.sinh(args[0]);
      case 'cosh': return Math.cosh(args[0]);
      case 'tanh': return Math.tanh(args[0]);
      case 'asinh': return Math.asinh(args[0]);
      case 'acosh': return Math.acosh(args[0]);
      case 'atanh': return Math.atanh(args[0]);
      case 'log': return Math.log(args[0]);
      case 'log10': return Math.log10(args[0]);
      case 'log2': return Math.log2(args[0]);
      case 'exp': return Math.exp(args[0]);
      case 'expm1': return Math.expm1(args[0]);
      case 'log1p': return Math.log1p(args[0]);
      case 'min': return Math.min(...args);
      case 'max': return Math.max(...args);
      case 'sum': return args.reduce((acc, val) => acc + val, 0);
      case 'factorial': return this.factorial(args[0]);
      default:
        throw new Error(`Unknown function: ${funcName}`);
    }
  }

  private evaluateSummation(node: ASTNode): any {
    const variableName = (node.variable as any).value as string;
    const startValue = this.evaluateASTNode(node.start!);
    const endValue = this.evaluateASTNode(node.end!);
    const expression = node.expression!;
    
    // Validate start and end values
    if (typeof startValue !== 'number' || typeof endValue !== 'number') {
      throw new Error('Summation bounds must be numbers');
    }
    
    if (!Number.isInteger(startValue) || !Number.isInteger(endValue)) {
      throw new Error('Summation bounds must be integers');
    }
    
    // Save current variable value if it exists
    const originalValue = this.context.variables.get(variableName);
    
    let sum = 0;
    try {
      // Iterate through the summation range
      for (let i = startValue; i <= endValue; i++) {
        // Set the summation variable to current iteration value
        this.context.variables.set(variableName, i);
        
        // Evaluate the expression with the current variable value
        const termValue = this.evaluateASTNode(expression);
        
        // Add to sum (ensure it's a number)
        if (typeof termValue === 'number') {
          sum += termValue;
        } else {
          throw new Error(`Summation expression must evaluate to a number, got: ${typeof termValue}`);
        }
      }
    } finally {
      // Restore original variable value or remove if it didn't exist
      if (originalValue !== undefined) {
        this.context.variables.set(variableName, originalValue);
      } else {
        this.context.variables.delete(variableName);
      }
    }
    
    return sum;
  }

  private factorial(n: number): number {
    if (n < 0) throw new Error('Factorial of negative number');
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  }

  private containsUnsafePatterns(expression: string): boolean {
    const unsafePatterns = [
      /\b(import|require|eval|Function|setTimeout|setInterval)\b/,
      /__proto__|prototype/,
      /\bconstructor\b/,
      /\bprocess\b/,
      /\bglobal\b/,
      /\bwindow\b/,
      /\bdocument\b/,
    ];

    return unsafePatterns.some(pattern => pattern.test(expression));
  }

  private formatResult(result: any): any {
    // Handle mathjs types
    if (result && typeof result.toString === 'function') {
      // For units, complex numbers, etc.
      if (result.type === 'Unit' || result.type === 'Complex') {
        return result.toString();
      }
    }

    // Handle arrays/matrices
    if (Array.isArray(result)) {
      return result.map(item => this.formatResult(item));
    }

    // Handle objects
    if (typeof result === 'object' && result !== null) {
      if (result.constructor === Object) {
        const formatted: Record<string, any> = {};
        for (const [key, value] of Object.entries(result)) {
          formatted[key] = this.formatResult(value);
        }
        return formatted;
      }
    }

    return result;
  }

  setVariable(name: string, value: any): void {
    this.context.variables.set(name, value);
  }

  getVariable(name: string): any {
    return this.context.variables.get(name);
  }

  clearVariables(): void {
    this.context.variables.clear();
  }

  listVariables(): string[] {
    return Array.from(this.context.variables.keys());
  }

  listConstants(): string[] {
    return Array.from(this.context.constants.keys());
  }

  listFunctions(): string[] {
    return this.config.allowedFunctions;
  }
}
