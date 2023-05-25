import { createDropDownFormatRenderer } from '../utils/createDropDownFormatRenderer';
import { DirectionFormat } from 'roosterjs-content-model';

export const DirectionFormatRenderer = createDropDownFormatRenderer<DirectionFormat, 'ltr' | 'rtl'>(
    'Direction',
    ['ltr', 'rtl'],
    format => format.direction,
    (format, value) => (format.direction = value)
);
