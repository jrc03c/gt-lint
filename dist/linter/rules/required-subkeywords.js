import { getKeywordSpec, getRequiredSubKeywords } from '../../language/keyword-spec.js';
/**
 * Rule: required-subkeywords
 *
 * Ensures that keywords have all their required sub-keywords present.
 *
 * Examples of violations:
 * - `*chart:` without `*type:` or `*data:`
 * - `*email` without `*subject:` or `*body:`
 * - `*service:` without `*path:`, `*method:`, `*success`, or `*error`
 * - `*database:` without `*what:`, `*success`, or `*error`
 */
export const requiredSubkeywords = {
    name: 'required-subkeywords',
    description: 'Ensure keywords have all required sub-keywords',
    severity: 'error',
    create(context) {
        function checkKeyword(node) {
            const keyword = node.keyword.toLowerCase();
            const spec = getKeywordSpec(keyword);
            if (!spec)
                return;
            const requiredSubs = getRequiredSubKeywords(keyword);
            if (requiredSubs.length === 0)
                return;
            // Get the sub-keywords that are present
            const presentSubs = new Set(node.subKeywords.map((sub) => sub.keyword.toLowerCase()));
            // Check for missing required sub-keywords
            const missingSubs = requiredSubs.filter((sub) => !presentSubs.has(sub));
            if (missingSubs.length > 0) {
                const missingList = missingSubs.map((s) => `*${s}:`).join(', ');
                const plural = missingSubs.length > 1 ? 's' : '';
                context.report({
                    message: `'*${keyword}:' is missing required sub-keyword${plural}: ${missingList}`,
                    line: node.loc.start.line,
                    column: node.loc.start.column,
                });
            }
        }
        function visit(node) {
            if (node.type === 'Program') {
                for (const stmt of node.body) {
                    if (stmt.type === 'KeywordStatement') {
                        visit(stmt);
                    }
                }
            }
            else if (node.type === 'KeywordStatement') {
                checkKeyword(node);
                for (const stmt of node.body) {
                    if (stmt.type === 'KeywordStatement') {
                        visit(stmt);
                    }
                }
            }
        }
        return {
            Program(node) {
                visit(node);
            },
        };
    },
};
//# sourceMappingURL=required-subkeywords.js.map