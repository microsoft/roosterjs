import { createDropDownFormatRenderer } from '../utils/createDropDownFormatRenderer';
import { HtmlAlignFormat } from 'roosterjs-content-model';

export const HtmlAlignFormatRenderer = createDropDownFormatRenderer<
    HtmlAlignFormat,
    'start' | 'center' | 'end' | 'justify' | 'initial'
>(
    'HTML align',
    ['start', 'center', 'end'],
    format => format.htmlAlign,
    (format, value) => (format.htmlAlign = value)
);
