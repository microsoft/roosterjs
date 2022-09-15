import { ContentModelFormatBase } from '../../publicTypes/format/ContentModelFormatBase';
import { defaultStyleMap } from '../context/defaultStyles';
import { DomToModelContext } from '../../publicTypes/context/DomToModelContext';
import { FormatHandler } from '../../formatHandlers/FormatHandler';

/**
 * @internal
 */
export function parseFormat<T extends ContentModelFormatBase>(
    element: HTMLElement,
    handlers: FormatHandler<T>[],
    format: T,
    context: DomToModelContext
) {
    const styleItem = defaultStyleMap[element.tagName];
    const defaultStyle = styleItem || {};

    handlers.forEach(handler => {
        handler.parse(format, element, context, defaultStyle);
    });
}
