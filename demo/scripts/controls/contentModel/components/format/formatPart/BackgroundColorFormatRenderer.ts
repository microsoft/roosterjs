import { BackgroundColorFormat } from 'roosterjs-content-model';
import { createTextFormatRenderer } from '../utils/createTextFormatRenderer';
import { FormatRenderer } from '../utils/FormatRenderer';

export const BackgroundColorFormatRenderer: FormatRenderer<BackgroundColorFormat> = createTextFormatRenderer<
    BackgroundColorFormat
>(
    'Back color',
    format => format.backgroundColor,
    (format, value) => {
        format.backgroundColor = value;
        return undefined;
    },
    'color'
);
