import type { FormatHandler } from '../FormatHandler';
import type { TextStrokeFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const textStrokeFormatHandler: FormatHandler<TextStrokeFormat> = {
    parse: (format, element) => {
        const width = element.style.getPropertyValue('-webkit-text-stroke-width');
        const color = element.style.getPropertyValue('-webkit-text-stroke-color');
        if (width && width != 'inherit' && width != 'unset') {
            format.textStrokeWidth = width == 'initial' ? '0px' : width;
        }
        if (color && color != 'inherit' && color != 'unset') {
            format.textStrokeColor = color == 'initial' ? 'currentcolor' : color;
        }
    },
    apply: (format, element, context) => {
        if (
            format.textStrokeWidth &&
            format.textStrokeWidth != context.implicitFormat.textStrokeWidth
        ) {
            element.style.setProperty('-webkit-text-stroke-width', format.textStrokeWidth);
        }
        if (
            format.textStrokeColor &&
            format.textStrokeColor != context.implicitFormat.textStrokeColor
        ) {
            element.style.setProperty('-webkit-text-stroke-color', format.textStrokeColor);
        }
    },
};
