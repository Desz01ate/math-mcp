import { Token, TokenType, ASTNode, ASTNodeType, ValidationResult, ParseError } from './types.js';
import { Tokenizer } from './tokenizer.js';

export class GrammarParser {
  private tokens: Token[] = [];
  private current: number = 0;
  private errors: ParseError[] = [];
  // Track contexts where ':' should not be parsed as range (e.g., conditional branches)
  private rangeDisableDepth: number = 0;

  parse(input: string): ValidationResult {
    try {
      const tokenizer = new Tokenizer(input);
      this.tokens = tokenizer.tokenize();
      this.current = 0;
      this.errors = [];

      const ast = this.parseProgram();
      
      return {
        isValid: this.errors.length === 0,
        errors: this.errors,
        ast: this.errors.length === 0 ? ast : undefined,
      };
    } catch (error) {
      this.errors.push({
        message: error instanceof Error ? error.message : 'Unknown parsing error',
        line: this.peek().line,
        column: this.peek().column,
        token: this.peek(),
      });
      
      return {
        isValid: false,
        errors: this.errors,
      };
    }
  }

  private parseProgram(): ASTNode {
    const statements: ASTNode[] = [];

    while (!this.isAtEnd()) {
      // Skip newlines at the program level
      if (this.match(TokenType.NEWLINE)) {
        continue;
      }

      const stmt = this.parseStatement();
      if (stmt) {
        statements.push(stmt);
      }

      // Expect semicolon or newline after statement (optional for last statement)
      if (!this.isAtEnd() && !this.match(TokenType.SEMICOLON, TokenType.NEWLINE)) {
        if (!this.check(TokenType.EOF)) {
          this.error('Expected semicolon or newline after statement');
        }
      }
    }

    return {
      type: ASTNodeType.PROGRAM,
      children: statements,
    };
  }

  private parseStatement(): ASTNode | null {
    if (this.isAtEnd()) return null;

    // Look ahead to see if this is an assignment
    const checkpoint = this.current;
    let isAssignment = false;
    
    // Check if we have identifier followed by '=' or identifier followed by '(' ... ')' followed by '='
    if (this.check(TokenType.IDENTIFIER)) {
      this.advance();
      if (this.check(TokenType.ASSIGN)) {
        // Simple variable assignment: x = ...
        isAssignment = true;
      } else if (this.check(TokenType.LEFT_PAREN)) {
        // Potential function assignment: f(...) = ...
        this.advance(); // consume '('
        
        // Skip through parameter list
        let parenDepth = 1;
        while (!this.isAtEnd() && parenDepth > 0) {
          if (this.check(TokenType.LEFT_PAREN)) {
            parenDepth++;
          } else if (this.check(TokenType.RIGHT_PAREN)) {
            parenDepth--;
          }
          this.advance();
        }
        
        // Check if we have '=' after the parentheses
        if (this.check(TokenType.ASSIGN)) {
          isAssignment = true;
        }
      }
    }
    
    // Reset position
    this.current = checkpoint;
    
    if (isAssignment) {
      return this.parseAssignment();
    } else {
      return this.parseExpression();
    }
  }

  private parseAssignment(): ASTNode {
    const lvalue = this.parseLValue();
    
    if (!this.match(TokenType.ASSIGN)) {
      throw new Error('Expected assignment operator');
    }
    
    const expression = this.parseAssignmentRHS();

    return {
      type: ASTNodeType.ASSIGNMENT,
      left: lvalue,
      right: expression,
    };
  }

  // Parse right-hand side of assignment allowing chained assignments
  private parseAssignmentRHS(): ASTNode {
    const checkpoint = this.current;
    if (this.check(TokenType.IDENTIFIER)) {
      this.advance();
      if (this.check(TokenType.ASSIGN)) {
        // It's a chained assignment, reset and parse as assignment
        this.current = checkpoint;
        return this.parseAssignment();
      }
    }
    // Not an assignment, reset and parse as expression
    this.current = checkpoint;
    return this.parseExpression();
  }

  private parseLValue(): ASTNode {
    let node = this.parseIdentifier();

    while (true) {
      if (this.match(TokenType.LEFT_PAREN)) {
        // Function definition: identifier(params)
        const params: ASTNode[] = [];
        
        if (!this.check(TokenType.RIGHT_PAREN)) {
          params.push(this.parseIdentifier());
          while (this.match(TokenType.COMMA)) {
            params.push(this.parseIdentifier());
          }
        }
        
        this.consume(TokenType.RIGHT_PAREN, 'Expected \')\' after parameters');
        
        node = {
          type: ASTNodeType.FUNCTION_CALL,
          callee: node,
          arguments: params,
        };
      } else {
        break;
      }
    }

    return node;
  }

  private parseExpression(): ASTNode {
    return this.parseConditional();
  }

