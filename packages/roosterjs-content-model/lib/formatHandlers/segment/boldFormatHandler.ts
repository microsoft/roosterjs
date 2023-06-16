import { BoldFormat } from '../../publicTypes/format/formatParts/BoldFormat';
import { FormatHandler } from '../FormatHandler';
import { moveChildNodes } from 'roosterjs-editor-dom';

/**
 * @internal
 */
export const boldFormatHandler: FormatHandler<BoldFormat> = {
    parse: (format, element, context, defaultStyle) => {
        const fontWeight = element.style.fontWeight || defaultStyle.fontWeight;

        if (fontWeight) {
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
                const b = element.ownerDocument.createElement('b');
                moveChildNodes(b, element);
                element.appendChild(b);
            } else {
                element.style.fontWeight = format.fontWeight || 'normal';
            }
        }
    },
};
