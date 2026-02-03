export function createProgram(body, loc) {
    return { type: 'Program', body, loc };
}
export function createKeywordStatement(keyword, argument, subKeywords, body, loc) {
    return { type: 'KeywordStatement', keyword, argument, subKeywords, body, loc };
}
export function createSubKeyword(keyword, argument, body, loc) {
    return { type: 'SubKeyword', keyword, argument, body, loc };
}
export function createExpressionStatement(expression, loc) {
    return { type: 'ExpressionStatement', expression, loc };
}
export function createTextStatement(parts, loc) {
    return { type: 'TextStatement', parts, loc };
}
export function createTextContent(parts, loc) {
    return { type: 'TextContent', parts, loc };
}
export function createCommentStatement(value, loc) {
    return { type: 'CommentStatement', value, loc };
}
export function createAnswerOption(text, body, loc) {
    return { type: 'AnswerOption', text, body, loc };
}
export function createBinaryExpression(operator, left, right, loc) {
    return { type: 'BinaryExpression', operator, left, right, loc };
}
export function createUnaryExpression(operator, argument, loc) {
    return { type: 'UnaryExpression', operator, argument, loc };
}
export function createMemberExpression(object, property, loc, computed = false) {
    return { type: 'MemberExpression', object, property, computed, loc };
}
export function createCallExpression(callee, args, loc) {
    return { type: 'CallExpression', callee, arguments: args, loc };
}
export function createIndexExpression(object, index, loc) {
    return { type: 'IndexExpression', object, index, loc };
}
export function createIdentifier(name, loc) {
    return { type: 'Identifier', name, loc };
}
export function createLiteral(value, raw, loc) {
    return { type: 'Literal', value, raw, loc };
}
export function createArrayExpression(elements, loc) {
    return { type: 'ArrayExpression', elements, loc };
}
export function createObjectExpression(properties, loc) {
    return { type: 'ObjectExpression', properties, loc };
}
export function createProperty(key, value, loc) {
    return { type: 'Property', key, value, loc };
}
export function createInterpolatedString(parts, loc) {
    return { type: 'InterpolatedString', parts, loc };
}
//# sourceMappingURL=ast.js.map