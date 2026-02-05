/**
 * GuidedTrack Keyword Specification
 *
 * This file defines the complete specification for all GuidedTrack keywords,
 * including their argument requirements, valid sub-keywords, and constraints.
 * This is used by various lint rules to validate keyword usage.
 *
 * Based on the GuidedTrack Function & Keyword API documentation.
 */
export type ArgumentType = 'none' | 'text' | 'url' | 'number' | 'percent' | 'duration' | 'expression' | 'label' | 'variable' | 'program-name' | 'service-name' | 'event-name' | 'iteration' | 'enum';
export type SubKeywordValueType = 'none' | 'text' | 'url' | 'number' | 'expression' | 'yes-no' | 'duration' | 'datetime' | 'enum' | 'collection' | 'association';
export interface SubKeywordSpec {
    /** Whether this sub-keyword is required */
    required: boolean;
    /** The type of value expected after the colon */
    valueType: SubKeywordValueType;
    /** Valid values for enum type */
    enumValues?: string[];
    /** Brief description */
    description?: string;
    /** Whether the sub-keyword expects a body (indented content) */
    hasBody?: boolean;
}
export interface KeywordSpec {
    /** Brief description of the keyword */
    description: string;
    /** Inline argument specification */
    argument: {
        /** Whether an argument is required after the colon */
        required: boolean;
        /** The type of argument expected */
        type: ArgumentType;
        /** Valid values for enum type */
        enumValues?: string[];
    };
    /** Body (indented content) specification */
    body: {
        /** Whether a body is allowed */
        allowed: boolean;
        /** Whether a body is required */
        required: boolean;
    };
    /** Valid sub-keywords for this keyword */
    subKeywords?: Record<string, SubKeywordSpec>;
    /** Sub-keywords that must be present (all of these are required) */
    requiredSubKeywords?: string[];
    /**
     * Groups of mutually exclusive sub-keywords.
     * Exactly one from each group must be present.
     * Example: [['status', 'frequency', 'management']] means exactly one of these three.
     */
    mutuallyExclusiveGroups?: string[][];
    /**
     * Conditional requirements.
     * E.g., "if 'status' or 'frequency' is used, then 'success' and 'error' are required"
     */
    conditionalRequirements?: Array<{
        if: string[];
        then: string[];
    }>;
}
export declare const KEYWORD_SPECS: Record<string, KeywordSpec>;
/**
 * Get the specification for a keyword (case-insensitive).
 */
export declare function getKeywordSpec(keyword: string): KeywordSpec | undefined;
/**
 * Check if a keyword exists.
 */
export declare function isValidKeyword(keyword: string): boolean;
/**
 * Get all required sub-keywords for a keyword.
 */
export declare function getRequiredSubKeywords(keyword: string): string[];
/**
 * Get all valid sub-keywords for a keyword.
 */
export declare function getValidSubKeywords(keyword: string): string[];
/**
 * Check if a sub-keyword is valid for a given parent keyword.
 */
export declare function isValidSubKeyword(parentKeyword: string, subKeyword: string): boolean;
/**
 * Get valid enum values for a sub-keyword.
 */
export declare function getSubKeywordEnumValues(parentKeyword: string, subKeyword: string): string[] | undefined;
//# sourceMappingURL=keyword-spec.d.ts.map