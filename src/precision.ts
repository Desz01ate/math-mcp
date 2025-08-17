import { Decimal } from 'decimal.js';

// Configure decimal.js for high precision mathematical calculations
// Using 20 significant digits by default for good balance between precision and performance
export const configurePrecision = (precision: number = 20, rounding: Decimal.Rounding = Decimal.ROUND_HALF_UP) => {
  Decimal.set({
    precision,
    rounding,
    toExpNeg: -20,
    toExpPos: 20,
    maxE: 9e15,
    minE: -9e15,
    modulo: Decimal.ROUND_DOWN,
  });
};

// Initialize with default precision
configurePrecision();

/**
 * Precision-aware mathematical operations using decimal.js
 * This replaces native JavaScript arithmetic to avoid floating-point precision issues
 */
export class PrecisionMath {
  /**
   * Convert a value to Decimal, handling various input types
   */
  private static toDecimal(value: any): Decimal {
    if (value instanceof Decimal) {
      return value;
    }
    if (typeof value === 'string') {
      // Handle unit values like "2.5 cm" by extracting just the number
      const numMatch = value.match(/^([+-]?\d*\.?\d+(?:[eE][+-]?\d+)?)/);
      if (numMatch) {
        return new Decimal(numMatch[1]);
      }
    }
    return new Decimal(value);
  }

  /**
   * Convert Decimal result back to appropriate JavaScript type
   */
  private static fromDecimal(decimal: Decimal, originalType?: string): any {
    // If the result should be an integer and is close to one, return integer
    const num = decimal.toNumber();
    if (Number.isInteger(num) && Math.abs(num) <= Number.MAX_SAFE_INTEGER) {
      return Math.round(num);
    }
    return num;
  }

  // Basic arithmetic operations
  static add(a: any, b: any): number {
    const decimalA = this.toDecimal(a);
    const decimalB = this.toDecimal(b);
    return this.fromDecimal(decimalA.plus(decimalB));
  }

  static subtract(a: any, b: any): number {
    const decimalA = this.toDecimal(a);
    const decimalB = this.toDecimal(b);
    return this.fromDecimal(decimalA.minus(decimalB));
  }

  static multiply(a: any, b: any): number {
    const decimalA = this.toDecimal(a);
    const decimalB = this.toDecimal(b);
    return this.fromDecimal(decimalA.times(decimalB));
  }

  static divide(a: any, b: any): number {
    const decimalA = this.toDecimal(a);
    const decimalB = this.toDecimal(b);
    return this.fromDecimal(decimalA.dividedBy(decimalB));
  }

  static modulo(a: any, b: any): number {
    const decimalA = this.toDecimal(a);
    const decimalB = this.toDecimal(b);
    return this.fromDecimal(decimalA.modulo(decimalB));
  }

  static power(a: any, b: any): number {
    const decimalA = this.toDecimal(a);
    const decimalB = this.toDecimal(b);
    return this.fromDecimal(decimalA.pow(decimalB));
  }

  static negate(a: any): number {
    const decimal = this.toDecimal(a);
    return this.fromDecimal(decimal.negated());
  }

  // Mathematical functions
  static abs(a: any): number {
    const decimal = this.toDecimal(a);
    return this.fromDecimal(decimal.abs());
  }

  static sqrt(a: any): number {
    const decimal = this.toDecimal(a);
    return this.fromDecimal(decimal.sqrt());
  }

  static cbrt(a: any): number {
    const decimal = this.toDecimal(a);
    return this.fromDecimal(decimal.pow(new Decimal(1).dividedBy(3)));
  }

  static ceil(a: any): number {
    const decimal = this.toDecimal(a);
    return this.fromDecimal(decimal.ceil());
  }

  static floor(a: any): number {
    const decimal = this.toDecimal(a);
    return this.fromDecimal(decimal.floor());
  }

  static round(a: any): number {
    const decimal = this.toDecimal(a);
    return this.fromDecimal(decimal.round());
  }

  static sign(a: any): number {
    const decimal = this.toDecimal(a);
    if (decimal.isZero()) return 0;
    return decimal.isPositive() ? 1 : -1;
  }

  // Trigonometric functions - using decimal.js implementations
  static sin(a: any): number {
    const decimal = this.toDecimal(a);
    return this.fromDecimal(decimal.sin());
  }

