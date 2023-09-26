import { moveChildNodes } from 'roosterjs-editor-dom';
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
        } else if (fontStyle == 'initial' || fontStyle == 'normal') {
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
                const i = element.ownerDocument.createElement('i');
                moveChildNodes(i, element);
                element.appendChild(i);
            } else {
                element.style.fontStyle = 'normal';
            }
        }
    },
};
