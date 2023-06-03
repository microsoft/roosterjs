import { FormatHandler } from '../FormatHandler';
import { moveChildNodes } from 'roosterjs-editor-dom';
import { UnderlineFormat } from '../../publicTypes/format/formatParts/UnderlineFormat';

/**
 * @internal
 */
export const underlineFormatHandler: FormatHandler<UnderlineFormat> = {
    parse: (format, element, context, defaultStyle) => {
        const textDecoration = element.style.textDecoration || defaultStyle.textDecoration;

        if (textDecoration?.indexOf('underline')! >= 0) {
            format.underline = true;
        } else if (element.tagName == 'A' && textDecoration == 'none') {
            format.underline = false;
        }
    },
    apply: (format, element, context) => {
        if (typeof format.underline === 'undefined') {
            return;
        }

        const blockUnderline = context.implicitFormat.underline;

        if (!!blockUnderline != !!format.underline) {
            if (format.underline) {
                const u = element.ownerDocument.createElement('u');
                moveChildNodes(u, element);
                element.appendChild(u);
            } else {
                element.style.textDecoration = 'none';
            }
        }
    },
};
