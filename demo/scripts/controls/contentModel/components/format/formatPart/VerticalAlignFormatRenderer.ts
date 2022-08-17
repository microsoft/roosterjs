import { createDropDownFormatRenderer } from '../utils/createDropDownFormatRenderer';
import { VerticalAlignFormat } from 'roosterjs-content-model';

export const VerticalAlignFormatRenderer = createDropDownFormatRenderer<
    VerticalAlignFormat,
    'top' | 'middle' | 'bottom'
>(
    'Vertical align',
    ['top', 'middle', 'bottom'],
    format => format.verticalAlign,
    (format, value) => (format.verticalAlign = value)
);
