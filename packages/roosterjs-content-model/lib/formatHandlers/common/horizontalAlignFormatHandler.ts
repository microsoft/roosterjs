import { FormatHandler } from '../FormatHandler';
import { HorizontalAlignFormat } from '../../publicTypes/format/formatParts/HorizontalAlignFormat';

/**
 * @internal
 */
export const horizontalAlignFormatHandler: FormatHandler<HorizontalAlignFormat> = {
    parse: (format, element, context) => {
        const align = element.style.textAlign;

        switch (align) {
            case 'center':
                format.horizontalAlign = 'center';
                break;

            case 'left':
                format.horizontalAlign = context.isRightToLeft ? 'end' : 'start';
                break;

            case 'right':
                format.horizontalAlign = context.isRightToLeft ? 'start' : 'end';
                break;

            case 'start':
            case 'end':
                format.horizontalAlign = align;
                break;
        }
    },
    apply: (format, element) => {
        if (format.horizontalAlign) {
            element.style.textAlign = format.horizontalAlign;
        }
    },
};
