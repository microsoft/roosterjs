import { parseValueWithUnit } from '../utils/parseValueWithUnit';
import type { FormatHandler } from '../FormatHandler';
import type { MarginBlockFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const marginBlockFormatHandler: FormatHandler<MarginBlockFormat> = {
    parse: (format, element, _, defaultStyle) => {
        const marginBlockStart = element.style.marginBlockStart || defaultStyle.marginBlockStart;
        const marginBlockEnd = element.style.marginBlockEnd || defaultStyle.marginBlockEnd;

        if (marginBlockStart) {
            format.marginBlockStart = parseValueWithUnit(marginBlockStart) + 'px';
        }

        if (marginBlockEnd) {
            format.marginBlockEnd = parseValueWithUnit(marginBlockEnd) + 'px';
        }
    },
    apply: (format, element, context) => {
        const marginBlockStart = format.marginBlockStart;
        const marginBlockEnd = format.marginBlockEnd;

        if (marginBlockStart) {
            element.style.marginBlockStart = marginBlockStart;
        }

        if (marginBlockEnd) {
            element.style.marginBlockEnd = marginBlockEnd;
        }
    },
};
