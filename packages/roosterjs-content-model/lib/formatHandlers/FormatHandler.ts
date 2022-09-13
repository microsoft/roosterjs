import { ContentModelFormatBase } from '../publicTypes/format/ContentModelFormatBase';
import { DomToModelContext } from '../publicTypes/context/DomToModelContext';
import { ModelToDomContext } from '../publicTypes/context/ModelToDomContext';

/**
 * Represents an object that will handle a given format
 */
export interface FormatHandler<TFormat extends ContentModelFormatBase> {
    /**
     * Parse format from the given HTML element and default style
     * @param format The format object to parse into
     * @param element The HTML element to parse format from
     * @param context The context object that provide related context information
     * @param defaultStyle Default CSS style of the given HTML element
     */
    parse: (
        format: TFormat,
        element: HTMLElement,
        context: DomToModelContext,
        defaultStyle: Readonly<Partial<CSSStyleDeclaration>>
    ) => void;

    /**
     * Apply format to the given HTML element
     * @param format The format object to apply
     * @param element The HTML element to apply format to
     * @param context The context object that provide related context information
     */
    apply: (format: TFormat, element: HTMLElement, context: ModelToDomContext) => void;
}
