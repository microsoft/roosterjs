import { createTextFormatRenderer } from '../utils/createTextFormatRenderer';
import { FormatRenderer } from '../utils/FormatRenderer';
import { LineHeightFormat } from 'roosterjs-content-model-types';

export const LineHeightFormatRenderer: FormatRenderer<LineHeightFormat> = createTextFormatRenderer<
    LineHeightFormat
>(
    'LineHeight',
    format => format.lineHeight,
    (format, value) => (format.lineHeight = value)
);
