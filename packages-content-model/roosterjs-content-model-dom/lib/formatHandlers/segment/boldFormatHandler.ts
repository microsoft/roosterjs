import { shouldSetValue } from '../utils/shouldSetValue';
import { wrapAllChildNodes } from '../../domUtils/moveChildNodes';
import type { BoldFormat } from 'roosterjs-content-model-types';
import type { FormatHandler } from '../FormatHandler';

/**
 * @internal
 */
export const boldFormatHandler: FormatHandler<BoldFormat> = {
    parse: (format, element, context, defaultStyle) => {
        const fontWeight = element.style.fontWeight || defaultStyle.fontWeight;

        if (shouldSetValue(fontWeight, '400', format.fontWeight, defaultStyle.fontWeight)) {
            format.fontWeight = fontWeight;
        }
    },
    apply: (format, element, context) => {
        if (typeof format.fontWeight === 'undefined') {
            return;
        }

        const blockFontWeight = context.implicitFormat.fontWeight;

        if (
            (blockFontWeight && blockFontWeight != format.fontWeight) ||
            (!blockFontWeight && format.fontWeight && format.fontWeight != 'normal')
        ) {
            if (format.fontWeight == 'bold') {
                wrapAllChildNodes(element, 'b');
            } else {
                element.style.fontWeight = format.fontWeight || 'normal';
            }
        }
    },
};
