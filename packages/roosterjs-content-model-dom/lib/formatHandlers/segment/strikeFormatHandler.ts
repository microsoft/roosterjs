import { wrapAllChildNodes } from '../../domUtils/moveChildNodes';
import type { FormatHandler } from '../FormatHandler';
import type { StrikeFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const strikeFormatHandler: FormatHandler<StrikeFormat> = {
    parse: (format, element, context, defaultStyle) => {
        const textDecoration = element.style.textDecoration || defaultStyle.textDecoration;

        if (textDecoration?.indexOf('line-through')! >= 0) {
            format.strikethrough = true;
            const style = element.style.textDecorationStyle || defaultStyle.textDecorationStyle;

            if (style == 'double') {
                format.strikethroughStyle = style;
            } else {
                delete format.strikethroughStyle;
            }
        } else if (textDecoration == 'none' && format.strikethrough) {
            format.strikethrough = false;
            delete format.strikethroughStyle;
        }
    },
    apply: (format, element) => {
        if (format.strikethrough) {
            const strike = wrapAllChildNodes(element, 's');

            if (format.strikethroughStyle == 'double') {
                strike.style.textDecorationStyle = 'double';
            }
        }
    },
};
