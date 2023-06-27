import { FormatHandler } from '../FormatHandler';
import { moveAndReplaceChildNodes } from '../../domUtils/moveAndReplaceChildNodes';
import { StrikeFormat } from 'roosterjs-content-model-types';

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
            moveAndReplaceChildNodes(strike, element);
            element.appendChild(strike);
        }
    },
};
