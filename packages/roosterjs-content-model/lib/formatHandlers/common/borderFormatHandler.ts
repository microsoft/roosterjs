import { BorderFormat } from '../../publicTypes/format/formatParts/BorderFormat';
import { FormatHandler } from '../FormatHandler';

/**
 * @internal
 */
export const BorderKeys: (keyof BorderFormat & keyof CSSStyleDeclaration)[] = [
    'borderTop',
    'borderRight',
    'borderBottom',
    'borderLeft',
    'borderRadius',
];

/**
 * @internal
 */
export const borderFormatHandler: FormatHandler<BorderFormat> = {
    parse: (format, element) => {
        BorderKeys.forEach(key => {
            const value = element.style[key];

            if (value) {
                format[key] = value == 'none' ? '' : value;
            }
        });
    },
    apply: (format, element) => {
        BorderKeys.forEach(key => {
            const value = format[key];

            if (value) {
                element.style[key] = value;
            }
        });
    },
};
