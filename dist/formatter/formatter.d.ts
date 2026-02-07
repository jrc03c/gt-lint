import type { FormatterConfig } from '../types.js';
export declare class Formatter {
    private config;
    constructor(config?: Partial<FormatterConfig>);
    format(source: string): string;
    private formatLine;
    private formatExpression;
    private formatOperatorsOutsideStrings;
    private getSpaceForBracket;
    private formatLiterals;
    private formatKeywordLine;
    private normalizeWhitespace;
}
export declare function format(source: string, config?: Partial<FormatterConfig>): string;
//# sourceMappingURL=formatter.d.ts.map