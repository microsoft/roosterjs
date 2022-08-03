import { ContentModelContext } from '../../publicTypes/ContentModelContext';
import { FormatHandler } from '../../formatHandlers/FormatHandler';

/**
 * @internal
 */
export function parseFormat<T>(
    element: HTMLElement,
    handlers: FormatHandler<T>[],
    format: T,
    context: ContentModelContext
) {
    handlers.forEach(handler => {
        handler.parse(format, element, context);
    });
}
