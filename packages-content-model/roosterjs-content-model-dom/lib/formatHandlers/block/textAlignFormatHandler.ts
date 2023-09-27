import { calcAlign, ResultMap } from '../utils/dir';
import { directionFormatHandler } from './directionFormatHandler';
import type { DirectionFormat, TextAlignFormat } from 'roosterjs-content-model-types';
import type { FormatHandler } from '../FormatHandler';

/**
 * @internal
 */
export const textAlignFormatHandler: FormatHandler<DirectionFormat & TextAlignFormat> = {
    parse: (format, element, context, defaultStyle) => {
        directionFormatHandler.parse(format, element, context, defaultStyle);

        let textAlign = element.style.textAlign || defaultStyle.textAlign;

        if (
            element.tagName == 'LI' &&
            element.parentElement?.style.display === 'flex' &&
            element.parentElement.style.flexDirection === 'column' &&
            element.style.alignSelf
        ) {
            // For LI element with flex style applied, we use its "align-self" style value instead since LI has a different implementation for align
            textAlign = element.style.alignSelf;
        }

        if (textAlign) {
            format.textAlign = calcAlign(textAlign, format.direction);
        }
    },
    apply: (format, element) => {
        const dir: 'ltr' | 'rtl' = format.direction == 'rtl' ? 'rtl' : 'ltr';

        if (format.textAlign) {
            const parent = element.parentElement;
            const parentTag = parent?.tagName;

            if (element.tagName == 'LI' && parent && (parentTag == 'OL' || parentTag == 'UL')) {
                element.style.alignSelf = format.textAlign;
                element.parentElement.style.flexDirection = 'column';
                element.parentElement.style.display = 'flex';
            } else {
                element.style.textAlign = ResultMap[format.textAlign][dir];
            }
        }
    },
};
