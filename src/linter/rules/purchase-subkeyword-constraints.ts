import type { LintRule, RuleContext } from '../linter.js';
import type { Program, KeywordStatement } from '../../parser/ast.js';

/**
 * Rule: purchase-subkeyword-constraints
 *
 * Ensures that `*purchase` follows its specific sub-keyword constraints:
 * 1. Exactly one of `*status`, `*frequency`, or `*management` must be present
 * 2. If `*status` or `*frequency` is used, then `*success` and `*error` are required
 *
 * Examples of violations:
 * - `*purchase` with no mode sub-keyword
 * - `*purchase` with both `*status` and `*frequency`
 * - `*purchase` with `*status` but missing `*success` or `*error`
 */
export const purchaseSubkeywordConstraints: LintRule = {
  name: 'purchase-subkeyword-constraints',
  description: 'Ensure *purchase has correct sub-keyword combinations',
  severity: 'error',

  create(context: RuleContext) {
    const MODE_SUBKEYWORDS = ['status', 'frequency', 'management'];

    function checkPurchase(node: KeywordStatement): void {
      const keyword = node.keyword.toLowerCase();

      if (keyword !== 'purchase') return;

      // Get present sub-keywords
      const presentSubs = new Set(
        node.subKeywords.map((sub) => sub.keyword.toLowerCase())
      );

      // Check which mode sub-keywords are present
      const presentModes = MODE_SUBKEYWORDS.filter((mode) => presentSubs.has(mode));

      // Must have exactly one mode
      if (presentModes.length === 0) {
        context.report({
          message: `'*purchase' must have exactly one of: *status, *frequency, or *management`,
          line: node.loc.start.line,
          column: node.loc.start.column,
        });
        return;
      }

      if (presentModes.length > 1) {
        const modeList = presentModes.map((m) => `*${m}`).join(', ');
        context.report({
          message: `'*purchase' cannot have multiple mode sub-keywords. Found: ${modeList}. Use only one.`,
          line: node.loc.start.line,
          column: node.loc.start.column,
        });
        return;
      }

      // If status or frequency is used, success and error are required
      const mode = presentModes[0];
      if (mode === 'status' || mode === 'frequency') {
        const missingCallbacks: string[] = [];

        if (!presentSubs.has('success')) {
          missingCallbacks.push('*success');
        }
        if (!presentSubs.has('error')) {
          missingCallbacks.push('*error');
        }

        if (missingCallbacks.length > 0) {
          context.report({
            message: `'*purchase' with '*${mode}' requires: ${missingCallbacks.join(' and ')}`,
            line: node.loc.start.line,
            column: node.loc.start.column,
          });
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
        checkPurchase(node);
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
