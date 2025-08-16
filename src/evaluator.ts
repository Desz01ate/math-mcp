import { evaluate } from 'mathjs';
import { ASTNode, ASTNodeType, EvaluationResult, EvaluationContext, MathServerConfig, DEFAULT_ALLOWED_FUNCTIONS, AngleMode } from './types.js';

export class MathEvaluator {
  private config: MathServerConfig;
  private context: EvaluationContext;

  constructor(config?: Partial<MathServerConfig>) {
    this.config = {
      maxExpressionLength: 1000,
      maxRecursionDepth: 100,
      allowedFunctions: [...DEFAULT_ALLOWED_FUNCTIONS],
      timeoutMs: 5000,
      angleMode: 'radians',
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
        // Handle array operations
        if (Array.isArray(left) || Array.isArray(right)) {
          return this.elementWiseOperation(left, right, (a, b) => a * b);
        }
        return left * right;
      case '+': 
        // Handle array operations
        if (Array.isArray(left) || Array.isArray(right)) {
          return this.elementWiseOperation(left, right, (a, b) => a + b);
        }
        return left + right;
      case '-': 
        // Handle array operations
        if (Array.isArray(left) || Array.isArray(right)) {
          return this.elementWiseOperation(left, right, (a, b) => a - b);
        }
        return left - right;
      case '/': 
        // Handle array operations
        if (Array.isArray(left) || Array.isArray(right)) {
          return this.elementWiseOperation(left, right, (a, b) => a / b);
        }
        return left / right;
      case '%': 
        // Handle array operations
        if (Array.isArray(left) || Array.isArray(right)) {
          return this.elementWiseOperation(left, right, (a, b) => a % b);
        }
        return left % right;
      case '^': 
        // Handle array operations
        if (Array.isArray(left) || Array.isArray(right)) {
          return this.elementWiseOperation(left, right, (a, b) => Math.pow(a, b));
        }
        return Math.pow(left, right);
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
      
      // Element-wise operators
      case '.*': return this.elementWiseOperation(left, right, (a, b) => a * b);
      case './': return this.elementWiseOperation(left, right, (a, b) => a / b);
      case '.%': return this.elementWiseOperation(left, right, (a, b) => a % b);
      case '.^': return this.elementWiseOperation(left, right, (a, b) => Math.pow(a, b));
      
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
        // Transpose operator
        return this.transpose(operand);
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
      
      // Trigonometric functions with angle mode support
      case 'sin': return Math.sin(this.toRadians(args[0]));
      case 'cos': return Math.cos(this.toRadians(args[0]));
      case 'tan': return Math.tan(this.toRadians(args[0]));
      case 'asin': return this.fromRadians(Math.asin(args[0]));
      case 'acos': return this.fromRadians(Math.acos(args[0]));
      case 'atan': return this.fromRadians(Math.atan(args[0]));
      case 'atan2': return this.fromRadians(Math.atan2(args[0], args[1]));
      
      // Hyperbolic functions (always in natural units)
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
      case 'min': return this.min(args);
      case 'max': return this.max(args);
      case 'mean': return this.mean(args);
      case 'median': return this.median(args);
      case 'std': return this.std(args);
      case 'var': return this.variance(args);
      case 'sum': return this.sum(args);
      case 'factorial': return this.factorial(args[0]);
      case 'gamma': return this.gamma(args[0]);
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

  private elementWiseOperation(left: any, right: any, operation: (a: number, b: number) => number): any {
    // Handle array-array operations
    if (Array.isArray(left) && Array.isArray(right)) {
      if (left.length !== right.length) {
        throw new Error(`Array length mismatch: ${left.length} vs ${right.length}`);
      }
      return left.map((a, i) => {
        const b = right[i];
        
        // Handle nested arrays recursively (for matrices)
        if (Array.isArray(a) && Array.isArray(b)) {
          return this.elementWiseOperation(a, b, operation);
        }
        
        // Handle scalar elements
        if (typeof a !== 'number' || typeof b !== 'number') {
          throw new Error(`Element-wise operations require numeric elements`);
        }
        return operation(a, b);
      });
    }
    
    // Handle array-scalar operations
    if (Array.isArray(left) && typeof right === 'number') {
      return left.map(a => {
        // Handle nested arrays recursively
        if (Array.isArray(a)) {
          return this.elementWiseOperation(a, right, operation);
        }
        
        if (typeof a !== 'number') {
          throw new Error(`Element-wise operations require numeric elements`);
        }
        return operation(a, right);
      });
    }
    
    // Handle scalar-array operations
    if (typeof left === 'number' && Array.isArray(right)) {
      return right.map(b => {
        // Handle nested arrays recursively
        if (Array.isArray(b)) {
          return this.elementWiseOperation(left, b, operation);
        }
        
        if (typeof b !== 'number') {
          throw new Error(`Element-wise operations require numeric elements`);
        }
        return operation(left, b);
      });
    }
    
    // Handle scalar-scalar operations (fallback to regular operation)
    if (typeof left === 'number' && typeof right === 'number') {
      return operation(left, right);
    }
    
    throw new Error(`Element-wise operations not supported for types: ${typeof left}, ${typeof right}`);
  }

  private transpose(operand: any): any {
    // Handle scalars (numbers)
    if (typeof operand === 'number') {
      return operand;
    }

    // Handle arrays
    if (Array.isArray(operand)) {
      // Check if it's a 1D array (vector)
      if (operand.length === 0) {
        return operand; // Empty array remains empty
      }

      // Check if all elements are numbers (1D vector)
      if (operand.every(item => typeof item === 'number')) {
        // Convert 1D row vector to 2D column vector
        return operand.map(item => [item]);
      }

      // Check if it's a 2D array (matrix)
      if (operand.every(row => Array.isArray(row))) {
        const matrix = operand as number[][];
        
        // Validate that all rows have the same length
        if (matrix.length === 0) {
          return matrix; // Empty matrix
        }
        
        const cols = matrix[0].length;
        if (!matrix.every(row => row.length === cols)) {
          throw new Error('Matrix transpose requires all rows to have the same length');
        }

        // Validate that all elements are numbers
        if (!matrix.every(row => row.every(item => typeof item === 'number'))) {
          throw new Error('Matrix transpose requires all elements to be numbers');
        }

        // Transpose: result[j][i] = matrix[i][j]
        const result: number[][] = [];
        for (let j = 0; j < cols; j++) {
          result[j] = [];
          for (let i = 0; i < matrix.length; i++) {
            result[j][i] = matrix[i][j];
          }
        }
        return result;
      }

      // Handle mixed array (some numbers, some arrays) - not supported
      throw new Error('Transpose not supported for mixed arrays (some numbers, some arrays)');
    }

    // Handle other types
    throw new Error(`Transpose not supported for type: ${typeof operand}`);
  }

  private min(args: any[]): number {
    // Handle both min(a, b, c) and min([a, b, c]) syntax
    const values = this.flattenToNumbers(args);
    if (values.length === 0) {
      throw new Error('min function requires at least one argument');
    }
    return Math.min(...values);
  }

  private max(args: any[]): number {
    // Handle both max(a, b, c) and max([a, b, c]) syntax
    const values = this.flattenToNumbers(args);
    if (values.length === 0) {
      throw new Error('max function requires at least one argument');
    }
    return Math.max(...values);
  }

  private mean(args: any[]): number {
    const values = this.flattenToNumbers(args);
    if (values.length === 0) {
      throw new Error('mean function requires at least one argument');
    }
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  private median(args: any[]): number {
    const values = this.flattenToNumbers(args);
    if (values.length === 0) {
      throw new Error('median function requires at least one argument');
    }
    
    const sorted = [...values].sort((a, b) => a - b);
    const n = sorted.length;
    
    if (n % 2 === 0) {
      // Even number of elements: average of middle two
      return (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
    } else {
      // Odd number of elements: middle element
      return sorted[Math.floor(n / 2)];
    }
  }

  private std(args: any[]): number {
    return Math.sqrt(this.variance(args));
  }

  private variance(args: any[]): number {
    const values = this.flattenToNumbers(args);
    if (values.length === 0) {
      throw new Error('variance function requires at least one argument');
    }
    if (values.length === 1) {
      return 0; // Variance of a single value is 0
    }
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const sumSquaredDiffs = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0);
    
    // Use N-1 denominator (sample variance) for consistency with most statistical software
    return sumSquaredDiffs / (values.length - 1);
  }

  private gamma(x: number): number {
    // Gamma function implementation using Lanczos approximation
    if (typeof x !== 'number') {
      throw new Error('gamma function requires a numeric argument');
    }
    
    if (x < 0) {
      // Use reflection formula for negative values: Γ(z)Γ(1-z) = π/sin(πz)
      return Math.PI / (Math.sin(Math.PI * x) * this.gamma(1 - x));
    }
    
    if (x === 0) {
      return Infinity;
    }
    
    if (x < 1) {
      // Use recurrence relation: Γ(z+1) = z·Γ(z)
      return this.gamma(x + 1) / x;
    }
    
    // Lanczos approximation for x >= 1
    const g = 7;
    const coefficients = [
      0.99999999999980993,
      676.5203681218851,
      -1259.1392167224028,
      771.32342877765313,
      -176.61502916214059,
      12.507343278686905,
      -0.13857109526572012,
      9.9843695780195716e-6,
      1.5056327351493116e-7
    ];
    
    x -= 1;
    let result = coefficients[0];
    for (let i = 1; i < coefficients.length; i++) {
      result += coefficients[i] / (x + i);
    }
    
    const t = x + g + 0.5;
    return Math.sqrt(2 * Math.PI) * Math.pow(t, x + 0.5) * Math.exp(-t) * result;
  }

  private sum(args: any[]): number {
    const values = this.flattenToNumbers(args);
    return values.reduce((acc, val) => acc + val, 0);
  }

  private flattenToNumbers(args: any[]): number[] {
    const result: number[] = [];
    
    for (const arg of args) {
      if (typeof arg === 'number') {
        result.push(arg);
      } else if (Array.isArray(arg)) {
        // Recursively flatten arrays
        const flattened = this.flattenToNumbers(arg);
        result.push(...flattened);
      } else {
        throw new Error(`Statistical functions require numeric arguments, got: ${typeof arg}`);
      }
    }
    
    return result;
  }

  private toRadians(angle: number): number {
    if (this.config.angleMode === 'degrees') {
      return angle * (Math.PI / 180);
    }
    return angle;
  }

  private fromRadians(angle: number): number {
    if (this.config.angleMode === 'degrees') {
      return angle * (180 / Math.PI);
    }
    return angle;
  }
}
