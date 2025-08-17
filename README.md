# Math MCP Server

A secure Model Context Protocol (MCP) server for mathematical expression evaluation with strict grammar validation and comprehensive safety features.

## Features

### Security-First Design
- **Grammar Validation**: All expressions are validated against a comprehensive BNF grammar before evaluation
- **Function Whitelisting**: Only mathematical functions are allowed - no arbitrary code execution
- **CLI Validation**: Command-line arguments are validated to ensure only supported functions are allowed
- **Sandboxed Evaluation**: Secure execution environment with timeout protection
- **Expression Limits**: Built-in safeguards against overly complex expressions

### Mathematical Capabilities
- **Arithmetic Operations**: Basic operations (+, -, *, /, %, ^) with proper precedence
- **Mathematical Functions**: Trigonometric, logarithmic, statistical, and utility functions
- **Constants**: Built-in mathematical constants (pi, e, tau, phi, etc.)
- **Variables**: Variable assignment and reuse across expressions
- **Advanced Features**:
  - Conditional expressions (ternary operator)
  - Logical operations (and, or, not)
  - Comparison operations (==, !=, <, <=, >, >=)
  - Arrays and object notation
  - Range notation (a:b:c)
  - Summation operations (sigma functions)
  - Unit values and member access
  - Factorial and transpose operations

### MCP Integration
- **6 Tools** for expression evaluation and variable management
- **3 Resources** providing grammar specification and function documentation
- **Real-time Validation** with detailed error reporting
- **Session State** with persistent variable context
- **Configurable Runtime** with CLI options for fine-grained control

## Installation

### Prerequisites
- Node.js >= 18.0.0
- npm or yarn package manager

### NPM Installation (Recommended)

The package is available on npm at https://www.npmjs.com/package/math-mcp

```bash
# Install globally
npm install -g math-mcp

# Start the server
math-mcp
```

### Development Installation

```bash
# Clone the repository
git clone https://github.com/Desz01ate/math-mcp
cd math-mcp

# Install dependencies and build
npm install
npm run build

# Start the server
npm start
```

### Installation for LLM Agents

#### Claude Desktop Integration

To use this MCP server with Claude Desktop, first install the package globally:

```bash
npm install -g math-mcp
```

Then add the following configuration to your Claude Desktop settings:

**On macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**On Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "math-mcp": {
      "command": "math-mcp",
      "args": [],
      "env": {}
    }
  }
}
```

**Alternative for development (from source):**

```json
{
  "mcpServers": {
    "math-mcp": {
      "command": "node",
      "args": ["/path/to/math-mcp/dist/index.js"],
      "env": {}
    }
  }
}
```

#### Other MCP Clients

For other MCP-compatible clients, you can run the server directly:

```bash
# If installed globally via npm
math-mcp

# With custom configuration
math-mcp --max-expression-length 2000 --timeout 10000

# Or if running from source
npm start

# With custom configuration from source
npm start -- --max-expression-length 2000 --timeout 10000
```

The server will start and listen for MCP connections on stdio.

#### Docker Installation

```bash
# Build the Docker image
docker build -t math-mcp .

# Run the container
docker run -it math-mcp
```

#### Troubleshooting Installation

**Common Issues:**

1. **"Command not found" error**
   - Ensure Node.js >= 18.0.0 is installed: `node --version`
   - Verify npm is available: `npm --version`
   - For global installation, ensure npm global bin is in PATH

2. **Claude Desktop not detecting the server**
   - Verify the path in `claude_desktop_config.json` is correct
   - Ensure the server builds successfully: `npm run build`
   - Check Claude Desktop logs for connection errors
   - Restart Claude Desktop after configuration changes

3. **Permission errors**
   - Use `sudo` for global npm installations if needed
   - Ensure write permissions in the installation directory
   - On Windows, run terminal as Administrator if needed

4. **Build failures**
   - Clear npm cache: `npm cache clean --force`
   - Remove node_modules and reinstall: `rm -rf node_modules && npm install`
   - Ensure TypeScript dependencies are installed

5. **Server startup issues**
   - Check if port is already in use
   - Verify all dependencies are installed
   - Run `npm run typecheck` to check for type errors

**Testing Installation:**

```bash
# Verify the server starts correctly
npm start

# Run the test suite
npm test

# Test with demo examples
node demo/run-all-demos.js
```

## Usage

### As MCP Server

Start the server:

```bash
npm start
# or
math-mcp
```

The server runs as an MCP server and can be integrated with Claude Desktop or other MCP clients.

### Configuration Options

The server supports various configuration options via command-line flags:

```bash
# Basic usage
math-mcp

# With custom configuration
math-mcp --max-expression-length 2000 --timeout 10000 --allowed-functions "sqrt,sin,cos"

# Show help and available options
math-mcp --help

