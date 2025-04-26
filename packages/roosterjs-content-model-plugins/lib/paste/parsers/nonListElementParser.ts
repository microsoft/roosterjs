import { isElementOfType } from 'roosterjs-content-model-dom/lib';
import type { FormatParser, ContentModelListItemFormat } from 'roosterjs-content-model-types/lib';

export const nonListElementParser: FormatParser<ContentModelListItemFormat> = (
    format,
    element,
    _context,
    defaultStyle
): void => {
    if (!isElementOfType(element, 'li')) {
        Object.keys(defaultStyle).forEach(keyInput => {
            const key = keyInput as keyof CSSStyleDeclaration;
            const formatKey = keyInput as keyof ContentModelListItemFormat;
            if (
                key != 'display' &&
                format[formatKey] != undefined &&
                format[formatKey] == defaultStyle[key]
            ) {
                delete format[formatKey];
            }
        });
    }
};
