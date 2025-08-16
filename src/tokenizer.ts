import { Token, TokenType } from './types.js';

export class Tokenizer {
  private input: string;
  private position: number = 0;
  private line: number = 1;
  private column: number = 1;

  constructor(input: string) {
    this.input = input;
  }

  tokenize(): Token[] {
    const tokens: Token[] = [];
    
    while (this.position < this.input.length) {
      const token = this.nextToken();
      if (token && token.type !== TokenType.WHITESPACE) {
        tokens.push(token);
      }
    }
    
    tokens.push({
      type: TokenType.EOF,
      value: '',
      line: this.line,
      column: this.column,
    });
    
    return tokens;
  }

  private nextToken(): Token | null {
    if (this.position >= this.input.length) {
      return null;
    }

    const startLine = this.line;
    const startColumn = this.column;
    const char = this.input[this.position];

    // Skip whitespace (except newlines)
    if (char === ' ' || char === '\t' || char === '\r') {
      this.advance();
      return {
        type: TokenType.WHITESPACE,
        value: char,
        line: startLine,
        column: startColumn,
      };
    }

    // Handle newlines
    if (char === '\n') {
      this.advance();
      this.line++;
      this.column = 1;
      return {
        type: TokenType.NEWLINE,
        value: char,
        line: startLine,
        column: startColumn,
      };
    }

    // Handle numbers
    if (this.isDigit(char)) {
      return this.readNumber(startLine, startColumn);
    }

    // Handle identifiers and keywords
    if (this.isLetter(char)) {
      return this.readIdentifier(startLine, startColumn);
    }

    // Handle strings (support both single and double quotes)
    if (char === '"' || char === "'") {
      // If single quote without a closing pair, treat as transpose operator
      if (char === "'") {
        const nextClose = this.input.indexOf("'", this.position + 1);
        if (nextClose === -1) {
          // No closing quote found; not a string literal
          return this.readOperator(startLine, startColumn);
        }
      }
      return this.readString(startLine, startColumn);
    }

    // Handle operators and punctuation
    return this.readOperator(startLine, startColumn);
  }

  private readNumber(line: number, column: number): Token {
    let value = '';
    
    // Read integer part
    while (this.position < this.input.length && this.input[this.position] && this.isDigit(this.input[this.position])) {
      value += this.input[this.position];
      this.advance();
    }
    
    // Read decimal part
    if (this.position < this.input.length && this.input[this.position] === '.') {
      value += this.input[this.position];
      this.advance();
      
      while (this.position < this.input.length && this.isDigit(this.input[this.position]!)) {
        value += this.input[this.position];
        this.advance();
      }
    }
    
    // Read scientific notation
    if (this.position < this.input.length && 
        (this.input[this.position] === 'e' || this.input[this.position] === 'E')) {
      value += this.input[this.position];
      this.advance();
      
      if (this.position < this.input.length && 
          (this.input[this.position] === '+' || this.input[this.position] === '-')) {
        value += this.input[this.position];
        this.advance();
      }
      
      while (this.position < this.input.length && this.isDigit(this.input[this.position]!)) {
        value += this.input[this.position];
        this.advance();
      }
    }

    return {
      type: TokenType.NUMBER,
      value,
      line,
      column,
    };
  }

  private readIdentifier(line: number, column: number): Token {
    let value = '';
    
    while (this.position < this.input.length && this.input[this.position] && 
           (this.isLetter(this.input[this.position]!) || 
            this.isDigit(this.input[this.position]!) || 
            this.input[this.position] === '_')) {
      value += this.input[this.position];
      this.advance();
    }

    // Check for keywords
    const tokenType = this.getKeywordType(value) || TokenType.IDENTIFIER;
    
    return {
      type: tokenType,
      value,
      line,
      column,
    };
  }

  private readString(line: number, column: number): Token {
    const quote = this.input[this.position];
    let value = '';
    
    this.advance(); // Skip opening quote
    
    while (this.position < this.input.length && this.input[this.position] !== quote) {
      if (this.input[this.position] === '\\') {
        this.advance();
        if (this.position < this.input.length) {
          // Handle escape sequences
          const escaped = this.input[this.position] || '';
          switch (escaped) {
            case 'n':
              value += '\n';
              break;
            case 't':
              value += '\t';
              break;
            case 'r':
              value += '\r';
              break;
            case '\\':
              value += '\\';
              break;
            case '"':
              value += '"';
              break;
            case "'":
              value += "'";
              break;
            default:
              value += escaped;
          }
          this.advance();
        }
      } else if (this.input[this.position]) {
        value += this.input[this.position];
        this.advance();
      }
    }
    
    if (this.position < this.input.length) {
      this.advance(); // Skip closing quote
    }

    return {
      type: TokenType.STRING,
      value,
      line,
      column,
    };
  }

