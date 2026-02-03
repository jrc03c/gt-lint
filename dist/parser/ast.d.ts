import type { SourceLocation } from '../types.js';
export type ASTNode = Program | Statement | Expression | SubKeyword | TextContent;
export type Statement = KeywordStatement | ExpressionStatement | TextStatement | CommentStatement | AnswerOption;
export type Expression = BinaryExpression | UnaryExpression | MemberExpression | CallExpression | IndexExpression | Identifier | Literal | ArrayExpression | ObjectExpression | InterpolatedString;
export interface BaseNode {
    type: string;
    loc: SourceLocation;
}
export interface Program extends BaseNode {
    type: 'Program';
    body: Statement[];
}
export interface KeywordStatement extends BaseNode {
    type: 'KeywordStatement';
    keyword: string;
    argument: Expression | TextContent | null;
    subKeywords: SubKeyword[];
    body: Statement[];
}
export interface SubKeyword extends BaseNode {
    type: 'SubKeyword';
    keyword: string;
    argument: Expression | TextContent | null;
    body: Statement[];
}
export interface ExpressionStatement extends BaseNode {
    type: 'ExpressionStatement';
    expression: Expression;
}
export interface TextStatement extends BaseNode {
    type: 'TextStatement';
    parts: (string | Expression)[];
}
export interface TextContent extends BaseNode {
    type: 'TextContent';
    parts: (string | Expression)[];
}
export interface CommentStatement extends BaseNode {
    type: 'CommentStatement';
    value: string;
}
export interface AnswerOption extends BaseNode {
    type: 'AnswerOption';
    text: TextContent;
    body: Statement[];
}
export interface BinaryExpression extends BaseNode {
    type: 'BinaryExpression';
    operator: string;
    left: Expression;
    right: Expression;
}
export interface UnaryExpression extends BaseNode {
    type: 'UnaryExpression';
    operator: string;
    argument: Expression;
}
export interface MemberExpression extends BaseNode {
    type: 'MemberExpression';
    object: Expression;
    property: Identifier;
    computed: boolean;
}
export interface CallExpression extends BaseNode {
    type: 'CallExpression';
    callee: Expression;
    arguments: Expression[];
}
export interface IndexExpression extends BaseNode {
    type: 'IndexExpression';
    object: Expression;
    index: Expression;
}
export interface Identifier extends BaseNode {
    type: 'Identifier';
    name: string;
}
export interface Literal extends BaseNode {
    type: 'Literal';
    value: string | number | boolean | null;
    raw: string;
}
export interface ArrayExpression extends BaseNode {
    type: 'ArrayExpression';
    elements: Expression[];
}
export interface ObjectExpression extends BaseNode {
    type: 'ObjectExpression';
    properties: Property[];
}
export interface Property extends BaseNode {
    type: 'Property';
    key: Expression;
    value: Expression;
}
export interface InterpolatedString extends BaseNode {
    type: 'InterpolatedString';
    parts: (string | Expression)[];
}
export declare function createProgram(body: Statement[], loc: SourceLocation): Program;
export declare function createKeywordStatement(keyword: string, argument: Expression | TextContent | null, subKeywords: SubKeyword[], body: Statement[], loc: SourceLocation): KeywordStatement;
export declare function createSubKeyword(keyword: string, argument: Expression | TextContent | null, body: Statement[], loc: SourceLocation): SubKeyword;
export declare function createExpressionStatement(expression: Expression, loc: SourceLocation): ExpressionStatement;
export declare function createTextStatement(parts: (string | Expression)[], loc: SourceLocation): TextStatement;
export declare function createTextContent(parts: (string | Expression)[], loc: SourceLocation): TextContent;
export declare function createCommentStatement(value: string, loc: SourceLocation): CommentStatement;
export declare function createAnswerOption(text: TextContent, body: Statement[], loc: SourceLocation): AnswerOption;
export declare function createBinaryExpression(operator: string, left: Expression, right: Expression, loc: SourceLocation): BinaryExpression;
export declare function createUnaryExpression(operator: string, argument: Expression, loc: SourceLocation): UnaryExpression;
export declare function createMemberExpression(object: Expression, property: Identifier, loc: SourceLocation, computed?: boolean): MemberExpression;
export declare function createCallExpression(callee: Expression, args: Expression[], loc: SourceLocation): CallExpression;
export declare function createIndexExpression(object: Expression, index: Expression, loc: SourceLocation): IndexExpression;
export declare function createIdentifier(name: string, loc: SourceLocation): Identifier;
export declare function createLiteral(value: string | number | boolean | null, raw: string, loc: SourceLocation): Literal;
export declare function createArrayExpression(elements: Expression[], loc: SourceLocation): ArrayExpression;
export declare function createObjectExpression(properties: Property[], loc: SourceLocation): ObjectExpression;
export declare function createProperty(key: Expression, value: Expression, loc: SourceLocation): Property;
export declare function createInterpolatedString(parts: (string | Expression)[], loc: SourceLocation): InterpolatedString;
//# sourceMappingURL=ast.d.ts.map