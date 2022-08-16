import { BorderFormat } from '../../publicTypes/format/formatParts/BorderFormat';
import { FormatHandler } from '../FormatHandler';

/**
 * @internal
 */
export const borderFormatHandler: FormatHandler<BorderFormat> = {
    parse: (format, element) => {
        const borderColor = element.style.borderColor;
        const borderWidth = element.style.borderWidth;
        const borderStyle = element.style.borderStyle;

        if (borderColor) {
            format.borderColor = borderColor;
        }

        if (borderWidth) {
            format.borderWidth = borderWidth;
        }

        if (borderStyle) {
            format.borderStyle = borderStyle;
        }

        if (element.style?.boxSizing == 'border-box') {
            format.useBorderBox = true;
        }
    },
    apply: (format, element) => {
        if (format.borderColor) {
            element.style.borderColor = format.borderColor;
        }

        if (format.borderWidth) {
            element.style.borderWidth = format.borderWidth;
        }

        if (format.borderStyle) {
            element.style.borderStyle = format.borderStyle;
        }

        if (format.useBorderBox) {
            element.style.boxSizing = 'border-box';
        }
    },
};
