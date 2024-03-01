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
        }
    },
    apply: (format, element) => {
        if (format.strikethrough) {
            wrapAllChildNodes(element, 's');
        }
    },
};
