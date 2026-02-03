export declare enum TokenType {
    NEWLINE = "NEWLINE",
    INDENT = "INDENT",
    DEDENT = "DEDENT",
    EOF = "EOF",
    KEYWORD = "KEYWORD",
    SUB_KEYWORD = "SUB_KEYWORD",
    EXPRESSION_START = "EXPRESSION_START",
    LABEL_DEF = "LABEL_DEF",
    STRING = "STRING",
    NUMBER = "NUMBER",
    OPERATOR = "OPERATOR",
    ARROW = "ARROW",
    LPAREN = "LPAREN",
    RPAREN = "RPAREN",
    LBRACKET = "LBRACKET",
    RBRACKET = "RBRACKET",
    LBRACE = "LBRACE",
    RBRACE = "RBRACE",
    COMMA = "COMMA",
    DOT = "DOT",
    COLON = "COLON",
    DOUBLE_COLON = "DOUBLE_COLON",
    IDENTIFIER = "IDENTIFIER",
    TEXT = "TEXT",
    COMMENT = "COMMENT",
    INTERPOLATION_START = "INTERPOLATION_START",
    INTERPOLATION_END = "INTERPOLATION_END",
    ERROR = "ERROR"
}
export interface Token {
    type: TokenType;
    value: string;
    line: number;
    column: number;
    offset: number;
    endLine: number;
    endColumn: number;
    endOffset: number;
}
export declare function createToken(type: TokenType, value: string, line: number, column: number, offset: number, endLine: number, endColumn: number, endOffset: number): Token;
export declare const KEYWORDS: Set<string>;
export declare const SUB_KEYWORDS: Set<string>;
export declare const OPERATORS: Set<string>;
//# sourceMappingURL=tokens.d.ts.map