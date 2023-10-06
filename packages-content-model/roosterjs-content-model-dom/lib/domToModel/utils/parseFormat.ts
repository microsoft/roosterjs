import { getDefaultStyle } from './getDefaultStyle';
import type {
    ContentModelFormatBase,
    DomToModelContext,
    FormatParser,
} from 'roosterjs-content-model-types';

/**
 * Parse formats of the given HTML element using specified format parsers
 * @param element The element to parse format from
 * @param parsers The parses we are using to parse format
 * @param format The format object to hold result format
 * @param context DOM to Content Model context
 */
export function parseFormat<T extends ContentModelFormatBase>(
    element: HTMLElement,
    parsers: (FormatParser<T> | null)[],
    format: T,
    context: DomToModelContext
) {
    const defaultStyle = getDefaultStyle(element, context);

    parsers.forEach(parser => {
        parser?.(format, element, context, defaultStyle);
    });
}
