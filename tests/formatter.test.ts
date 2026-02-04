import { describe, it, expect } from 'vitest';
import { Formatter, format } from '../src/formatter/index.js';

describe('Formatter', () => {
  describe('Basic formatting', () => {
    it('should preserve valid code', () => {
      const source = 'Hello world\n';
      const result = format(source);

      expect(result).toBe(source);
    });

    it('should add final newline if missing', () => {
      const source = 'Hello world';
      const result = format(source);

      expect(result.endsWith('\n')).toBe(true);
    });

    it('should trim trailing whitespace', () => {
      const source = 'Hello world   \n';
      const result = format(source);

      expect(result).toBe('Hello world\n');
    });
  });

  describe('Indentation preservation', () => {
    it('should preserve tab indentation', () => {
      const source = `*if: true
\tIndented line
`;
      const result = format(source);

      expect(result).toContain('\tIndented line');
    });

    it('should preserve multiple levels of indentation', () => {
      const source = `*if: true
\t*if: false
\t\tDeeply indented
`;
      const result = format(source);

      expect(result).toContain('\t\tDeeply indented');
    });
  });

  describe('Operator spacing', () => {
    it('should enforce single space after >>', () => {
      const source = '>>x = 5\n';
      const result = format(source);

      expect(result).toBe('>> x = 5\n');
    });

    it('should normalize multiple spaces after >> to single space', () => {
      const source = '>>  x = 5\n';
      const result = format(source);

      expect(result).toBe('>> x = 5\n');
    });

    it('should add spaces around operators in expressions', () => {
      const source = '>> x=1+2\n';
      const result = format(source);

      expect(result).toContain('x = 1 + 2');
    });

    it('should add spaces around comparison operators', () => {
      const source = '>> result=a>=b\n';
      const result = format(source);

      expect(result).toContain('>= ');
    });

    it('should add spaces around arrow operator', () => {
      const source = '>> x = {"key"->"value"}\n';
      const result = format(source);

      expect(result).toContain('-> ');
    });

    it('should not add spaces in negative numbers', () => {
      const source = '>> x = -5\n';
      const result = format(source);

      expect(result).toContain('-5');
    });
  });

  describe('Comma spacing', () => {
    it('should add space after commas', () => {
      const source = '>> x = [1,2,3]\n';
      const result = format(source);

      expect(result).toContain('1, 2, 3');
    });
  });

  describe('Bracket spacing', () => {
    it('should remove extra spaces after opening brackets', () => {
      const source = '>> x = [ 1, 2, 3]\n';
      const result = format(source);

      expect(result).toContain('[1,');
    });

    it('should remove extra spaces before closing brackets', () => {
      const source = '>> x = [1, 2, 3 ]\n';
      const result = format(source);

      expect(result).toContain('3]');
    });
  });

  describe('Comments', () => {
    it('should preserve comments', () => {
      const source = '-- this is a comment\n';
      const result = format(source);

      expect(result).toBe(source);
    });

    it('should trim trailing whitespace from comments', () => {
      const source = '-- comment with trailing space   \n';
      const result = format(source);

      expect(result).toBe('-- comment with trailing space\n');
    });
  });

  describe('Blank lines', () => {
    it('should preserve single blank lines', () => {
      const source = `First line

Second line
`;
      const result = format(source);

      expect(result).toContain('\n\n');
    });

    it('should remove excess blank lines (max 1)', () => {
      const source = `First line



Second line
`;
      const result = format(source);
      const lines = result.split('\n');

      // Should have at most one blank line between content
      let maxConsecutiveBlank = 0;
      let currentConsecutiveBlank = 0;

      for (const line of lines) {
        if (line.trim() === '') {
          currentConsecutiveBlank++;
          maxConsecutiveBlank = Math.max(maxConsecutiveBlank, currentConsecutiveBlank);
        } else {
          currentConsecutiveBlank = 0;
        }
      }

      expect(maxConsecutiveBlank).toBeLessThanOrEqual(1);
    });
  });

  describe('String preservation', () => {
    it('should not modify content inside strings', () => {
      const source = '>> x = "hello   world"\n';
      const result = format(source);

      expect(result).toContain('"hello   world"');
    });

    it('should not modify operators inside strings', () => {
      const source = '>> x = "a+b=c"\n';
      const result = format(source);

      expect(result).toContain('"a+b=c"');
    });
  });

  describe('Formatter configuration', () => {
    it('should respect insertFinalNewline option', () => {
      const source = 'Hello world';
      const result = format(source, { insertFinalNewline: false });

      expect(result.endsWith('\n')).toBe(false);
    });

    it('should respect trimTrailingWhitespace option', () => {
      const source = 'Hello world   \n';
      const result = format(source, { trimTrailingWhitespace: false });

      expect(result).toBe(source);
    });

    it('should respect spaceAroundOperators option', () => {
      const source = '>> x=1+2\n';
      const result = format(source, { spaceAroundOperators: false });

      // When disabled, should preserve original spacing
      expect(result).toBe(source);
    });

    it('should respect spaceAfterComma option', () => {
      const source = '>> x = [1,2,3]\n';
      const result = format(source, { spaceAfterComma: false });

      expect(result).toBe(source);
    });
  });

  describe('Keyword whitespace normalization', () => {
    it('should normalize excess whitespace in *if expressions', () => {
      const source = '*if:           x     >           7\n';
      const result = format(source);

      expect(result).toBe('*if: x > 7\n');
    });

    it('should normalize excess whitespace in *while expressions', () => {
      const source = '*while:    counter   <    100\n';
      const result = format(source);

      expect(result).toBe('*while: counter < 100\n');
    });

    it('should normalize excess whitespace in *for expressions', () => {
      const source = '*for:   item    in     items\n';
      const result = format(source);

      expect(result).toBe('*for: item in items\n');
    });

    it('should preserve text content in *question keywords', () => {
      const source = '*question:        What is your name?\n';
      const result = format(source);

      expect(result).toBe('*question: What is your name?\n');
    });

    it('should preserve string content in keyword expressions', () => {
      const source = '*if: name = "hello     world"\n';
      const result = format(source);

      expect(result).toBe('*if: name = "hello     world"\n');
    });
  });

  describe('Complex formatting scenarios', () => {
    it('should format question with options', () => {
      const source = `*question: Pick one
\tOption A
\tOption B
`;
      const result = format(source);

      expect(result).toBe(source);
    });

    it('should format nested conditionals', () => {
      const source = `*if: x > 0
\t*if: y > 0
\t\tBoth positive
`;
      const result = format(source);

      expect(result).toBe(source);
    });

    it('should format expressions with function calls', () => {
      const source = '>> parts = text.split(",")\n';
      const result = format(source);

      expect(result).toContain('text.split(",")');
    });
  });

  describe('Formatter class', () => {
    it('should be instantiable with custom config', () => {
      const formatter = new Formatter({
        insertFinalNewline: false,
        trimTrailingWhitespace: false,
      });

      expect(formatter).toBeInstanceOf(Formatter);
    });

    it('should format consistently across multiple calls', () => {
      const formatter = new Formatter();
      const source = '>> x=1+2';

      const result1 = formatter.format(source);
      const result2 = formatter.format(source);

      expect(result1).toBe(result2);
    });

    it('should be idempotent', () => {
      const formatter = new Formatter();
      const source = '>> x=1+2';

      const once = formatter.format(source);
      const twice = formatter.format(once);

      expect(once).toBe(twice);
    });
  });
});
