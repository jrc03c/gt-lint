import { Token } from '../lexer/index.js';
import { Program } from './ast.js';
export declare class Parser {
    private tokens;
    private pos;
    private errors;
    parse(tokens: Token[]): Program;
    getErrors(): string[];
    private parseStatements;
    private parseStatement;
    private parseComment;
    private parseExpressionStatement;
    private parseKeywordStatement;
    private parseKeywordBody;
    private parseSubKeyword;
    private parseTextOrAnswerOption;
    private parseTextContent;
    private parseExpression;
    private parseAssignment;
    private parseOr;
    private parseAnd;
    private parseEquality;
    private parseComparison;
    private parseIn;
    private parseAdditive;
    private parseMultiplicative;
    private parseUnary;
    private parsePostfix;
    private parsePrimary;
    private parseArrayLiteral;
    private parseObjectLiteral;
    private parseArguments;
    private extractKeywordName;
    /**
     * Re-tokenizes and parses a text string as an expression.
     * This is used for keywords like *if:, *while:, etc. that expect expressions
     * but initially receive TEXT tokens from the lexer.
     */
    private parseTextAsExpression;
    private createLoc;
    private createLocFromToken;
    private peek;
    private previous;
    private advance;
    private check;
    private isAtEnd;
}
export declare function parse(tokens: Token[]): Program;
//# sourceMappingURL=parser.d.ts.map