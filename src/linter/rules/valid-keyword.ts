import type { LintRule, RuleContext } from '../linter.js';
import type { Program, KeywordStatement } from '../../parser/ast.js';
import { KEYWORDS } from '../../lexer/tokens.js';

export const validKeyword: LintRule = {
  name: 'valid-keyword',
  description: 'Ensure keywords are valid GuidedTrack keywords',
  severity: 'error',

  create(context: RuleContext) {
    function checkKeyword(node: KeywordStatement): void {
      const keyword = node.keyword.toLowerCase();
      if (!KEYWORDS.has(keyword)) {
        context.report({
          message: `'*${keyword}' is not a valid GuidedTrack keyword`,
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
