import type { LintResult, LinterConfig, Fix } from '../types.js';
export interface ReportDescriptor {
    message: string;
    line: number;
    column: number;
    endLine?: number;
    endColumn?: number;
    fix?: Fix;
}
export interface RuleContext {
    report(descriptor: ReportDescriptor): void;
    getSourceCode(): string;
}
export interface RuleVisitor {
    [nodeType: string]: (node: any) => void;
}
export interface LintRule {
    name: string;
    description: string;
    severity: 'error' | 'warning' | 'info';
    create(context: RuleContext): RuleVisitor;
}
export declare class Linter {
    private config;
    private messages;
    private source;
    constructor(config?: Partial<LinterConfig>);
    lint(source: string, filePath?: string): LintResult;
    fix(source: string): string;
    private visitNode;
}
export declare function lint(source: string, config?: Partial<LinterConfig>): LintResult;
//# sourceMappingURL=linter.d.ts.map