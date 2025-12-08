import type { FormatHandler } from '../FormatHandler';
import type { LegacyTableBorderFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const legacyTableBorderFormatHandler: FormatHandler<LegacyTableBorderFormat> = {
    parse: (format, element) => {
        const border = element.getAttribute('border');
        const cellSpacing = element.getAttribute('cellspacing');
        const cellpadding = element.getAttribute('cellpadding');

        if (border) {
            format.legacyTableBorder = border;
        }

        if (cellSpacing) {
            format.cellSpacing = cellSpacing;
        }

        if (cellpadding) {
            format.cellPadding = cellpadding;
        }
    },

    apply: (format, element) => {
        if (format.legacyTableBorder) {
            element.setAttribute('border', format.legacyTableBorder);
        }

        if (format.cellSpacing) {
            element.setAttribute('cellspacing', format.cellSpacing);
        }

        if (format.cellPadding) {
            element.setAttribute('cellpadding', format.cellPadding);
        }
    },
};
