import type { FormatHandler } from '../FormatHandler';
import type { SpacingFormat } from 'roosterjs-content-model-types';

const BorderCollapsed = 'collapse';
const CellPadding = 'cellPadding';

/**
 * @internal
 */
export const tableSpacingFormatHandler: FormatHandler<SpacingFormat> = {
    parse: (format, element) => {
        if (element.style.borderCollapse == BorderCollapsed) {
            format.borderCollapse = true;
        } else {
            const cellPadding = element.getAttribute(CellPadding);
            if (cellPadding) {
                format.borderCollapse = true;
            }
        }
    },
    apply: (format, element) => {
        if (format.borderCollapse) {
            element.style.borderCollapse = BorderCollapsed;
            element.style.borderSpacing = '0';
            element.style.boxSizing = 'border-box';
        }
    },
};
