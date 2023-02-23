import { DirectionFormat } from '../../publicTypes/format/formatParts/DirectionFormat';
import { FormatHandler } from '../FormatHandler';

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
export const directionFormatHandler: FormatHandler<DirectionFormat> = {
    parse: (format, element, _, defaultStyle) => {
        const dir = element.style.direction || element.dir || defaultStyle.direction;
        const alignFromAttr = element.getAttribute('align');
        const textAlign = element.style.textAlign || alignFromAttr || defaultStyle.textAlign;
        const alignSelf = element.style.alignSelf;
        const isLI = element.tagName === 'li';
        const shouldApplyAlignSelf =
            isLI && element.style.display === 'flex' && element.style.flexDirection === 'column';
        const align = shouldApplyAlignSelf ? alignSelf : textAlign;

        if (dir) {
            format.direction = dir == 'rtl' ? 'rtl' : 'ltr';
        }

        switch (align) {
            case 'center':
                format.textAlign = 'center';
                break;

            case 'left':
                format.textAlign = dir == 'rtl' ? 'end' : 'start';
                break;

            case 'right':
                format.textAlign = dir == 'rtl' ? 'start' : 'end';
                break;

            case 'start':
            case 'end':
                format.textAlign = align;
                break;
        }

        if (alignFromAttr && !element.style.textAlign) {
            format.isTextAlignFromAttr = true;
        }
    },
    apply: (format, element) => {
        if (format.direction) {
            element.style.direction = format.direction;
        }

        if (format.textAlign) {
            const value = ResultMap[format.textAlign][format.direction == 'rtl' ? 'rtl' : 'ltr'];

            if (format.isTextAlignFromAttr) {
                element.setAttribute('align', value);
            } else if (element.tagName === 'LI') {
                element.style.alignSelf = format.textAlign;
            } else {
                element.style.textAlign = value;
            }
        }

        if (element.tagName == 'OL' || element.tagName == 'UL') {
            element.style.flexDirection = 'column';
            element.style.display = 'flex';
        }
    },
};
