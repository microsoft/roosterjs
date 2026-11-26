import type { BlockWritingModeFormat } from 'roosterjs-content-model-types';
import type { FormatHandler } from '../FormatHandler';

/**
 * @internal
 */
export const blockWritingModeFormatHandler: FormatHandler<BlockWritingModeFormat> = {
    parse: (format, element, _, defaultStyle) => {
        const value = element.style.writingMode || defaultStyle.writingMode;
        if (
            value &&
            value != 'inherit' &&
            value != 'unset' &&
            value != 'revert' &&
            value != 'revert-layer'
        ) {
            format.writingMode = value == 'initial' ? 'horizontal-tb' : value;
        }
    },
    apply: (format, element) => {
        if (format.writingMode) {
            element.style.writingMode = format.writingMode;
        }
    },
};
