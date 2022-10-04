import { FormatHandler } from '../FormatHandler';
import { MarginFormat } from '../../publicTypes/format/formatParts/MarginFormat';
import { parseValueWithUnit } from '../utils/parseValueWithUnit';

const MarginKeys: (keyof MarginFormat & keyof CSSStyleDeclaration)[] = [
    'marginTop',
    'marginRight',
    'marginBottom',
    'marginLeft',
];

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
    parse: (format, element) => {
        MarginKeys.forEach(key => {
            const value = element.style[key];

            if (value) {
                format[key] = value;
            }
        });
    },
    apply: (format, element) => {
        MarginKeys.forEach(key => {
            const value = format[key];

            if (value) {
                element.style[key] = value;
            }
        });
    },
};
