import { ContentModelFormatBase, FormatApplier, FormatParser } from 'roosterjs-content-model-types';

/**
 * @internal
 * Represents an object that will handle a given format
 */
export interface FormatHandler<TFormat extends ContentModelFormatBase> {
    /**
     * Parse format from the given HTML element and default style
     */
    parse: FormatParser<TFormat>;

    /**
     * Apply format to the given HTML element
     */
    apply: FormatApplier<TFormat>;
}
