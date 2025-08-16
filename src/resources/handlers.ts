import { MathEvaluator } from '../evaluator.js';

export class ResourceHandlers {
  private evaluator: MathEvaluator;

  constructor(evaluator: MathEvaluator) {
    this.evaluator = evaluator;
  }

  async handleResourceRead(uri: string) {
    switch (uri) {
      case 'math://grammar':
        return {
          contents: [
            {
              uri: 'math://grammar',
              mimeType: 'text/plain',
              text: await this.getGrammarSpec(),
            },
          ],
        };

      case 'math://functions':
        return {
          contents: [
            {
              uri: 'math://functions',
              mimeType: 'application/json',
              text: JSON.stringify({
                functions: this.evaluator.listFunctions(),
                description: 'List of supported mathematical functions',
              }, null, 2),
            },
          ],
        };

      case 'math://constants':
        return {
          contents: [
            {
              uri: 'math://constants',
              mimeType: 'application/json',
              text: JSON.stringify({
                constants: this.evaluator.listConstants(),
                description: 'List of predefined mathematical constants',
              }, null, 2),
            },
          ],
        };

      default:
        throw new Error(`Unknown resource: ${uri}`);
    }
  }

  private async getGrammarSpec(): Promise<string> {
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      const grammarPath = path.resolve(process.cwd(), 'grammar.txt');
      return await fs.readFile(grammarPath, 'utf-8');
    } catch {
      return 'Grammar specification not available';
    }
  }
}