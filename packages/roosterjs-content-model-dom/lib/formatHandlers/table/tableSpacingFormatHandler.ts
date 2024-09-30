import type { FormatHandler } from '../FormatHandler';
import type { SpacingFormat } from 'roosterjs-content-model-types';

const BorderCollapsed = 'collapse';
const BorderSeparate = 'separate';
const CellPadding = 'cellPadding';
const CellSpacing = 'cellSpacing';

/**
 * @internal
 */
export const tableSpacingFormatHandler: FormatHandler<SpacingFormat> = {
    parse: (format, element) => {
        if (element.style.borderCollapse == BorderCollapsed) {
            format.borderCollapse = true;
        }

        const cellPadding = element.getAttribute(CellPadding);
        if (cellPadding) {
            format.cellPadding = cellPadding;
        }

        const cellSpacing = element.style.borderSpacing || element.getAttribute(CellSpacing);
        if (cellSpacing) {
            format.cellSpacing = cellSpacing;
        }

        if (element.style.borderCollapse == BorderSeparate) {
            format.borderSeparate = true;
        }
    },
    apply: (format, element, context) => {
        if (format.borderCollapse) {
            element.style.borderCollapse = BorderCollapsed;
            element.style.borderSpacing = '0';
            element.style.boxSizing = 'border-box';
        } else if (format.borderSeparate) {
            element.style.borderCollapse = BorderSeparate;
            element.style.borderSpacing = '0';
            element.style.boxSizing = 'border-box';
        }

        if (format.cellSpacing) {
            const cellSpacing = format.cellSpacing.concat(
                format.cellSpacing.endsWith('%') ? '' : 'px'
            );
            element.style.borderSpacing = cellSpacing;
        }

        if (!context.tableFormat) {
            context.tableFormat = {};
        }
        context.tableFormat.cellPadding = format.cellPadding;
    },
};
