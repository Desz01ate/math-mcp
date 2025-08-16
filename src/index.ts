#!/usr/bin/env node

import { Command } from 'commander';
import { MathMCPServer } from "./server.js";
import { MathServerConfig, DEFAULT_ALLOWED_FUNCTIONS } from "./types.js";

const program = new Command();

program
  .name('math-mcp')
  .description('MCP server for mathematical expression evaluation with strict grammar validation')
  .version('1.0.0')
  .option(
    '--max-expression-length <number>',
    'Maximum expression length',
    (value) => {
      const parsed = parseInt(value, 10);
      if (isNaN(parsed) || parsed <= 0) {
        throw new Error(`Invalid max-expression-length: ${value}. Must be a positive integer.`);
      }
      return parsed;
    },
    1000
  )
  .option(
    '--max-recursion-depth <number>',
    'Maximum recursion depth',
    (value) => {
      const parsed = parseInt(value, 10);
      if (isNaN(parsed) || parsed <= 0) {
        throw new Error(`Invalid max-recursion-depth: ${value}. Must be a positive integer.`);
      }
      return parsed;
    },
    100
  )
  .option(
    '--timeout <number>',
    'Evaluation timeout in milliseconds',
    (value) => {
      const parsed = parseInt(value, 10);
      if (isNaN(parsed) || parsed <= 0) {
        throw new Error(`Invalid timeout: ${value}. Must be a positive integer.`);
      }
      return parsed;
    },
    5000
  )
  .option(
    '--allowed-functions <functions>',
    `Comma-separated list of allowed functions. Available: ${DEFAULT_ALLOWED_FUNCTIONS.join(', ')}`,
    (value) => {
      const functions = value.split(',').map(f => f.trim());
      const invalidFunctions = functions.filter(f => !DEFAULT_ALLOWED_FUNCTIONS.includes(f as any));
      
      if (invalidFunctions.length > 0) {
        throw new Error(
          `Invalid functions: ${invalidFunctions.join(', ')}. ` +
          `Supported functions: ${DEFAULT_ALLOWED_FUNCTIONS.join(', ')}`
        );
      }
      
      return functions;
    }
  );

program.parse();

const options = program.opts();

// Build config from parsed options
const config: Partial<MathServerConfig> = {};
if (options.maxExpressionLength !== undefined) {
  config.maxExpressionLength = options.maxExpressionLength;
}
if (options.maxRecursionDepth !== undefined) {
  config.maxRecursionDepth = options.maxRecursionDepth;
}
if (options.timeout !== undefined) {
  config.timeoutMs = options.timeout;
}
if (options.allowedFunctions !== undefined) {
  config.allowedFunctions = options.allowedFunctions;
}

const mathServer = new MathMCPServer(config);

await mathServer.run();