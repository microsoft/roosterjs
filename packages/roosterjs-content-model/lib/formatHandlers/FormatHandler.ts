import { ContentModelFormatBase } from '../publicTypes/format/ContentModelFormatBase';
import { FormatApplier } from '../publicTypes/context/ModelToDomSettings';
import { FormatParser } from '../publicTypes/context/DomToModelSettings';

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
