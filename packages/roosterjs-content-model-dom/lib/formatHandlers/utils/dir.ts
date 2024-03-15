/**
 * @internal
 */
export const ResultMap = {
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
export function calcAlign(align: string, dir?: 'ltr' | 'rtl') {
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
