import { Token } from './tokens.js';
export declare class Lexer {
    private source;
    private pos;
    private line;
    private column;
    private tokens;
    private indentStack;
    private atLineStart;
    constructor(source: string);
    tokenize(): Token[];
    private scanToken;
    private handleIndentation;
    private scanKeyword;
    private scanItalic;
    private scanKeywordArgument;
    private scanExpression;
    private scanComment;
    private scanString;
    private scanNumber;
    private scanIdentifier;
    private scanIdentifierOrText;
    private scanText;
    private scanInterpolation;
    private emitToken;
    private skipSpaces;
    private peek;
    private peekNext;
    private advance;
    private isAtEnd;
    private isDigit;
    private isAlpha;
    private isAlphaNumeric;
}
export declare function tokenize(source: string): Token[];
//# sourceMappingURL=lexer.d.ts.map