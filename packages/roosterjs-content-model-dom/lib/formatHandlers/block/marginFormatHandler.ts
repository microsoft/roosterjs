import { parseValueWithUnit } from '../utils/parseValueWithUnit';
import type { FormatHandler } from '../FormatHandler';
import type { DirectionFormat, MarginFormat } from 'roosterjs-content-model-types';

const MarginKeys: (keyof MarginFormat & keyof CSSStyleDeclaration)[] = [
    'marginTop',
    'marginRight',
    'marginBottom',
    'marginLeft',
];

const AlternativeKeyLtr: Partial<Record<
    keyof MarginFormat,
    keyof CSSStyleDeclaration | undefined
>> = {
    marginLeft: 'marginInlineStart',
};

const AlternativeKeyRtl: Partial<Record<
    keyof MarginFormat,
    keyof CSSStyleDeclaration | undefined
>> = {
    marginRight: 'marginInlineStart',
};

const LTR: Record<keyof MarginFormat, keyof MarginFormat> = {
    marginLeft: 'marginRight',
    marginRight: 'marginLeft',
    marginTop: 'marginTop',
    marginBottom: 'marginBottom',
};

/**
 * @internal
 */
export const marginFormatHandler: FormatHandler<MarginFormat & DirectionFormat> = {
    parse: (format, element, _, defaultStyle) => {
        MarginKeys.forEach(key => {
            let value = element.style[key];

            if (!value) {
                const alterativeKey = (format.direction == 'rtl'
                    ? AlternativeKeyRtl
                    : AlternativeKeyLtr)[key];

                value =
                    defaultStyle[key] ??
                    ((alterativeKey ? defaultStyle[alterativeKey] : '') as string);
            }

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
            const ltrKey = format.direction == 'rtl' ? LTR[key] : key;

            if (value != context.implicitFormat[ltrKey]) {
                element.style[key] = value || '0';
            }
        });
    },
};
