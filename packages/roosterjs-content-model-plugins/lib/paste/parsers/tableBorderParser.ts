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

export const tableBorderParser: FormatParser<ContentModelTableCellFormat> = (format, element) => {
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
