export const toolDefinitions = [
  {
    name: 'evaluate',
    description: 'Evaluate mathematical expressions with strict grammar validation',
    inputSchema: {
      type: 'object',
      properties: {
        expression: {
          type: 'string',
          description: 'Mathematical expression to evaluate',
        },
        validate_only: {
          type: 'boolean',
          description: 'If true, only validate syntax without evaluation',
          default: false,
        },
      },
      required: ['expression'],
    },
  },
  {
    name: 'validate_syntax',
    description: 'Validate mathematical expression syntax against grammar',
    inputSchema: {
      type: 'object',
      properties: {
        expression: {
          type: 'string',
          description: 'Mathematical expression to validate',
        },
      },
      required: ['expression'],
    },
  },
  {
    name: 'set_variable',
    description: 'Set a variable value in the math context',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Variable name',
        },
        expression: {
          type: 'string',
          description: 'Mathematical expression to evaluate and store',
        },
      },
      required: ['name', 'expression'],
    },
  },
  {
    name: 'get_variable',
    description: 'Get the value of a variable',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Variable name',
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'list_variables',
    description: 'List all defined variables',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'clear_variables',
    description: 'Clear all defined variables',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];