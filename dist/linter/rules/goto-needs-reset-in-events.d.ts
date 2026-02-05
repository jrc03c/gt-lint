import type { LintRule } from '../linter.js';
/**
 * Rule: goto-needs-reset-in-events
 *
 * Ensures that `*goto:` statements inside `*events` blocks have a `*reset` sub-keyword.
 *
 * Per the GuidedTrack documentation:
 * "*goto keywords used inside an event block must always include a *reset indented beneath."
 *
 * Example of violation:
 * ```
 * *events
 *     myEvent
 *         >> x = 5
 *         *goto: someLabel  -- ERROR: missing *reset
 * ```
 *
 * Correct usage:
 * ```
 * *events
 *     myEvent
 *         >> x = 5
 *         *goto: someLabel
 *             *reset
 * ```
 */
export declare const gotoNeedsResetInEvents: LintRule;
//# sourceMappingURL=goto-needs-reset-in-events.d.ts.map