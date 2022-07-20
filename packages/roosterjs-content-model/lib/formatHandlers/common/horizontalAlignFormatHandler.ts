import { FormatHandler } from '../FormatHandler';
import { HorizontalAlignFormat } from '../../publicTypes/format/formatParts/HorizontalAlignFormat';

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
export const horizontalAlignFormatHandler: FormatHandler<HorizontalAlignFormat> = {
    parse: (format, element, context) => {
        const align = element.style.textAlign || element.getAttribute('align');

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
    apply: (format, element, context) => {
        if (format.horizontalAlign) {
            element.style.textAlign =
                ResultMap[format.horizontalAlign][context.isRightToLeft ? 'rtl' : 'ltr'];
        }
    },
};
