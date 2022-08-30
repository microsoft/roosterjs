import { createTextFormatRenderer } from '../utils/createTextFormatRenderer';
import { FontSizeFormat } from 'roosterjs-content-model';
import { FormatRenderer } from '../utils/FormatRenderer';

export const FontSizeFormatRenderer: FormatRenderer<FontSizeFormat> = createTextFormatRenderer<
    FontSizeFormat
>(
    'Font size',
    format => format.fontSize,
    (format, value) => {
        format.fontSize = value;
        return undefined;
    }
);
