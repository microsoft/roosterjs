import { createTextFormatRenderer } from '../utils/createTextFormatRenderer';
import { FormatRenderer } from '../utils/FormatRenderer';
import { TextIndentFormat } from 'roosterjs-content-model-types';

export const TextIndentFormatRenderer: FormatRenderer<TextIndentFormat> = createTextFormatRenderer<
    TextIndentFormat
>(
    'Text indent',
    format => format.textIndent,
    (format, value) => (format.textIndent = value)
);
