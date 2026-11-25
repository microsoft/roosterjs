import type { FormatHandler } from '../FormatHandler';
import type { TextOffsetFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const textOffsetFormatHandler: FormatHandler<TextOffsetFormat> = {
    parse: (format, element, _, defaultStyle) => {
        const position = element.style.position || defaultStyle.position;
        const top = element.style.top || defaultStyle.top;
        const match = top?.match(/^(-?(?:\d+\.?\d*|\.\d+))(pt|px)?$/);

        if (position == 'relative' && match && (match[2] || Number(match[1]) == 0)) {
            const offset = Number(match[1]) * (match[2] == 'pt' ? 4 / 3 : 1);

            // Relative offsets accumulate through nested runs; top:0 does not undo an ancestor.
            format.textOffset = parseFloat(format.textOffset || '0') + offset + 'px';
        }
    },
    apply: (format, element) => {
        if (format.textOffset) {
            element.style.position = 'relative';
            element.style.top = format.textOffset;
        }
    },
};
