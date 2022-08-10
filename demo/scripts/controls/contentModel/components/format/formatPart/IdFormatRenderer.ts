import { createTextFormatRenderer } from '../utils/createTextFormatRenderer';
import { FormatRenderer } from '../utils/FormatRenderer';
import { IdFormat } from 'roosterjs-content-model';

export const IdFormatRenderer: FormatRenderer<IdFormat> = createTextFormatRenderer<IdFormat>(
    'Id',
    format => format.id,
    (format, value) => (format.id = value)
);
