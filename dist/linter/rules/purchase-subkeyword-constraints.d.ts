import type { LintRule } from '../linter.js';
/**
 * Rule: purchase-subkeyword-constraints
 *
 * Ensures that `*purchase` follows its specific sub-keyword constraints:
 * 1. Exactly one of `*status`, `*frequency`, or `*management` must be present
 * 2. If `*status` or `*frequency` is used, then `*success` and `*error` are required
 *
 * Examples of violations:
 * - `*purchase` with no mode sub-keyword
 * - `*purchase` with both `*status` and `*frequency`
 * - `*purchase` with `*status` but missing `*success` or `*error`
 */
export declare const purchaseSubkeywordConstraints: LintRule;
//# sourceMappingURL=purchase-subkeyword-constraints.d.ts.map