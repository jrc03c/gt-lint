export var TokenType;
(function (TokenType) {
    // Structure
    TokenType["NEWLINE"] = "NEWLINE";
    TokenType["INDENT"] = "INDENT";
    TokenType["DEDENT"] = "DEDENT";
    TokenType["EOF"] = "EOF";
    // Keywords & Identifiers
    TokenType["KEYWORD"] = "KEYWORD";
    TokenType["SUB_KEYWORD"] = "SUB_KEYWORD";
    TokenType["EXPRESSION_START"] = "EXPRESSION_START";
    TokenType["LABEL_DEF"] = "LABEL_DEF";
    // Literals
    TokenType["STRING"] = "STRING";
    TokenType["NUMBER"] = "NUMBER";
    // Operators
    TokenType["OPERATOR"] = "OPERATOR";
    TokenType["ARROW"] = "ARROW";
    // Punctuation
    TokenType["LPAREN"] = "LPAREN";
    TokenType["RPAREN"] = "RPAREN";
    TokenType["LBRACKET"] = "LBRACKET";
    TokenType["RBRACKET"] = "RBRACKET";
    TokenType["LBRACE"] = "LBRACE";
    TokenType["RBRACE"] = "RBRACE";
    TokenType["COMMA"] = "COMMA";
    TokenType["DOT"] = "DOT";
    TokenType["COLON"] = "COLON";
    TokenType["DOUBLE_COLON"] = "DOUBLE_COLON";
    // Other
    TokenType["IDENTIFIER"] = "IDENTIFIER";
    TokenType["TEXT"] = "TEXT";
    TokenType["COMMENT"] = "COMMENT";
    TokenType["INTERPOLATION_START"] = "INTERPOLATION_START";
    TokenType["INTERPOLATION_END"] = "INTERPOLATION_END";
    // Errors
    TokenType["ERROR"] = "ERROR";
})(TokenType || (TokenType = {}));
export function createToken(type, value, line, column, offset, endLine, endColumn, endOffset) {
    return {
        type,
        value,
        line,
        column,
        offset,
        endLine,
        endColumn,
        endOffset,
    };
}
// GuidedTrack keywords
export const KEYWORDS = new Set([
    'audio',
    'button',
    'chart',
    'clear',
    'component',
    'database',
    'email',
    'events',
    'experiment',
    'for',
    'goto',
    'group',
    'header',
    'html',
    'if',
    'image',
    'label',
    'list',
    'login',
    'maintain',
    'navigation',
    'page',
    'points',
    'program',
    'progress',
    'purchase',
    'question',
    'quit',
    'randomize',
    'repeat',
    'return',
    'service',
    'set',
    'settings',
    'share',
    'summary',
    'switch',
    'trigger',
    'video',
    'wait',
    'while',
]);
// Sub-keywords that can appear under various parent keywords
export const SUB_KEYWORDS = new Set([
    'after',
    'answers',
    'before',
    'blank',
    'body',
    'cancel',
    'caption',
    'classes',
    'click',
    'confirm',
    'countdown',
    'data',
    'date',
    'default',
    'description',
    'error',
    'every',
    'everytime',
    'frequency',
    'hide',
    'icon',
    'identifier',
    'management',
    'max',
    'method',
    'min',
    'multiple',
    'name',
    'other',
    'path',
    'placeholder',
    'required',
    'reset',
    'save',
    'searchable',
    'send',
    'shuffle',
    'start',
    'startup',
    'status',
    'subject',
    'success',
    'tags',
    'throwaway',
    'time',
    'tip',
    'to',
    'trendline',
    'type',
    'until',
    'what',
    'when',
    'with',
    'xaxis',
    'yaxis',
]);
// Operators
export const OPERATORS = new Set([
    '+',
    '-',
    '*',
    '/',
    '%',
    '=',
    '<',
    '>',
    '<=',
    '>=',
    'and',
    'or',
    'not',
    'in',
]);
//# sourceMappingURL=tokens.js.map