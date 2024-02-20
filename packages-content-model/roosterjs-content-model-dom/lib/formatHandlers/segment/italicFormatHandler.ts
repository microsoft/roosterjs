import { wrapAllChildNodes } from '../../domUtils/moveChildNodes';
import type { FormatHandler } from '../FormatHandler';
import type { ItalicFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const italicFormatHandler: FormatHandler<ItalicFormat> = {
    parse: (format, element, context, defaultStyle) => {
        const fontStyle = element.style.fontStyle || defaultStyle.fontStyle;

        if (fontStyle == 'italic' || fontStyle == 'oblique') {
            format.italic = true;
        } else if (
            fontStyle == 'initial' ||
            fontStyle == 'normal' ||
            context.defaultFormat?.italic
        ) {
            format.italic = false;
        }
    },
    apply: (format, element, context) => {
        if (typeof format.italic === 'undefined') {
            return;
        }

        const implicitItalic = context.implicitFormat.italic;

        if (!!implicitItalic != !!format.italic) {
            if (format.italic) {
                wrapAllChildNodes(element, 'i');
            } else {
                element.style.fontStyle = 'normal';
            }
        }
    },
};
