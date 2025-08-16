#!/usr/bin/env node

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🎯 Running All Math Library Demos\n');
console.log('=' .repeat(60));

const demos = [
  { 
    name: 'Basic Operations', 
    file: 'basic-operations.js',
    description: 'Arithmetic, constants, and variables'
  },
  { 
    name: 'Mathematical Functions', 
    file: 'mathematical-functions.js',
    description: 'Trigonometric, logarithmic, and utility functions'
  },
  { 
    name: 'Conditional Logic', 
    file: 'conditional-logic.js',
    description: 'Comparisons, logical operators, and ternary expressions'
  },
  { 
    name: 'Summation (Sigma)', 
    file: 'test-summation.js',
    description: 'Basic and advanced summation examples'
  },
  { 
    name: 'Statistics & Probability', 
    file: 'statistics-probability.js',
    description: 'Statistical calculations and probability examples'
  },
  { 
    name: 'Calculus Applications', 
    file: 'calculus-applications.js',
    description: 'Numerical derivatives, integration, limits, and series'
  },
  { 
    name: 'Advanced Features', 
    file: 'advanced-features.js',
    description: 'Complex expressions, edge cases, and performance tests'
  }
];

let successCount = 0;
let totalCount = demos.length;

demos.forEach((demo, index) => {
  console.log(`\n${index + 1}. ${demo.name}`);
  console.log(`   ${demo.description}`);
  console.log(`   File: ${demo.file}`);
  console.log('-'.repeat(40));
  
  try {
    const demoPath = join(__dirname, demo.file);
    console.log(`   Running: node ${demo.file}\n`);
    
    const result = execSync(`node "${demoPath}"`, { 
      encoding: 'utf8',
      timeout: 30000 // 30 second timeout
    });
    
    console.log(result);
    console.log(`   ✅ Demo completed successfully`);
    successCount++;
    
  } catch (error) {
    console.log(`   ❌ Demo failed with error:`);
    console.log(`   ${error.message}`);
    
    if (error.stdout) {
      console.log(`   STDOUT: ${error.stdout}`);
    }
    if (error.stderr) {
      console.log(`   STDERR: ${error.stderr}`);
    }
  }
  
  console.log('='.repeat(60));
});

console.log(`\n📊 Demo Summary:`);
console.log(`   Successful: ${successCount}/${totalCount}`);
console.log(`   Failed: ${totalCount - successCount}/${totalCount}`);

if (successCount === totalCount) {
  console.log(`   🎉 All demos completed successfully!`);
} else {
  console.log(`   ⚠️  Some demos failed. Check the output above for details.`);
}

console.log('\n🚀 To run individual demos:');
demos.forEach((demo) => {
  console.log(`   node demo/${demo.file}`);
});

console.log('\n📚 For more information about the math library:');
console.log('   - Check the source code in src/');
console.log('   - Run tests with: npm test');
console.log('   - Build the project with: npm run build');