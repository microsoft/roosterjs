import { FormatContext } from '../../formatHandlers/FormatContext';
import { FormatHandler } from '../../formatHandlers/FormatHandler';

/**
 * @internal
 */
export function applyFormat<T>(
    element: HTMLElement,
    handlers: FormatHandler<T>[],
    format: T,
    context: FormatContext
) {
    handlers.forEach(handler => {
        handler.apply(format, element, context);
    });
}
