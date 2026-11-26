import type { FormatHandler } from '../FormatHandler';
import type { HyphensFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const hyphensFormatHandler: FormatHandler<HyphensFormat> = {
    parse: (format, element, _, defaultStyle) => {
        const value = element.style.hyphens || defaultStyle.hyphens;
        if (value && value != 'inherit' && value != 'unset') {
            format.hyphens = value;
        }
    },
    apply: (format, element, context) => {
        const value = format.hyphens || 'initial';
        if (value != (context.implicitFormat.hyphens || 'initial')) {
            element.style.hyphens = value;
        }
    },
};
