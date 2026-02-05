import type { LintRule } from '../linter.js';
/**
 * Rule: no-inline-argument
 *
 * Ensures that keywords that shouldn't have inline arguments don't have them.
 *
 * Examples of violations:
 * - `*page: something` (should be just `*page`)
 * - `*html: something` (should be just `*html`)
 * - `*events: something` (should be just `*events`)
 * - `*clear: something` (should be just `*clear`)
 */
export declare const noInlineArgument: LintRule;
//# sourceMappingURL=no-inline-argument.d.ts.map