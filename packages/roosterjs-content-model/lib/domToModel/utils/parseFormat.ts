import { getDefaultStyle } from './getDefaultStyle';
import {
    ContentModelFormatBase,
    DomToModelContext,
    FormatParser,
} from 'roosterjs-content-model-types';

/**
 * @internal
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
