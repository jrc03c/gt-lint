export const indentStyle = {
    name: 'indent-style',
    description: 'Enforce tabs for indentation',
    severity: 'error',
    create(context) {
        return {
            Program(_node) {
                const source = context.getSourceCode();
                const lines = source.split('\n');
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    const lineNumber = i + 1;
                    // Check for spaces at the beginning of the line (before any content)
                    let leadingWhitespace = '';
                    let j = 0;
                    while (j < line.length && (line[j] === ' ' || line[j] === '\t')) {
                        leadingWhitespace += line[j];
                        j++;
                    }
                    // Skip blank lines
                    if (j === line.length)
                        continue;
                    // Check for spaces used for indentation
                    if (leadingWhitespace.includes(' ')) {
                        // Check if spaces are used before tabs or as indentation
                        const firstSpace = leadingWhitespace.indexOf(' ');
                        const firstTab = leadingWhitespace.indexOf('\t');
                        if (firstTab === -1 || firstSpace < firstTab) {
                            context.report({
                                message: 'Use tabs for indentation, not spaces',
                                line: lineNumber,
                                column: firstSpace + 1,
                                fix: {
                                    range: [getLineOffset(lines, i), getLineOffset(lines, i) + leadingWhitespace.length],
                                    text: leadingWhitespace.replace(/ {2,}/g, (match) => '\t'.repeat(Math.ceil(match.length / 2))).replace(/ /g, ''),
                                },
                            });
                        }
                    }
                }
            },
        };
    },
};
function getLineOffset(lines, lineIndex) {
    let offset = 0;
    for (let i = 0; i < lineIndex; i++) {
        offset += lines[i].length + 1; // +1 for newline
    }
    return offset;
}
//# sourceMappingURL=indent-style.js.map