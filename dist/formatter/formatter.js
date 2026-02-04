import { DEFAULT_FORMATTER_CONFIG } from '../types.js';
export class Formatter {
    config;
    constructor(config = {}) {
        this.config = {
            ...DEFAULT_FORMATTER_CONFIG,
            ...config,
        };
    }
    format(source) {
        const lines = source.split('\n');
        const formattedLines = [];
        let previousLineWasBlank = false;
        let previousLineWasTopLevel = false;
        let consecutiveBlankLines = 0;
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            // Trim trailing whitespace
            if (this.config.trimTrailingWhitespace) {
                line = line.replace(/[ \t]+$/, '');
            }
            // Check if current line is blank
            const isBlank = line.trim() === '';
            // Skip excess blank lines (keep at most 1)
            if (isBlank) {
                consecutiveBlankLines++;
                if (consecutiveBlankLines > 1) {
                    continue; // Skip this blank line
                }
            }
            else {
                consecutiveBlankLines = 0;
            }
            // Check if current line is top-level (no indentation)
            const isTopLevel = !isBlank && !line.startsWith('\t');
            // Manage blank lines between blocks
            if (this.config.blankLinesBetweenBlocks > 0) {
                if (isTopLevel && previousLineWasTopLevel && !previousLineWasBlank && !isBlank) {
                    // Check if this starts a new block (keyword at start of line)
                    const trimmed = line.trim();
                    if (trimmed.startsWith('*') && !trimmed.startsWith('--')) {
                        // Add blank line before new top-level keyword block
                        formattedLines.push('');
                    }
                }
            }
            // Format the line content
            line = this.formatLine(line);
            formattedLines.push(line);
            previousLineWasBlank = isBlank;
            previousLineWasTopLevel = isTopLevel;
        }
        let result = formattedLines.join('\n');
        // Ensure final newline
        if (this.config.insertFinalNewline && !result.endsWith('\n')) {
            result += '\n';
        }
        return result;
    }
    formatLine(line) {
        // Preserve indentation
        let indent = '';
        let content = line;
        let i = 0;
        while (i < line.length && line[i] === '\t') {
            indent += '\t';
            i++;
        }
        content = line.slice(i);
        // Skip blank lines and comments
        if (content.trim() === '' || content.trim().startsWith('--')) {
            return line;
        }
        // Format expression lines (>> ...)
        if (content.startsWith('>>')) {
            // Ensure exactly one space after >>
            content = content.replace(/^>>\s*/, '>> ');
            content = this.formatExpression(content);
        }
        // Format keyword lines (*keyword: ...)
        if (content.startsWith('*')) {
            content = this.formatKeywordLine(content);
        }
        // Format array/object literals
        content = this.formatLiterals(content);
        return indent + content;
    }
    formatExpression(content) {
        // Simple formatting for expressions
        let result = content;
        // Space around operators
        if (this.config.spaceAroundOperators) {
            // Comparison, arithmetic, and assignment (but not in strings)
            result = this.formatOperatorsOutsideStrings(result);
        }
        return result;
    }
    formatOperatorsOutsideStrings(content) {
        const operators = ['+', '-', '*', '/', '%', '<', '>', '<=', '>=', '='];
        let result = '';
        let inString = false;
        let stringChar = '';
        for (let i = 0; i < content.length; i++) {
            const ch = content[i];
            const next = content[i + 1] || '';
            const prev = content[i - 1] || '';
            // Handle string boundaries
            if (!inString && (ch === '"' || ch === "'")) {
                inString = true;
                stringChar = ch;
                result += ch;
                continue;
            }
            if (inString && ch === stringChar) {
                inString = false;
                stringChar = '';
                result += ch;
                continue;
            }
            // If in string, just add character
            if (inString) {
                result += ch;
                continue;
            }
            // Handle arrow
            if (ch === '-' && next === '>') {
                if (this.config.spaceAroundArrow) {
                    // Ensure space before
                    if (result.length > 0 && result[result.length - 1] !== ' ') {
                        result += ' ';
                    }
                    result += '->';
                    // Ensure space after
                    if (content[i + 2] && content[i + 2] !== ' ') {
                        result += ' ';
                    }
                    i++; // Skip >
                    continue;
                }
            }
            // Handle <=, >=
            if ((ch === '<' || ch === '>') && next === '=') {
                if (result.length > 0 && result[result.length - 1] !== ' ') {
                    result += ' ';
                }
                result += ch + '=';
                if (content[i + 2] && content[i + 2] !== ' ') {
                    result += ' ';
                }
                i++;
                continue;
            }
            // Handle operators
            if (this.config.spaceAroundOperators && operators.includes(ch) && !operators.includes(next)) {
                // Don't add spaces around - when it's a negative number
                if (ch === '-' && /\d/.test(next) && (prev === '' || prev === '(' || prev === '[' || prev === ',' || prev === '=' || prev === ' ')) {
                    result += ch;
                    continue;
                }
                // Don't add spaces in >>
                if (ch === '>' && prev === '>') {
                    result += ch;
                    continue;
                }
                // Ensure space before
                if (result.length > 0 && result[result.length - 1] !== ' ') {
                    result += ' ';
                }
                result += ch;
                // Ensure space after
                if (next && next !== ' ' && next !== '\n') {
                    result += ' ';
                }
                continue;
            }
            result += ch;
        }
        return result;
    }
    formatLiterals(content) {
        let result = '';
        let inString = false;
        let stringChar = '';
        for (let i = 0; i < content.length; i++) {
            const ch = content[i];
            const next = content[i + 1] || '';
            const prev = content[i - 1] || '';
            // Handle string boundaries
            if (!inString && (ch === '"' || ch === "'")) {
                inString = true;
                stringChar = ch;
                result += ch;
                continue;
            }
            if (inString && ch === stringChar) {
                inString = false;
                stringChar = '';
                result += ch;
                continue;
            }
            // If in string, just add character
            if (inString) {
                result += ch;
                continue;
            }
            // Handle commas
            if (ch === ',' && this.config.spaceAfterComma) {
                result += ch;
                if (next && next !== ' ' && next !== '\n') {
                    result += ' ';
                }
                continue;
            }
            // Cleanup extra spaces after opening brackets
            if (ch === '[' || ch === '(' || ch === '{') {
                result += ch;
                // Skip all spaces after opening bracket
                while (i + 1 < content.length && content[i + 1] === ' ') {
                    i++;
                }
                continue;
            }
            // Cleanup extra spaces before closing brackets
            if (ch === ' ' && (next === ']' || next === ')' || next === '}')) {
                continue;
            }
            result += ch;
        }
        return result;
    }
    formatKeywordLine(content) {
        // Match keyword pattern: *keyword: expression/text
        const colonIndex = content.indexOf(':');
        if (colonIndex === -1) {
            // No colon, just return as-is (e.g., answer options like "* Option")
            return content;
        }
        const keywordPart = content.slice(0, colonIndex + 1); // e.g., "*if:"
        let expressionPart = content.slice(colonIndex + 1); // e.g., " x > 7"
        // Keywords that require expressions (should normalize whitespace)
        const expressionKeywords = [
            'if', 'while', 'for', 'repeat', 'goto', 'return', 'set', 'wait',
            'program', 'component', 'service', 'trigger', 'switch'
        ];
        // Extract keyword name (remove * and :)
        const keywordName = keywordPart.slice(1, -1).trim();
        // Check if this keyword requires expression formatting
        if (expressionKeywords.includes(keywordName)) {
            // Normalize whitespace in the expression part
            expressionPart = this.normalizeWhitespace(expressionPart);
        }
        else {
            // For text-based keywords (like *question:, *header:), just trim leading space
            expressionPart = expressionPart.replace(/^\s+/, ' ');
        }
        return keywordPart + expressionPart;
    }
    normalizeWhitespace(expression) {
        // This function normalizes excess whitespace while preserving string content
        let result = '';
        let inString = false;
        let stringChar = '';
        let lastWasSpace = false;
        const trimmed = expression.trim();
        for (let i = 0; i < trimmed.length; i++) {
            const ch = trimmed[i];
            // Handle string boundaries
            if (!inString && (ch === '"' || ch === "'")) {
                inString = true;
                stringChar = ch;
                result += ch;
                lastWasSpace = false;
                continue;
            }
            if (inString && ch === stringChar) {
                inString = false;
                stringChar = '';
                result += ch;
                lastWasSpace = false;
                continue;
            }
            // If in string, preserve all whitespace
            if (inString) {
                result += ch;
                continue;
            }
            // Normalize whitespace outside strings
            if (ch === ' ' || ch === '\t') {
                if (!lastWasSpace && result.length > 0) {
                    result += ' ';
                    lastWasSpace = true;
                }
                continue;
            }
            result += ch;
            lastWasSpace = false;
        }
        return ' ' + result;
    }
}
export function format(source, config) {
    const formatter = new Formatter(config);
    return formatter.format(source);
}
//# sourceMappingURL=formatter.js.map