import { FormatHandler } from '../FormatHandler';
import { MarginFormat } from '../../publicTypes/format/formatParts/MarginFormat';
import { parseValueWithUnit } from '../utils/parseValueWithUnit';

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
                switch (key) {
                    case 'marginTop':
                    case 'marginBottom':
                        format[key] = value;
                        break;

                    case 'marginLeft':
                    case 'marginRight':
                        format[key] = format[key]
                            ? parseValueWithUnit(format[key] || '', element) +
                              parseValueWithUnit(value, element) +
                              'px'
                            : value;
                        break;
                }
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
