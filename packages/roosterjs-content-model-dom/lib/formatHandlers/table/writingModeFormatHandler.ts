import type { FormatHandler } from '../FormatHandler';
import type { WritingModeFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const writingModeFormatHandler: FormatHandler<WritingModeFormat> = {
    parse: (format, element, _, defaultStyle) => {
        const value = element.style.writingMode || defaultStyle.writingMode;

        if (
            value &&
            ['horizontal-tb', 'vertical-rl', 'vertical-lr', 'sideways-rl', 'sideways-lr'].indexOf(
                value
            ) >= 0
        ) {
            format.writingMode = value;
        }
    },
    apply: (format, element) => {
        if (format.writingMode) {
            element.style.writingMode = format.writingMode;
        }
    },
};