  static cos(a: any): number {
    const decimal = this.toDecimal(a);
    return this.fromDecimal(decimal.cos());
  }

  static tan(a: any): number {
    const decimal = this.toDecimal(a);
    return this.fromDecimal(decimal.tan());
  }

  static asin(a: any): number {
    const decimal = this.toDecimal(a);
    return this.fromDecimal(decimal.asin());
  }

  static acos(a: any): number {
    const decimal = this.toDecimal(a);
    return this.fromDecimal(decimal.acos());
  }

  static atan(a: any): number {
    const decimal = this.toDecimal(a);
    return this.fromDecimal(decimal.atan());
  }

  static atan2(y: any, x: any): number {
    const decimalY = this.toDecimal(y);
    const decimalX = this.toDecimal(x);
    return this.fromDecimal(Decimal.atan2(decimalY, decimalX));
  }

  // Hyperbolic functions
  static sinh(a: any): number {
    const decimal = this.toDecimal(a);
    return this.fromDecimal(decimal.sinh());
  }

  static cosh(a: any): number {
    const decimal = this.toDecimal(a);
    return this.fromDecimal(decimal.cosh());
  }

  static tanh(a: any): number {
    const decimal = this.toDecimal(a);
    return this.fromDecimal(decimal.tanh());
  }

  static asinh(a: any): number {
    const decimal = this.toDecimal(a);
    return this.fromDecimal(decimal.asinh());
  }

  static acosh(a: any): number {
    const decimal = this.toDecimal(a);
    return this.fromDecimal(decimal.acosh());
  }

  static atanh(a: any): number {
    const decimal = this.toDecimal(a);
    return this.fromDecimal(decimal.atanh());
  }

  // Logarithmic and exponential functions
  static log(a: any): number {
    const decimal = this.toDecimal(a);
    return this.fromDecimal(decimal.ln());
  }

  static log10(a: any): number {
    const decimal = this.toDecimal(a);
    return this.fromDecimal(decimal.log(10));
  }

  static log2(a: any): number {
    const decimal = this.toDecimal(a);
    return this.fromDecimal(decimal.log(2));
  }

  static exp(a: any): number {
    const decimal = this.toDecimal(a);
    return this.fromDecimal(decimal.exp());
  }

  static expm1(a: any): number {
    const decimal = this.toDecimal(a);
    return this.fromDecimal(decimal.exp().minus(1));
  }

  static log1p(a: any): number {
    const decimal = this.toDecimal(a);
    return this.fromDecimal(decimal.plus(1).ln());
  }

  // Comparison functions that handle precision issues
  static equals(a: any, b: any, epsilon: number = 1e-15): boolean {
    const decimalA = this.toDecimal(a);
    const decimalB = this.toDecimal(b);
    return decimalA.minus(decimalB).abs().lessThanOrEqualTo(epsilon);
  }

  static lessThan(a: any, b: any): boolean {
    const decimalA = this.toDecimal(a);
    const decimalB = this.toDecimal(b);
    return decimalA.lessThan(decimalB);
  }

  static lessThanOrEqual(a: any, b: any): boolean {
    const decimalA = this.toDecimal(a);
    const decimalB = this.toDecimal(b);
    return decimalA.lessThanOrEqualTo(decimalB);
  }

  static greaterThan(a: any, b: any): boolean {
    const decimalA = this.toDecimal(a);
    const decimalB = this.toDecimal(b);
    return decimalA.greaterThan(decimalB);
  }

  static greaterThanOrEqual(a: any, b: any): boolean {
    const decimalA = this.toDecimal(a);
    const decimalB = this.toDecimal(b);
    return decimalA.greaterThanOrEqualTo(decimalB);
  }

  // Utility function to check if a number has precision issues
  static hasPrecisionIssue(result: number, expected: number): boolean {
    const diff = Math.abs(result - expected);
    return diff > Number.EPSILON && diff < 1e-10;
  }

  // Constants with high precision
  static get PI(): number {
    return this.fromDecimal(Decimal.acos(-1));
  }

  static get E(): number {
    return this.fromDecimal(new Decimal(1).exp());
  }

  static get TAU(): number {
    return this.fromDecimal(Decimal.acos(-1).times(2));
  }

  static get PHI(): number {
    return this.fromDecimal(new Decimal(1).plus(new Decimal(5).sqrt()).dividedBy(2));
  }
}