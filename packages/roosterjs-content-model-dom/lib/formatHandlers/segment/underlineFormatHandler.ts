import { wrapAllChildNodes } from '../../domUtils/moveChildNodes';
import type { FormatHandler } from '../FormatHandler';
import type { UnderlineFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const underlineFormatHandler: FormatHandler<UnderlineFormat> = {
    parse: (format, element, context, defaultStyle) => {
        const textDecoration = element.style.textDecoration || defaultStyle.textDecoration;

        if (textDecoration?.indexOf('underline')! >= 0) {
            format.underline = true;

            const style = element.style.textDecorationStyle || defaultStyle.textDecorationStyle;

            switch (style) {
                case 'solid':
                case 'double':
                case 'dotted':
                case 'dashed':
                case 'wavy':
                    format.underlineStyle = style;
                    break;
            }
        } else if (element.tagName == 'A' && textDecoration == 'none') {
            format.underline = false;
            delete format.underlineStyle;
        }
    },
    apply: (format, element, context) => {
        if (typeof format.underline === 'undefined') {
            return;
        }

        const blockUnderline = context.implicitFormat.underline;
        const style = format.underlineStyle;
        const isLink = element.tagName == 'A';

        if (format.underline && style && isLink) {
            element.style.textDecorationStyle = style;
        }

        if (
            !!blockUnderline != !!format.underline ||
            (format.underline && style && !isLink && style != context.implicitFormat.underlineStyle)
        ) {
            if (format.underline) {
                const underline = wrapAllChildNodes(element, 'u');

                if (style) {
                    underline.style.textDecorationStyle = style;
                }
            } else {
                element.style.textDecoration = 'none';
            }
        }
    },
};
