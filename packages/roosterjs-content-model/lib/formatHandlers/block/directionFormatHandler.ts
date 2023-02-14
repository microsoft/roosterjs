import { DirectionFormat } from '../../publicTypes/format/formatParts/DirectionFormat';
import { FormatHandler } from '../FormatHandler';

const ResultMap: Record<string, Record<'ltr' | 'rtl', 'start' | 'center' | 'end'>> = {
    start: {
        ltr: 'start',
        rtl: 'end',
    },
    center: {
        ltr: 'center',
        rtl: 'center',
    },
    end: {
        ltr: 'end',
        rtl: 'start',
    },
    left: {
        ltr: 'start',
        rtl: 'end',
    },
    right: {
        ltr: 'end',
        rtl: 'start',
    },
};

/**
 * @internal
 */
export const directionFormatHandler: FormatHandler<DirectionFormat> = {
    parse: (format, element, _, defaultStyle) => {
        const dir = element.style.direction || element.dir || defaultStyle.direction;
        const alignFromAttr = element.getAttribute('align');
        const align = element.style.textAlign || alignFromAttr || defaultStyle.textAlign;
        const alignSelf = element.style.alignSelf;

        if (dir) {
            format.direction = dir == 'rtl' ? 'rtl' : 'ltr';
        }

        if (align) {
            format.textAlign = ResultMap[align][format.direction == 'rtl' ? 'rtl' : 'ltr'];
        }

        if (alignFromAttr && !element.style.textAlign) {
            format.isTextAlignFromAttr = true;
        }

        if (alignSelf) {
            format.alignSelf = ResultMap[alignSelf][format.direction == 'rtl' ? 'rtl' : 'ltr'];
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
            } else {
                element.style.textAlign = value;
            }
        }

        if (format.alignSelf) {
            const value = ResultMap[format.alignSelf][format.direction == 'rtl' ? 'rtl' : 'ltr'];
            element.style.alignSelf = value;
        }
    },
};
