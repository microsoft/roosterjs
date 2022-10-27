import { BoldFormat } from '../../publicTypes/format/formatParts/BoldFormat';
import { FormatHandler } from '../FormatHandler';
import { moveChildNodes } from 'roosterjs-editor-dom';

/**
 * @internal
 */
export const boldFormatHandler: FormatHandler<BoldFormat> = {
    parse: (format, element, context, defaultStyle) => {
        const fontWeight = element.style.fontWeight || defaultStyle.fontWeight || '';
        const fontWeightInt = parseInt(fontWeight);

        if (fontWeight == 'bold' || fontWeight == 'bolder' || fontWeightInt >= 600) {
            format.bold = true;
        } else if (
            fontWeight == 'normal' ||
            fontWeight == 'lighter' ||
            fontWeight == 'initial' ||
            fontWeightInt < 600
        ) {
            format.bold = false;
        }
    },
    apply: (format, element, context) => {
        if (format.bold && !context.segmentFormatFromBlock.bold) {
            const b = element.ownerDocument.createElement('b');
            moveChildNodes(b, element);
            element.appendChild(b);
        } else if (!format.bold && context.segmentFormatFromBlock.bold) {
            element.style.fontWeight = 'normal';
        }
    },
};
