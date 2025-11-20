import type {
    ContentModelListItemLevelFormat,
    DomToModelContext,
    FormatParser,
} from 'roosterjs-content-model-types';

/**
 * @internal
 * Parser for Word Desktop list level formatting
 * Handles margin and formatting adjustments for list items from Word Desktop
 */
export const wordDesktopListLevelParser: FormatParser<ContentModelListItemLevelFormat> = (
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
