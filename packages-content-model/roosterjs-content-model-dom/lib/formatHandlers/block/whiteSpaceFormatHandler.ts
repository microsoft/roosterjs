import type { FormatHandler } from '../FormatHandler';
import type { WhiteSpaceFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const whiteSpaceFormatHandler: FormatHandler<WhiteSpaceFormat> = {
    parse: (format, element, _, defaultStyle) => {
        const whiteSpace = element.style.whiteSpace || defaultStyle.whiteSpace;

        if (whiteSpace) {
            format.whiteSpace = whiteSpace;
        }
    },
    apply: (format, element, context) => {
        const whiteSpace = context.implicitFormat.whiteSpace;
        if (format.whiteSpace != whiteSpace) {
            element.style.whiteSpace = format.whiteSpace || 'normal';
        }
    },
};
