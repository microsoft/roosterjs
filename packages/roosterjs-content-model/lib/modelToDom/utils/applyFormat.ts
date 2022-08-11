import { ContentModelContext } from '../../publicTypes/ContentModelContext';
import { ContentModelFormatBase } from '../../publicTypes/format/ContentModelFormatBase';
import { FormatHandler } from '../../formatHandlers/FormatHandler';

/**
 * @internal
 */
export function applyFormat<T extends ContentModelFormatBase>(
    element: HTMLElement,
    handlers: FormatHandler<T>[],
    format: T,
    context: ContentModelContext
) {
    handlers.forEach(handler => {
        handler.apply(format, element, context);
    });
}
