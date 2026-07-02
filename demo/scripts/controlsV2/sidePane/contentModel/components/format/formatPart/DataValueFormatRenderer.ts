import { createTextFormatRenderer } from '../utils/createTextFormatRenderer';
import { DataValueFormat } from 'roosterjs-content-model-types';
import { FormatRenderer } from '../utils/FormatRenderer';

export const DataValueFormatRenderer: FormatRenderer<DataValueFormat> = createTextFormatRenderer<
    DataValueFormat
>(
    'Data value',
    format => format.dataValue,
    (format, value) => (format.dataValue = value)
);
