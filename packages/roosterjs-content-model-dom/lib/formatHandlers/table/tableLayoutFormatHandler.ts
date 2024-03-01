import type { FormatHandler } from '../FormatHandler';
import type { TableLayoutFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const tableLayoutFormatHandler: FormatHandler<TableLayoutFormat> = {
    parse: (format, element) => {
        const tableLayout = element.style.tableLayout;
        if (tableLayout && tableLayout != 'inherit') {
            format.tableLayout = tableLayout;
        }
    },
    apply: (format, element) => {
        if (format.tableLayout) {
            element.style.tableLayout = format.tableLayout;
        }
    },
};
