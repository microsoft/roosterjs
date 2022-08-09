import { ContentModelContext } from '../../publicTypes/ContentModelContext';
import { FormatHandler } from '../../formatHandlers/FormatHandler';

/**
 * @internal
 */
export function applyFormat<T>(
    element: HTMLElement,
    handlers: FormatHandler<T>[],
    format: T,
    context: ContentModelContext
) {
    handlers.forEach(handler => {
        handler.apply(format, element, context);
    });
}
