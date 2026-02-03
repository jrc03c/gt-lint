export const noInvalidGoto = {
    name: 'no-invalid-goto',
    description: 'Ensure *goto targets exist',
    severity: 'error',
    create(context) {
        const definedLabels = new Set();
        const gotoStatements = [];
        function collectLabels(node) {
            if (!node || typeof node !== 'object')
                return;
            if (node.type === 'Program') {
                for (const stmt of node.body) {
                    collectLabels(stmt);
                }
            }
            else if (node.type === 'KeywordStatement') {
                const kw = node;
                // Collect *label: definitions
                if (kw.keyword === 'label' && kw.argument) {
                    let labelName = '';
                    if (kw.argument.type === 'TextContent') {
                        const text = kw.argument.parts.find(p => typeof p === 'string');
                        if (text) {
                            labelName = text.trim();
                        }
                    }
                    else if (kw.argument.type === 'Identifier') {
                        labelName = kw.argument.name;
                    }
                    if (labelName) {
                        definedLabels.add(labelName);
                    }
                }
                // Collect *goto: usages
                if (kw.keyword === 'goto' && kw.argument) {
                    let targetName = '';
                    if (kw.argument.type === 'TextContent') {
                        const text = kw.argument.parts.find(p => typeof p === 'string');
                        if (text) {
                            targetName = text.trim();
                        }
                    }
                    else if (kw.argument.type === 'Identifier') {
                        targetName = kw.argument.name;
                    }
                    if (targetName) {
                        // Skip URLs (external gotos)
                        if (!targetName.startsWith('http://') && !targetName.startsWith('https://')) {
                            gotoStatements.push({
                                target: targetName,
                                line: kw.loc.start.line,
                                column: kw.loc.start.column,
                            });
                        }
                    }
                }
                // Recurse into body
                for (const stmt of kw.body) {
                    collectLabels(stmt);
                }
                // Recurse into sub-keywords
                for (const sub of kw.subKeywords) {
                    for (const stmt of sub.body) {
                        collectLabels(stmt);
                    }
                }
            }
            else if (node.type === 'AnswerOption') {
                for (const stmt of node.body) {
                    collectLabels(stmt);
                }
            }
        }
        return {
            Program(node) {
                // Collect all label definitions and goto usages
                collectLabels(node);
                // Report gotos that target undefined labels
                for (const goto of gotoStatements) {
                    if (!definedLabels.has(goto.target)) {
                        context.report({
                            message: `*goto target '${goto.target}' is not defined`,
                            line: goto.line,
                            column: goto.column,
                        });
                    }
                }
            },
        };
    },
};
//# sourceMappingURL=no-invalid-goto.js.map