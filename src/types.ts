export enum TokenType {
  // Literals
  NUMBER = 'NUMBER',
  STRING = 'STRING',
  IDENTIFIER = 'IDENTIFIER',
  
  // Operators
  PLUS = 'PLUS',
  MINUS = 'MINUS',
  MULTIPLY = 'MULTIPLY',
  DIVIDE = 'DIVIDE',
  MODULO = 'MODULO',
  POWER = 'POWER',
  
  // Element-wise operators
  ELEMENT_MULTIPLY = 'ELEMENT_MULTIPLY',
  ELEMENT_DIVIDE = 'ELEMENT_DIVIDE',
  ELEMENT_MODULO = 'ELEMENT_MODULO',
  ELEMENT_POWER = 'ELEMENT_POWER',
  
  // Logical operators
  AND = 'AND',
  OR = 'OR',
  NOT = 'NOT',
  LOGICAL_AND = 'LOGICAL_AND',
  LOGICAL_OR = 'LOGICAL_OR',
  
  // Comparison operators
  EQUALS = 'EQUALS',
  NOT_EQUALS = 'NOT_EQUALS',
  LESS_THAN = 'LESS_THAN',
  LESS_EQUAL = 'LESS_EQUAL',
  GREATER_THAN = 'GREATER_THAN',
  GREATER_EQUAL = 'GREATER_EQUAL',
  
  // Punctuation
  LEFT_PAREN = 'LEFT_PAREN',
  RIGHT_PAREN = 'RIGHT_PAREN',
  LEFT_BRACKET = 'LEFT_BRACKET',
  RIGHT_BRACKET = 'RIGHT_BRACKET',
  LEFT_BRACE = 'LEFT_BRACE',
  RIGHT_BRACE = 'RIGHT_BRACE',
  
  // Special characters
  DOT = 'DOT',
  COMMA = 'COMMA',
  COLON = 'COLON',
  SEMICOLON = 'SEMICOLON',
  QUESTION = 'QUESTION',
  ASSIGN = 'ASSIGN',
  FACTORIAL = 'FACTORIAL',
  TRANSPOSE = 'TRANSPOSE',
  
  // Special tokens
  NEWLINE = 'NEWLINE',
  EOF = 'EOF',
  WHITESPACE = 'WHITESPACE',
}

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

export interface ParseError {
  message: string;
  line: number;
  column: number;
  token?: Token;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ParseError[];
  ast?: ASTNode;
}

export enum ASTNodeType {
  PROGRAM = 'PROGRAM',
  STATEMENT = 'STATEMENT',
  ASSIGNMENT = 'ASSIGNMENT',
  EXPRESSION = 'EXPRESSION',
  CONDITIONAL = 'CONDITIONAL',
  BINARY_OP = 'BINARY_OP',
  UNARY_OP = 'UNARY_OP',
  POSTFIX_OP = 'POSTFIX_OP',
  FUNCTION_CALL = 'FUNCTION_CALL',
  MEMBER_ACCESS = 'MEMBER_ACCESS',
  INDEXING = 'INDEXING',
  ARRAY = 'ARRAY',
  OBJECT = 'OBJECT',
  UNIT_VALUE = 'UNIT_VALUE',
  RANGE = 'RANGE',
  SLICE = 'SLICE',
  SUMMATION = 'SUMMATION',
  NUMBER = 'NUMBER',
  STRING = 'STRING',
  IDENTIFIER = 'IDENTIFIER',
}

export interface ASTNode {
  type: ASTNodeType;
  value?: string | number;
  operator?: string;
  left?: ASTNode;
  right?: ASTNode;
  condition?: ASTNode;
  consequent?: ASTNode;
  alternate?: ASTNode;
  operand?: ASTNode;
  object?: ASTNode;
  property?: ASTNode;
  callee?: ASTNode;
  arguments?: ASTNode[];
  elements?: ASTNode[];
  properties?: { key: ASTNode; value: ASTNode }[];
  unit?: string;
  start?: ASTNode;
  end?: ASTNode;
  step?: ASTNode;
  children?: ASTNode[];
  // Summation-specific properties
  variable?: ASTNode;
  expression?: ASTNode;
}

export interface EvaluationContext {
  variables: Map<string, any>;
  functions: Map<string, Function>;
  constants: Map<string, any>;
}

export interface EvaluationResult {
  success: boolean;
  result?: any;
  error?: string;
}

export const DEFAULT_ALLOWED_FUNCTIONS = [
  'sqrt', 'cbrt', 'abs', 'sign', 'ceil', 'floor', 'round', 
  'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'atan2',
  'sinh', 'cosh', 'tanh', 'asinh', 'acosh', 'atanh',
  'log', 'log10', 'log2', 'exp', 'expm1', 'log1p',
  'min', 'max', 'mean', 'median', 'std', 'var',
  'sum', 'factorial', 'gamma',
] as const;

export interface MathServerConfig {
  maxExpressionLength: number;
  maxRecursionDepth: number;
  allowedFunctions: string[];
  timeoutMs: number;
}