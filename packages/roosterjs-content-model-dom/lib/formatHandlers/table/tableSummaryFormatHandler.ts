import type { FormatHandler } from '../FormatHandler';
import type { TableSummaryFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const tableSummaryFormatHandler: FormatHandler<TableSummaryFormat> = {
    parse: (format, element) => {
        const summary = element.getAttribute('summary');

        if (summary) {
            format.summary = summary;
        }
    },
    apply: (format, element) => {
        if (format.summary !== undefined) {
            element.setAttribute('summary', format.summary);
        }
    },
};
