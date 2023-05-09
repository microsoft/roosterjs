import { createDropDownFormatRenderer } from '../utils/createDropDownFormatRenderer';
import { TextAlignFormat } from 'roosterjs-content-model';

export const TextAlignFormatRenderer = createDropDownFormatRenderer<
    TextAlignFormat,
    'start' | 'center' | 'end' | 'justify' | 'initial'
>(
    'Text align',
    ['start', 'center', 'end'],
    format => format.textAlign,
    (format, value) => (format.textAlign = value)
);
