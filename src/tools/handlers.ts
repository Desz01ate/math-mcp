import { GrammarParser } from '../grammar-parser.js';
import { MathEvaluator } from '../evaluator.js';
import { ValidationResult } from '../types.js';

export class ToolHandlers {
  private parser: GrammarParser;
  private evaluator: MathEvaluator;

  constructor(parser: GrammarParser, evaluator: MathEvaluator) {
    this.parser = parser;
    this.evaluator = evaluator;
  }

  async handleEvaluateMath(args: any) {
    const { expression, validate_only = false } = args;

    if (typeof expression !== 'string') {
      throw new Error('Expression must be a string');
    }

    const validation = this.parser.parse(expression);

    if (!validation.isValid) {
      return {
        content: [
          {
            type: 'text',
            text: this.formatValidationErrors(validation),
          },
        ],
      };
    }

    if (validate_only) {
      return {
        content: [
          {
            type: 'text',
            text: 'Expression is syntactically valid.',
          },
        ],
      };
    }

    const result = this.evaluator.evaluate(validation.ast);

    if (!result.success) {
      return {
        content: [
          {
            type: 'text',
            text: `Evaluation error: ${result.error}`,
          },
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            expression,
            result: result.result,
            type: typeof result.result,
          }, null, 2),
        },
      ],
    };
  }

  async handleValidateSyntax(args: any) {
    const { expression } = args;

    if (typeof expression !== 'string') {
      throw new Error('Expression must be a string');
    }

    const validation = this.parser.parse(expression);

    return {
      content: [
        {
          type: 'text',
          text: validation.isValid
            ? 'Expression is syntactically valid.'
            : this.formatValidationErrors(validation),
        },
      ],
    };
  }

  async handleSetVariable(args: any) {
    const { name, expression } = args;

    if (typeof name !== 'string' || typeof expression !== 'string') {
      throw new Error('Name and expression must be strings');
    }

    const validation = this.parser.parse(expression);
    if (!validation.isValid) {
      return {
        content: [
          {
            type: 'text',
            text: `Cannot set variable - ${this.formatValidationErrors(validation)}`,
          },
        ],
        isError: true,
      };
    }

    const result = this.evaluator.evaluate(validation.ast);

    if (!result.success) {
      return {
        content: [
          {
            type: 'text',
            text: `Cannot set variable - ${result.error}`,
          },
        ],
        isError: true,
      };
    }

    this.evaluator.setVariable(name, result.result);

    return {
      content: [
        {
          type: 'text',
          text: `Variable '${name}' set to: ${JSON.stringify(result.result)}`,
        },
      ],
    };
  }

  async handleGetVariable(args: any) {
    const { name } = args;

    if (typeof name !== 'string') {
      throw new Error('Variable name must be a string');
    }

    const value = this.evaluator.getVariable(name);

    if (value === undefined) {
      return {
        content: [
          {
            type: 'text',
            text: `Variable '${name}' is not defined`,
          },
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: `${name} = ${JSON.stringify(value)}`,
        },
      ],
    };
  }

  async handleListVariables() {
    const variables = this.evaluator.listVariables();

    if (variables.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: 'No variables defined',
          },
        ],
      };
    }

    const variableList = variables.map(name => {
      const value = this.evaluator.getVariable(name);
      return `${name} = ${JSON.stringify(value)}`;
    }).join('\n');

    return {
      content: [
        {
          type: 'text',
          text: `Defined variables:\n${variableList}`,
        },
      ],
    };
  }

  async handleClearVariables() {
    const count = this.evaluator.listVariables().length;
    this.evaluator.clearVariables();

    return {
      content: [
        {
          type: 'text',
          text: `Cleared ${count} variables`,
        },
      ],
    };
  }

  private formatValidationErrors(validation: ValidationResult): string {
    if (validation.isValid) {
      return 'No errors';
    }

    const errors = validation.errors.map(error => 
      `Line ${error.line}, Column ${error.column}: ${error.message}`
    ).join('\n');

    return `Syntax errors:\n${errors}`;
  }
}