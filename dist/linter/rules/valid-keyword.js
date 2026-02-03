import { KEYWORDS } from '../../lexer/tokens.js';
export const validKeyword = {
    name: 'valid-keyword',
    description: 'Ensure keywords are valid GuidedTrack keywords',
    severity: 'error',
    create(context) {
        function checkKeyword(node) {
            const keyword = node.keyword.toLowerCase();
            if (!KEYWORDS.has(keyword)) {
                context.report({
                    message: `'*${keyword}' is not a valid GuidedTrack keyword`,
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
//# sourceMappingURL=valid-keyword.js.map