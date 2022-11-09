import { FormatHandler } from '../FormatHandler';
import { LineHeightFormat } from '../../publicTypes/format/formatParts/LineHeightFormat';

/**
 * @internal
 */
export const lineHeightFormatHandler: FormatHandler<LineHeightFormat> = {
    parse: (format, element, context, defaultStyle) => {
        const lineHeight = element.style.lineHeight || defaultStyle.lineHeight;

        if (lineHeight && lineHeight != 'inherit') {
            format.lineHeight = lineHeight;
        }
    },
    apply: (format, element) => {
        if (format.lineHeight) {
            element.style.lineHeight = format.lineHeight;
        }
    },
};
