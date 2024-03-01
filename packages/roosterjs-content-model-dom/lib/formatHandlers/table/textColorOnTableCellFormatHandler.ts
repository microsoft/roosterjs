import type { FormatHandler } from '../FormatHandler';
import type { TextColorFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const textColorOnTableCellFormatHandler: FormatHandler<TextColorFormat> = {
    parse: (format, element) => {
        if (element.style.color) {
            // Delete color from format since text color on TD/TH will be handled by separate code
            // and text color on segment format context need to be reset so that it will not inherit
            // value outer container
            delete format.textColor;
        }
    },
    apply: () => {},
};
