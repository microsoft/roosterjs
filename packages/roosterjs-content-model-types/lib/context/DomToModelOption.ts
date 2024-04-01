import type { ValueSanitizer } from '../parameter/ValueSanitizer';
import type {
    ElementProcessorMap,
    FormatParsers,
    FormatParsersPerCategory,
} from './DomToModelSettings';

/**
 * Options for creating DomToModelContext
 */
export interface DomToModelOption {
    /**
     * Overrides default element processors
     */
    processorOverride?: Partial<ElementProcessorMap>;

    /**
     * Overrides default format handlers
     */
    formatParserOverride?: Partial<FormatParsers>;

    /**
     * Provide additional format parsers for each format type
     */
    additionalFormatParsers?: Partial<FormatParsersPerCategory>;
}

/**
 * Options for creating DomToModelContext, used by formatContentModel and createContentModel API
 */
export interface DomToModelOptionForCreateModel extends DomToModelOption {
    /**
     * When set to true, it will try to reuse cached content model if any
     */
    tryGetFromCache: boolean;
}

/**
 * Options for DOM to Content Model conversion for paste only
 */
export interface DomToModelOptionForSanitizing extends Required<DomToModelOption> {
    /**
     * Additional allowed HTML tags in lower case. Element with these tags will be preserved
     */
    readonly additionalAllowedTags: Lowercase<string>[];

    /**
     * Additional disallowed HTML tags in lower case. Elements with these tags will be dropped
     */
    readonly additionalDisallowedTags: Lowercase<string>[];

    /**
     * Additional sanitizers for CSS styles
     */
    readonly styleSanitizers: Record<string, ValueSanitizer>;

    /**
     * Additional sanitizers for CSS styles
     */
    readonly attributeSanitizers: Record<string, ValueSanitizer>;
}