# Show version
math-mcp --version
```

**Available Options:**

- `--max-expression-length <number>` - Maximum expression length (default: 1000)
- `--max-recursion-depth <number>` - Maximum recursion depth (default: 100)  
- `--timeout <number>` - Evaluation timeout in milliseconds (default: 5000)
- `--allowed-functions <functions>` - Comma-separated list of allowed functions
- `--help` - Display help information
- `--version` - Show version number

**Supported Functions:**
`sqrt`, `cbrt`, `abs`, `sign`, `ceil`, `floor`, `round`, `sin`, `cos`, `tan`, `asin`, `acos`, `atan`, `atan2`, `sinh`, `cosh`, `tanh`, `asinh`, `acosh`, `atanh`, `log`, `log10`, `log2`, `exp`, `expm1`, `log1p`, `min`, `max`, `mean`, `median`, `std`, `var`, `sum`, `factorial`, `gamma`

### Development Mode

```bash
npm run dev
```

### Running Examples

```bash
# Run all demo examples
node demo/run-all-demos.js

# Run specific demos
node demo/basic-operations.js
node demo/mathematical-functions.js
node demo/conditional-logic.js
node demo/test-summation.js
node demo/statistics-probability.js
node demo/calculus-applications.js
node demo/advanced-features.js
```

## MCP Tools

### `evaluate`
Evaluate mathematical expressions with full validation.

```json
{
  "expression": "2 * pi * radius^2",
  "validate_only": false
}
```

### `validate_syntax`
Validate expression syntax without evaluation.

```json
{
  "expression": "sin(x) + cos(y)"
}
```

### `set_variable` / `get_variable`
Manage variables in the math context.

```json
{
  "name": "radius",
  "expression": "5"
}
```

### `list_variables` / `clear_variables`
List or clear all defined variables.

## MCP Resources

### `math://grammar`
Access the complete BNF grammar specification.

### `math://functions`
Get the list of all supported mathematical functions.

### `math://constants`
Retrieve all predefined mathematical constants.

## Expression Examples

### Basic Arithmetic
```
2 + 3 * 4          // 14 (order of operations)
(2 + 3) * 4        // 20 (parentheses)
2^3 + 1            // 9 (exponentiation)
15 % 4             // 3 (modulo)
```

### Mathematical Functions
```
sin(pi/2)          // 1
log(e)             // 1
sqrt(16)           // 4
abs(-5)            // 5
```

### Variables and Constants
```
x = 5
y = 2 * x          // 10
area = pi * r^2    // Circle area
```

### Advanced Features
```
x > 0 ? x : -x     // Absolute value using ternary
sigma(i, 1, 10, i^2)  // Sum of squares 1 to 10
[1, 2, 3, 4]       // Arrays
{x: 1, y: 2}       // Objects
```

### Conditional Logic
```
x > 0 and y > 0    // Logical AND
not (x == 0)       // Logical NOT
a >= b ? a : b     // Maximum using ternary
```

## Grammar Specification

The server implements a comprehensive BNF grammar supporting:

- **Operators**: Arithmetic, logical, comparison, with proper precedence
- **Data Types**: Numbers, strings, arrays, objects
- **Functions**: Extensive mathematical function library
- **Control Flow**: Conditional expressions and logical operations
- **Advanced Math**: Summation, ranges, units, member access

See `grammar.txt` for the complete specification or access via `math://grammar` resource.

## Development

### Available Scripts

```bash
npm run build      # Compile TypeScript
npm run dev        # Development mode with tsx
npm start          # Start compiled server
npm test           # Run test suite
npm run test:watch # Watch mode testing
npm run lint       # ESLint checking
npm run typecheck  # Type checking only
npm run setup      # Full setup: install, build, test
```

### Configuration Examples

```bash
# Restrict to basic functions only
math-mcp --allowed-functions "sqrt,abs,sin,cos"

# Increase limits for complex expressions
math-mcp --max-expression-length 5000 --timeout 15000

# Minimal configuration for simple calculations
math-mcp --allowed-functions "sqrt,abs" --max-expression-length 500
```

### Project Structure

```
src/
├── server.ts           # MCP server implementation
├── evaluator.ts        # Secure expression evaluator
├── grammar-parser.ts   # BNF grammar parser
├── tokenizer.ts        # Lexical analyzer
├── tools/              # MCP tool implementations
├── resources/          # MCP resource handlers
└── __tests__/          # Test suite

demo/                   # Example scripts
grammar.txt            # BNF grammar specification
```

### Testing

```bash
npm test               # Run all tests
npm run test:watch     # Watch mode
```

Tests cover:
- Tokenizer functionality
- Grammar parser validation
- Expression evaluation
- Integration scenarios
- Summation operations
- CLI configuration validation

## Security Considerations

This server is designed with security as a primary concern:

1. **No Code Execution**: Only mathematical expressions are evaluated
2. **Grammar Validation**: All input is validated against a strict grammar
3. **Function Whitelisting**: Only approved mathematical functions are available
4. **CLI Validation**: Command-line function arguments are validated against the whitelist
5. **Timeout Protection**: Expressions are evaluated with time limits
6. **Input Sanitization**: All input is properly sanitized before processing

## License

MIT License - see LICENSE file for details.

## Support

For issues and feature requests, please use the GitHub issue tracker.

## Acknowledgments

- Built with [MCP SDK](https://github.com/modelcontextprotocol/typescript-sdk)