  private parseConditional(): ASTNode {
    let expr = this.parseLogicalOr();

    if (this.match(TokenType.QUESTION)) {
      // Prevent ':' being parsed as range while parsing consequent
      this.rangeDisableDepth++;
      const consequent = this.parseConditional();
      this.consume(TokenType.COLON, 'Expected \':\' after conditional consequent');
      this.rangeDisableDepth--;
      const alternate = this.parseConditional();

      expr = {
        type: ASTNodeType.CONDITIONAL,
        condition: expr,
        consequent,
        alternate,
      };
    }

    return expr;
  }

  private parseLogicalOr(): ASTNode {
    let expr = this.parseLogicalAnd();

    while (this.match(TokenType.OR, TokenType.LOGICAL_OR)) {
      const operator = this.previous().value;
      const right = this.parseLogicalAnd();
      expr = {
        type: ASTNodeType.BINARY_OP,
        operator,
        left: expr,
        right,
      };
    }

    return expr;
  }

  private parseLogicalAnd(): ASTNode {
    let expr = this.parseCompare();

    while (this.match(TokenType.AND, TokenType.LOGICAL_AND)) {
      const operator = this.previous().value;
      const right = this.parseCompare();
      expr = {
        type: ASTNodeType.BINARY_OP,
        operator,
        left: expr,
        right,
      };
    }

    return expr;
  }

  private parseCompare(): ASTNode {
    let expr = this.parseRange();

    while (this.match(TokenType.EQUALS, TokenType.NOT_EQUALS, 
                     TokenType.LESS_THAN, TokenType.LESS_EQUAL,
                     TokenType.GREATER_THAN, TokenType.GREATER_EQUAL)) {
      const operator = this.previous().value;
      const right = this.parseRange();
      expr = {
        type: ASTNodeType.BINARY_OP,
        operator,
        left: expr,
        right,
      };
    }

    return expr;
  }

  private parseRange(): ASTNode {
    let expr = this.parseAddSub();

    // If ranges are disabled (e.g., within conditional branch), do not consume ':' as range
    if (this.rangeDisableDepth > 0) {
      return expr;
    }
    if (this.match(TokenType.COLON)) {
      const end = this.parseAddSub();
      let step: ASTNode | undefined;

      if (this.match(TokenType.COLON)) {
        step = this.parseAddSub();
      }

      expr = {
        type: ASTNodeType.RANGE,
        start: expr,
        end,
        step,
      };
    }

    return expr;
  }

  private parseAddSub(): ASTNode {
    let expr = this.parseMulDiv();

    while (this.match(TokenType.PLUS, TokenType.MINUS)) {
      const operator = this.previous().value;
      const right = this.parseMulDiv();
      expr = {
        type: ASTNodeType.BINARY_OP,
        operator,
        left: expr,
        right,
      };
    }

    return expr;
  }

  private parseMulDiv(): ASTNode {
    let expr = this.parsePow();

    while (this.match(TokenType.MULTIPLY, TokenType.DIVIDE, TokenType.MODULO,
                     TokenType.ELEMENT_MULTIPLY, TokenType.ELEMENT_DIVIDE, TokenType.ELEMENT_MODULO)) {
      const operator = this.previous().value;
      const right = this.parsePow();
      expr = {
        type: ASTNodeType.BINARY_OP,
        operator,
        left: expr,
        right,
      };
    }

    return expr;
  }

  private parsePow(): ASTNode {
    let expr = this.parseUnary();

    // Right-associative
    if (this.match(TokenType.POWER, TokenType.ELEMENT_POWER)) {
      const operator = this.previous().value;
      const right = this.parsePow(); // Right-associative recursion
      expr = {
        type: ASTNodeType.BINARY_OP,
        operator,
        left: expr,
        right,
      };
    }

    return expr;
  }

  private parseUnary(): ASTNode {
    if (this.match(TokenType.PLUS, TokenType.MINUS, TokenType.NOT, TokenType.FACTORIAL)) {
      const operator = this.previous().value;
      // Disallow consecutive '+' operators like '2 + + 3'
      const prevToken = this.tokens[this.current - 2] || { type: TokenType.EOF, value: '', line: 1, column: 1 } as Token;
      if (operator === '+' && prevToken.type === TokenType.PLUS) {
        throw this.error('Unexpected consecutive operator');
      }
      const operand = this.parseUnary();
      return {
        type: ASTNodeType.UNARY_OP,
        operator: operator === '!' ? 'not' : operator, // Convert ! to 'not' for prefix usage
        operand,
      };
    }

    return this.parsePostfix();
  }

  private parsePostfix(): ASTNode {
    let expr = this.parsePrimary();

    while (this.match(TokenType.FACTORIAL, TokenType.TRANSPOSE)) {
      const operator = this.previous().value;
      expr = {
        type: ASTNodeType.POSTFIX_OP,
        operator,
        operand: expr,
      };
    }

    return expr;
  }

