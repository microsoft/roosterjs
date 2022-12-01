import { FormatHandler } from '../FormatHandler';
import { WhiteSpaceFormat } from '../../publicTypes/format/formatParts/WhiteSpaceFormat';

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
    apply: (format, element) => {
        if (format.whiteSpace) {
            element.style.whiteSpace = format.whiteSpace;
        }
    },
};
