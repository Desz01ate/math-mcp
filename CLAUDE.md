# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run build` - Compile TypeScript to JavaScript in dist/
- `npm run dev` - Run server in development mode with tsx
- `npm start` - Start the compiled MCP server
- `npm test` - Run tests with Vitest
- `npm run test:watch` - Run tests in watch mode  
- `npm run lint` - Lint TypeScript files with ESLint
- `npm run typecheck` - Type check without emitting files
- `npm run setup` - Full setup: install, build, and test

## Architecture Overview

This is an MCP (Model Context Protocol) server for secure mathematical expression evaluation with strict grammar validation. The system follows a three-layer architecture:

### Core Components

1. **Tokenizer** (`src/tokenizer.ts`) - Lexical analysis converting input strings into tokens
2. **GrammarParser** (`src/grammar-parser.ts`) - Recursive descent parser validating expressions against BNF grammar
3. **MathEvaluator** (`src/evaluator.ts`) - Secure expression evaluation using mathjs with function whitelisting
4. **MathMCPServer** (`src/server.ts`) - MCP server implementation coordinating all components

### Grammar Specification

The mathematical grammar is defined in `grammar.txt` as a comprehensive BNF specification supporting:
- Arithmetic, logical, and comparison operations
- Function calls and variable assignments
- Arrays, objects, and conditional expressions
- Range notation and summation operations
- Unit values and member access

### Tool System

Tools are organized in `src/tools/`:
- `evaluate` - Main expression evaluation with validation
- `validate_syntax` - Syntax-only validation
- `set_variable`/`get_variable` - Variable management
- `list_variables`/`clear_variables` - Context management

### Resource System 

Resources in `src/resources/` provide:
- `math://grammar` - Grammar specification access
- `math://functions` - Supported function list
- `math://constants` - Mathematical constants

### Security Model

The evaluator implements multiple security layers:
- Grammar validation before evaluation
- Function whitelisting (only mathematical functions allowed)
- Expression length limits and timeout protection
- Sandboxed execution environment

### Precision Handling

The system addresses JavaScript's floating-point precision limitations using decimal.js:

#### Features
- **Arbitrary-precision arithmetic**: Eliminates classic issues like `0.1 + 0.2 ≠ 0.3`
- **High-precision constants**: More accurate values for π, e, τ, and φ
- **Enhanced mathematical functions**: All trigonometric, logarithmic, and arithmetic operations use high precision
- **Smart comparisons**: Equality and inequality operations handle precision automatically
- **Financial accuracy**: Precise decimal calculations for currency and percentage operations

#### Implementation
- All mathematical operations route through `PrecisionMath` wrapper class
- Configured for 20 significant digits by default
- Seamlessly integrates with existing AST evaluation
- Backward compatible with all existing functionality

#### Examples
```javascript
// Classic JavaScript precision issues - now resolved:
0.1 + 0.2        // Returns exactly 0.3 (not 0.30000000000000004)
1.4 * 3          // Returns exactly 4.2 (not 4.199999999999999)  
0.57 * 100       // Returns exactly 57 (not 56.99999999999999)
sqrt(2) * sqrt(2) // Returns exactly 2 (not 2.0000000000000004)
```

### Testing

Tests in `src/__tests__/` cover:
- Tokenizer functionality
- Grammar parser validation
- Integration scenarios
- Summation operations

### Demo Scripts

The `demo/` directory contains JavaScript examples demonstrating various mathematical capabilities and can be run with `node demo/run-all-demos.js`.

## Key Patterns

- All expression processing follows: Tokenize → Parse → Validate → Evaluate
- Error handling provides detailed syntax errors with line/column information
- Variable context is maintained across evaluations within a session
- Security is enforced at multiple layers to prevent code injection