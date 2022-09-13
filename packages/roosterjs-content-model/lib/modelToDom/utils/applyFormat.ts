import { ContentModelFormatBase } from '../../publicTypes/format/ContentModelFormatBase';
import { FormatHandler } from '../../formatHandlers/FormatHandler';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';

/**
 * @internal
 */
export function applyFormat<T extends ContentModelFormatBase>(
    element: HTMLElement,
    handlers: FormatHandler<T>[],
    format: T,
    context: ModelToDomContext
) {
    handlers.forEach(handler => {
        handler.apply(format, element, context);
    });
}
