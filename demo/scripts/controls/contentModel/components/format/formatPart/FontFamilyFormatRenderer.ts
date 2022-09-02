import { createTextFormatRenderer } from '../utils/createTextFormatRenderer';
import { FontFamilyFormat } from 'roosterjs-content-model';
import { FormatRenderer } from '../utils/FormatRenderer';

export const FontFamilyFormatRenderer: FormatRenderer<FontFamilyFormat> = createTextFormatRenderer<
    FontFamilyFormat
>(
    'Font family',
    format => format.fontFamily,
    (format, value) => {
        format.fontFamily = value;
        return undefined;
    }
);
