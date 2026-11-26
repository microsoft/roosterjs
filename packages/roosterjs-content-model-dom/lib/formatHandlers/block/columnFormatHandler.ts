import type { ColumnFormat } from 'roosterjs-content-model-types';
import type { FormatHandler } from '../FormatHandler';

const keys = ['columnCount', 'columnGap', 'columnRule'] as const;

/**
 * @internal
 */
export const columnFormatHandler: FormatHandler<ColumnFormat> = {
    parse: (format, element) => {
        keys.forEach(key => {
            if (element.style[key]) {
                format[key] = element.style[key];
            }
        });
    },
    apply: (format, element) => {
        keys.forEach(key => {
            const value = format[key];
            if (value) {
                element.style[key] = value;
            }
        });
    },
};
