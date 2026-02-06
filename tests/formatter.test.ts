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

  describe('Blank lines between blocks', () => {
    it('should insert blank line after keyword block with children before text', () => {
      const source = '*question: Name?\n\t*save: name\nHi, {name}!\n';
      const result = format(source);

      expect(result).toBe('*question: Name?\n\t*save: name\n\nHi, {name}!\n');
    });

    it('should insert blank line after keyword block with children before another keyword', () => {
      const source = '*question: Name?\n\t*save: name\n*question: Age?\n\t*save: age\n';
      const result = format(source);

      expect(result).toBe('*question: Name?\n\t*save: name\n\n*question: Age?\n\t*save: age\n');
    });

    it('should insert blank line on keyword-to-non-keyword transition', () => {
      const source = '*header: Welcome\nSome text here\n';
      const result = format(source);

      expect(result).toBe('*header: Welcome\n\nSome text here\n');
    });

    it('should insert blank line on non-keyword-to-keyword transition', () => {
      const source = 'Some text here\n*header: Welcome\n';
      const result = format(source);

      expect(result).toBe('Some text here\n\n*header: Welcome\n');
    });

    it('should not insert blank line between consecutive non-keyword lines', () => {
      const source = 'Line one\nLine two\nLine three\n';
      const result = format(source);

      expect(result).toBe('Line one\nLine two\nLine three\n');
    });

    it('should not insert blank line between sibling sub-keywords without children', () => {
      const source = '*question: Email?\n\t*type: text\n\t*save: email\n\t*placeholder: you@example.com\n';
      const result = format(source);

      expect(result).toBe('*question: Email?\n\t*type: text\n\t*save: email\n\t*placeholder: you@example.com\n');
    });

    it('should insert blank lines at nested levels between keyword blocks', () => {
      const source = '*page\n\t*question: Q1\n\t\t*save: a\n\t*question: Q2\n\t\t*save: b\n\tThanks!\n';
      const result = format(source);

      expect(result).toBe('*page\n\t*question: Q1\n\t\t*save: a\n\n\t*question: Q2\n\t\t*save: b\n\n\tThanks!\n');
    });

    it('should not double blank lines when one already exists', () => {
      const source = '*question: Name?\n\t*save: name\n\n*question: Age?\n\t*save: age\n';
      const result = format(source);

      expect(result).toBe('*question: Name?\n\t*save: name\n\n*question: Age?\n\t*save: age\n');
    });

    it('should disable blank line insertion when blankLinesBetweenBlocks is 0', () => {
      const source = '*question: Name?\n\t*save: name\n*header: Welcome\nSome text\n';
      const result = format(source, { blankLinesBetweenBlocks: 0 });

      expect(result).toBe('*question: Name?\n\t*save: name\n*header: Welcome\nSome text\n');
    });

    it('should be idempotent with blank line insertion', () => {
      const formatter = new Formatter();
      const source = '*question: Name?\n\t*save: name\nHi!\n*question: Age?\n\t*save: age\nBye!\n';

      const once = formatter.format(source);
      const twice = formatter.format(once);

      expect(once).toBe(twice);
    });

    it('should respect gtformat-disable regions', () => {
      const source = '-- gtformat-disable\n*question: Name?\n\t*save: name\nHi!\n-- gtformat-enable\n';
      const result = format(source);

      // No blank lines inserted in disabled region
      expect(result).toBe('-- gtformat-disable\n*question: Name?\n\t*save: name\nHi!\n-- gtformat-enable\n');
    });

    it('should clear deeper level tracking on dedent', () => {
      // After dedenting back to level 0, deeper level info should be cleared
      const source = '*if: x\n\t*if: y\n\t\tDeep\n*header: Next\n';
      const result = format(source);

      expect(result).toBe('*if: x\n\t*if: y\n\t\tDeep\n\n*header: Next\n');
    });

    it('should separate keyword blocks with bodies (*success/*error)', () => {
      const source = '*service: API\n\t*method: PUT\n\t*send: data\n\t*success\n\t\t>> r = it\n\t*error\n\t\t>> e = 1\n';
      const result = format(source);

      expect(result).toBe('*service: API\n\t*method: PUT\n\t*send: data\n\t*success\n\t\t>> r = it\n\n\t*error\n\t\t>> e = 1\n');
    });

    it('should not insert blank line before comments', () => {
      const source = '*question: Name?\n\t*save: name\n-- a comment\n*header: Next\n';
      const result = format(source);

      // Comment should not get a blank line before it, but *header should
      expect(result).toBe('*question: Name?\n\t*save: name\n-- a comment\n\n*header: Next\n');
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
