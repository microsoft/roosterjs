import type { FontFamilyFormat } from 'roosterjs-content-model-types';
import type { FormatHandler } from '../FormatHandler';
import { normalizeFontFamily } from '../../domUtils/style/normalizeFontFamily';

/**
 * @internal
 */
export const fontFamilyFormatHandler: FormatHandler<FontFamilyFormat> = {
    parse: (format, element, context, defaultStyle) => {
        const fontFamily = element.style.fontFamily || defaultStyle.fontFamily;

        if (fontFamily && fontFamily != 'inherit') {
            format.fontFamily = normalizeFontFamily(fontFamily);
        }
    },
    apply: (format, element, context) => {
        if (format.fontFamily && format.fontFamily != context.implicitFormat.fontFamily) {
            element.style.fontFamily = format.fontFamily;
        }
    },
};
