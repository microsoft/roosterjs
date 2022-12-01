import { FormatHandler } from '../FormatHandler';
import { MarginFormat } from '../../publicTypes/format/formatParts/MarginFormat';

const MarginKeys: (keyof MarginFormat & keyof CSSStyleDeclaration)[] = [
    'marginTop',
    'marginRight',
    'marginBottom',
    'marginLeft',
];

/**
 * @internal
 */
export const marginFormatHandler: FormatHandler<MarginFormat> = {
    parse: (format, element, _, defaultStyle) => {
        MarginKeys.forEach(key => {
            const value = element.style[key] || defaultStyle[key];

            if (value) {
                format[key] = value;
            }
        });
    },
    apply: (format, element, context) => {
        MarginKeys.forEach(key => {
            const value = format[key];

            if (value != context.implicitFormat[key]) {
                element.style[key] = value || '0';
            }
        });
    },
};
