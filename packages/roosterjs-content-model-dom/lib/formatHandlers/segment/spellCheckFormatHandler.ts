import type { FormatHandler } from '../FormatHandler';
import type { SpellCheckFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const spellCheckFormatHandler: FormatHandler<SpellCheckFormat> = {
    parse: (format, element) => {
        const value = element.getAttribute('spellcheck')?.toLowerCase();
        if (value == '' || value == 'true' || value == 'false') {
            format.spellCheck = value != 'false';
        }
    },
    apply: (format, element, context) => {
        if (
            typeof format.spellCheck == 'boolean' &&
            format.spellCheck != context.implicitFormat.spellCheck
        ) {
            element.setAttribute('spellcheck', String(format.spellCheck));
        }
    },
};
