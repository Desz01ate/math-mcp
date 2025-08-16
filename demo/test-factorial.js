import { GrammarParser } from '../dist/grammar-parser.js';
import { MathEvaluator } from '../dist/evaluator.js';

const parser = new GrammarParser();
const evaluator = new MathEvaluator();

const testCases = [
  '5!',
  '3! + 2!',
  '(4 + 1)!',
  '!true',  // prefix not
  '0!',
  '1!',
  '3!!', // multi-factorials
  '3!! != 720' // multiple use cases combine
];

console.log('Testing factorial expressions:');
for (const expr of testCases) {
  try {
    console.log(`\nTesting: ${expr}`);
    
    // First test parsing
    const parseResult = parser.parse(expr);
    if (!parseResult.isValid) {
      console.log(`  Parse ERROR: ${parseResult.errors.map(e => e.message).join(', ')}`);
      continue;
    }
    console.log(`  Parsed successfully`);
    
    // Then test evaluation
    const evalResult = evaluator.evaluateAST(parseResult.ast);
    if (evalResult.success) {
      console.log(`  Result: ${evalResult.result}`);
    } else {
      console.log(`  Eval ERROR: ${evalResult.error}`);
    }
  } catch (error) {
    console.log(`  EXCEPTION: ${error.message}`);
  }
}