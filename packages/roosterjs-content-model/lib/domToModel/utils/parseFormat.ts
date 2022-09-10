import { ContentModelFormatBase } from '../../publicTypes/format/ContentModelFormatBase';
import { DomToModelContext } from '../../publicTypes/context/DomToModelContext';
import { FormatHandler } from '../../formatHandlers/FormatHandler';

type DefaultFormatParserType =
    | Partial<CSSStyleDeclaration>
    | ((e: HTMLElement) => Partial<CSSStyleDeclaration>);

const DefaultStyleMap: Record<string, DefaultFormatParserType> = {
    B: {
        fontWeight: 'bold',
    },
    EM: {
        fontStyle: 'italic',
    },
    I: {
        fontStyle: 'italic',
    },
    S: {
        textDecoration: 'line-through',
    },
    STRIKE: {
        textDecoration: 'line-through',
    },
    STRONG: {
        fontWeight: 'bold',
    },
    SUB: {
        verticalAlign: 'sub',
        fontSize: 'smaller',
    },
    SUP: {
        verticalAlign: 'super',
        fontSize: 'smaller',
    },
    U: {
        textDecoration: 'underline',
    },
};

/**
 * @internal
 */
export function parseFormat<T extends ContentModelFormatBase>(
    element: HTMLElement,
    handlers: FormatHandler<T>[],
    format: T,
    context: DomToModelContext
) {
    const styleItem = DefaultStyleMap[element.tagName];
    const defaultStyle = styleItem
        ? typeof styleItem === 'function'
            ? styleItem(element)
            : styleItem
        : {};

    handlers.forEach(handler => {
        handler.parse(format, element, context, defaultStyle);
    });
}
