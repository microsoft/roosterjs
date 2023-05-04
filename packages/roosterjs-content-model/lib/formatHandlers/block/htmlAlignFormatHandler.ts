import { calcAlign, ResultMap } from '../utils/dir';
import { DirectionFormat } from '../../publicTypes/format/formatParts/DirectionFormat';
import { directionFormatHandler } from './directionFormatHandler';
import { FormatHandler } from '../FormatHandler';
import { HtmlAlignFormat } from '../../publicTypes/format/formatParts/HtmlAlignFormat';
import { TextAlignFormat } from '../../publicTypes/format/formatParts/TextAlignFormat';

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
