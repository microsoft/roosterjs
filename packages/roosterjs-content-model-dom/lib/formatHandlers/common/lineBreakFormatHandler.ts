import type { FormatHandler } from '../FormatHandler';
import type { LineBreakFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const lineBreakFormatHandler: FormatHandler<LineBreakFormat> = {
    parse: (format, element, _, defaultStyle) => {
        const value = element.style.getPropertyValue('line-break') || defaultStyle.lineBreak;
        if (value && value != 'inherit' && value != 'unset') {
            format.lineBreak = value;
        }
    },
    apply: (format, element, context) => {
        const value = format.lineBreak || 'initial';
        if (value != (context.implicitFormat.lineBreak || 'initial')) {
            element.style.setProperty('line-break', value);
        }
    },
};
