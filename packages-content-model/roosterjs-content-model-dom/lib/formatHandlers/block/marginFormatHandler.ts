import { parseValueWithUnit } from '../utils/parseValueWithUnit';
import type { FormatHandler } from '../FormatHandler';
import type { MarginFormat } from 'roosterjs-content-model-types';

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

        const marginBlockStart = element.style.marginBlockStart || defaultStyle.marginBlockStart;
        const marginTop = element.style.marginTop || defaultStyle.marginTop;
        if (marginBlockStart && !marginTop) {
            format.marginBlockStart = parseValueWithUnit(marginBlockStart) + 'px';
        }

        const marginBlockEnd = element.style.marginBlockEnd || defaultStyle.marginBlockEnd;
        const marginBottom = element.style.marginBottom || defaultStyle.marginBottom;
        if (marginBlockEnd && !marginBottom) {
            format.marginBlockEnd = parseValueWithUnit(marginBlockEnd) + 'px';
        }
    },
    apply: (format, element, context) => {
        MarginKeys.forEach(key => {
            const value = format[key];

            if (value != context.implicitFormat[key]) {
                element.style[key] = value || '0';
            }
        });

        if (format.marginBlockStart && !format.marginTop) {
            element.style.marginBlockStart = format.marginBlockStart;
        }

        if (format.marginBlockEnd && !format.marginBottom) {
            element.style.marginBlockEnd = format.marginBlockEnd;
        }
    },
};
