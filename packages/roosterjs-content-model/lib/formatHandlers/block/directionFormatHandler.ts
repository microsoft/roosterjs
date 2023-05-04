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
    initial: {
        ltr: 'initial',
        rtl: 'initial',
    },
    justify: {
        ltr: 'justify',
        rtl: 'justify',
    },
};

/**
 * @internal
 */
export const directionFormatHandler: FormatHandler<DirectionFormat> = {
    parse: (format, element, _, defaultStyle) => {
        const dir = element.style.direction || element.dir || defaultStyle.direction;
        const alignFromAttr = element.getAttribute('align');
        let alignFromCss = element.style.textAlign || defaultStyle.textAlign;

        if (
            element.tagName == 'LI' &&
            element.parentElement?.style.display === 'flex' &&
            element.parentElement.style.flexDirection === 'column' &&
            element.style.alignSelf
        ) {
            // For LI element with flex style applied, we use its "align-self" style value instead since LI has a different implementation for align
            alignFromCss = element.style.alignSelf;
        }

        if (dir) {
            format.direction = dir == 'rtl' ? 'rtl' : 'ltr';
        }

        if (alignFromAttr) {
            format.htmlAlign = calcAlign(alignFromAttr, format.direction);
            delete format.textAlign;
        }

        if (alignFromCss) {
            format.textAlign = calcAlign(alignFromCss, format.direction);
        }
    },
    apply: (format, element) => {
        if (format.direction) {
            element.style.direction = format.direction;
        }

        const dir: 'ltr' | 'rtl' = format.direction == 'rtl' ? 'rtl' : 'ltr';

        if (format.textAlign) {
            const parent = element.parentElement;
            const parentTag = parent?.tagName;

            if (element.tagName == 'LI' && parent && (parentTag == 'OL' || parentTag == 'UL')) {
                element.style.alignSelf = format.textAlign;
                element.parentElement.style.flexDirection = 'column';
                element.parentElement.style.display = 'flex';
            } else {
                element.style.textAlign = ResultMap[format.textAlign][dir];
            }
        }

        if (format.htmlAlign) {
            element.setAttribute('align', ResultMap[format.htmlAlign][dir]);
        }
    },
};

function calcAlign(align: string, dir?: 'ltr' | 'rtl') {
    switch (align) {
        case 'center':
            return 'center';

        case 'left':
            return dir == 'rtl' ? 'end' : 'start';

        case 'right':
            return dir == 'rtl' ? 'start' : 'end';

        case 'start':
        case 'end':
            return align;

        case 'justify':
        case 'initial':
            return align;

        default:
            return undefined;
    }
}
