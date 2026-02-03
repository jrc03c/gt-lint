export interface SourceLocation {
    start: Position;
    end: Position;
}
export interface Position {
    line: number;
    column: number;
    offset: number;
}
export interface LintMessage {
    ruleId: string;
    severity: 'error' | 'warning' | 'info';
    message: string;
    line: number;
    column: number;
    endLine?: number;
    endColumn?: number;
    fix?: Fix;
}
export interface Fix {
    range: [number, number];
    text: string;
}
export interface LintResult {
    filePath: string;
    messages: LintMessage[];
    errorCount: number;
    warningCount: number;
    fixableErrorCount: number;
    fixableWarningCount: number;
    source?: string;
    output?: string;
}
export interface FormatterConfig {
    blankLinesBetweenBlocks: number;
    spaceAroundOperators: boolean;
    spaceAfterComma: boolean;
    spaceAroundArrow: boolean;
    trimTrailingWhitespace: boolean;
    insertFinalNewline: boolean;
}
export interface LinterConfig {
    rules: Record<string, 'off' | 'warn' | 'error'>;
    format: FormatterConfig;
    ignore: string[];
}
export declare const DEFAULT_FORMATTER_CONFIG: FormatterConfig;
export declare const DEFAULT_LINTER_CONFIG: LinterConfig;
//# sourceMappingURL=types.d.ts.map