import { ContentModelFormatBase } from '../../publicTypes/format/ContentModelFormatBase';
import { FormatKey } from '../../publicTypes/format/FormatHandlerTypeMap';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';

/**
 * @internal
 */
export function applyFormat<T extends ContentModelFormatBase>(
    element: HTMLElement,
    handlerKeys: FormatKey[],
    format: T,
    context: ModelToDomContext
) {
    handlerKeys.forEach(key => {
        context.formatAppliers[key](format, element, context);
    });
}
