import type { WidowOrphanFormat } from 'roosterjs-content-model-types';
import type { FormatHandler } from '../FormatHandler';

const keys = ['widows', 'orphans'] as const;

/**
 * @internal
 */
export const widowOrphanFormatHandler: FormatHandler<WidowOrphanFormat> = {
    parse: (format, element) => {
        keys.forEach(key => {
            const value = element.style[key];
            if (value && value != 'inherit' && value != 'unset') {
                format[key] = value == 'initial' ? '2' : value;
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
