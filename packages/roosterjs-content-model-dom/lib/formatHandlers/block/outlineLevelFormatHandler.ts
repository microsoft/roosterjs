import type { FormatHandler } from '../FormatHandler';
import type { OutlineLevelFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const outlineLevelFormatHandler: FormatHandler<OutlineLevelFormat> = {
    parse: (format, element) => {
        delete format.outlineLevel;
        const level = element.getAttribute('aria-level') || '';
        if (
            /^(P|H[1-6])$/.test(element.tagName) &&
            element.getAttribute('role') == 'heading' &&
            /^[1-9]\d*$/.test(level) &&
            Number.isSafeInteger(Number(level))
        ) {
            format.outlineLevel = Number(level);
        }
    },
    apply: (format, element) => {
        if (
            format.outlineLevel &&
            Number.isSafeInteger(format.outlineLevel) &&
            format.outlineLevel > 0
        ) {
            element.setAttribute('role', 'heading');
            element.setAttribute('aria-level', format.outlineLevel.toString());
        }
    },
};
