import { directionFormatHandler } from './directionFormatHandler';
import type { FormatHandler } from '../FormatHandler';
import type { DirectionFormat, PaddingFormat } from 'roosterjs-content-model-types';

const PaddingKeys: (keyof PaddingFormat & keyof CSSStyleDeclaration)[] = [
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',
];

const AlternativeKeyLtr: Partial<Record<
    keyof PaddingFormat,
    keyof CSSStyleDeclaration | undefined
>> = {
    paddingLeft: 'paddingInlineStart',
};

const AlternativeKeyRtl: Partial<Record<
    keyof PaddingFormat,
    keyof CSSStyleDeclaration | undefined
>> = {
    paddingRight: 'paddingInlineStart',
};

/**
 * @internal
 */
export const paddingFormatHandler: FormatHandler<PaddingFormat & DirectionFormat> = {
    parse: (format, element, context, defaultStyle) => {
        directionFormatHandler.parse(format, element, context, defaultStyle);

        PaddingKeys.forEach(key => {
            let value = element.style[key];
            const alterativeKey = (format.direction == 'rtl'
                ? AlternativeKeyRtl
                : AlternativeKeyLtr)[key];
            const defaultValue: string =
                (defaultStyle[key] ??
                    (alterativeKey ? defaultStyle[alterativeKey] : undefined) ??
                    '0px') + '';

            if (!value) {
                value = defaultValue;
            }

            if (!value || value == '0') {
                value = '0px';
            }

            if (value && value != defaultValue) {
                format[key] = value;
            }
        });
    },
    apply: (format, element, context) => {
        const tagName = element.tagName;
        const isTableCell = tagName == 'TD' || tagName == 'TH';
        const isList = tagName == 'OL' || tagName == 'UL';

        if (context.tableFormat?.alreadyWroteCellPadding && isTableCell) {
            return;
        }

        PaddingKeys.forEach(key => {
            const value = format[key];
            let defaultValue: string | undefined = undefined;

            if (isList) {
                if (
                    (format.direction == 'rtl' && key == 'paddingRight') ||
                    (format.direction != 'rtl' && key == 'paddingLeft')
                ) {
                    defaultValue = '40px';
                }
            }

            if (value && value != defaultValue) {
                element.style[key] = value;
            }
        });
    },
};
