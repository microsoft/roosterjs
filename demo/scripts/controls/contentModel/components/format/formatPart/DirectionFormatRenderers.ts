import { createDropDownFormatRenderer } from '../utils/createDropDownFormatRenderer';
import { DirectionFormat } from 'roosterjs-content-model';

export const DirectionFormatRenderers = [
    createDropDownFormatRenderer<DirectionFormat, 'ltr' | 'rtl' | 'column'>(
        'Direction',
        ['ltr', 'rtl', 'column'],
        format => format.direction,
        (format, value) => (format.direction = value)
    ),
    createDropDownFormatRenderer<DirectionFormat, 'start' | 'center' | 'end'>(
        'Text align',
        ['start', 'center', 'end'],
        format => format.textAlign,
        (format, value) => (format.textAlign = value)
    ),
];
