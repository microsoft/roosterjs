import { ContentModelFormatBase } from '../../publicTypes/format/ContentModelFormatBase';
import { DomToModelContext } from '../../publicTypes/context/DomToModelContext';
import { FormatKey } from '../../publicTypes/format/FormatHandlerTypeMap';

/**
 * @internal
 */
export function parseFormat<T extends ContentModelFormatBase>(
    element: HTMLElement,
    handlerKeys: FormatKey[],
    format: T,
    context: DomToModelContext
) {
    const styleItem = context.defaultStyles[element.tagName];
    const defaultStyle = styleItem || {};

    handlerKeys.forEach(key => {
        context.formatParsers[key](format, element, context, defaultStyle);
    });
}
