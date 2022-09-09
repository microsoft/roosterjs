import { FormatHandler } from '../FormatHandler';
import { moveChildNodes } from 'roosterjs-editor-dom';
import { StrikeFormat } from '../../publicTypes/format/formatParts/StrikeFormat';

/**
 * @internal
 */
export const strikeFormatHandler: FormatHandler<StrikeFormat> = {
    parse: (format, element, context, defaultStyle) => {
        const textDecoration = element.style.textDecoration || defaultStyle.textDecoration;

        if (textDecoration?.indexOf('line-through')! >= 0) {
            format.strikethrough = true;
        }
    },
    apply: (format, element) => {
        if (format.strikethrough) {
            const strike = element.ownerDocument.createElement('s');
            moveChildNodes(strike, element);
            element.appendChild(strike);
        }
    },
};
