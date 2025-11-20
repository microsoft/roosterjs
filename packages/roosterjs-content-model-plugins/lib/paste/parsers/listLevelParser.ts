import type {
    ContentModelListItemLevelFormat,
    DomToModelContext,
    FormatParser,
} from 'roosterjs-content-model-types';

/**
 * @internal
 * Parser for processing list level formatting specific to Word Desktop
 * @param format The list item level format to modify
 * @param element The HTML element being processed
 * @param _context The DOM to model context
 * @param defaultStyle The default style properties
 */
export const listLevelParser: FormatParser<ContentModelListItemLevelFormat> = (
    format: ContentModelListItemLevelFormat,
    element: HTMLElement,
    _context: DomToModelContext,
    defaultStyle: Readonly<Partial<CSSStyleDeclaration>>
) => {
    if (element.style.marginLeft != '') {
        format.marginLeft = defaultStyle.marginLeft;
    }

    format.marginBottom = undefined;
};
