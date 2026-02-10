import type { LintRule, RuleContext } from '../linter.js';
import type { Program, KeywordStatement, Statement } from '../../parser/ast.js';

export const noUnusedLabels: LintRule = {
  name: 'no-unused-labels',
  description: 'Detect labels that are never referenced by a *goto',
  severity: 'warning',

  create(context: RuleContext) {
    const labelDefinitions: Array<{ name: string; line: number; column: number }> = [];
    const gotoTargets = new Set<string>();

    function collect(node: Program | Statement): void {
      if (!node || typeof node !== 'object') return;

      if (node.type === 'Program') {
        for (const stmt of node.body) {
          collect(stmt);
        }
      } else if (node.type === 'KeywordStatement') {
        const kw = node as KeywordStatement;

        if (kw.argument) {
          let name = '';
          if (kw.argument.type === 'TextContent') {
            const text = kw.argument.parts.find(p => typeof p === 'string') as string | undefined;
            if (text) {
              name = text.trim();
            }
          } else if (kw.argument.type === 'Identifier') {
            name = kw.argument.name;
          }

          if (name) {
            if (kw.keyword === 'label') {
              labelDefinitions.push({
                name,
                line: kw.loc.start.line,
                column: kw.loc.start.column,
              });
            } else if (kw.keyword === 'goto') {
              if (!name.startsWith('http://') && !name.startsWith('https://')) {
                gotoTargets.add(name);
              }
            }
          }
        }

        // Recurse into body
        for (const stmt of kw.body) {
          collect(stmt);
        }

        // Recurse into sub-keywords
        for (const sub of kw.subKeywords) {
          for (const stmt of sub.body) {
            collect(stmt);
          }
        }
      } else if (node.type === 'AnswerOption') {
        for (const stmt of node.body) {
          collect(stmt);
        }
      }
    }

    return {
      Program(node: Program) {
        collect(node);

        for (const label of labelDefinitions) {
          if (!gotoTargets.has(label.name)) {
            context.report({
              message: `Label '${label.name}' is defined but never used by a *goto`,
              line: label.line,
              column: label.column,
            });
          }
        }
      },
    };
  },
};
