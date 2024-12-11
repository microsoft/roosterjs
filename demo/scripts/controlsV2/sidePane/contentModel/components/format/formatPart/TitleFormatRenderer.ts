import { createTextFormatRenderer } from '../utils/createTextFormatRenderer';
import { FormatRenderer } from '../utils/FormatRenderer';
import { TitleFormat } from 'roosterjs-content-model-types';

export const TitleFormatRenderer: FormatRenderer<TitleFormat> = createTextFormatRenderer<
    TitleFormat
>(
    'Title',
    format => format.title,
    (format, value) => (format.title = value)
);
