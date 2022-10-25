import { ContentModelFormatBase } from '../../publicTypes/format/ContentModelFormatBase';
import { DomToModelContext } from '../../publicTypes/context/DomToModelContext';
import { FormatParser } from '../../publicTypes/context/DomToModelSettings';

/**
 * @internal
 */
export function parseFormat<T extends ContentModelFormatBase>(
    element: HTMLElement,
    parsers: (FormatParser<T> | null)[],
    format: T,
    context: DomToModelContext
) {
    const styleItem = context.defaultStyles[element.tagName];
    const defaultStyle = styleItem || {};

    parsers.forEach(parser => {
        parser?.(format, element, context, defaultStyle);
    });
}
