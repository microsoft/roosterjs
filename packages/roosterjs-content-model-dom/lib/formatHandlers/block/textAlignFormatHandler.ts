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

        if (textAlign && element.parentElement?.style.display !== 'flex') {
            format.textAlign = calcAlign(textAlign, format.direction);
        }
    },
    apply: (format, element) => {
        const dir: 'ltr' | 'rtl' = format.direction == 'rtl' ? 'rtl' : 'ltr';

        if (format.textAlign) {
            element.style.textAlign = ResultMap[format.textAlign][dir];
        }
    },
};
