import { createTextFormatRenderer } from '../utils/createTextFormatRenderer';
import { FloatFormat } from 'roosterjs-content-model-types';
import { FormatRenderer } from '../utils/FormatRenderer';

export const FloatFormatRenderer: FormatRenderer<FloatFormat> = createTextFormatRenderer<
    FloatFormat
>(
    'Float',
    format => format.float,
    (format, value) => (format.float = value)
);
