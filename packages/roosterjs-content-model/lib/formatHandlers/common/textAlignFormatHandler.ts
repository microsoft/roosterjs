import { FormatHandler } from '../FormatHandler';
import { TextAlignFormat } from '../../publicTypes/format/formatParts/TextAlignFormat';

const ResultMap = {
    start: {
        ltr: 'left',
        rtl: 'right',
    },
    center: {
        ltr: 'center',
        rtl: 'center',
    },
    end: {
        ltr: 'right',
        rtl: 'left',
    },
};

/**
 * @internal
 */
export const textAlignFormatHandler: FormatHandler<TextAlignFormat> = {
    parse: (format, element, context) => {
        const align = element.style.textAlign || element.getAttribute('align');

        switch (align) {
            case 'center':
                format.textAlign = 'center';
                break;

            case 'left':
                format.textAlign = context.isRightToLeft ? 'end' : 'start';
                break;

            case 'right':
                format.textAlign = context.isRightToLeft ? 'start' : 'end';
                break;

            case 'start':
            case 'end':
                format.textAlign = align;
                break;
        }
    },
    apply: (format, element, context) => {
        if (format.textAlign) {
            element.style.textAlign =
                ResultMap[format.textAlign][context.isRightToLeft ? 'rtl' : 'ltr'];
        }
    },
};
