import * as Color from 'color';
import { createColorFormatRenderer } from '../utils/createColorFormatRender';
import { FormatRenderer } from '../utils/FormatRenderer';
import { TextColorFormat } from 'roosterjs-content-model-types';

export const TextColorFormatRenderer: FormatRenderer<TextColorFormat> = createColorFormatRenderer<
    TextColorFormat
>(
    'Text color',
    format => {
        try {
            return format.textColor ? Color(format.textColor).hex() : '';
        } catch (e) {
            console.log(e);
        }
    },
    (format, value) => {
        format.textColor = value;
        return undefined;
    }
);
