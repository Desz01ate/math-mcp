#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { GrammarParser } from './grammar-parser.js';
import { MathEvaluator } from './evaluator.js';
import { toolDefinitions, ToolHandlers } from './tools/index.js';
import { resourceDefinitions, ResourceHandlers } from './resources/index.js';
import { MathServerConfig } from './types.js';

class MathMCPServer {
  public readonly server: Server;
  private parser: GrammarParser;
  private evaluator: MathEvaluator;
  private toolHandlers: ToolHandlers;
  private resourceHandlers: ResourceHandlers;

  constructor(config?: Partial<MathServerConfig>) {
    this.server = new Server(
      {
        name: 'math-expression-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
        },
      }
    );

    this.parser = new GrammarParser();
    this.evaluator = new MathEvaluator(config);
    this.toolHandlers = new ToolHandlers(this.parser, this.evaluator);
    this.resourceHandlers = new ResourceHandlers(this.evaluator);

    this.setupToolHandlers();
    this.setupResourceHandlers();
  }

  private setupToolHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: toolDefinitions,
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'evaluate':
            return await this.toolHandlers.handleEvaluateMath(args);

          case 'validate_syntax':
            return await this.toolHandlers.handleValidateSyntax(args);

          case 'set_variable':
            return await this.toolHandlers.handleSetVariable(args);

          case 'get_variable':
            return await this.toolHandlers.handleGetVariable(args);

          case 'list_variables':
            return await this.toolHandlers.handleListVariables();

          case 'clear_variables':
            return await this.toolHandlers.handleClearVariables();

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  private setupResourceHandlers(): void {
    // List available resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: resourceDefinitions,
      };
    });

    // Handle resource reads
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;
      return await this.resourceHandlers.handleResourceRead(uri);
    });
  }


  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Math MCP Server started');
  }
}

export { MathMCPServer };