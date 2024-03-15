import { calcAlign, ResultMap } from '../utils/dir';
import { directionFormatHandler } from './directionFormatHandler';
import type {
    DirectionFormat,
    HtmlAlignFormat,
    TextAlignFormat,
} from 'roosterjs-content-model-types';
import type { FormatHandler } from '../FormatHandler';

/**
 * @internal
 */
export const htmlAlignFormatHandler: FormatHandler<
    DirectionFormat & HtmlAlignFormat & TextAlignFormat
> = {
    parse: (format, element, context, defaultStyle) => {
        directionFormatHandler.parse(format, element, context, defaultStyle);

        const htmlAlign = element.getAttribute('align');

        if (htmlAlign) {
            format.htmlAlign = calcAlign(htmlAlign, format.direction);
            delete format.textAlign;
            delete context.blockFormat.textAlign;
        }
    },
    apply: (format, element) => {
        const dir: 'ltr' | 'rtl' = format.direction == 'rtl' ? 'rtl' : 'ltr';

        if (format.htmlAlign) {
            element.setAttribute('align', ResultMap[format.htmlAlign][dir]);
        }
    },
};
