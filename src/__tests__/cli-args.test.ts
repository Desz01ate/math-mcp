import { describe, it, expect } from 'vitest';
import { Command } from 'commander';
import { AngleMode } from '../types.js';

describe('CLI Argument Parsing', () => {
  describe('angle-mode option', () => {
    it('should parse valid angle mode values', () => {
      const program = new Command();
      
      program
        .option(
          '--angle-mode <mode>',
          'Angle mode for trigonometric functions (radians, degrees, rad, deg)',
          (value) => {
            const normalizedValue = value.toLowerCase();
            if (normalizedValue === 'radians' || normalizedValue === 'rad') {
              return 'radians' as AngleMode;
            } else if (normalizedValue === 'degrees' || normalizedValue === 'deg') {
              return 'degrees' as AngleMode;
            } else {
              throw new Error(`Invalid angle mode: ${value}. Must be one of: radians, degrees, rad, deg`);
            }
          },
          'radians' as AngleMode
        );

      // Test valid values
      const validInputs = [
        { input: ['--angle-mode', 'radians'], expected: 'radians' },
        { input: ['--angle-mode', 'degrees'], expected: 'degrees' },
        { input: ['--angle-mode', 'rad'], expected: 'radians' },
        { input: ['--angle-mode', 'deg'], expected: 'degrees' },
        { input: ['--angle-mode', 'RADIANS'], expected: 'radians' },
        { input: ['--angle-mode', 'DEGREES'], expected: 'degrees' },
        { input: ['--angle-mode', 'Rad'], expected: 'radians' },
        { input: ['--angle-mode', 'Deg'], expected: 'degrees' },
      ];

      validInputs.forEach(({ input, expected }) => {
        const testProgram = new Command();
        testProgram
          .option(
            '--angle-mode <mode>',
            'Angle mode for trigonometric functions (radians, degrees, rad, deg)',
            (value) => {
              const normalizedValue = value.toLowerCase();
              if (normalizedValue === 'radians' || normalizedValue === 'rad') {
                return 'radians' as AngleMode;
              } else if (normalizedValue === 'degrees' || normalizedValue === 'deg') {
                return 'degrees' as AngleMode;
              } else {
                throw new Error(`Invalid angle mode: ${value}. Must be one of: radians, degrees, rad, deg`);
              }
            },
            'radians' as AngleMode
          );

        testProgram.parse(input, { from: 'user' });
        const options = testProgram.opts();
        expect(options.angleMode).toBe(expected);
      });
    });

    it('should reject invalid angle mode values', () => {
      const program = new Command();
      
      program
        .option(
          '--angle-mode <mode>',
          'Angle mode for trigonometric functions (radians, degrees, rad, deg)',
          (value) => {
            const normalizedValue = value.toLowerCase();
            if (normalizedValue === 'radians' || normalizedValue === 'rad') {
              return 'radians' as AngleMode;
            } else if (normalizedValue === 'degrees' || normalizedValue === 'deg') {
              return 'degrees' as AngleMode;
            } else {
              throw new Error(`Invalid angle mode: ${value}. Must be one of: radians, degrees, rad, deg`);
            }
          },
          'radians' as AngleMode
        );

      // Test invalid values
      const invalidInputs = ['invalid', 'gradians', 'rads', 'degs', '123', ''];

      invalidInputs.forEach(input => {
        const testProgram = new Command();
        testProgram
          .option(
            '--angle-mode <mode>',
            'Angle mode for trigonometric functions (radians, degrees, rad, deg)',
            (value) => {
              const normalizedValue = value.toLowerCase();
              if (normalizedValue === 'radians' || normalizedValue === 'rad') {
                return 'radians' as AngleMode;
              } else if (normalizedValue === 'degrees' || normalizedValue === 'deg') {
                return 'degrees' as AngleMode;
              } else {
                throw new Error(`Invalid angle mode: ${value}. Must be one of: radians, degrees, rad, deg`);
              }
            },
            'radians' as AngleMode
          );

        expect(() => {
          testProgram.parse(['--angle-mode', input], { from: 'user' });
        }).toThrow(`Invalid angle mode: ${input}`);
      });
    });

    it('should use default value when option is not provided', () => {
      const program = new Command();
      
      program
        .option(
          '--angle-mode <mode>',
          'Angle mode for trigonometric functions (radians, degrees, rad, deg)',
          (value) => {
            const normalizedValue = value.toLowerCase();
            if (normalizedValue === 'radians' || normalizedValue === 'rad') {
              return 'radians' as AngleMode;
            } else if (normalizedValue === 'degrees' || normalizedValue === 'deg') {
              return 'degrees' as AngleMode;
            } else {
              throw new Error(`Invalid angle mode: ${value}. Must be one of: radians, degrees, rad, deg`);
            }
          },
          'radians' as AngleMode
        );

      program.parse([], { from: 'user' });
      const options = program.opts();
      expect(options.angleMode).toBe('radians');
    });
  });
});