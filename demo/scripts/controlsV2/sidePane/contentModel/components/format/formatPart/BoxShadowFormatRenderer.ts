import { BoxShadowFormat } from 'roosterjs-content-model-types';
import { createTextFormatRenderer } from '../utils/createTextFormatRenderer';
import { FormatRenderer } from '../utils/FormatRenderer';

export const BoxShadowFormatRenderer: FormatRenderer<BoxShadowFormat> = createTextFormatRenderer<
    BoxShadowFormat
>(
    'BoxShadow',
    format => format.boxShadow,
    (format, value) => (format.boxShadow = value)
);
