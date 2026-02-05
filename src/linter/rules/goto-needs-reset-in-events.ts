import type { LintRule, RuleContext } from '../linter.js';
import type { Program, KeywordStatement, Statement } from '../../parser/ast.js';

/**
 * Rule: goto-needs-reset-in-events
 *
 * Ensures that `*goto:` statements inside `*events` blocks have a `*reset` sub-keyword.
 *
 * Per the GuidedTrack documentation:
 * "*goto keywords used inside an event block must always include a *reset indented beneath."
 *
 * Example of violation:
 * ```
 * *events
 *     myEvent
 *         >> x = 5
 *         *goto: someLabel  -- ERROR: missing *reset
 * ```
 *
 * Correct usage:
 * ```
 * *events
 *     myEvent
 *         >> x = 5
 *         *goto: someLabel
 *             *reset
 * ```
 */
export const gotoNeedsResetInEvents: LintRule = {
  name: 'goto-needs-reset-in-events',
  description: 'Ensure *goto: inside *events has *reset',
  severity: 'warning',

  create(context: RuleContext) {
    function checkGotoInEvents(node: KeywordStatement): void {
      const keyword = node.keyword.toLowerCase();

      if (keyword !== 'goto') return;

      // Check if it has a *reset sub-keyword
      const hasReset = node.subKeywords.some(
        (sub) => sub.keyword.toLowerCase() === 'reset'
      );

      if (!hasReset) {
        context.report({
          message: `'*goto:' inside '*events' should have '*reset' to prevent unexpected behavior`,
          line: node.loc.start.line,
          column: node.loc.start.column,
        });
      }
    }

    function visitInsideEvents(statements: Statement[]): void {
      for (const stmt of statements) {
        if (stmt.type === 'KeywordStatement') {
          checkGotoInEvents(stmt);
          // Recursively check nested statements
          visitInsideEvents(stmt.body);
        } else if (stmt.type === 'AnswerOption') {
          visitInsideEvents(stmt.body);
        }
      }
    }

    function visit(node: Program | KeywordStatement): void {
      if (node.type === 'Program') {
        for (const stmt of node.body) {
          if (stmt.type === 'KeywordStatement') {
            visit(stmt);
          }
        }
      } else if (node.type === 'KeywordStatement') {
        const keyword = node.keyword.toLowerCase();

        // If this is an *events block, check all gotos inside it
        if (keyword === 'events') {
          visitInsideEvents(node.body);
        } else {
          // Continue visiting nested keywords
          for (const stmt of node.body) {
            if (stmt.type === 'KeywordStatement') {
              visit(stmt);
            }
          }
        }
      }
    }

    return {
      Program(node: Program) {
        visit(node);
      },
    };
  },
};
