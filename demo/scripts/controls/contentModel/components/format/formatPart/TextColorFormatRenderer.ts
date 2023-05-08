import * as Color from 'color';
import { createColorFormatRenderer } from '../utils/createColorFormatRender';
import { FormatRenderer } from '../utils/FormatRenderer';
import { TextColorFormat } from 'roosterjs-content-model';

export const TextColorFormatRenderer: FormatRenderer<TextColorFormat> = createColorFormatRenderer<
    TextColorFormat
>(
    'Text color',
    format => (format.textColor ? Color(format.textColor).hex() : ''),
    (format, value) => {
        format.textColor = value;
        return undefined;
    }
);
