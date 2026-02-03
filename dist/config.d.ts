import type { LinterConfig, FormatterConfig } from './types.js';
export interface GTLintConfig {
    rules?: LinterConfig['rules'];
    format?: Partial<FormatterConfig>;
    ignore?: string[];
}
/**
 * Find a config file by searching up the directory tree
 */
export declare function findConfigFile(startDir: string): string | null;
/**
 * Load a config file
 */
export declare function loadConfigFile(configPath: string): Promise<GTLintConfig>;
/**
 * Merge user config with defaults
 */
export declare function mergeConfig(userConfig: GTLintConfig): {
    linter: LinterConfig;
    formatter: FormatterConfig;
    ignore: string[];
};
/**
 * Load config from a directory or specific file path
 */
export declare function loadConfig(pathOrDir: string): Promise<{
    linter: LinterConfig;
    formatter: FormatterConfig;
    ignore: string[];
    configPath: string | null;
}>;
//# sourceMappingURL=config.d.ts.map