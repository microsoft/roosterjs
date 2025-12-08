import { calcAlign } from '../utils/dir';
import type { DirectionFormat, TextAlignFormat } from 'roosterjs-content-model-types';
import type { FormatHandler } from '../FormatHandler';

/**
 * @internal
 */
export const listItemAlignFormatHandler: FormatHandler<TextAlignFormat & DirectionFormat> = {
    parse: (format, element, context) => {
        // For list, we usually use align-self to implement alignment
        if (element.style.alignSelf) {
            format.textAlign = calcAlign(element.style.alignSelf, context.blockFormat.direction);
        } else if (element.style.textAlign && element.parentElement?.style.display !== 'flex') {
            let align = element.style.textAlign;

            // For RTL environment, 'start' and 'end' in textAlign means opposite direction compared to LTR unless parent is using flex display
            if (context.blockFormat.direction === 'rtl' && (align == 'start' || align == 'end')) {
                align = align == 'start' ? 'end' : 'start';
            }

            format.textAlign = calcAlign(align, context.blockFormat.direction);
        }
    },
    apply: (format, element) => {
        if (format.textAlign) {
            const parent = element.parentElement;

            element.style.alignSelf = format.textAlign;

            // For list item we use align-self to implement textAlign rather than text-align
            element.style.removeProperty('text-align');

            if (parent) {
                parent.style.flexDirection = 'column';
                parent.style.display = 'flex';
            }
        }
    },
};