  private readOperator(line: number, column: number): Token {
    const char = this.input[this.position] || '';
    const nextChar = this.position + 1 < this.input.length ? this.input[this.position + 1] || '' : '';
    
    // Two-character operators
    const twoChar = char + nextChar;
    switch (twoChar) {
      case '==':
        this.advance();
        this.advance();
        return { type: TokenType.EQUALS, value: twoChar, line, column };
      case '!=':
        this.advance();
        this.advance();
        return { type: TokenType.NOT_EQUALS, value: twoChar, line, column };
      case '<=':
        this.advance();
        this.advance();
        return { type: TokenType.LESS_EQUAL, value: twoChar, line, column };
      case '>=':
        this.advance();
        this.advance();
        return { type: TokenType.GREATER_EQUAL, value: twoChar, line, column };
      case '&&':
        this.advance();
        this.advance();
        return { type: TokenType.LOGICAL_AND, value: twoChar, line, column };
      case '||':
        this.advance();
        this.advance();
        return { type: TokenType.LOGICAL_OR, value: twoChar, line, column };
      case '.*':
        this.advance();
        this.advance();
        return { type: TokenType.ELEMENT_MULTIPLY, value: twoChar, line, column };
      case './':
        this.advance();
        this.advance();
        return { type: TokenType.ELEMENT_DIVIDE, value: twoChar, line, column };
      case '.%':
        this.advance();
        this.advance();
        return { type: TokenType.ELEMENT_MODULO, value: twoChar, line, column };
      case '.^':
        this.advance();
        this.advance();
        return { type: TokenType.ELEMENT_POWER, value: twoChar, line, column };
    }
    
    // Single-character operators
    this.advance();
    switch (char) {
      case '+': return { type: TokenType.PLUS, value: char, line, column };
      case '-': return { type: TokenType.MINUS, value: char, line, column };
      case '*': return { type: TokenType.MULTIPLY, value: char, line, column };
      case '/': return { type: TokenType.DIVIDE, value: char, line, column };
      case '%': return { type: TokenType.MODULO, value: char, line, column };
      case '^': return { type: TokenType.POWER, value: char, line, column };
      case '<': return { type: TokenType.LESS_THAN, value: char, line, column };
      case '>': return { type: TokenType.GREATER_THAN, value: char, line, column };
      case '(': return { type: TokenType.LEFT_PAREN, value: char, line, column };
      case ')': return { type: TokenType.RIGHT_PAREN, value: char, line, column };
      case '[': return { type: TokenType.LEFT_BRACKET, value: char, line, column };
      case ']': return { type: TokenType.RIGHT_BRACKET, value: char, line, column };
      case '{': return { type: TokenType.LEFT_BRACE, value: char, line, column };
      case '}': return { type: TokenType.RIGHT_BRACE, value: char, line, column };
      case '.': return { type: TokenType.DOT, value: char, line, column };
      case ',': return { type: TokenType.COMMA, value: char, line, column };
      case ':': return { type: TokenType.COLON, value: char, line, column };
      case ';': return { type: TokenType.SEMICOLON, value: char, line, column };
      case '?': return { type: TokenType.QUESTION, value: char, line, column };
      case '=': return { type: TokenType.ASSIGN, value: char, line, column };
      case '!': return { type: TokenType.FACTORIAL, value: char, line, column };
      case "'": return { type: TokenType.TRANSPOSE, value: char, line, column };
      default:
        throw new Error(`Unexpected character '${char}' at line ${line}, column ${column}`);
    }
  }

  private getKeywordType(value: string): TokenType | null {
    switch (value) {
      case 'and': return TokenType.AND;
      case 'or': return TokenType.OR;
      case 'not': return TokenType.NOT;
      default: return null;
    }
  }

  private isDigit(char: string): boolean {
    return char >= '0' && char <= '9';
  }

  private isLetter(char: string): boolean {
    return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z');
  }

  private advance(): void {
    this.position++;
    this.column++;
  }
}
