import type { LintRule } from '../linter.js';
/**
 * Rule: required-subkeywords
 *
 * Ensures that keywords have all their required sub-keywords present.
 *
 * Examples of violations:
 * - `*chart:` without `*type:` or `*data:`
 * - `*email` without `*subject:` or `*body:`
 * - `*service:` without `*path:`, `*method:`, `*success`, or `*error`
 * - `*database:` without `*what:`, `*success`, or `*error`
 */
export declare const requiredSubkeywords: LintRule;
//# sourceMappingURL=required-subkeywords.d.ts.map