  private parsePrimary(): ASTNode {
    if (this.match(TokenType.NUMBER)) {
      const value = parseFloat(this.previous().value);
      
      // Check if this number is followed by a unit
      if (this.check(TokenType.IDENTIFIER)) {
        const unit = this.parseUnit();
        return {
          type: ASTNodeType.UNIT_VALUE,
          operand: {
            type: ASTNodeType.NUMBER,
            value,
          },
          unit: unit.value as string,
        };
      }
      
      return {
        type: ASTNodeType.NUMBER,
        value,
      };
    }

    if (this.match(TokenType.STRING)) {
      const value = this.previous().value;
      return {
        type: ASTNodeType.STRING,
        value,
      };
    }

    if (this.check(TokenType.IDENTIFIER)) {
      // Look ahead to distinguish between identifiers and function calls
      const identifier = this.parseIdentifier();
      
      if (this.match(TokenType.LEFT_PAREN)) {
        // Check if this is a summation call
        if (identifier.value === 'sigma') {
          return this.parseSummationCall(identifier);
        }
        
        // Regular function call
        const args: ASTNode[] = [];
        
        if (!this.check(TokenType.RIGHT_PAREN)) {
          args.push(this.parseExpression());
          while (this.match(TokenType.COMMA)) {
            args.push(this.parseExpression());
          }
        }
        
        this.consume(TokenType.RIGHT_PAREN, 'Expected \')\' after arguments');
        
        return {
          type: ASTNodeType.FUNCTION_CALL,
          callee: identifier,
          arguments: args,
        };
      }
      
      return identifier;
    }

    if (this.match(TokenType.LEFT_BRACKET)) {
      return this.parseArray();
    }


    if (this.match(TokenType.LEFT_PAREN)) {
      const expr = this.parseExpression();
      this.consume(TokenType.RIGHT_PAREN, 'Expected \')\' after expression');
      
      // Check if this parenthesized expression is followed by a unit
      if (this.check(TokenType.IDENTIFIER)) {
        const unit = this.parseUnit();
        return {
          type: ASTNodeType.UNIT_VALUE,
          operand: expr,
          unit: unit.value as string,
        };
      }
      
      return expr;
    }

    throw this.error('Expected expression');
  }


  private parseArray(): ASTNode {
    const elements: ASTNode[] = [];
    
    if (!this.check(TokenType.RIGHT_BRACKET)) {
      elements.push(this.parseExpression());
      while (this.match(TokenType.COMMA)) {
        elements.push(this.parseExpression());
      }
    }
    
    this.consume(TokenType.RIGHT_BRACKET, 'Expected \']\' after array elements');
    
    return {
      type: ASTNodeType.ARRAY,
      elements,
    };
  }


  private parseIdentifier(): ASTNode {
    this.consume(TokenType.IDENTIFIER, 'Expected identifier');
    return {
      type: ASTNodeType.IDENTIFIER,
      value: this.previous().value,
    };
  }

  private parseSummationCall(_identifier: ASTNode): ASTNode {
    // sigma(variable, start, end, expression)
    
    // Parse variable
    const variable = this.parseIdentifier();
    this.consume(TokenType.COMMA, 'Expected \',\' after summation variable');
    
    // Parse start
    const start = this.parseExpression();
    this.consume(TokenType.COMMA, 'Expected \',\' after summation start');
    
    // Parse end
    const end = this.parseExpression();
    this.consume(TokenType.COMMA, 'Expected \',\' after summation end');
    
    // Parse expression
    const expression = this.parseExpression();
    
    this.consume(TokenType.RIGHT_PAREN, 'Expected \')\' after summation expression');
    
    return {
      type: ASTNodeType.SUMMATION,
      variable,
      start,
      end,
      expression,
    };
  }

  private parseUnit(): ASTNode {
    let unitStr = '';
    
    this.consume(TokenType.IDENTIFIER, 'Expected unit identifier');
    unitStr = this.previous().value;
    
    while (this.match(TokenType.MULTIPLY, TokenType.DIVIDE)) {
      const op = this.previous().value;
      this.consume(TokenType.IDENTIFIER, 'Expected unit identifier');
      unitStr += op + this.previous().value;
    }
    
    return {
      type: ASTNodeType.IDENTIFIER,
      value: unitStr,
    };
  }

  // Utility methods
  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private check(...types: TokenType[]): boolean {
    if (this.isAtEnd()) return false;
    return types.includes(this.peek().type);
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private isAtEnd(): boolean {
    return this.peek().type === TokenType.EOF;
  }

  private peek(): Token {
    return this.tokens[this.current] || { 
      type: TokenType.EOF, 
      value: '', 
      line: 1, 
      column: 1 
    };
  }

  private previous(): Token {
    return this.tokens[this.current - 1] || { 
      type: TokenType.EOF, 
      value: '', 
      line: 1, 
      column: 1 
    };
  }

  private consume(type: TokenType, message: string): Token {
    if (this.check(type)) return this.advance();
    throw this.error(message);
  }

  private error(message: string): Error {
    const token = this.peek();
    this.errors.push({
      message,
      line: token.line,
      column: token.column,
      token,
    });
    return new Error(message);
  }
}
