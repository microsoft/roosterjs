import { FormatContext } from '../../formatHandlers/FormatContext';
import { FormatHandler } from '../../formatHandlers/FormatHandler';

/**
 * @internal
 */
export function parseFormat<T>(
    element: HTMLElement,
    handlers: FormatHandler<T>[],
    format: T,
    context: FormatContext
) {
    handlers.forEach(handler => {
        handler.parse(format, element, context);
    });
}
