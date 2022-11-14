import { ContentModelFormatBase } from '../../publicTypes/format/ContentModelFormatBase';
import { DomToModelContext } from '../../publicTypes/context/DomToModelContext';
import { FormatParser } from '../../publicTypes/context/DomToModelSettings';
import { getDefaultStyle } from './getDefaultStyle';

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
