import { BorderKeys } from 'roosterjs-content-model-dom';
import type {
    BorderFormat,
    ContentModelTableCellFormat,
    FormatParser,
} from 'roosterjs-content-model-types';

const ElementBorderKeys = new Map<
    keyof BorderFormat,
    {
        c: keyof CSSStyleDeclaration;
        s: keyof CSSStyleDeclaration;
        w: keyof CSSStyleDeclaration;
    }
>([
    ['borderTop', { w: 'borderTopWidth', s: 'borderTopStyle', c: 'borderTopColor' }],
    ['borderRight', { w: 'borderRightWidth', s: 'borderRightStyle', c: 'borderRightColor' }],
    ['borderBottom', { w: 'borderBottomWidth', s: 'borderBottomStyle', c: 'borderBottomColor' }],
    ['borderLeft', { w: 'borderLeftWidth', s: 'borderLeftStyle', c: 'borderLeftColor' }],
]);

/**
 * @internal
 * If a table cell has borderXStyle and borderXWidth but do not have borderXColor, the style borderX is not provided and just returns an empty string. This parser is to work around that issue
 * More info in https://github.com/microsoft/roosterjs/pull/2154
 */
export const tableBorderParser: FormatParser<ContentModelTableCellFormat> = (
    format: ContentModelTableCellFormat,
    element: HTMLElement
): void => {
    BorderKeys.forEach(key => {
        if (!format[key]) {
            const styleSet = ElementBorderKeys.get(key);
            if (
                styleSet &&
                element.style[styleSet.w] &&
                element.style[styleSet.s] &&
                !element.style[styleSet.c]
            ) {
                format[key] = `${element.style[styleSet.w]} ${element.style[styleSet.s]}`;
            }
        }
    });
};
