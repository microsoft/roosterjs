import { FormatHandler } from '../../formatHandlers/FormatHandler';

/**
 * @internal
 */
export function applyFormat<T>(element: HTMLElement, handlers: FormatHandler<T>[], format: T) {
    handlers.forEach(handler => {
        handler.apply(format, element);
    });
}
