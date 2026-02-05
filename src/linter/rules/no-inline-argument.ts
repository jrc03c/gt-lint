import type { LintRule, RuleContext } from '../linter.js';
import type { Program, KeywordStatement } from '../../parser/ast.js';
import { getKeywordSpec } from '../../language/keyword-spec.js';

/**
 * Rule: no-inline-argument
 *
 * Ensures that keywords that shouldn't have inline arguments don't have them.
 *
 * Examples of violations:
 * - `*page: something` (should be just `*page`)
 * - `*html: something` (should be just `*html`)
 * - `*events: something` (should be just `*events`)
 * - `*clear: something` (should be just `*clear`)
 */
export const noInlineArgument: LintRule = {
  name: 'no-inline-argument',
  description: 'Ensure keywords that should not have inline arguments do not have them',
  severity: 'error',

  create(context: RuleContext) {
    function checkKeyword(node: KeywordStatement): void {
      const keyword = node.keyword.toLowerCase();
      const spec = getKeywordSpec(keyword);

      if (!spec) return;

      // Check if this keyword should not have an argument
      if (spec.argument.type === 'none' && node.argument !== null) {
        context.report({
          message: `'*${keyword}' should not have an inline argument`,
          line: node.loc.start.line,
          column: node.loc.start.column,
        });
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
        checkKeyword(node);
        for (const stmt of node.body) {
          if (stmt.type === 'KeywordStatement') {
            visit(stmt);
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
